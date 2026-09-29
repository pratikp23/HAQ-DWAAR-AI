import AnalyticsEvent from "../models/AnalyticsEvent.js";

/**
 * HAQ DWAAR AI — Analytics Event Service
 * 
 * Best-effort operational event logger:
 * - Asynchronous, non-blocking execution
 * - Sanitizes metadata to ensure zero PII leakage
 */

const BLOCKED_METADATA_KEYS = [
  "aadhaar",
  "pan",
  "bank",
  "account",
  "transcript",
  "password",
  "token",
  "audio",
  "secret",
];

export function sanitizeMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== "object") return {};
  const clean = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = BLOCKED_METADATA_KEYS.some((b) => lowerKey.includes(b));
    if (!isSensitive) {
      if (typeof value === "object" && value !== null) {
        clean[key] = sanitizeMetadata(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

export async function recordEvent({
  eventType,
  userId = null,
  schemeId = null,
  category = null,
  status = null,
  metadata = {},
}) {
  try {
    const cleanMeta = sanitizeMetadata(metadata);
    await AnalyticsEvent.create({
      eventType,
      userId,
      schemeId,
      category,
      status,
      metadata: cleanMeta,
    });
  } catch (err) {
    // Best effort: never break core citizen flow on analytics failure
    if (process.env.NODE_ENV !== "test") {
      console.warn("[AnalyticsEvent] Failed to record event:", err.message);
    }
  }
}
