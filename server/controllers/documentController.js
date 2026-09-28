import fs from "fs";
import path from "path";
import Document from "../models/Document.js";
import Scheme from "../models/Scheme.js";
import { uploadDir } from "../middleware/uploadMiddleware.js";
import { extractDocumentData } from "../services/ocrService.js";
import { evaluateDocumentHealth } from "../services/documentHealthService.js";
import { matchSchemeDocuments } from "../services/schemeDocumentMatcher.js";

const VALID_DOC_TYPES = [
  "Aadhaar",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "Marksheet",
  "Bank Passbook",
  "Land Ownership Document",
  "Disability Certificate",
  "Other",
];

/**
 * Upload a document, run extraction and health assessment
 * POST /api/documents/upload
 */
export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload.",
      });
    }

    const { documentType } = req.body;
    if (!documentType || !VALID_DOC_TYPES.includes(documentType)) {
      // Clean up uploaded file if validation fails
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        message: `Invalid document type. Must be one of: ${VALID_DOC_TYPES.join(", ")}`,
      });
    }

    // Run text extraction and OCR abstraction
    const extractedData = await extractDocumentData({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      originalFileName: req.file.originalname,
      documentType,
    });

    // Run deterministic health evaluation
    const { healthStatus, issuesDetected } = evaluateDocumentHealth(
      documentType,
      extractedData
    );

    // Save document to database
    const newDoc = await Document.create({
      userId: req.user.id,
      documentType,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      source: "UPLOAD",
      extractedData,
      healthStatus,
      issuesDetected,
      uploadedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded and evaluated successfully.",
      document: {
        id: newDoc._id,
        documentType: newDoc.documentType,
        originalFileName: newDoc.originalFileName,
        fileSize: newDoc.fileSize,
        mimeType: newDoc.mimeType,
        source: newDoc.source,
        healthStatus: newDoc.healthStatus,
        issuesDetected: newDoc.issuesDetected,
        extractedData: newDoc.extractedData,
        uploadedAt: newDoc.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Document upload controller error:", error);
    // Cleanup if file was written but DB threw error
    if (req.file?.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({
      success: false,
      message: "Failed to process document upload.",
    });
  }
}

/**
 * Get all documents for authenticated user
 * GET /api/documents
 */
export async function getUserDocuments(req, res) {
  try {
    const documents = await Document.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-filePath -storedFileName");

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get user documents error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
}

/**
 * Get single document details
 * GET /api/documents/:id
 */
export async function getDocumentById(req, res) {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).select("-filePath -storedFileName");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get document by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve document.",
    });
  }
}

/**
 * Securely download/view an authenticated user's document
 * GET /api/documents/:id/download
 */
export async function downloadDocument(req, res) {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const resolvedPath = path.resolve(document.filePath);
    const resolvedUploadDir = path.resolve(uploadDir);

    // Prevent path traversal attacks
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Invalid file path.",
      });
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        success: false,
        message: "Stored file not found on server.",
      });
    }

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(document.originalFileName)}"`
    );

    const fileStream = fs.createReadStream(resolvedPath);
    return fileStream.pipe(res);
  } catch (error) {
    console.error("Download document error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download document.",
    });
  }
}

/**
 * Delete a user's document
 * DELETE /api/documents/:id
 */
export async function deleteDocument(req, res) {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    // Remove physical file from disk safely
    if (document.filePath && fs.existsSync(document.filePath)) {
      await fs.promises.unlink(document.filePath).catch((err) => {
        console.warn("Could not delete file from disk:", err.message);
      });
    }

    await Document.findByIdAndDelete(document._id);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document.",
    });
  }
}

/**
 * Get document checklist for a specific scheme
 * GET /api/documents/scheme/:schemeId/checklist
 */
export async function getSchemeDocumentChecklist(req, res) {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    const userDocuments = await Document.find({ userId: req.user.id });

    const checklist = matchSchemeDocuments(
      scheme.requiredDocuments || [],
      userDocuments
    );

    return res.status(200).json({
      success: true,
      scheme: {
        id: scheme._id,
        name: scheme.name,
      },
      ...checklist,
    });
  } catch (error) {
    console.error("Scheme checklist error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate scheme document checklist.",
    });
  }
}
