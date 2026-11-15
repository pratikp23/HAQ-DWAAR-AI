# 🏛️ HAQ DWAAR AI — Volume 5: Database Schemas & Data Models

---

## 1. Overview of MongoDB Collections

The platform is powered by MongoDB and structured with Mongoose ODM models:

| Model | File Path | Purpose |
|:---|:---|:---|
| `User` | `server/models/User.js` | User authentication, session, role (`citizen`, `admin`) |
| `UserProfile` | `server/models/UserProfile.js` | Citizen Benefit Passport (demographics, income, land, education) |
| `Scheme` | `server/models/Scheme.js` | Authoritative verified welfare schemes with deterministic rules |
| `Document` | `server/models/Document.js` | Citizen personal document vault with health status & PII masking |
| `ApplicationTracker` | `server/models/ApplicationTracker.js` | Citizen application tracker & Quick Apply dossiers |
| `SchemeFormGuide` | `server/models/SchemeFormGuide.js` | *(NEW)* Field-by-field manual form helper guide for SchemeCoach |
| `SchemeIngestionQueue` | `server/models/SchemeIngestionQueue.js` | *(NEW)* Auto-fetched schemes from government APIs pending 1-click approval |
| `SchemeReport` | `server/models/SchemeReport.js` | Citizen fraud / expired scheme reporting queue |
| `Notification` | `server/models/Notification.js` | In-app alerts, deadline reminders (IST), document expirations |
| `NotificationAnalysis` | `server/models/NotificationAnalysis.js` | PDF circular text extraction & candidate field diffs |

---

## 2. Core Mongoose Schema Definitions

### 1. `User.js` (Simplified Single Admin + Citizen)
```javascript
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
      index: true,
    },
    phone: { type: String, trim: true, default: null },
    avatar: { type: String, default: null },
    preferredLanguage: { type: String, enum: ["en", "hi"], default: "hi" },
  },
  { timestamps: true }
);
```

---

### 2. `UserProfile.js` (The Citizen Benefit Passport)
```javascript
const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    personal: {
      age: { type: Number, min: 0, max: 125 },
      gender: { type: String, enum: ["Male", "Female", "Transgender", "Other", "Prefer not to say"] },
      category: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS", "Minority"] },
      differentlyAbled: { type: Boolean, default: false },
    },
    location: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      city: { type: String, trim: true },
      areaType: { type: String, enum: ["Rural", "Urban", "Semi-Urban"] },
    },
    education: {
      qualification: { type: String, enum: ["Below 10th", "10th Pass", "12th Pass", "Diploma", "Graduate", "Post-Graduate", "Doctorate"] },
      currentStatus: { type: String, enum: ["Studying", "Completed", "Dropped Out"] },
      fieldOfStudy: { type: String, trim: true },
    },
    occupation: {
      type: { type: String, enum: ["Student", "Farmer", "Self-Employed", "Unemployed", "Daily Wage", "Salaried Private", "Government", "Homemaker"] },
      detail: { type: String, trim: true },
    },
    socioEconomic: {
      familyAnnualIncome: { type: Number, min: 0 },
      bplCardHolder: { type: Boolean, default: false },
      rationCardType: { type: String, enum: ["None", "Antyodaya (AAY)", "BPL", "APL"] },
    },
    agriculture: {
      isFarmer: { type: Boolean, default: false },
      landHoldingHectares: { type: Number, min: 0 },
      irrigationType: { type: String, enum: ["Rainfed", "Borewell", "Canal", "Drip/Sprinkler", "None"] },
      kccHolder: { type: Boolean, default: false },
    },
    completenessScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);
```

---

### 3. `Scheme.js` (Verified Welfare Inventory & Deterministic Rules)
```javascript
const schemeRuleSchema = new mongoose.Schema(
  {
    ruleType: {
      type: String,
      required: true,
      enum: ["age", "gender", "category", "state", "income", "education", "occupation", "landholding", "farmer_status", "disability", "custom"],
    },
    fieldPath: { type: String, required: true, trim: true }, // e.g. "socioEconomic.familyAnnualIncome"
    operator: {
      type: String,
      required: true,
      enum: ["equals", "not_equals", "less_than", "less_than_or_equal", "greater_than", "greater_than_or_equal", "in", "contains"],
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    mandatory: { type: Boolean, default: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const requiredDocumentSchema = new mongoose.Schema(
  {
    documentType: { type: String, required: true, trim: true },
    mandatory: { type: Boolean, default: true },
    guidance: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const schemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 300, trim: true },
    fullDescription: { type: String, default: "" },
    category: { type: String, required: true, enum: ["STUDENT", "KISAN", "EMPLOYMENT", "BUSINESS", "GENERAL"], index: true },
    state: { type: String, required: true, default: "All-India", trim: true, index: true },
    benefitSummary: { type: String, required: true },
    eligibilitySummary: { type: String, required: true },
    rules: [schemeRuleSchema],
    requiredDocuments: [requiredDocumentSchema],
    officialApplicationUrl: { type: String, trim: true, default: "" },
    officialSourceUrl: { type: String, required: true, trim: true },
    sourceName: { type: String, required: true, trim: true },
    verificationStatus: { type: String, enum: ["VERIFIED", "PENDING_REVIEW", "ARCHIVED"], default: "VERIFIED", index: true },
    applicationDeadline: { type: Date, default: null },
  },
  { timestamps: true }
);

schemeSchema.index({ category: 1, state: 1, verificationStatus: 1 });
schemeSchema.index({ name: "text", shortDescription: "text" });
```

---

### 4. `ApplicationTracker.js` (Citizen Applications & Quick Apply Dossiers)
```javascript
const applicationTrackerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true, index: true },
    status: {
      type: String,
      enum: ["INTERESTED", "PREPARING", "READY_TO_APPLY", "APPLIED", "FOLLOW_UP", "COMPLETED", "CANCELLED"],
      default: "INTERESTED",
      index: true,
    },
    referenceNumber: { type: String, default: null, trim: true, index: true },
    submissionType: {
      type: String,
      enum: ["QUICK_APPLY", "SELF_APPLIED", "MANUAL_TRACK"],
      default: "QUICK_APPLY",
      index: true,
    },
    department: { type: String, enum: ["KISAN", "STUDENT", "HEALTH", "BUSINESS", "EMPLOYMENT", "GENERAL"], default: "GENERAL" },
    applicantDetails: {
      fullName: String,
      phone: String,
      age: Number,
      gender: String,
      category: String,
      state: String,
      district: String,
      annualIncome: Number,
      occupation: String,
      landHolding: Number,
    },
    eligibilitySnapshot: {
      matchScore: Number,
      classification: String,
      matchedReasons: [String],
      missingInformation: [String],
      failedConditions: [String],
    },
    documentsAttached: [
      {
        documentType: String,
        documentName: String,
        status: String,
        verifiedVia: String,
        fileUrl: String,
      },
    ],
    nodalReview: {
      actionTaken: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "NEEDS_DOCUMENTS"], default: "PENDING" },
      remarks: { type: String, default: "" },
      reviewedAt: Date,
    },
  },
  { timestamps: true }
);

applicationTrackerSchema.index({ userId: 1, schemeId: 1 }, { unique: true });
```

---

### 5. `SchemeFormGuide.js` *(NEW: Form Helper for SchemeCoach)*
```javascript
const formFieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },          // e.g. "father_name"
    fieldLabel: { type: String, required: true },       // "Father's Name"
    fieldLabelHindi: { type: String, required: true },  // "पिता का नाम"
    fieldType: { type: String, enum: ["text", "number", "date", "dropdown"], default: "text" },
    explanation: String,                                // "Enter father's full name as on Aadhaar"
    explanationHindi: String,                           // "यहाँ अपने पिता का पूरा नाम लिखें"
    voicePrompt: String,                                // Spoken audio text for illiterate citizens
    autoFillPath: String,                               // Path to BenefitPassport value e.g. "personal.name"
    isRequired: { type: Boolean, default: true },
    exampleValue: String,
    commonMistakes: [String],
    documentSource: String,                             // e.g. "AADHAAR"
  },
  { _id: false }
);

const schemeFormGuideSchema = new mongoose.Schema(
  {
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true, unique: true, index: true },
    officialFormUrl: { type: String, required: true },
    preFlightChecklist: [
      {
        itemTitle: String,
        itemTitleHindi: String,
        isRequired: Boolean,
      },
    ],
    formFields: [formFieldSchema],
    commonTraps: [String],
    estimatedTimeMinutes: { type: Number, default: 15 },
  },
  { timestamps: true }
);
```

---

### 6. `SchemeIngestionQueue.js` *(NEW: Automated Government API Sync Queue)*
```javascript
const schemeIngestionQueueSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["DATA_GOV_IN", "MY_SCHEME", "PIB_FEED", "MANUAL_PDF"],
      required: true,
      index: true,
    },
    rawData: mongoose.Schema.Types.Mixed,
    parsedData: mongoose.Schema.Types.Mixed,
    aiConfidence: { type: Number, min: 0, max: 1, default: 0.8 },
    status: {
      type: String,
      enum: ["PENDING_REVIEW", "APPROVED", "REJECTED", "DUPLICATE"],
      default: "PENDING_REVIEW",
      index: true,
    },
    isDuplicate: { type: Boolean, default: false },
    existingSchemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme" },
    adminReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminReviewedAt: Date,
    adminNotes: String,
    urlValidation: {
      applicationUrlSafe: Boolean,
      isGovDomain: Boolean,
    },
  },
  { timestamps: true }
);
```

---

*HAQ DWAAR AI — Volume 5: Database Schemas & Data Models 🇮🇳*
