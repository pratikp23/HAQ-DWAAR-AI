import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { uploadDir } from "./uploadMiddleware.js";

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Enforce .pdf extension on stored file
    const safeExt = ext === ".pdf" ? ".pdf" : ".pdf";
    const uniqueName = `notification_${crypto.randomUUID()}${safeExt}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype.toLowerCase() === "application/pdf";
  const isPdfExt = path.extname(file.originalname).toLowerCase() === ".pdf";

  if (isPdfMime || isPdfExt) {
    cb(null, true);
  } else {
    const error = new Error("Unsupported file type. Only PDF documents are allowed.");
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

export const notificationUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

export const handleNotificationUpload = (fieldName = "file") => {
  const uploadSingle = notificationUpload.single(fieldName);
  return (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size exceeds the 5MB limit.",
            code: "LIMIT_FILE_SIZE",
          });
        }
        if (err.code === "INVALID_FILE_TYPE" || err.message?.includes("Only PDF")) {
          return res.status(400).json({
            success: false,
            message: "This file is not a valid PDF. Only PDF documents are supported.",
            code: "INVALID_FILE_TYPE",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "Failed to upload notification PDF.",
          code: "UPLOAD_ERROR",
        });
      }
      next();
    });
  };
};
