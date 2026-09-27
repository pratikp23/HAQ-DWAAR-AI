import express from "express";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  archiveScheme,
} from "../controllers/schemeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Citizen & Admin accessible
router.get("/", requireAuth, getSchemes);
router.get("/:id", requireAuth, getSchemeById);

// Admin role strictly required
router.post("/", requireAuth, requireRole("admin"), createScheme);
router.put("/:id", requireAuth, requireRole("admin"), updateScheme);
router.delete("/:id", requireAuth, requireRole("admin"), archiveScheme);

export default router;
