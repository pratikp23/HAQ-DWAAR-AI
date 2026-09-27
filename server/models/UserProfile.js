import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    personal: {
      age: {
        type: Number,
        min: [0, "Age cannot be negative"],
        max: [125, "Please enter a valid age"],
      },
      gender: {
        type: String,
        enum: {
          values: ["Male", "Female", "Transgender", "Other", "Prefer not to say"],
          message: "{VALUE} is not a valid gender option",
        },
      },
      category: {
        type: String,
        enum: {
          values: ["General", "OBC", "SC", "ST", "EWS", "Minority"],
          message: "{VALUE} is not a valid social category",
        },
      },
      differentlyAbled: {
        type: Boolean,
        default: false,
      },
    },
    location: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      city: { type: String, trim: true },
      areaType: {
        type: String,
        enum: {
          values: ["Rural", "Urban", "Semi-Urban"],
          message: "{VALUE} is not a valid area type",
        },
      },
    },
    education: {
      qualification: {
        type: String,
        enum: {
          values: [
            "Below 10th",
            "10th Pass",
            "12th Pass",
            "Diploma",
            "Graduate",
            "Post-Graduate",
            "Doctorate",
            "Vocational",
          ],
          message: "{VALUE} is not a valid qualification",
        },
      },
      currentCourse: { type: String, trim: true },
      institution: { type: String, trim: true },
      gradePercentage: {
        type: Number,
        min: [0, "Percentage cannot be negative"],
        max: [100, "Percentage cannot exceed 100"],
      },
    },
    occupation: {
      occupationType: {
        type: String,
        enum: {
          values: [
            "Student",
            "Farmer",
            "Self-Employed",
            "Unemployed",
            "Daily Wage",
            "Salaried Private",
            "Government",
            "Homemaker",
          ],
          message: "{VALUE} is not a valid occupation type",
        },
      },
      annualIncome: {
        type: Number,
        min: [0, "Annual income cannot be negative"],
      },
      incomeRange: {
        type: String,
        enum: {
          values: [
            "Below 1 Lakh",
            "1 - 2.5 Lakhs",
            "2.5 - 5 Lakhs",
            "5 - 8 Lakhs",
            "Above 8 Lakhs",
          ],
          message: "{VALUE} is not a valid income range",
        },
      },
    },
    kisanDetails: {
      isFarmer: { type: Boolean, default: false },
      landholdingAcres: {
        type: Number,
        min: [0, "Landholding cannot be negative"],
      },
      cropTypes: [{ type: String, trim: true }],
      irrigationType: {
        type: String,
        enum: {
          values: ["Rainfed", "Borewell", "Canal", "Drip/Sprinkler", "None"],
          message: "{VALUE} is not a valid irrigation type",
        },
      },
      kisanCreditCard: { type: Boolean, default: false },
    },
    needs: [{ type: String, trim: true }],
    preferences: {
      notificationConsent: { type: Boolean, default: true },
      whatsappConsent: { type: Boolean, default: false },
      preferredLanguage: { type: String, default: "Hindi/English" },
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
