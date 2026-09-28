import crypto from "crypto";
import fs from "fs";
import path from "path";
import Document from "../models/Document.js";
import { uploadDir } from "../middleware/uploadMiddleware.js";
import { evaluateDocumentHealth } from "./documentHealthService.js";

// In-memory time-bounded state store for prototype authorization
// Maps stateToken -> { state, userId, createdAt, expiresAt, consumed }
const authorizationStates = new Map();

// Deterministic synthetic documents available in DigiLocker Demo Mode
const DEMO_DOCUMENTS = [
  {
    id: "demo-aadhaar-001",
    documentType: "Aadhaar",
    documentName: "Aadhaar Card",
    holderName: "Demo Citizen",
    maskedDocumentNumber: "XXXX XXXX 4821",
    issuer: "UIDAI (Demo Authority)",
    issuedDate: "2025-01-15",
    dateOfBirth: "15/08/1988",
    mode: "demo",
    simulated: true,
  },
  {
    id: "demo-income-001",
    documentType: "Income Certificate",
    documentName: "Income Certificate",
    holderName: "Demo Citizen",
    maskedDocumentNumber: "XXXX-7284",
    issuer: "Demo Revenue Department",
    income: 150000,
    issuedDate: "2025-02-10",
    expiryDate: "2027-03-31",
    mode: "demo",
    simulated: true,
  },
  {
    id: "demo-marksheet-001",
    documentType: "Marksheet",
    documentName: "Class XII Marksheet",
    holderName: "Demo Citizen",
    maskedDocumentNumber: "XXXX-1942",
    issuer: "Demo Board of Secondary Education",
    issuedDate: "2024-06-20",
    mode: "demo",
    simulated: true,
  },
  {
    id: "demo-caste-001",
    documentType: "Caste Certificate",
    documentName: "OBC Caste Certificate",
    holderName: "Demo Citizen",
    maskedDocumentNumber: "XXXX-6312",
    issuer: "Demo Sub-Divisional Magistrate",
    issuedDate: "2023-04-10",
    mode: "demo",
    simulated: true,
  },
  {
    id: "demo-domicile-001",
    documentType: "Domicile Certificate",
    documentName: "State Domicile Certificate",
    holderName: "Demo Citizen",
    maskedDocumentNumber: "XXXX-8821",
    issuer: "Demo Revenue Authority",
    issuedDate: "2023-08-15",
    mode: "demo",
    simulated: true,
  },
];

/**
 * Returns current DigiLocker integration mode ('demo' or 'real')
 */
export function getMode() {
  return process.env.DIGILOCKER_MODE === "real" ? "real" : "demo";
}

/**
 * Generate synthetic PDF buffer for simulated downloads
 */
function createSyntheticPdfContent(doc) {
  const streamBody = `BT\n/F1 12 Tf\n72 712 Td\n(HAQDWAAR AI - SIMULATED DIGILOCKER PROTOTYPE) Tj\n0 -24 Td\n(Document: ${doc.documentName}) Tj\n0 -20 Td\n(Holder: ${doc.holderName}) Tj\n0 -20 Td\n(Masked ID: ${doc.maskedDocumentNumber}) Tj\n0 -20 Td\n(Issuer: ${doc.issuer}) Tj\n0 -20 Td\n(Issued: ${doc.issuedDate || "N/A"}) Tj\n0 -32 Td\n(NOTICE: Prototype simulated document representation. Not an official government certificate.) Tj\nET`;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${Buffer.byteLength(streamBody)} >>
stream
${streamBody}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000200 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
450
%%EOF`;

  return Buffer.from(pdf, "utf-8");
}

/**
 * Clean up expired authorization states
 */
function purgeExpiredStates() {
  const now = Date.now();
  for (const [key, val] of authorizationStates.entries()) {
    if (now > val.expiresAt || val.consumed) {
      authorizationStates.delete(key);
    }
  }
}

/**
 * Get DigiLocker authorization URL or start demo state flow
 */
export async function getAuthorizationUrl(userId) {
  const mode = getMode();

  if (mode === "real") {
    const clientId = process.env.DIGILOCKER_CLIENT_ID;
    const clientSecret = process.env.DIGILOCKER_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return {
        success: false,
        mode: "real",
        reason: "DigiLocker integration is not configured",
      };
    }

    // Real OAuth URL generation would go here with configured client credentials
    const redirectUri = process.env.DIGILOCKER_REDIRECT_URI || "http://localhost:5000/api/digilocker/callback";
    const state = crypto.randomUUID();
    authorizationStates.set(state, {
      state,
      userId: String(userId),
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      consumed: false,
    });

    return {
      success: true,
      mode: "real",
      state,
      authorizationRequired: true,
      authorizationUrl: `https://digilocker.meripehchan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
    };
  }

  // Demo mode: in-memory state bound to authenticated user
  purgeExpiredStates();
  const state = crypto.randomUUID();
  authorizationStates.set(state, {
    state,
    userId: String(userId),
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    consumed: false,
  });

  return {
    success: true,
    mode: "demo",
    state,
    authorizationRequired: true,
  };
}

/**
 * Validate authorization state for user
 */
export function validateAuthorizationState(userId, state) {
  if (!state || typeof state !== "string") return false;
  purgeExpiredStates();

  const record = authorizationStates.get(state);
  if (!record) return false;
  if (record.consumed) return false;
  if (Date.now() > record.expiresAt) return false;
  if (record.userId !== String(userId)) return false;

  return true;
}

/**
 * Submit simulated user consent
 */
export async function submitConsent(userId, state) {
  const mode = getMode();

  if (mode === "real") {
    return {
      success: false,
      mode: "real",
      reason: "DigiLocker integration is not configured",
    };
  }

  if (!validateAuthorizationState(userId, state)) {
    const error = new Error("Invalid, expired, or unauthorized authorization state.");
    error.statusCode = 400;
    throw error;
  }

  // Mark state as consumed so it cannot be re-used
  const record = authorizationStates.get(state);
  if (record) {
    record.consumed = true;
  }

  return {
    success: true,
    mode: "demo",
    consented: true,
    message: "Simulated DigiLocker consent confirmed.",
  };
}

/**
 * List available DigiLocker documents for the user
 */
export async function listDocuments(userId) {
  const mode = getMode();

  if (mode === "real") {
    return {
      success: false,
      mode: "real",
      reason: "DigiLocker integration is not configured",
    };
  }

  // Find which documents have already been imported by this user to mark status
  const existingDocs = await Document.find({
    userId,
    source: "DIGILOCKER",
  }).select("digilockerDocId");

  const importedIds = new Set(existingDocs.map((d) => d.digilockerDocId));

  const documents = DEMO_DOCUMENTS.map((doc) => ({
    ...doc,
    alreadyImported: importedIds.has(doc.id),
  }));

  return {
    success: true,
    mode: "demo",
    connected: false,
    disclaimer: "DigiLocker Demo Mode: Prototype simulation displaying synthetic documents. Does not connect to your real DigiLocker account.",
    documents,
  };
}

/**
 * Get details for a specific demo document
 */
export async function getDocument(userId, documentId) {
  const mode = getMode();

  if (mode === "real") {
    const err = new Error("DigiLocker integration is not configured.");
    err.statusCode = 503;
    throw err;
  }

  const doc = DEMO_DOCUMENTS.find((d) => d.id === documentId);
  if (!doc) {
    const err = new Error("DigiLocker document not found.");
    err.statusCode = 404;
    throw err;
  }

  const existing = await Document.findOne({
    userId,
    source: "DIGILOCKER",
    digilockerDocId: documentId,
  });

  return {
    ...doc,
    alreadyImported: !!existing,
  };
}

/**
 * Import a DigiLocker document into the user's Personal Document Vault
 */
export async function importDocument(userId, documentId) {
  const mode = getMode();

  if (mode === "real") {
    const err = new Error("DigiLocker integration is not configured.");
    err.statusCode = 503;
    throw err;
  }

  // 1. Duplicate check: prevent duplicate import of same document by the same citizen
  const existing = await Document.findOne({
    userId,
    source: "DIGILOCKER",
    digilockerDocId: documentId,
  });

  if (existing) {
    const err = new Error("This DigiLocker document is already in My Documents.");
    err.statusCode = 409;
    throw err;
  }

  // 2. Fetch demo document specification
  const demoDoc = DEMO_DOCUMENTS.find((d) => d.id === documentId);
  if (!demoDoc) {
    const err = new Error("DigiLocker document not found.");
    err.statusCode = 404;
    throw err;
  }

  // 3. Ensure uploads folder exists and write synthetic file representation
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueFileName = `digilocker_demo_${crypto.randomUUID()}.pdf`;
  const filePath = path.join(uploadDir, uniqueFileName);
  const pdfBuffer = createSyntheticPdfContent(demoDoc);
  await fs.promises.writeFile(filePath, pdfBuffer);

  // 4. Normalize extractedData for existing Document schema
  const extractedData = {
    documentName: demoDoc.documentName,
    holderName: demoDoc.holderName,
    maskedDocumentNumber: demoDoc.maskedDocumentNumber,
    dateOfBirth: demoDoc.dateOfBirth || null,
    issueDate: demoDoc.issuedDate ? new Date(demoDoc.issuedDate) : null,
    expiryDate: demoDoc.expiryDate ? new Date(demoDoc.expiryDate) : null,
    income: demoDoc.income || null,
    issuingAuthority: demoDoc.issuer,
    detectedFields: ["documentName", "holderName", "maskedDocumentNumber", "issuingAuthority"],
    extractionConfidence: "HIGH",
  };

  if (demoDoc.dateOfBirth) extractedData.detectedFields.push("dateOfBirth");
  if (demoDoc.issuedDate) extractedData.detectedFields.push("issueDate");
  if (demoDoc.expiryDate) extractedData.detectedFields.push("expiryDate");
  if (demoDoc.income) extractedData.detectedFields.push("income");

  // 5. Run existing Phase 7 deterministic health evaluation
  const { healthStatus, issuesDetected } = evaluateDocumentHealth(
    demoDoc.documentType,
    extractedData
  );

  // 6. Save in Document collection
  const newDocument = await Document.create({
    userId,
    documentType: demoDoc.documentType,
    originalFileName: `${demoDoc.documentName.replace(/\s+/g, "_")}_DigiLockerDemo.pdf`,
    storedFileName: uniqueFileName,
    filePath,
    fileSize: pdfBuffer.length,
    mimeType: "application/pdf",
    source: "DIGILOCKER",
    digilockerDocId: demoDoc.id,
    extractedData,
    healthStatus,
    issuesDetected,
    uploadedAt: new Date(),
  });

  return {
    id: newDocument._id,
    documentType: newDocument.documentType,
    originalFileName: newDocument.originalFileName,
    fileSize: newDocument.fileSize,
    mimeType: newDocument.mimeType,
    source: newDocument.source,
    digilockerDocId: newDocument.digilockerDocId,
    healthStatus: newDocument.healthStatus,
    issuesDetected: newDocument.issuesDetected,
    extractedData: newDocument.extractedData,
    uploadedAt: newDocument.uploadedAt,
  };
}
