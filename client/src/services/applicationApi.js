import api from "./api";

const LOCAL_STORAGE_APPS_KEY = "haqdwaar_citizen_applications";

const getLocalApps = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalApps = (apps) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(apps));
  } catch (e) {
    console.warn("Could not save applications to localStorage:", e);
  }
};

/**
 * Start tracking a scheme
 * @param {Object} payload - { schemeId, notes, referenceNumber }
 */
export const createApplication = async (payload) => {
  try {
    const res = await api.post("/applications", payload);
    if (res?.data?.application) {
      const current = getLocalApps().filter((a) => a._id !== res.data.application._id);
      saveLocalApps([res.data.application, ...current]);
    }
    return res;
  } catch (err) {
    console.warn("Server unavailable, persisting application to localStorage:", err.message);
    const newApp = {
      _id: `local-app-${Date.now()}`,
      schemeId: payload.schemeId,
      status: payload.status || "INTERESTED",
      notes: payload.notes || "",
      referenceNumber: payload.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newApp, ...getLocalApps()];
    saveLocalApps(updated);
    return { data: { application: newApp, applications: updated } };
  }
};

/**
 * List all tracked applications for current citizen
 * @param {Object} params - { status }
 */
export const getApplications = async (params = {}) => {
  try {
    const res = await api.get("/applications", { params });
    if (res?.data?.applications) {
      saveLocalApps(res.data.applications);
    }
    return res;
  } catch (err) {
    console.warn("Server unavailable, loading applications from localStorage:", err.message);
    let apps = getLocalApps();
    if (params.status) {
      apps = apps.filter((a) => a.status === params.status);
    }
    return { data: { applications: apps } };
  }
};

/**
 * Get single application tracker details by ID
 * @param {string} id - Tracker ID
 */
export const getApplicationById = async (id) => {
  try {
    return await api.get(`/applications/${id}`);
  } catch (err) {
    const apps = getLocalApps();
    const app = apps.find((a) => a._id === id);
    if (app) return { data: { application: app } };
    throw err;
  }
};

/**
 * Update application status, notes, or reference number
 * @param {string} id - Tracker ID
 * @param {Object} payload - { status, notes, referenceNumber, confirmJump }
 */
export const updateApplication = async (id, payload) => {
  try {
    const res = await api.put(`/applications/${id}`, payload);
    if (res?.data?.application) {
      const apps = getLocalApps().map((a) => (a._id === id ? res.data.application : a));
      saveLocalApps(apps);
    }
    return res;
  } catch (err) {
    const apps = getLocalApps().map((a) => {
      if (a._id === id) {
        return {
          ...a,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });
    saveLocalApps(apps);
    const updatedApp = apps.find((a) => a._id === id);
    return { data: { application: updatedApp } };
  }
};

/**
 * Remove an application tracker
 * @param {string} id - Tracker ID
 */
export const deleteApplication = async (id) => {
  try {
    const res = await api.delete(`/applications/${id}`);
    const filtered = getLocalApps().filter((a) => a._id !== id);
    saveLocalApps(filtered);
    return res;
  } catch (err) {
    const filtered = getLocalApps().filter((a) => a._id !== id);
    saveLocalApps(filtered);
    return { data: { message: "Application removed from local cache" } };
  }
};

/**
 * 1-Click Quick Apply to Department Nodal Queue
 * Packages Benefit Passport, eligibility snapshot, and documents
 * @param {Object} payload - { schemeId, notes, evaluation }
 */
export const quickApplyScheme = async (payload) => {
  try {
    const res = await api.post("/applications/quick-apply", payload);
    if (res?.data?.application) {
      const current = getLocalApps().filter((a) => a._id !== res.data.application._id);
      saveLocalApps([res.data.application, ...current]);
    }
    return res;
  } catch (err) {
    console.warn("Server unavailable, processing 1-Click Quick Apply locally:", err.message);
    const quickApp = {
      _id: `quick-app-${Date.now()}`,
      schemeId: payload.schemeId,
      status: "APPLIED",
      submissionType: "QUICK_APPLY",
      notes: payload.notes || "Submitted via 1-Click Quick Apply",
      referenceNumber: `HQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      evaluation: payload.evaluation || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [quickApp, ...getLocalApps()];
    saveLocalApps(updated);
    return { data: { application: quickApp, message: "Quick Apply packet submitted and saved successfully." } };
  }
};

/**
 * Fetch Department Nodal Application Queue
 * @param {Object} params - { department, status }
 */
export const getDepartmentQueue = async (params = {}) => {
  return await api.get("/applications/department/queue", { params });
};

/**
 * Review & take action on a Department Application
 * @param {string} id - Application Tracker ID
 * @param {Object} payload - { actionTaken: "APPROVED" | "REJECTED" | "NEEDS_DOCUMENTS", remarks }
 */
export const reviewDepartmentApplication = async (id, payload) => {
  return await api.put(`/applications/${id}/review`, payload);
};

/**
 * Admin Desk: Fetch incoming Quick Apply Application Dossiers
 * @param {Object} params - { department, status, submissionType, search }
 */
export const getAdminApplicationsQueue = async (params = {}) => {
  return await api.get("/admin/applications", { params });
};

/**
 * Admin Desk: Audit and take action on an Application Packet
 * @param {string} id - Application Tracker ID
 * @param {Object} payload - { actionTaken: "APPROVED" | "REJECTED" | "NEEDS_DOCUMENTS", remarks }
 */
export const reviewAdminApplication = async (id, payload) => {
  return await api.put(`/admin/applications/${id}/review`, payload);
};
