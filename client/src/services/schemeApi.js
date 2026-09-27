import api from "./api";

/**
 * Fetch schemes with optional filters (category, state, search, status)
 */
export const getSchemes = async (params = {}) => {
  return await api.get("/schemes", { params });
};

/**
 * Fetch detailed scheme by ID
 */
export const getSchemeById = async (id) => {
  return await api.get(`/schemes/${id}`);
};

/**
 * Admin: Create a new draft scheme
 */
export const createScheme = async (schemeData) => {
  return await api.post("/schemes", schemeData);
};

/**
 * Admin: Update an existing scheme
 */
export const updateScheme = async (id, schemeData) => {
  return await api.put(`/schemes/${id}`, schemeData);
};

/**
 * Admin: Archive a scheme (soft delete)
 */
export const archiveScheme = async (id) => {
  return await api.delete(`/schemes/${id}`);
};

/**
 * Admin: Verify and publish scheme to citizen catalog
 */
export const verifyScheme = async (id) => {
  return await api.put(`/admin/schemes/${id}/verify`);
};
