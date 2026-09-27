import api from "./api";

/**
 * Evaluate citizen's Benefit Passport against a specific verified scheme
 * @param {string} schemeId - MongoDB ObjectId of the scheme
 */
export const evaluateScheme = async (schemeId) => {
  return await api.post("/matching/evaluate", { schemeId });
};

/**
 * Get personalized recommendations for authenticated citizen
 * @param {Object} params - Query parameters (e.g., category)
 */
export const getRecommendations = async (params = {}) => {
  return await api.get("/matching/recommendations", { params });
};
