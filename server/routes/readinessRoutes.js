import express from "express";
import { getSchemeReadiness } from "../controllers/readinessController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/readiness/:schemeId
 * @desc    Get deterministic readiness evaluation and personal action plan for a verified scheme
 * @access  Private (Citizen & Admin)
 */
router.get("/:schemeId", requireAuth, getSchemeReadiness);

export default router;
