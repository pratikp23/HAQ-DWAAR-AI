import mongoose from "mongoose";

const extractedDataSchema = new mongoose.Schema(
  {
    documentName: {
      type: String,
      default: null,
      trim: true,
    },
    holderName: {
      type: String,
      default: null,
      trim: true,
    },
    maskedDocumentNumber: {
      type: String,
      default: null,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      default: null,
      trim: true,
    },
    issueDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    income: {
      type: Number,
      default: null,
    },
    issuingAuthority: {
      type: String,
      default: null,
      trim: true,
    },
    detectedFields: {
      type: [String],
      default: [],
    },
    extractionConfidence: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Document must belong to a user"],
      index: true,
    },
    documentType: {
      type: String,
      required: [true, "Document type is required"],
      enum: [
        "Aadhaar",
        "Income Certificate",
        "Caste Certificate",
        "Domicile Certificate",
        "Marksheet",
        "Bank Passbook",
        "Land Ownership Document",
        "Disability Certificate",
        "Other",
      ],
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
    },
    source: {
      type: String,
      enum: ["UPLOAD", "DIGILOCKER"],
      default: "UPLOAD",
    },
    digilockerDocId: {
      type: String,
      default: null,
    },
    extractedData: {
      type: extractedDataSchema,
      default: () => ({}),
    },
    healthStatus: {
      type: String,
      enum: ["VALID", "NEEDS_VERIFICATION", "EXPIRED", "INCOMPLETE"],
      default: "NEEDS_VERIFICATION",
      index: true,
    },
    issuesDetected: {
      type: [String],
      default: [],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
