import api from "./api";

/**
 * HAQ DWAAR AI — MITTRA Frontend API Service
 * 
 * Communicates with backend MITTRA Agent (`/api/mittra`)
 */

/**
 * Send a citizen voice/text message to the MITTRA Agent
 * @param {Object} payload - { query, language, currentRoute, conversationHistory }
 */
export const sendMittraMessage = async (payload) => {
  return await api.post("/mittra/chat", payload);
};

/**
 * Fetch fresh citizen context snapshot for MITTRA
 */
export const getMittraContext = async () => {
  return await api.get("/mittra/context");
};
