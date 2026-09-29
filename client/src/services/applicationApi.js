import api from "./api";

/**
 * Start tracking a scheme
 * @param {Object} payload - { schemeId, notes, referenceNumber }
 */
export const createApplication = async (payload) => {
  return await api.post("/applications", payload);
};

/**
 * List all tracked applications for current citizen
 * @param {Object} params - { status }
 */
export const getApplications = async (params = {}) => {
  return await api.get("/applications", { params });
};

/**
 * Get single application tracker details by ID
 * @param {string} id - Tracker ID
 */
export const getApplicationById = async (id) => {
  return await api.get(`/applications/${id}`);
};

/**
 * Update application status, notes, or reference number
 * @param {string} id - Tracker ID
 * @param {Object} payload - { status, notes, referenceNumber, confirmJump }
 */
export const updateApplication = async (id, payload) => {
  return await api.put(`/applications/${id}`, payload);
};

/**
 * Remove an application tracker
 * @param {string} id - Tracker ID
 */
export const deleteApplication = async (id) => {
  return await api.delete(`/applications/${id}`);
};
