import api from "./api";

/**
 * Send natural language text to be analyzed by Gemini NLU (or fallback)
 * @param {string} text - Citizen's natural language situation
 */
export const analyzeLifeSituation = async (text) => {
  return await api.post("/life-situation/analyze", { text });
};

/**
 * Preview matching schemes deterministically using extracted signals without persisting
 * @param {Object} extractedSignals - Signals extracted from citizen text
 */
export const previewMatches = async (extractedSignals) => {
  return await api.post("/life-situation/preview-matches", { extractedSignals });
};

/**
 * Explicitly confirm and apply proposed signals to citizen's persistent Benefit Passport
 * @param {Object} proposedSignals - User-confirmed profile fields
 */
export const applySignalsToPassport = async (proposedSignals) => {
  return await api.post("/life-situation/apply-signals", { proposedSignals });
};
