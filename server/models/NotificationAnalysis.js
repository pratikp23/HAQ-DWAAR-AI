import mongoose from "mongoose";

const importantDateSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const notificationAnalysisSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    storedFileName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      default: "application/pdf",
    },
    status: {
      type: String,
      enum: {
        values: ["UPLOADED", "PROCESSING", "REVIEW_REQUIRED", "APPROVED", "REJECTED"],
        message: "{VALUE} is not a valid notification status",
      },
      default: "REVIEW_REQUIRED",
      index: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
      index: true,
    },

    // Extracted candidate metadata
    title: {
      type: String,
      trim: true,
      default: null,
    },
    schemeName: {
      type: String,
      trim: true,
      default: null,
    },
    issuingOrganization: {
      type: String,
      trim: true,
      default: null,
    },
    notificationNumber: {
      type: String,
      trim: true,
      default: null,
    },
    notificationDate: {
      type: Date,
      default: null,
    },
    effectiveDate: {
      type: Date,
      default: null,
    },
    applicationStartDate: {
      type: Date,
      default: null,
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    importantDates: [importantDateSchema],

    // Highlight text arrays
    eligibilityHighlights: [{ type: String, trim: true }],
    documentHighlights: [{ type: String, trim: true }],
    benefitHighlights: [{ type: String, trim: true }],
    changeHighlights: [{ type: String, trim: true }],
    sourceReferences: [{ type: String, trim: true }],

    // Parser and AI Extraction metadata
    extractionMethod: {
      type: String,
      enum: ["DETERMINISTIC", "AI_ASSISTED", "HYBRID"],
      default: "DETERMINISTIC",
    },
    extractionConfidence: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
    extractionWarnings: [{ type: String, trim: true }],
    rawExtractedTextSummary: {
      type: String,
      default: "",
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    hasUsableText: {
      type: Boolean,
      default: true,
    },
    ocrRequired: {
      type: Boolean,
      default: false,
    },

    // Review metadata
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNotes: {
      type: String,
      default: "",
      trim: true,
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationAnalysisSchema.index({ createdAt: -1 });

const NotificationAnalysis = mongoose.model(
  "NotificationAnalysis",
  notificationAnalysisSchema
);

export default NotificationAnalysis;
