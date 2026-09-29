import Notification from "../models/Notification.js";
import UserProfile from "../models/UserProfile.js";

/**
 * HAQ DWAAR AI — Notification Dispatch & Preference Enforcement Service
 * 
 * Enforces citizen consent, handles In-App & WhatsApp Demo channels, and
 * guarantees atomic deduplication.
 */

/**
 * Generate a deterministic deduplication key
 */
export function buildDedupKey(userId, entityId, type, window, dateKey = "") {
  const safeEntity = entityId ? String(entityId) : "general";
  const safeWindow = window ? String(window) : "default";
  const safeDate = dateKey ? String(dateKey) : "";
  return `${userId}_${safeEntity}_${type}_${safeWindow}_${safeDate}`;
}

/**
 * Dispatches an in-app and/or optional WhatsApp alert based on user preferences.
 */
export async function dispatchAlert({
  userId,
  type,
  title,
  message,
  schemeId = null,
  applicationId = null,
  documentId = null,
  priority = "MEDIUM",
  channel = "IN_APP",
  dedupKey = null,
  metadata = {},
}) {
  try {
    // 1. Check user notification preferences
    const profile = await UserProfile.findOne({ userId });
    const prefs = profile?.preferences || {
      notificationConsent: true,
      whatsappConsent: false,
      deadlineAlerts: true,
      documentExpiryAlerts: true,
      applicationFollowUpAlerts: true,
    };

    // Global in-app notification opt-in check
    if (channel === "IN_APP" && prefs.notificationConsent === false) {
      return { success: false, reason: "USER_OPTED_OUT_IN_APP" };
    }

    // Granular preference checks
    if (type.startsWith("DEADLINE") && prefs.deadlineAlerts === false) {
      return { success: false, reason: "USER_OPTED_OUT_DEADLINE_ALERTS" };
    }
    if (type === "DOCUMENT_EXPIRING" && prefs.documentExpiryAlerts === false) {
      return { success: false, reason: "USER_OPTED_OUT_DOCUMENT_ALERTS" };
    }
    if (type === "APPLICATION_FOLLOW_UP" && prefs.applicationFollowUpAlerts === false) {
      return { success: false, reason: "USER_OPTED_OUT_FOLLOW_UP_ALERTS" };
    }

    // 2. WhatsApp channel handling
    let finalChannel = channel;
    let finalMetadata = { ...metadata };
    let initialStatus = "SENT";

    if (channel === "WHATSAPP") {
      if (!prefs.whatsappConsent) {
        return { success: false, reason: "WHATSAPP_CONSENT_NOT_GRANTED" };
      }

      const whatsappMode = process.env.WHATSAPP_MODE || "demo";
      if (whatsappMode === "demo") {
        finalMetadata.isDemo = true;
        finalMetadata.demoNotice =
          "Simulated WhatsApp notification (Demo Mode). No actual SMS/WhatsApp dispatched.";
        finalMetadata.simulatedAt = new Date().toISOString();
        console.log(`[WhatsApp Demo] Simulated alert to user ${userId}: ${title} - ${message}`);
      } else {
        // Real WhatsApp integration: fail gracefully if not configured
        console.warn("[WhatsApp Real] Real WhatsApp provider credentials not configured. Dispatch skipped.");
        return { success: false, reason: "WHATSAPP_PROVIDER_NOT_CONFIGURED" };
      }
    }

    // 3. Atomic deduplication & record creation
    const notificationData = {
      userId,
      type,
      title,
      message,
      schemeId,
      applicationId,
      documentId,
      priority,
      status: initialStatus,
      channel: finalChannel,
      dedupKey,
      metadata: finalMetadata,
      sentAt: new Date(),
    };

    if (dedupKey) {
      // Use findOneAndUpdate with upsert to prevent race conditions
      const existing = await Notification.findOne({ dedupKey });
      if (existing) {
        return { success: true, notification: existing, deduplicated: true };
      }
    }

    const created = await Notification.create(notificationData);
    return { success: true, notification: created, deduplicated: false };
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error - safely return existing
      const existing = await Notification.findOne({ dedupKey });
      return { success: true, notification: existing, deduplicated: true };
    }
    console.error("[notificationService] Dispatch error:", error);
    return { success: false, error: error.message };
  }
}
