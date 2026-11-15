import mongoose from "mongoose";

const schemeIngestionQueueSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["data.gov.in", "myscheme", "pib", "state_gazette", "manual_crawler"],
      index: true,
    },
    sourceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    sourceName: {
      type: String,
      trim: true,
      default: "Government of India Open Data",
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    parsedDraft: {
      name: { type: String, required: true, trim: true },
      shortDescription: { type: String, required: true, trim: true },
      fullDescription: { type: String, trim: true, default: "" },
      category: {
        type: String,
        required: true,
        enum: ["STUDENT", "KISAN", "EMPLOYMENT", "BUSINESS", "GENERAL"],
      },
      state: { type: String, default: "All-India", trim: true },
      targetAudience: [{ type: String, trim: true }],
      benefitSummary: { type: String, required: true, trim: true },
      eligibilitySummary: { type: String, required: true, trim: true },
      rules: [
        {
          ruleType: { type: String, required: true },
          fieldPath: { type: String, required: true },
          operator: { type: String, required: true },
          value: { type: mongoose.Schema.Types.Mixed, required: true },
          mandatory: { type: Boolean, default: true },
          label: { type: String, required: true },
        },
      ],
      requiredDocuments: [
        {
          documentType: { type: String, required: true },
          mandatory: { type: Boolean, default: true },
          guidance: { type: String, default: "" },
        },
      ],
      applicationMethod: {
        type: String,
        enum: ["ONLINE", "OFFLINE", "HYBRID"],
        default: "ONLINE",
      },
      officialApplicationUrl: { type: String, default: "", trim: true },
      officialSourceUrl: { type: String, required: true, trim: true },
      sourceName: { type: String, required: true, trim: true },
      sourceType: {
        type: String,
        enum: [
          "CENTRAL_GOVERNMENT",
          "STATE_GOVERNMENT",
          "OFFICIAL_PORTAL",
          "OTHER_OFFICIAL",
        ],
        default: "CENTRAL_GOVERNMENT",
      },
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.85,
    },
    status: {
      type: String,
      enum: ["pending_review", "approved", "rejected", "auto_merged"],
      default: "pending_review",
      index: true,
    },
    approvedSchemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
    },
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
      trim: true,
      default: "",
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for queue filtering
schemeIngestionQueueSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("SchemeIngestionQueue", schemeIngestionQueueSchema);
