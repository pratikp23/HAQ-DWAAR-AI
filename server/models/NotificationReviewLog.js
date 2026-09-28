import mongoose from "mongoose";

const notificationReviewLogSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationAnalysis",
      required: true,
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: {
        values: [
          "UPLOADED",
          "ANALYZED",
          "UPDATED",
          "APPROVED",
          "REJECTED",
          "SCHEME_UPDATE_PREVIEWED",
          "SCHEME_UPDATE_APPLIED",
        ],
        message: "{VALUE} is not a valid notification log action",
      },
      index: true,
    },
    previousStatus: {
      type: String,
      default: null,
    },
    newStatus: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    changedFields: [{ type: String, trim: true }],
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

const NotificationReviewLog = mongoose.model(
  "NotificationReviewLog",
  notificationReviewLogSchema
);

export default NotificationReviewLog;
