import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Authentication Middleware: Protects routes requiring valid JWT
 * Checks HTTP-only cookie first, then fallback to Authorization header (Bearer token)
 */
export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check for cookie token first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Bearer token in Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No session token provided.",
        code: "AUTH_TOKEN_MISSING",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "haqdwaar_jwt_secret_dev_key_2026_secure";
    
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session token. Please log in again.",
        code: "AUTH_TOKEN_INVALID",
      });
    }

    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session is no longer valid. User does not exist.",
        code: "AUTH_USER_NOT_FOUND",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication Middleware:
 * Inspects token if provided. If valid, attaches req.user.
 * If token is missing or invalid, sets req.user = null and continues without error.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET || "haqdwaar_jwt_secret_dev_key_2026_secure";
    try {
      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.userId).select("-passwordHash");
      req.user = user || null;
    } catch (err) {
      req.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};
