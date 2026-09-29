/**
 * HAQ DWAAR AI — Voice Endpoint Rate Limiter
 * 
 * Provides rate limiting for voice audio processing endpoints:
 * - Prevents denial-of-service and voice buffer abuse
 * - Sliding window calculation
 * - Sets standard X-RateLimit headers
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 30; // Max 30 voice requests per 15 minutes

const requestCounts = new Map();

// Periodic cleanup of stale IP windows every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.startTime > WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const voiceRateLimiter = (req, res, next) => {
  // Allow test suites to bypass rate limiting if configured
  if (process.env.NODE_ENV === "test" && req.headers["x-test-bypass-rate-limit"]) {
    return next();
  }

  const clientKey = req.user?.id || req.ip || req.connection?.remoteAddress || "anonymous";
  const now = Date.now();

  let record = requestCounts.get(clientKey);

  if (!record || now - record.startTime > WINDOW_MS) {
    record = {
      count: 1,
      startTime: now,
    };
    requestCounts.set(clientKey, record);
  } else {
    record.count += 1;
  }

  const remaining = Math.max(0, MAX_REQUESTS - record.count);
  const resetTime = Math.ceil((record.startTime + WINDOW_MS - now) / 1000);

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", resetTime);

  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Too many voice processing requests. Please wait a few minutes or write your situation instead.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfterSeconds: resetTime,
    });
  }

  next();
};

export function resetVoiceRateLimits() {
  requestCounts.clear();
}
