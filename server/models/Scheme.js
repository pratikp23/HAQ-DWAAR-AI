import mongoose from "mongoose";

const schemeRuleSchema = new mongoose.Schema(
  {
    ruleType: {
      type: String,
      required: true,
      enum: [
        "age",
        "gender",
        "category",
        "state",
        "income",
        "education",
        "occupation",
        "landholding",
        "farmer_status",
        "disability",
        "need",
        "custom",
      ],
    },
    fieldPath: {
      type: String,
      required: true,
      trim: true,
    },
    operator: {
      type: String,
      required: true,
      enum: [
        "equals",
        "not_equals",
        "less_than",
        "less_than_or_equal",
        "greater_than",
        "greater_than_or_equal",
        "in",
        "contains",
      ],
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const requiredDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
      trim: true,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
    guidance: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Scheme name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    fullDescription: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["STUDENT", "KISAN", "EMPLOYMENT", "BUSINESS", "GENERAL"],
        message: "{VALUE} is not a supported scheme category",
      },
      index: true,
    },
    state: {
      type: String,
      required: true,
      default: "All-India",
      trim: true,
      index: true,
    },
    targetAudience: [{ type: String, trim: true }],
    benefitSummary: {
      type: String,
      required: [true, "Benefit summary is required"],
      trim: true,
    },
    eligibilitySummary: {
      type: String,
      required: [true, "Eligibility summary is required"],
      trim: true,
    },
    rules: [schemeRuleSchema],
    requiredDocuments: [requiredDocumentSchema],
    applicationMethod: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "HYBRID"],
      default: "ONLINE",
    },
    officialApplicationUrl: {
      type: String,
      trim: true,
      default: "",
    },
    officialSourceUrl: {
      type: String,
      required: [true, "Official source URL is required"],
      trim: true,
    },
    sourceName: {
      type: String,
      required: [true, "Source authority name is required"],
      trim: true,
    },
    sourceType: {
      type: String,
      required: [true, "Source type is required"],
      enum: {
        values: [
          "CENTRAL_GOVERNMENT",
          "STATE_GOVERNMENT",
          "OFFICIAL_PORTAL",
          "OTHER_OFFICIAL",
        ],
        message: "{VALUE} is not a recognized government source type",
      },
    },
    sourceLastVerified: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      default: null,
    },
    hasDeadline: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ["DRAFT", "PENDING_REVIEW", "VERIFIED", "ARCHIVED"],
        message: "{VALUE} is not a valid verification status",
      },
      default: "DRAFT",
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

// Text search index on name, description, and tags
schemeSchema.index({ name: "text", shortDescription: "text", tags: "text" });

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;
