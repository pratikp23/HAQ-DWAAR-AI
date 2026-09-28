import api from "./api";

/**
 * Get deterministic application readiness & personal action plan for a verified scheme
 * @param {string} schemeId - Scheme ID or slug
 */
export const getSchemeReadiness = async (schemeId) => {
  return await api.get(`/readiness/${schemeId}`);
};
