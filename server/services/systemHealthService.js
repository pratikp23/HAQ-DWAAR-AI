import mongoose from "mongoose";
import { isRealBhashiniConfigured } from "./bhashiniService.js";

/**
 * HAQ DWAAR AI — System Health Service
 * 
 * Inspects active infrastructure and integration configurations.
 * PRIVACY GUARANTEE: Never exposes API keys, secrets, tokens, or DB passwords.
 */

export async function getSystemHealth() {
  // 1. API Health
  const apiHealth = {
    status: "HEALTHY",
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  };

  // 2. Database Health
  const dbStateMap = {
    0: "DISCONNECTED",
    1: "CONNECTED",
    2: "CONNECTING",
    3: "DISCONNECTING",
  };
  const dbStateCode = mongoose.connection.readyState;
  const dbHealth = {
    status: dbStateCode === 1 ? "CONNECTED" : "DEGRADED",
    connectionState: dbStateMap[dbStateCode] || "UNKNOWN",
    databaseName: mongoose.connection.name || "haqdwaar-ai",
  };

  // 3. AI / Gemini NLU Configuration Status
  const geminiKey = process.env.GEMINI_API_KEY;
  const isAiConfigured = Boolean(
    geminiKey &&
    geminiKey.trim() !== "" &&
    geminiKey !== "your-gemini-api-key-here"
  );
  const aiHealth = {
    status: isAiConfigured ? "CONFIGURED" : "FALLBACK_ACTIVE",
    provider: "Gemini 1.5 Flash (with Deterministic Regex Fallback)",
    isConfigured: isAiConfigured,
  };

  // 4. Voice / Bhashini Status
  const isBhashiniReal = isRealBhashiniConfigured();
  const voiceHealth = {
    status: isBhashiniReal ? "CONFIGURED" : "DEMO",
    provider: isBhashiniReal ? "Bhashini Production" : "Demo Speech Engine",
    mode: isBhashiniReal ? "real" : "mock",
    isConfigured: isBhashiniReal,
  };

  // 5. DigiLocker Status
  const isDigiLockerProd = (process.env.DIGILOCKER_MODE || "demo").toLowerCase() === "production";
  const digilockerHealth = {
    status: isDigiLockerProd ? "CONFIGURED" : "DEMO",
    mode: isDigiLockerProd ? "production" : "demo",
    isConfigured: isDigiLockerProd,
  };

  // 6. Notifications & WhatsApp Status
  const isWhatsAppConfigured = Boolean(
    process.env.WHATSAPP_API_KEY &&
    process.env.WHATSAPP_API_KEY.trim() !== ""
  );
  const notificationHealth = {
    status: "ACTIVE",
    inAppChannel: "ACTIVE",
    whatsappChannel: isWhatsAppConfigured ? "CONFIGURED" : "DEMO",
    proactiveDeadlineScheduler: "RUNNING",
  };

  return {
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      api: apiHealth,
      database: dbHealth,
      ai: aiHealth,
      voice: voiceHealth,
      digilocker: digilockerHealth,
      notifications: notificationHealth,
    },
  };
}
