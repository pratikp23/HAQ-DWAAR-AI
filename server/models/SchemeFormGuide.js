import mongoose from "mongoose";

/**
 * Individual field definition for official government application forms
 */
const formFieldSchema = new mongoose.Schema(
  {
    fieldId: {
      type: String,
      required: true,
      trim: true,
    }, // e.g. "applicant_name", "father_name", "khasra_number", "annual_income"
    fieldLabel: {
      type: String,
      required: true,
      trim: true,
    }, // e.g. "Father's Full Name"
    fieldLabelHindi: {
      type: String,
      required: true,
      trim: true,
    }, // e.g. "पिता का पूरा नाम"
    fieldType: {
      type: String,
      enum: ["text", "number", "date", "dropdown", "radio", "textarea"],
      default: "text",
    },
    explanation: {
      type: String,
      default: "",
      trim: true,
    }, // Plain English instruction
    explanationHindi: {
      type: String,
      required: true,
      trim: true,
    }, // Simple conversational Hindi guidance
    voicePrompt: {
      type: String,
      default: "",
      trim: true,
    }, // Spoken script for MITTRA voice assistant
    autoFillPath: {
      type: String,
      default: null,
      trim: true,
    }, // Dotted path to citizen Benefit Passport e.g. "personal.name" or "socioEconomic.familyAnnualIncome"
    isRequired: {
      type: Boolean,
      default: true,
    },
    exampleValue: {
      type: String,
      default: "",
    },
    commonMistakes: [
      {
        type: String,
        trim: true,
      },
    ],
    documentSource: {
      type: String,
      default: null,
      trim: true,
    }, // e.g. "AADHAAR", "INCOME_CERTIFICATE", "LAND_RECORD"
  },
  { _id: false }
);

/**
 * Checklist item to verify BEFORE opening the official government portal
 */
const preFlightItemSchema = new mongoose.Schema(
  {
    itemTitle: {
      type: String,
      required: true,
      trim: true,
    },
    itemTitleHindi: {
      type: String,
      required: true,
      trim: true,
    },
    guidanceHindi: {
      type: String,
      default: "",
      trim: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const schemeFormGuideSchema = new mongoose.Schema(
  {
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
      unique: true,
      index: true,
    },
    officialPortalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    officialRegistrationSteps: [
      {
        stepNumber: { type: Number, required: true },
        titleHindi: { type: String, required: true },
        descriptionHindi: { type: String, required: true },
      },
    ],
    preFlightChecklist: [preFlightItemSchema],
    formFields: [formFieldSchema],
    commonTraps: [
      {
        trapTitle: { type: String, required: true },
        trapTitleHindi: { type: String, required: true },
        solutionHindi: { type: String, required: true },
      },
    ],
    estimatedTimeMinutes: {
      type: Number,
      default: 15,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const SchemeFormGuide = mongoose.model("SchemeFormGuide", schemeFormGuideSchema);

export default SchemeFormGuide;
