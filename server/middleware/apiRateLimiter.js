/**
 * HAQ DWAAR AI — General & Authentication Rate Limiting Middleware
 * Memory-safe sliding-window rate limiting to protect against brute force and DDoS.
 */

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, maxRequests = 100, message = "Too many requests. Please try again later." }) => {
  const store = new Map();

  // Periodic cleanup of expired windows
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now - record.startTime > windowMs) {
        store.delete(key);
      }
    }
  }, Math.min(windowMs, 5 * 60 * 1000));

  return (req, res, next) => {
    if (process.env.NODE_ENV === "test" && req.headers["x-test-bypass-rate-limit"]) {
      return next();
    }

    const clientKey = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "anonymous";
    const now = Date.now();

    let record = store.get(clientKey);

    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      store.set(clientKey, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const resetSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetSeconds);

    if (record.count > maxRequests) {
      res.setHeader("Retry-After", resetSeconds);
      return res.status(429).json({
        success: false,
        message,
        code: "RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: resetSeconds,
      });
    }

    return next();
  };
};

// Strict auth rate limiter: 20 attempts per 15 minutes
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many login/registration attempts from this connection. Please wait 15 minutes before trying again.",
});

// General public API rate limiter: 300 requests per 15 minutes
export const generalApiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 300,
  message: "API rate limit reached. Please slow down your requests.",
});
