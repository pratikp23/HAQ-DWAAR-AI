import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_EXPIRES_IN = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

/**
 * Generate signed JWT for authenticated user
 */
const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET || "haqdwaar_jwt_secret_dev_key_2026_secure";
  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Attach HTTP-only cookie with session token
 */
const attachAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new citizen
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
        code: "VALIDATION_ERROR",
        errors: [{ field: "name", message: "Name cannot be empty" }],
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
        code: "VALIDATION_ERROR",
        errors: [{ field: "email", message: "Invalid email format" }],
      });
    }

    // Validate password
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
        code: "VALIDATION_ERROR",
        errors: [{ field: "password", message: "Password too short" }],
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Public registration strictly creates citizen accounts.
    // Category Admins and Officers must be vetted and approved by the Chief Nodal Officer.
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "citizen",
    });

    // Generate JWT and attach cookie
    const token = generateToken(newUser._id, newUser.role);
    attachAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Citizen account registered successfully.",
      data: {
        user: newUser.toSafeObject(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT session
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required.",
        code: "VALIDATION_ERROR",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = generateToken(user._id, user.role);
    attachAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: user.toSafeObject(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user.toSafeObject ? req.user.toSafeObject() : req.user,
    },
    message: "Authenticated session verified.",
  });
};

/**
 * @route   POST /api/auth/logout
 * @desc    Clear session cookie and invalidate token
 * @access  Public
 */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
    data: {},
  });
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile details & avatar
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const { name, phone, designation, officeLocation, avatar } = req.body;

    if (name && typeof name === "string") user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;
    if (designation !== undefined) user.designation = designation ? designation.trim() : null;
    if (officeLocation !== undefined) user.officeLocation = officeLocation ? officeLocation.trim() : null;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user account password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
