import express from "express";
import {
  getStatus,
  handleSpeechToText,
  handleTextToSpeech,
} from "../controllers/bhashiniController.js";
import { handleAudioUpload } from "../middleware/audioUploadMiddleware.js";
import { voiceRateLimiter } from "../middleware/voiceRateLimiter.js";

const router = express.Router();

// Service status (public)
router.get("/status", getStatus);

// Speech to text (rate limited, audio upload handling)
router.post(
  "/speech-to-text",
  voiceRateLimiter,
  handleAudioUpload("audio"),
  handleSpeechToText
);

// Text to speech (rate limited)
router.post("/text-to-speech", voiceRateLimiter, handleTextToSpeech);

export default router;
