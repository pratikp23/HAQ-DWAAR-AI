import api from "./api";

/**
 * HAQ DWAAR AI — Admin Analytics API Client
 * 
 * Secure requests for authorized administrators only (requireRole("admin")).
 */

export const getOverview = async (range = "all") => {
  return await api.get(`/admin/analytics/overview?range=${range}`);
};

export const getSchemes = async () => {
  return await api.get("/admin/analytics/schemes");
};

export const getApplications = async (range = "all") => {
  return await api.get(`/admin/analytics/applications?range=${range}`);
};

export const getMatching = async (range = "all") => {
  return await api.get(`/admin/analytics/matching?range=${range}`);
};

export const getReadiness = async (range = "all") => {
  return await api.get(`/admin/analytics/readiness?range=${range}`);
};

export const getDocuments = async (range = "all") => {
  return await api.get(`/admin/analytics/documents?range=${range}`);
};

export const getNotifications = async (range = "all") => {
  return await api.get(`/admin/analytics/notifications?range=${range}`);
};

export const getVoice = async (range = "all") => {
  return await api.get(`/admin/analytics/voice?range=${range}`);
};

export const getAttention = async () => {
  return await api.get("/admin/analytics/attention");
};

export const getSystemHealth = async () => {
  return await api.get("/admin/analytics/system");
};

export const getActivity = async (limit = 10) => {
  return await api.get(`/admin/analytics/activity?limit=${limit}`);
};

export default {
  getOverview,
  getSchemes,
  getApplications,
  getMatching,
  getReadiness,
  getDocuments,
  getNotifications,
  getVoice,
  getAttention,
  getSystemHealth,
  getActivity,
};
