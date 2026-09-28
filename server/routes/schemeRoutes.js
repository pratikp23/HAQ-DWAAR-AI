import express from "express";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  archiveScheme,
} from "../controllers/schemeController.js";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Publicly accessible with optional auth (Citizens see VERIFIED; Admins see drafts/all)
router.get("/", optionalAuth, getSchemes);
router.get("/:id", optionalAuth, getSchemeById);

// Admin role strictly required
router.post("/", requireAuth, requireRole("admin"), createScheme);
router.put("/:id", requireAuth, requireRole("admin"), updateScheme);
router.delete("/:id", requireAuth, requireRole("admin"), archiveScheme);

export default router;
