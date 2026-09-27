import express from "express";
import { evaluateSchemeMatch, getRecommendations } from "../controllers/matchingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/matching/evaluate
 * @desc    Evaluate authenticated citizen's Benefit Passport against a verified scheme
 * @access  Private
 */
router.post("/evaluate", requireAuth, evaluateSchemeMatch);

/**
 * @route   GET /api/matching/recommendations
 * @desc    Get recommendations based on citizen's Benefit Passport
 * @access  Private
 */
router.get("/recommendations", requireAuth, getRecommendations);

export default router;
