import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const audioUploadDir = path.join(__dirname, "..", "uploads", "voice_temp");

// Ensure temp voice directory exists
if (!fs.existsSync(audioUploadDir)) {
  fs.mkdirSync(audioUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".wav";
    const uniqueName = `voice_${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const audioMimes = [
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
  "audio/mpeg",
  "audio/mp3",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/webm;codecs=opus",
];

const fileFilter = (req, file, cb) => {
  const mime = file.mimetype.split(";")[0].toLowerCase().trim();
  const isMatch = audioMimes.some((allowed) => allowed.split(";")[0].toLowerCase().trim() === mime);

  if (isMatch) {
    cb(null, true);
  } else {
    const error = new Error(`Unsupported audio format (${file.mimetype}). Only WAV, MP3, WebM, OGG, and M4A are allowed.`);
    error.code = "INVALID_AUDIO_TYPE";
    cb(error, false);
  }
};

export const audioUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});

export const handleAudioUpload = (fieldName = "audio") => {
  const uploadSingle = audioUpload.single(fieldName);

  return (req, res, next) => {
    // If request is JSON with base64 audio, skip multer file handling
    if (req.is("application/json")) {
      return next();
    }

    uploadSingle(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "Audio file size exceeds the 10MB limit.",
            code: "AUDIO_TOO_LARGE",
          });
        }
        if (err.code === "INVALID_AUDIO_TYPE" || err.message?.includes("Unsupported audio")) {
          return res.status(415).json({
            success: false,
            message: err.message,
            code: "INVALID_AUDIO_FORMAT",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "Failed to process audio file.",
          code: "AUDIO_UPLOAD_ERROR",
        });
      }
      next();
    });
  };
};
