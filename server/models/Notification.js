import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "DEADLINE_APPROACHING",
        "DEADLINE_SOON",
        "DEADLINE_TODAY",
        "DOCUMENT_EXPIRING",
        "READINESS_BLOCKER",
        "APPLICATION_FOLLOW_UP",
        "SYSTEM",
      ],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApplicationTracker",
      default: null,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "READ", "DISMISSED", "FAILED"],
      default: "SENT",
      index: true,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
      default: null,
    },
    channel: {
      type: String,
      enum: ["IN_APP", "WHATSAPP"],
      default: "IN_APP",
      index: true,
    },
    dedupKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
