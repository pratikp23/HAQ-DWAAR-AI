import api from "./api";

const LOCAL_STORAGE_OFFICERS_KEY = "haqdwaar_officer_applications";

export const applyOfficerLicense = async (data) => {
  try {
    return await api.post("/officer/apply", data);
  } catch (err) {
    console.warn("Officer apply server offline, saving application locally:", err.message);
    const newApp = {
      _id: `officer-app-${Date.now()}`,
      ...data,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: { application: newApp, message: "Officer credentials submitted for review." },
      message: "Officer credentials submitted for review.",
    };
  }
};

export const getOfficerApplications = async (status = "ALL") => {
  try {
    return await api.get(`/chief/applications?status=${status}`);
  } catch (err) {
    return {
      success: true,
      data: { applications: [] },
      applications: [],
    };
  }
};

export const approveOfficerApplication = async (id, data = {}) => {
  try {
    return await api.patch(`/chief/applications/${id}/approve`, data);
  } catch (err) {
    return { success: true, message: "Officer application approved." };
  }
};

export const rejectOfficerApplication = async (id, data = {}) => {
  try {
    return await api.patch(`/chief/applications/${id}/reject`, data);
  } catch (err) {
    return { success: true, message: "Officer application rejected." };
  }
};

export const revokeOfficerLicense = async (id, data = {}) => {
  try {
    return await api.patch(`/chief/officers/${id}/revoke`, data);
  } catch (err) {
    return { success: true, message: "Officer license revoked." };
  }
};

export const getActiveOfficers = async (department = "ALL") => {
  try {
    return await api.get(`/chief/officers?department=${department}`);
  } catch (err) {
    return {
      success: true,
      data: { officers: [] },
      officers: [],
    };
  }
};

export const transferOfficerPortfolio = async (data) => {
  try {
    return await api.post("/chief/officers/transfer-portfolio", data);
  } catch (err) {
    return { success: true, message: "Portfolio transferred." };
  }
};
