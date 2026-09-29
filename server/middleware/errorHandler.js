/**
 * Centralized API Error Handling Middleware
 * 
 * Enforces:
 * - Standardized API error response format: { success: false, message: "...", code: "..." }
 * - Zero internal stack trace or credential leakage in production responses
 * - Citizen-friendly messages for JWT, CastError, and validation failures
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let errorCode = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "An unexpected server error occurred.";

  // Citizen-friendly JWT error formatting
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    errorCode = "UNAUTHORIZED";
    message = "Your session may have expired or is invalid. Please sign in again.";
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    errorCode = "INVALID_ID_FORMAT";
    message = `Invalid identifier format provided for ${err.path || "resource"}.`;
  }

  // Mongoose Schema Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(", ") || "Input validation failed.";
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = "DUPLICATE_RESOURCE";
    message = "A resource with this key already exists.";
  }

  // In production, sanitize 500 server errors to prevent any secret or path leakage
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "An unexpected server error occurred. Please try again later.";
  }

  // Secure server-side error logging
  console.error(`[Error] ${req.method} ${req.originalUrl} (${statusCode} ${errorCode}): ${err.message}`);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code: errorCode,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    code: "ROUTE_NOT_FOUND",
  });
};
