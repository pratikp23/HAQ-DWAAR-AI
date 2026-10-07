import express from "express";
import {
  reportSchemeIssue,
  getSchemeReports,
  resolveSchemeReport,
} from "../controllers/schemeReportController.js";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Citizen Grievance & Fraud Reporting:
 * Citizens can report a suspected fake, broken, or inaccurate scheme
 */
router.post("/:id", optionalAuth, reportSchemeIssue);
router.post("/schemes/:id", optionalAuth, reportSchemeIssue);

/**
 * Super Admin & Chief Nodal Officer audit endpoints:
 * Review pending fraud investigations and take corrective actions
 */
router.get(
  "/",
  requireAuth,
  requireRole("super_admin", "chief_officer", "admin"),
  getSchemeReports
);

router.patch(
  "/:id/resolve",
  requireAuth,
  requireRole("super_admin", "chief_officer", "admin"),
  resolveSchemeReport
);

export default router;
