import mongoose from "mongoose";

/**
 * HAQ DWAAR AI — Government Officer Access Application Model
 * 
 * Stores applications submitted by departmental officers seeking Category Admin rights.
 * Must be reviewed and authorized by the Chief Nodal Verification Officer before granting access.
 */
const officerApplicationSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Official email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      required: [true, "Target department is required"],
      enum: ["STUDENT", "KISAN", "BUSINESS", "EMPLOYMENT", "HEALTH", "GENERAL"],
      index: true,
    },
    designation: {
      type: String,
      required: [true, "Official designation is required"],
      trim: true,
    },
    officeLocation: {
      type: String,
      required: [true, "Office location / Ministry secretariat is required"],
      trim: true,
    },
    govtIdType: {
      type: String,
      required: true,
      enum: ["EMPLOYEE_ID", "NIC_BADGE", "OFFICER_SERVICE_ID", "GAZETTE_ORDER"],
      default: "EMPLOYEE_ID",
    },
    govtIdNumber: {
      type: String,
      required: [true, "Government ID number is required"],
      trim: true,
      index: true,
    },
    govtIdDocumentUrl: {
      type: String,
      default: "",
      trim: true,
    },
    employeeIdCardUrl: {
      type: String,
      default: "",
      trim: true,
    },
    authorizationLetterUrl: {
      type: String,
      default: "",
      trim: true,
    },
    postingOrderUrl: {
      type: String,
      default: "",
      trim: true,
    },
    specimenSignatureUrl: {
      type: String,
      default: "",
      trim: true,
    },
    justification: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "REVOKED"],
      default: "PENDING",
      index: true,
    },
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedByChiefId: {
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
    },
  },
  {
    timestamps: true,
  }
);

const OfficerApplication = mongoose.model("OfficerApplication", officerApplicationSchema);
export default OfficerApplication;
