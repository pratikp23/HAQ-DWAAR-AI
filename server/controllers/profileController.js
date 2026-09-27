import UserProfile from "../models/UserProfile.js";
import { calculateProfileCompleteness } from "../utils/completenessCalculator.js";

const VALID_GENDERS = ["Male", "Female", "Transgender", "Other", "Prefer not to say"];
const VALID_CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "Minority"];
const VALID_AREA_TYPES = ["Rural", "Urban", "Semi-Urban"];
const VALID_QUALIFICATIONS = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post-Graduate",
  "Doctorate",
  "Vocational",
];
const VALID_OCCUPATIONS = [
  "Student",
  "Farmer",
  "Self-Employed",
  "Unemployed",
  "Daily Wage",
  "Salaried Private",
  "Government",
  "Homemaker",
];
const VALID_INCOME_RANGES = [
  "Below 1 Lakh",
  "1 - 2.5 Lakhs",
  "2.5 - 5 Lakhs",
  "5 - 8 Lakhs",
  "Above 8 Lakhs",
];
const VALID_IRRIGATION_TYPES = ["Rainfed", "Borewell", "Canal", "Drip/Sprinkler", "None"];

/**
 * Safely sanitizes enum values. Empty strings or unlisted values become null so Mongoose does not fail validation.
 */
const sanitizeEnum = (val, allowedValues) => {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();
  return allowedValues.includes(trimmed) ? trimmed : null;
};

const sanitizeString = (val) => {
  if (!val || typeof val !== "string") return "";
  return val.trim();
};

/**
 * Default empty profile structure for new users
 */
const getDefaultProfile = (userId) => ({
  userId,
  personal: {
    age: null,
    gender: null,
    category: null,
    differentlyAbled: false,
  },
  location: {
    state: "",
    district: "",
    city: "",
    areaType: null,
  },
  education: {
    qualification: null,
    currentCourse: "",
    institution: "",
    gradePercentage: null,
  },
  occupation: {
    occupationType: null,
    annualIncome: null,
    incomeRange: null,
  },
  kisanDetails: {
    isFarmer: false,
    landholdingAcres: null,
    cropTypes: [],
    irrigationType: null,
    kisanCreditCard: false,
  },
  needs: [],
  preferences: {
    notificationConsent: true,
    whatsappConsent: false,
    preferredLanguage: "Hindi/English",
  },
  profileCompleteness: 0,
});

/**
 * @route   GET /api/profile
 * @desc    Get current citizen Benefit Passport profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      const defaultProfile = getDefaultProfile(userId);
      return res.status(200).json({
        success: true,
        message: "No profile found. Default empty profile initialized.",
        data: {
          profile: defaultProfile,
          profileCompleteness: 0,
        },
      });
    }

    // Ensure completeness is accurately synchronized
    const completeness = calculateProfileCompleteness(profile);
    if (profile.profileCompleteness !== completeness) {
      profile.profileCompleteness = completeness;
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message: "Benefit Passport retrieved successfully.",
      data: {
        profile,
        profileCompleteness: profile.profileCompleteness,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/profile
 * @desc    Create or update citizen Benefit Passport profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      personal = {},
      location = {},
      education = {},
      occupation = {},
      kisanDetails = {},
      needs = [],
      preferences = {},
    } = req.body;

    // 1. Sanitize & validate Personal
    let ageNum = null;
    if (personal.age !== undefined && personal.age !== null && personal.age !== "") {
      ageNum = Number(personal.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid age between 0 and 125.",
          code: "VALIDATION_ERROR",
          errors: [{ field: "personal.age", message: "Age must be between 0 and 125" }],
        });
      }
    }

    const sanitizedPersonal = {
      age: ageNum,
      gender: sanitizeEnum(personal.gender, VALID_GENDERS),
      category: sanitizeEnum(personal.category, VALID_CATEGORIES),
      differentlyAbled: Boolean(personal.differentlyAbled),
    };

    // 2. Sanitize Location
    const sanitizedLocation = {
      state: sanitizeString(location.state),
      district: sanitizeString(location.district),
      city: sanitizeString(location.city),
      areaType: sanitizeEnum(location.areaType, VALID_AREA_TYPES),
    };

    // 3. Sanitize & validate Education
    let gradePct = null;
    if (
      education.gradePercentage !== undefined &&
      education.gradePercentage !== null &&
      education.gradePercentage !== ""
    ) {
      gradePct = Number(education.gradePercentage);
      if (isNaN(gradePct) || gradePct < 0 || gradePct > 100) {
        return res.status(400).json({
          success: false,
          message: "Grade percentage must be between 0 and 100.",
          code: "VALIDATION_ERROR",
          errors: [{ field: "education.gradePercentage", message: "Percentage must be 0 to 100" }],
        });
      }
    }

    const sanitizedEducation = {
      qualification: sanitizeEnum(education.qualification, VALID_QUALIFICATIONS),
      currentCourse: sanitizeString(education.currentCourse),
      institution: sanitizeString(education.institution),
      gradePercentage: gradePct,
    };

    // 4. Sanitize & validate Occupation
    let incomeNum = null;
    if (
      occupation.annualIncome !== undefined &&
      occupation.annualIncome !== null &&
      occupation.annualIncome !== ""
    ) {
      incomeNum = Number(occupation.annualIncome);
      if (isNaN(incomeNum) || incomeNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Annual income cannot be negative.",
          code: "VALIDATION_ERROR",
          errors: [{ field: "occupation.annualIncome", message: "Income cannot be negative" }],
        });
      }
    }

    const sanitizedOccupation = {
      occupationType: sanitizeEnum(occupation.occupationType, VALID_OCCUPATIONS),
      annualIncome: incomeNum,
      incomeRange: sanitizeEnum(occupation.incomeRange, VALID_INCOME_RANGES),
    };

    // 5. Sanitize & validate Kisan Details
    let landholdingNum = null;
    if (
      kisanDetails.landholdingAcres !== undefined &&
      kisanDetails.landholdingAcres !== null &&
      kisanDetails.landholdingAcres !== ""
    ) {
      landholdingNum = Number(kisanDetails.landholdingAcres);
      if (isNaN(landholdingNum) || landholdingNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Landholding acres cannot be negative.",
          code: "VALIDATION_ERROR",
          errors: [{ field: "kisanDetails.landholdingAcres", message: "Landholding cannot be negative" }],
        });
      }
    }

    let parsedCrops = [];
    if (Array.isArray(kisanDetails.cropTypes)) {
      parsedCrops = kisanDetails.cropTypes.map(sanitizeString).filter(Boolean);
    } else if (typeof kisanDetails.cropTypes === "string") {
      parsedCrops = kisanDetails.cropTypes.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const sanitizedKisan = {
      isFarmer: Boolean(kisanDetails.isFarmer),
      landholdingAcres: landholdingNum,
      cropTypes: parsedCrops,
      irrigationType: sanitizeEnum(kisanDetails.irrigationType, VALID_IRRIGATION_TYPES),
      kisanCreditCard: Boolean(kisanDetails.kisanCreditCard),
    };

    // 6. Needs
    const sanitizedNeeds = Array.isArray(needs)
      ? needs.map(sanitizeString).filter(Boolean)
      : [];

    // 7. Preferences
    const sanitizedPreferences = {
      notificationConsent:
        typeof preferences.notificationConsent === "boolean"
          ? preferences.notificationConsent
          : true,
      whatsappConsent:
        typeof preferences.whatsappConsent === "boolean"
          ? preferences.whatsappConsent
          : false,
      preferredLanguage: sanitizeString(preferences.preferredLanguage) || "Hindi/English",
    };

    // Build update object
    const updatePayload = {
      personal: sanitizedPersonal,
      location: sanitizedLocation,
      education: sanitizedEducation,
      occupation: sanitizedOccupation,
      kisanDetails: sanitizedKisan,
      needs: sanitizedNeeds,
      preferences: sanitizedPreferences,
    };

    // Calculate deterministic completeness
    updatePayload.profileCompleteness = calculateProfileCompleteness(updatePayload);

    // Save/update in MongoDB
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updatePayload },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Benefit Passport saved successfully.",
      data: {
        profile: updatedProfile,
        profileCompleteness: updatedProfile.profileCompleteness,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const formattedErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).json({
        success: false,
        message: "Profile validation failed: " + formattedErrors.map((e) => e.message).join(", "),
        code: "VALIDATION_ERROR",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};
