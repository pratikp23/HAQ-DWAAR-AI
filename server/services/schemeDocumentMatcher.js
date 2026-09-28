/**
 * Scheme Document Availability Matcher
 *
 * Matches a scheme's required documents against a citizen's uploaded document vault.
 * Informational readiness check only.
 */

export function normalizeDocType(type) {
  if (!type) return "";
  return type
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\b(card|proof|certificate|document|copy|records?|statement|of)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isTypeMatch(schemeType, userDocType) {
  const normScheme = normalizeDocType(schemeType);
  const normUser = normalizeDocType(userDocType);

  if (!normScheme || !normUser) return false;
  if (normScheme === normUser) return true;
  if (normScheme.includes(normUser) || normUser.includes(normScheme)) return true;

  // Specific common mappings
  if (normScheme.includes("aadhaar") && normUser.includes("aadhaar")) return true;
  if (normScheme.includes("income") && normUser.includes("income")) return true;
  if (normScheme.includes("caste") && normUser.includes("caste")) return true;
  if (normScheme.includes("domicile") && normUser.includes("domicile")) return true;
  if (normScheme.includes("marksheet") && normUser.includes("marksheet")) return true;
  if ((normScheme.includes("passbook") || normScheme.includes("bank")) && normUser.includes("bank passbook")) return true;
  if (normScheme.includes("land") && (normUser.includes("land") || normUser.includes("khasra"))) return true;
  if (normScheme.includes("disability") && (normUser.includes("disability") || normUser.includes("udid"))) return true;

  return false;
}

export function matchSchemeDocuments(schemeRequiredDocs = [], userDocuments = []) {
  const available = [];
  const missing = [];
  const optionalMissing = [];

  // Track matched user documents so the same doc doesn't satisfy multiple unrelated slots if possible
  const usedDocIds = new Set();

  for (const reqDoc of schemeRequiredDocs) {
    // Find matching user document that is NOT expired
    const candidateDocs = userDocuments.filter((doc) => {
      if (usedDocIds.has(doc._id.toString())) return false;
      if (doc.healthStatus === "EXPIRED") return false;
      return isTypeMatch(reqDoc.documentType, doc.documentType);
    });

    // Prefer VALID, then NEEDS_VERIFICATION, then INCOMPLETE
    const healthPriority = { VALID: 3, NEEDS_VERIFICATION: 2, INCOMPLETE: 1 };
    candidateDocs.sort((a, b) => {
      const pA = healthPriority[a.healthStatus] || 0;
      const pB = healthPriority[b.healthStatus] || 0;
      if (pB !== pA) return pB - pA;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const matchedDoc = candidateDocs[0];

    if (matchedDoc) {
      usedDocIds.add(matchedDoc._id.toString());
      available.push({
        requiredDocumentType: reqDoc.documentType,
        mandatory: reqDoc.mandatory,
        guidance: reqDoc.guidance || "",
        userDocument: {
          id: matchedDoc._id,
          originalFileName: matchedDoc.originalFileName,
          documentType: matchedDoc.documentType,
          source: matchedDoc.source || "UPLOAD",
          digilockerDocId: matchedDoc.digilockerDocId || null,
          healthStatus: matchedDoc.healthStatus,
          issuesDetected: matchedDoc.issuesDetected || [],
          maskedDocumentNumber: matchedDoc.extractedData?.maskedDocumentNumber || null,
          uploadedAt: matchedDoc.uploadedAt,
        },
      });
    } else {
      if (reqDoc.mandatory) {
        missing.push({
          requiredDocumentType: reqDoc.documentType,
          mandatory: true,
          guidance: reqDoc.guidance || "",
        });
      } else {
        optionalMissing.push({
          requiredDocumentType: reqDoc.documentType,
          mandatory: false,
          guidance: reqDoc.guidance || "",
        });
      }
    }
  }

  const totalRequired = schemeRequiredDocs.length;
  const totalMandatory = schemeRequiredDocs.filter((d) => d.mandatory).length;
  const availableMandatory = available.filter((a) => a.mandatory).length;

  return {
    available,
    missing,
    optionalMissing,
    totalRequired,
    totalAvailable: available.length,
    totalMandatory,
    availableMandatory,
    isReadyForApplication: missing.length === 0,
    disclaimer: "Informational readiness check only. This does not represent official government document verification or application acceptance.",
  };
}
