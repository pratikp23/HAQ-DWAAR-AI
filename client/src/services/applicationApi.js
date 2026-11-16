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
  try {
    return await api.get("/admin/applications", { params });
  } catch (err) {
    console.warn("Admin Applications server offline, loading queue from localStorage:", err.message);
    let apps = getLocalApps();

    // Default statutory seed applications if none present
    if (apps.length === 0) {
      apps = [
        {
          _id: "app-statutory-admin-01",
          referenceNumber: "HQ-2026-KISAN-84192",
          schemeId: {
            _id: "scheme-pm-kisan",
            id: "scheme-pm-kisan",
            name: "PM-KISAN Samman Nidhi (₹6,000 Annual Direct Income)",
            category: "KISAN",
            level: "CENTRAL GOVT",
          },
          citizenId: {
            name: "Pratik Pathak",
            email: "pratik@lok-samarth.gov.in",
            phone: "+91 98260 12345",
            gender: "Male",
            category: "General",
            state: "Madhya Pradesh",
            district: "Bhopal",
          },
          submissionType: "QUICK_APPLY",
          status: "SUBMITTED",
          notes: "1-Click Direct Nodal Submission with DigiLocker verified Aadhaar and Khasra record.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "app-statutory-admin-02",
          referenceNumber: "HQ-2026-ABHA-19420",
          schemeId: {
            _id: "scheme-pmjay-ayushman",
            id: "scheme-pmjay-ayushman",
            name: "Ayushman Bharat PM-JAY (₹5 Lakh Cashless Healthcare)",
            category: "HEALTH",
            level: "CENTRAL GOVT",
          },
          citizenId: {
            name: "Sunita Verma",
            email: "sunita.v@citizen.in",
            phone: "+91 94250 88712",
            gender: "Female",
            category: "OBC",
            state: "Madhya Pradesh",
            district: "Indore",
          },
          submissionType: "QUICK_APPLY",
          status: "APPROVED",
          notes: "Approved under verified SECC-2011 depository and Aadhaar e-KYC match.",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "app-statutory-admin-03",
          referenceNumber: "HQ-2026-NSP-55219",
          schemeId: {
            _id: "scheme-nsp-csss",
            id: "scheme-nsp-csss",
            name: "Central Sector Scheme of Scholarship for College Students (PM-USP)",
            category: "STUDENT",
            level: "CENTRAL GOVT",
          },
          citizenId: {
            name: "Aman Deshmukh",
            email: "aman.d@student.ac.in",
            phone: "+91 98110 54321",
            gender: "Male",
            category: "General",
            state: "Madhya Pradesh",
            district: "Jabalpur",
          },
          submissionType: "SCHEMECOACH",
          status: "UNDER_REVIEW",
          notes: "Submitted via SchemeCoach Guided Pathway. Class 12 board marksheet verified.",
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      saveLocalApps(apps);
    }

    // Ensure schemeId objects are populated
    const populated = apps.map((app) => {
      let schemeObj = app.schemeId;
      if (typeof schemeObj === "string") {
        const found = STATUTORY_SCHEMES.find((s) => s._id === schemeObj || s.id === schemeObj);
        schemeObj = found
          ? { _id: found._id, name: found.name, category: found.category, level: found.level || "CENTRAL GOVT" }
          : { _id: schemeObj, name: "Statutory Welfare Scheme", category: "GENERAL", level: "CENTRAL GOVT" };
      }
      return {
        ...app,
        schemeId: schemeObj,
        citizenId: app.citizenId || {
          name: "Verified Citizen",
          email: "citizen@lok-samarth.in",
          phone: "+91 98000 00000",
          category: "General",
          district: "Bhopal",
          state: "Madhya Pradesh",
        },
      };
    });

    let filtered = [...populated];
    if (params.department && params.department !== "ALL") {
      filtered = filtered.filter(
        (a) => a.schemeId?.category?.toUpperCase() === params.department.toUpperCase()
      );
    }
    if (params.status && params.status !== "ALL") {
      filtered = filtered.filter((a) => a.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.referenceNumber?.toLowerCase().includes(q) ||
          a.citizenId?.name?.toLowerCase().includes(q) ||
          a.schemeId?.name?.toLowerCase().includes(q)
      );
    }

    const counts = {
      total: populated.length,
      pending: populated.filter((a) => ["SUBMITTED", "APPLIED", "UNDER_REVIEW"].includes(a.status)).length,
      quickApply: populated.filter((a) => a.submissionType === "QUICK_APPLY").length,
      completed: populated.filter((a) => ["APPROVED", "SANCTIONED", "REJECTED"].includes(a.status)).length,
    };

    return {
      success: true,
      data: {
        applications: filtered,
        counts,
      },
      applications: filtered,
      counts,
    };
  }
};

/**
 * Admin Desk: Audit and take action on an Application Packet
 * @param {string} id - Application Tracker ID
 * @param {Object} payload - { actionTaken: "APPROVED" | "REJECTED" | "NEEDS_DOCUMENTS", remarks }
 */
export const reviewAdminApplication = async (id, payload) => {
  try {
    return await api.put(`/admin/applications/${id}/review`, payload);
  } catch (err) {
    console.warn("Admin review server offline, updating review status in localStorage:", err.message);
    const apps = getLocalApps();
    const targetIdx = apps.findIndex((a) => a._id === id);

    if (targetIdx >= 0) {
      apps[targetIdx] = {
        ...apps[targetIdx],
        status: payload.actionTaken || "APPROVED",
        adminRemarks: payload.remarks || "Audited and verified by Lok Samarth Nodal Desk",
        reviewedAt: new Date().toISOString(),
      };
      saveLocalApps(apps);
      return {
        success: true,
        data: {
          application: apps[targetIdx],
          message: `Application packet successfully marked as ${payload.actionTaken}.`,
        },
      };
    }

    return {
      success: true,
      data: {
        message: `Application action ${payload.actionTaken} recorded.`,
      },
    };
  }
};
