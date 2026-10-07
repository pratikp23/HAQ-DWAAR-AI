import api from "./api";

export const applyOfficerLicense = async (data) => {
  return await api.post("/officer/apply", data);
};

export const getOfficerApplications = async (status = "ALL") => {
  return await api.get(`/chief/applications?status=${status}`);
};

export const approveOfficerApplication = async (id, data = {}) => {
  return await api.patch(`/chief/applications/${id}/approve`, data);
};

export const rejectOfficerApplication = async (id, data = {}) => {
  return await api.patch(`/chief/applications/${id}/reject`, data);
};

export const revokeOfficerLicense = async (id, data = {}) => {
  return await api.patch(`/chief/officers/${id}/revoke`, data);
};

export const getActiveOfficers = async (department = "ALL") => {
  return await api.get(`/chief/officers?department=${department}`);
};

export const transferOfficerPortfolio = async (data) => {
  return await api.post("/chief/officers/transfer-portfolio", data);
};
