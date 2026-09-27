import express from "express";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  archiveScheme,
  verifyScheme,
} from "../controllers/schemeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Admin scheme management routes
 * All routes require authenticated user with role: admin
 */
router.get("/schemes", requireAuth, requireRole("admin"), getSchemes);
router.get("/schemes/:id", requireAuth, requireRole("admin"), getSchemeById);
router.post("/schemes", requireAuth, requireRole("admin"), createScheme);
router.put("/schemes/:id", requireAuth, requireRole("admin"), updateScheme);
router.delete("/schemes/:id", requireAuth, requireRole("admin"), archiveScheme);
router.put("/schemes/:id/verify", requireAuth, requireRole("admin"), verifyScheme);

export default router;
