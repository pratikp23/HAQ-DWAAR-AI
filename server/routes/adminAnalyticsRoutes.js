import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  getOverview,
  getSchemes,
  getApplications,
  getMatching,
  getReadiness,
  getDocuments,
  getNotifications,
  getVoice,
  getAttention,
  getSystem,
  getActivity,
} from "../controllers/adminAnalyticsController.js";

const router = express.Router();

// Strict Admin-Only Guard: 401 if unauthenticated, 403 if non-admin citizen
router.use(requireAuth, requireRole("admin"));

// Analytics & Operational Endpoints
router.get("/overview", getOverview);
router.get("/schemes", getSchemes);
router.get("/applications", getApplications);
router.get("/matching", getMatching);
router.get("/readiness", getReadiness);
router.get("/documents", getDocuments);
router.get("/notifications", getNotifications);
router.get("/voice", getVoice);
router.get("/attention", getAttention);
router.get("/system", getSystem);
router.get("/activity", getActivity);

export default router;
