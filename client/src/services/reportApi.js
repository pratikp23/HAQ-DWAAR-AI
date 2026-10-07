import api from "./api";

export const reportScheme = async (schemeId, data) => {
  return await api.post(`/schemes/${schemeId}/report`, data);
};

export const getSchemeReports = async (status = "ALL") => {
  return await api.get(`/admin/reports?status=${status}`);
};

export const resolveSchemeReport = async (reportId, data) => {
  return await api.patch(`/admin/reports/${reportId}/resolve`, data);
};
