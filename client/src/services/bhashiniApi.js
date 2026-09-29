import api from "./api";

/**
 * Get Bhashini service configuration & status
 */
export const getBhashiniStatus = async () => {
  return await api.get("/bhashini/status");
};

/**
 * Send speech audio (Blob or Base64) to Bhashini STT endpoint
 * 
 * @param {Object} options
 * @param {Blob} [options.audioBlob]
 * @param {string} [options.audioBase64]
 * @param {string} [options.language]
 * @param {string} [options.textHint]
 */
export const speechToText = async ({ audioBlob, audioBase64, language = "hi", textHint }) => {
  if (audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("language", language);
    if (textHint) formData.append("textHint", textHint);

    return await api.post("/bhashini/speech-to-text", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 25000,
    });
  }

  return await api.post(
    "/bhashini/speech-to-text",
    {
      audioBase64,
      language,
      textHint,
    },
    { timeout: 25000 }
  );
};

/**
 * Convert text into speech (mock / real)
 */
export const textToSpeech = async ({ text, language = "hi" }) => {
  return await api.post("/bhashini/text-to-speech", { text, language });
};
