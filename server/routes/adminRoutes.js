import express from "express";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  archiveScheme,
  verifyScheme,
} from "../controllers/schemeController.js";
import {
  getSchemeReports,
  resolveSchemeReport,
} from "../controllers/schemeReportController.js";
import {
  getActiveOfficers,
  transferOfficerPortfolio,
} from "../controllers/chiefOfficerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole, requireDepartmentScope } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Admin scheme management routes
 * Authorized for: super_admin, chief_officer, category_admin (scoped)
 */
router.get(
  "/schemes",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin", "chief_officer"),
  getSchemes
);

router.get(
  "/schemes/:id",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin", "chief_officer"),
  getSchemeById
);

router.post(
  "/schemes",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  createScheme
);

router.put(
  "/schemes/:id",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  updateScheme
);

router.delete(
  "/schemes/:id",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  archiveScheme
);

router.put(
  "/schemes/:id/verify",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  verifyScheme
);

/**
 * Fraud Grievance & Citizen Reports Queue
 */
router.get(
  "/reports",
  requireAuth,
  requireRole("admin", "super_admin", "chief_officer", "category_admin"),
  getSchemeReports
);

router.patch(
  "/reports/:id/resolve",
  requireAuth,
  requireRole("admin", "super_admin", "chief_officer", "category_admin"),
  resolveSchemeReport
);

/**
 * Officers Directory & Succession Management
 */
router.get(
  "/officers",
  requireAuth,
  requireRole("admin", "super_admin", "chief_officer"),
  getActiveOfficers
);

router.post(
  "/officers/transfer-portfolio",
  requireAuth,
  requireRole("admin", "super_admin", "chief_officer"),
  transferOfficerPortfolio
);

export default router;
