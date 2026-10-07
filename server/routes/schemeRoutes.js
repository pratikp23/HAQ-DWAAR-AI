import express from "express";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  archiveScheme,
} from "../controllers/schemeController.js";
import { reportSchemeIssue } from "../controllers/schemeReportController.js";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";
import { requireRole, requireDepartmentScope } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Publicly accessible with optional auth (Citizens see VERIFIED; Admins see drafts/all)
router.get("/", optionalAuth, getSchemes);
router.get("/:id", optionalAuth, getSchemeById);

// Citizen grievance & fraud reporting for a scheme
router.post("/:id/report", optionalAuth, reportSchemeIssue);

// Admin scheme operations with scoped permissions
router.post(
  "/",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  createScheme
);
router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  updateScheme
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "super_admin", "category_admin"),
  requireDepartmentScope(),
  archiveScheme
);

export default router;
