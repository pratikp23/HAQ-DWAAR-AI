import express from "express";
import {
  submitOfficerApplication,
  getOfficerApplications,
  approveOfficerApplication,
  rejectOfficerApplication,
  revokeOfficerLicense,
  getActiveOfficers,
  transferOfficerPortfolio,
} from "../controllers/chiefOfficerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Public endpoint: Government officers apply for Category Admin access
 */
router.post("/apply", submitOfficerApplication);

/**
 * High-Level Nodal & Super Admin endpoints
 * Restricted to chief_officer, super_admin, admin
 */
router.get(
  "/applications",
  requireAuth,
  requireRole("chief_officer", "super_admin", "admin"),
  getOfficerApplications
);

router.patch(
  "/applications/:id/approve",
  requireAuth,
  requireRole("chief_officer", "super_admin", "admin"),
  approveOfficerApplication
);

router.patch(
  "/applications/:id/reject",
  requireAuth,
  requireRole("chief_officer", "super_admin", "admin"),
  rejectOfficerApplication
);

router.patch(
  "/officers/:id/revoke",
  requireAuth,
  requireRole("chief_officer", "super_admin", "admin"),
  revokeOfficerLicense
);

router.get(
  "/officers",
  requireAuth,
  requireRole("chief_officer", "super_admin", "admin"),
  getActiveOfficers
);

router.post(
  "/officers/transfer-portfolio",
  requireAuth,
  requireRole("chief_officer", "super_admin", "admin"),
  transferOfficerPortfolio
);

export default router;
