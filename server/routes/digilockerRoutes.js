import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getStatus,
  getAuthorize,
  submitConsent,
  getDocuments,
  getDocumentById,
  importDocument,
} from "../controllers/digilockerController.js";

const router = express.Router();

// All DigiLocker endpoints require citizen authentication
router.use(requireAuth);

router.get("/status", getStatus);
router.get("/authorize", getAuthorize);
router.post("/consent", submitConsent);
router.get("/documents", getDocuments);
router.get("/documents/:documentId", getDocumentById);
router.post("/import/:documentId", importDocument);

export default router;
