import express from "express";
import {
  analyzeSituation,
  previewMatchingWithSignals,
  applySignalsToPassport,
} from "../controllers/lifeSituationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/life-situation/analyze
 * @desc    Analyze citizen natural-language text with Gemini NLU (or fallback)
 * @access  Private
 */
router.post("/analyze", requireAuth, analyzeSituation);

/**
 * @route   POST /api/life-situation/preview-matches
 * @desc    Non-persistent match preview using extracted signals
 * @access  Private
 */
router.post("/preview-matches", requireAuth, previewMatchingWithSignals);

/**
 * @route   POST /api/life-situation/apply-signals
 * @desc    Explicitly confirm and save signals into Benefit Passport
 * @access  Private
 */
router.post("/apply-signals", requireAuth, applySignalsToPassport);

export default router;
