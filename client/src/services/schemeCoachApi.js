import api from "./api";

/**
 * Fetch full 6-stage SchemeCoach roadmap, pre-filled form fields, checklist, and audio prompts
 * @param {string} schemeId - Scheme MongoDB ID
 */
export const getCoachRoadmap = async (schemeId) => {
  return await api.get(`/coach/${schemeId}`);
};

/**
 * Save citizen-reported government reference number to Application Tracker
 * @param {string} schemeId - Scheme MongoDB ID
 * @param {Object} payload - { referenceNumber, notes }
 */
export const saveOfficialReference = async (schemeId, payload) => {
  return await api.post(`/coach/${schemeId}/save-reference`, payload);
};

/**
 * Helper to build the printable pre-filled application form URL
 * @param {string} schemeId - Scheme MongoDB ID
 */
export const getPrintableFormUrl = (schemeId) => {
  const baseUrl = import.meta.env.VITE_API_URL || "/api";
  const token = typeof window !== "undefined" ? localStorage.getItem("haqdwaar_token") : "";
  const cleanBase = baseUrl.replace(/\/$/, "");
  const fullBase = cleanBase.startsWith("http")
    ? cleanBase
    : typeof window !== "undefined"
    ? `${window.location.origin}${cleanBase}`
    : cleanBase;
  const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${fullBase}/coach/${schemeId}/print-form${tokenParam}`;
};
