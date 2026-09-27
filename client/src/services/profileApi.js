import api from "./api";

/**
 * Fetch current authenticated citizen Benefit Passport
 */
export const getProfile = async () => {
  return await api.get("/profile");
};

/**
 * Update citizen Benefit Passport profile
 * @param {Object} profileData
 */
export const updateProfile = async (profileData) => {
  return await api.put("/profile", profileData);
};
