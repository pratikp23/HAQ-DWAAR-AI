import fs from "fs";
import {
  getServiceStatus,
  speechToText,
  textToSpeech,
  cleanupAudioFile,
} from "../services/bhashiniService.js";

/**
 * @route   GET /api/bhashini/status
 * @desc    Get Bhashini voice engine status, active mode, and supported languages
 * @access  Public / Citizen
 */
export const getStatus = async (req, res, next) => {
  try {
    const status = getServiceStatus();
    return res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/bhashini/speech-to-text
 * @desc    Process voice recording and convert speech to text
 * @access  Public / Citizen (Authenticated or anonymous voice demo)
 */
export const handleSpeechToText = async (req, res, next) => {
  const filePath = req.file?.path;

  try {
    const language = (req.body?.language || req.query?.language || "hi").trim();
    const textHint = req.body?.textHint;

    let audioBuffer = null;
    let audioBase64 = null;
    let mimeType = req.file?.mimetype || req.body?.mimeType || "audio/wav";
    let size = req.file?.size || 0;

    if (req.file) {
      audioBuffer = fs.readFileSync(req.file.path);
      size = audioBuffer.length;
    } else if (req.body?.audioBase64) {
      audioBase64 = req.body.audioBase64;
      const stripped = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
      audioBuffer = Buffer.from(stripped, "base64");
      size = audioBuffer.length;
    } else {
      return res.status(400).json({
        success: false,
        message: "No audio file or base64 audio data provided.",
        code: "EMPTY_AUDIO",
      });
    }

    if (size === 0) {
      return res.status(400).json({
        success: false,
        message: "Audio input is empty (0 bytes).",
        code: "EMPTY_AUDIO",
      });
    }

    // Call voice abstraction service
    const result = await speechToText({
      audioBuffer,
      audioBase64,
      filePath,
      mimeType,
      size,
      language,
      textHint,
    });

    // Safe privacy logging: Log metadata only, never citizen voice content or PII
    if (process.env.NODE_ENV !== "test") {
      console.log(`[Bhashini] STT processed successfully. Mode: ${result.mode}, Lang: ${result.language}`);
    }

    return res.status(200).json({
      success: true,
      message: "Audio transcribed successfully.",
      data: result,
    });
  } catch (error) {
    // Check specific custom codes
    if (error.code === "EMPTY_AUDIO") {
      return res.status(400).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    }
    if (error.code === "AUDIO_TOO_LARGE") {
      return res.status(413).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    }
    if (error.code === "INVALID_AUDIO_FORMAT") {
      return res.status(415).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    }

    next(error);
  } finally {
    // Temporary file cleanup: always delete temp audio on disk
    if (filePath) {
      cleanupAudioFile(filePath);
    }
  }
};

/**
 * @route   POST /api/bhashini/text-to-speech
 * @desc    Convert text into speech audio
 * @access  Public / Citizen
 */
export const handleTextToSpeech = async (req, res, next) => {
  try {
    const { text, language = "hi" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Text is required for speech synthesis.",
        code: "INVALID_TEXT",
      });
    }

    const result = await textToSpeech({ text, language });

    return res.status(200).json({
      success: true,
      message: "Text-to-speech generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
