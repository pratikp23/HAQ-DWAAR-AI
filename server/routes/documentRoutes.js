import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { handleSingleUpload } from "../middleware/uploadMiddleware.js";
import {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
  getSchemeDocumentChecklist,
} from "../controllers/documentController.js";

const router = express.Router();

// Upload document (file + documentType)
router.post("/upload", requireAuth, handleSingleUpload("file"), uploadDocument);

// Get all documents of current authenticated user
router.get("/", requireAuth, getUserDocuments);

// Scheme document availability checklist
router.get("/scheme/:schemeId/checklist", requireAuth, getSchemeDocumentChecklist);

// Get single document by ID
router.get("/:id", requireAuth, getDocumentById);

// Download / stream file
router.get("/:id/download", requireAuth, downloadDocument);

// Delete document and file
router.delete("/:id", requireAuth, deleteDocument);

export default router;
