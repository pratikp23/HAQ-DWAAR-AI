import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["citizen", "category_admin", "super_admin", "chief_officer", "admin"],
      default: "citizen",
    },
    department: {
      type: String,
      enum: ["STUDENT", "KISAN", "BUSINESS", "EMPLOYMENT", "HEALTH", "GENERAL", "ALL", null],
      default: null,
    },
    designation: {
      type: String,
      trim: true,
      default: null,
    },
    govtIdNumber: {
      type: String,
      trim: true,
      default: null,
    },
    officerStatus: {
      type: String,
      enum: ["NONE", "PENDING_VERIFICATION", "ACTIVE_VERIFIED", "SUSPENDED", "RETIRED"],
      default: "NONE",
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    officeLocation: {
      type: String,
      trim: true,
      default: null,
    },
    verifiedByChief: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compare plain password against stored bcrypt hash
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Return safe user representation excluding passwordHash
 */
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
    designation: this.designation,
    govtIdNumber: this.govtIdNumber,
    officerStatus: this.officerStatus,
    avatar: this.avatar,
    phone: this.phone,
    officeLocation: this.officeLocation,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
