import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { processCitizenMessage } from "../services/mittraAgentService.js";
import { getCitizenContextSnapshot } from "../services/mittraContextService.js";

const router = express.Router();

/**
 * @route   POST /api/mittra/chat
 * @desc    Process natural voice/text citizen prompt into structured MITTRA command
 * @access  Private (Authenticated Citizen)
 */
router.post("/chat", requireAuth, async (req, res, next) => {
  try {
    const { query, language = "hi", currentRoute = "/dashboard", conversationHistory = [] } = req.body;
    const userId = req.user._id;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "A prompt query is required.",
      });
    }

    const result = await processCitizenMessage({
      userId,
      query,
      language,
      currentRoute,
      conversationHistory,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/mittra/context
 * @desc    Fetch current citizen snapshot for MITTRA
 * @access  Private (Authenticated Citizen)
 */
router.get("/context", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const snapshot = await getCitizenContextSnapshot(userId);
    return res.status(200).json({
      success: true,
      data: snapshot,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
