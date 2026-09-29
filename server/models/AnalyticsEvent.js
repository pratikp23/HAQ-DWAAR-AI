import mongoose from "mongoose";

/**
 * HAQ DWAAR AI — Operational Analytics Event Model
 * 
 * Used strictly for aggregate platform monitoring and operational intelligence.
 * PRIVACY GUARANTEE:
 * - NEVER stores raw voice audio or transcripts.
 * - NEVER stores document contents or images.
 * - NEVER stores Aadhaar, PAN, or bank account numbers.
 * - Minimal operational metadata only.
 */

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        "MATCH_EVALUATED",
        "READINESS_CHECKED",
        "VOICE_SESSION",
        "DOCUMENT_UPLOADED",
        "DOCUMENT_IMPORTED",
        "APPLICATION_CREATED",
        "APPLICATION_STATUS_CHANGED",
        "NOTIFICATION_CREATED",
        "NOTIFICATION_READ",
      ],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
      index: true,
    },
    category: {
      type: String,
      default: null,
      index: true,
    },
    status: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for time-range metric aggregation
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });

const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);

export default AnalyticsEvent;
