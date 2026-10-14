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
    // Snapshot of citizen's Benefit Passport at time of submission
    applicantDetails: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      age: { type: Number, default: null },
      gender: { type: String, default: "" },
      category: { type: String, default: "" },
      state: { type: String, default: "" },
      district: { type: String, default: "" },
      annualIncome: { type: Number, default: null },
      occupation: { type: String, default: "" },
      landHolding: { type: Number, default: null },
      qualification: { type: String, default: "" },
    },
    // Eligibility criteria & match score evaluated at time of application
    eligibilitySnapshot: {
      matchScore: { type: Number, default: 100 },
      classification: { type: String, default: "MATCHED" },
      summary: { type: String, default: "" },
      matchedReasons: { type: [String], default: [] },
      missingInformation: { type: [String], default: [] },
      failedConditions: { type: [String], default: [] },
    },
    // Ministry / Department assigned for statutory review
    department: {
      type: String,
      enum: ["KISAN", "STUDENT", "HEALTH", "BUSINESS", "EMPLOYMENT", "GENERAL", "OTHER"],
      default: "GENERAL",
      index: true,
    },
    // Verified statutory documents attached from citizen vault / DigiLocker
    documentsAttached: [
      {
        documentType: { type: String, required: true },
        documentName: { type: String, default: "" },
        status: { type: String, default: "VERIFIED" },
        verifiedVia: { type: String, default: "DigiLocker" },
        fileUrl: { type: String, default: "" },
      },
    ],
    submissionType: {
      type: String,
      enum: ["QUICK_APPLY", "SELF_APPLIED", "MANUAL_TRACK"],
      default: "QUICK_APPLY",
      index: true,
    },
    // Official Department Nodal Officer Audit Trail
    nodalReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      officerName: { type: String, default: null },
      actionTaken: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "NEEDS_DOCUMENTS"],
        default: "PENDING",
      },
      reviewedAt: { type: Date, default: null },
      remarks: { type: String, default: "" },
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
