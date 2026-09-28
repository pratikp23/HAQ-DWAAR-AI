import express from "express";
import {
  uploadNotification,
  listNotifications,
  getNotificationById,
  analyzeNotification,
  downloadNotificationFile,
  updateNotification,
  approveNotification,
  rejectNotification,
  previewSchemeUpdate,
  applySchemeUpdate,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { handleNotificationUpload } from "../middleware/notificationUploadMiddleware.js";

const router = express.Router();

// Strict Access Control: All routes require authenticated Admin
router.use(requireAuth, requireRole("admin"));

// Upload & List
router.post("/", handleNotificationUpload("file"), uploadNotification);
router.get("/", listNotifications);

// Detail & Actions
router.get("/:id", getNotificationById);
router.post("/:id/analyze", analyzeNotification);
router.get("/:id/download", downloadNotificationFile);
router.put("/:id", updateNotification);

// Verification Decision
router.post("/:id/approve", approveNotification);
router.post("/:id/reject", rejectNotification);

// Optional Explicit Scheme Update
router.get("/:id/preview-scheme-update", previewSchemeUpdate);
router.post("/:id/apply-scheme-update", applySchemeUpdate);

export default router;
