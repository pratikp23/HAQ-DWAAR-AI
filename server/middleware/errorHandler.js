/**
 * Centralized API Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  console.error("[Error] " + req.method + " " + req.originalUrl + ": " + err.message);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
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
    message: "Endpoint " + req.method + " " + req.originalUrl + " not found.",
    code: "ROUTE_NOT_FOUND",
  });
};
