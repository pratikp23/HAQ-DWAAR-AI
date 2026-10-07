import mongoose from "mongoose";

/**
 * HAQ DWAAR AI — Scheme Grievance & Fraud Report Model
 * 
 * Allows citizens to flag suspicious, fraudulent, or inaccurate scheme information.
 * Directly fed into the Super Admin and Chief Officer investigation desks.
 */
const schemeReportSchema = new mongoose.Schema(
  {
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: [true, "Scheme ID is required"],
      index: true,
    },
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },
    reportedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reporterName: {
      type: String,
      trim: true,
      default: "Anonymous Citizen",
    },
    reporterEmail: {
      type: String,
      trim: true,
      default: "",
    },
    reason: {
      type: String,
      required: [true, "Reporting reason is required"],
      enum: [
        "FAKE_OR_FRAUD",
        "BROKEN_OR_UNAUTHORIZED_LINK",
        "INCORRECT_ELIGIBILITY_RULES",
        "EXPIRED_SCHEME_SHOWING_ACTIVE",
        "CORRUPT_FEE_DEMANDED",
        "OTHER",
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description of the issue is required"],
      trim: true,
      maxlength: 2000,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["PENDING_INVESTIGATION", "VERIFIED_VALID", "SCHEME_UPDATED", "SCHEME_DELISTED", "DISMISSED"],
      default: "PENDING_INVESTIGATION",
      index: true,
    },
    investigatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    investigationNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SchemeReport = mongoose.model("SchemeReport", schemeReportSchema);
export default SchemeReport;
