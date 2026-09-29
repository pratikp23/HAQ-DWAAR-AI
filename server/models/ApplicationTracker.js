import mongoose from "mongoose";

const applicationTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "INTERESTED",
        "PREPARING",
        "READY_TO_APPLY",
        "APPLIED",
        "FOLLOW_UP",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "INTERESTED",
      index: true,
    },
    referenceNumber: {
      type: String,
      default: null,
      trim: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    officialApplicationUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One active tracker per user per scheme
applicationTrackerSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

const ApplicationTracker = mongoose.model("ApplicationTracker", applicationTrackerSchema);

export default ApplicationTracker;
