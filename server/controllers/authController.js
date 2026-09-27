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

    // Create user (role defaults to citizen, allow admin only if explicitly specified and valid)
    const assignedRole = role === "admin" ? "admin" : "citizen";
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: assignedRole,
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
