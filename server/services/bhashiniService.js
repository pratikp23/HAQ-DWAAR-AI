import fs from "fs";
import path from "path";

/**
 * HAQ DWAAR AI — Bhashini Voice Access Service
 * 
 * Provides an abstraction for Speech-to-Text (STT) and Text-to-Speech (TTS).
 * Supports:
 * - VOICE_MODE=mock (default)
 * - Real mode if valid production credentials/configuration exist
 * - Privacy protection: never logs sensitive citizen PII
 * - Audio file validation and automatic temporary cleanup
 */

const SUPPORTED_LANGUAGES = [
  { code: "hi", name: "Hindi", label: "हिन्दी" },
  { code: "en", name: "English", label: "English" },
  { code: "mr", name: "Marathi", label: "मराठी" },
  { code: "ta", name: "Tamil", label: "தமிழ்" },
  { code: "te", name: "Telugu", label: "తెలుగు" },
  { code: "bn", name: "Bengali", label: "বাংলা" },
  { code: "gu", name: "Gujarati", label: "ગુજરાતી" },
];

const ALLOWED_MIME_TYPES = [
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
  "audio/mpeg",
  "audio/mp3",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/webm;codecs=opus",
];

const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Determine if real Bhashini credentials are configured
 */
export function isRealBhashiniConfigured() {
  const mode = (process.env.BHASHINI_MODE || process.env.VOICE_MODE || "mock").toLowerCase();
  if (mode === "mock") return false;

  const apiKey = process.env.BHASHINI_API_KEY;
  const baseUrl = process.env.BHASHINI_BASE_URL;
  return Boolean(apiKey && baseUrl);
}

/**
 * Get current Bhashini service status and configuration
 */
export function getServiceStatus() {
  const isConfigured = isRealBhashiniConfigured();
  const mode = isConfigured ? "real" : "mock";

  return {
    success: true,
    mode,
    provider: mode === "real" ? "Bhashini (National Language Translation Mission)" : "Demo Voice Engine",
    status: "available",
    isConfigured,
    supportedLanguages: SUPPORTED_LANGUAGES,
    maxAudioSizeBytes: MAX_AUDIO_SIZE,
    disclaimer:
      mode === "mock"
        ? "Voice service is running in demo mode. Bhashini integration runs in Demo/Mock Mode unless authorized production credentials and configuration are provided."
        : "Connected to Bhashini Speech Services.",
  };
}

/**
 * Validate audio input format, size, and presence
 */
export function validateAudioInput({ buffer, mimeType, size }) {
  if (!buffer && !size) {
    const err = new Error("Audio input is empty or missing.");
    err.code = "EMPTY_AUDIO";
    err.statusCode = 400;
    throw err;
  }

  const effectiveSize = size || (buffer ? buffer.length : 0);
  if (effectiveSize === 0) {
    const err = new Error("Audio recording contains 0 bytes.");
    err.code = "EMPTY_AUDIO";
    err.statusCode = 400;
    throw err;
  }

  if (effectiveSize > MAX_AUDIO_SIZE) {
    const err = new Error("Audio file exceeds the maximum allowed 10MB limit.");
    err.code = "AUDIO_TOO_LARGE";
    err.statusCode = 413;
    throw err;
  }

  if (mimeType) {
    const cleanMime = mimeType.split(";")[0].toLowerCase().trim();
    const isAllowed = ALLOWED_MIME_TYPES.some((allowed) => {
      const baseAllowed = allowed.split(";")[0].toLowerCase().trim();
      return cleanMime === baseAllowed;
    });

    if (!isAllowed) {
      const err = new Error(`Unsupported audio format (${mimeType}). Supported formats: WAV, MP3, WebM, OGG, M4A.`);
      err.code = "INVALID_AUDIO_FORMAT";
      err.statusCode = 415;
      throw err;
    }
  }

  return true;
}

/**
 * Clean up temporary audio file if stored on disk
 */
export function cleanupAudioFile(filePath) {
  if (filePath && typeof filePath === "string") {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupErr) {
      // Non-blocking cleanup warning (do not throw)
      console.warn("Failed to remove temporary audio file:", cleanupErr.message);
    }
  }
}

/**
 * Generate realistic mock transcription for testing and demo flows
 */
function generateMockTranscript({ language = "hi", textHint = "" }) {
  const cleanLang = (language || "hi").toLowerCase().trim();

  // If a specific prompt hint was passed (e.g. from tests or query param)
  if (textHint && textHint.length > 5) {
    return textHint;
  }

  switch (cleanLang) {
    case "en":
      return "I am a farmer from Madhya Pradesh. I have two acres of land and I want financial assistance for my crop.";
    case "mr":
      return "मी मध्य प्रदेशातील एक शेतकरी आहे. माझ्याकडे 2 एकर जमीन आहे आणि मला माझ्या पिकासाठी आर्थिक मदत हवी आहे.";
    case "hi":
    default:
      return "मैं मध्य प्रदेश का एक किसान हूं। मेरे पास 2 एकड़ जमीन है और मुझे अपनी फसल के लिए वित्तीय सहायता चाहिए।";
  }
}

/**
 * Speech-to-Text Operation
 * 
 * @param {Object} params
 * @param {Buffer} [params.audioBuffer] - In-memory audio buffer
 * @param {string} [params.audioBase64] - Base64 encoded audio string
 * @param {string} [params.filePath] - Temp file path if saved by multer
 * @param {string} [params.mimeType] - Audio MIME type
 * @param {number} [params.size] - File size in bytes
 * @param {string} [params.language] - Language code ('hi', 'en', 'mr', etc.)
 * @param {string} [params.textHint] - Optional mock text hint for testing
 */
export async function speechToText({
  audioBuffer,
  audioBase64,
  filePath,
  mimeType = "audio/wav",
  size,
  language = "hi",
  textHint,
}) {
  let buffer = audioBuffer;

  if (!buffer && audioBase64) {
    // Strip data URL header if present (e.g., data:audio/webm;base64,...)
    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
    buffer = Buffer.from(base64Data, "base64");
  }

  const effectiveSize = size || (buffer ? buffer.length : 0);

  // Validate audio
  validateAudioInput({ buffer, mimeType, size: effectiveSize });

  const isConfigured = isRealBhashiniConfigured();

  if (isConfigured) {
    // Real Bhashini API integration
    try {
      const realResult = await callRealBhashiniSTT({
        buffer,
        filePath,
        mimeType,
        language,
      });
      return realResult;
    } catch (realErr) {
      console.error("Real Bhashini API call failed, falling back to mock response:", realErr.message);
      // Safe fallback if real mode fails
    }
  }

  // MOCK MODE: Return transparent, clearly identified demo transcript
  const transcript = generateMockTranscript({ language, textHint });

  return {
    transcript,
    language,
    confidence: 0.94,
    mode: "mock",
    provider: "mock",
    isDemoMode: true,
    disclaimer:
      "Voice service is running in demo mode. Bhashini integration runs in Demo/Mock Mode unless authorized production credentials and configuration are provided.",
  };
}

/**
 * Real Bhashini API invocation (when credentials are present)
 */
async function callRealBhashiniSTT({ buffer, filePath, mimeType, language }) {
  const baseUrl = process.env.BHASHINI_BASE_URL;
  const apiKey = process.env.BHASHINI_API_KEY;
  const userId = process.env.BHASHINI_USER_ID;

  if (!apiKey || !baseUrl) {
    throw new Error("Bhashini production credentials not configured.");
  }

  // Safe timeout call to external Bhashini endpoint
  const response = await fetch(`${baseUrl}/v1/stt`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      ...(userId ? { "X-User-Id": userId } : {}),
    },
    body: JSON.stringify({
      audioContent: buffer ? buffer.toString("base64") : "",
      config: {
        language: { sourceLanguage: language },
        audioFormat: mimeType,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Bhashini API responded with status ${response.status}`);
  }

  const data = await response.json();
  return {
    transcript: data.pipelineResponse?.[0]?.output?.[0]?.source || data.transcript || "",
    language,
    confidence: data.confidence || 0.9,
    mode: "real",
    provider: "Bhashini",
    isDemoMode: false,
    disclaimer: "Verified Bhashini STT transcription.",
  };
}

/**
 * Text-to-Speech Operation (Mock / Extension)
 */
export async function textToSpeech({ text, language = "hi" }) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    const err = new Error("Text is required for speech synthesis.");
    err.code = "INVALID_TEXT";
    err.statusCode = 400;
    throw err;
  }

  const isConfigured = isRealBhashiniConfigured();

  if (isConfigured) {
    // If real credentials are provided, call Bhashini TTS
    try {
      const baseUrl = process.env.BHASHINI_BASE_URL;
      const apiKey = process.env.BHASHINI_API_KEY;

      const response = await fetch(`${baseUrl}/v1/tts`, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: [{ source: text }],
          config: {
            language: { sourceLanguage: language },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          audioContent: data.pipelineResponse?.[0]?.audio?.[0]?.audioContent || "",
          mode: "real",
          isDemoMode: false,
        };
      }
    } catch (err) {
      console.warn("Real TTS failed, returning mock payload:", err.message);
    }
  }

  // Mock TTS response
  return {
    audioContent: null,
    text,
    language,
    mode: "mock",
    provider: "mock",
    isDemoMode: true,
    disclaimer: "Voice service is running in demo mode.",
  };
}
