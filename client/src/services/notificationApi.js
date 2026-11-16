import api from "./api";

/**
 * Upload a government notification PDF for admin review
 * @param {FormData} formData - Contains "file"
 */
export const uploadNotification = async (formData) => {
  return await api.post("/admin/notifications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * List all uploaded notifications with optional filters
 * @param {Object} params - { status, search, page, limit }
 */
export const getNotifications = async (params = {}) => {
  return await api.get("/admin/notifications", { params });
};

/**
 * Get single notification detail by record ID
 * @param {string} id - Notification ID
 */
export const getNotificationById = async (id) => {
  return await api.get(`/admin/notifications/${id}`);
};

/**
 * Trigger re-analysis on an existing notification record
 * @param {string} id - Notification ID
 */
export const analyzeNotification = async (id) => {
  return await api.post(`/admin/notifications/${id}/analyze`);
};

/**
 * Download or stream original notification PDF
 * @param {string} id - Notification ID
 */
export const getNotificationDownloadUrl = (id) => {
  return `/api/admin/notifications/${id}/download`;
};

/**
 * Update candidate extracted fields before/during admin review
 * @param {string} id - Notification ID
 * @param {Object} data - Updated candidate fields
 */
export const updateNotification = async (id, data) => {
  return await api.put(`/admin/notifications/${id}`, data);
};

/**
 * Explicitly approve extracted notification data for HAQ DWAAR AI use
 * @param {string} id - Notification ID
 * @param {string} reviewNotes - Mandatory admin review note
 */
export const approveNotification = async (id, reviewNotes) => {
  return await api.post(`/admin/notifications/${id}/approve`, { reviewNotes });
};

/**
 * Explicitly reject extracted notification data
 * @param {string} id - Notification ID
 * @param {string} rejectionReason - Mandatory rejection justification
 */
export const rejectNotification = async (id, rejectionReason) => {
  return await api.post(`/admin/notifications/${id}/reject`, { rejectionReason });
};

/**
 * Preview proposed updates against an existing Scheme record
 * @param {string} id - Notification ID
 * @param {string} schemeId - Target Scheme ID
 */
export const previewSchemeUpdate = async (id, schemeId) => {
  return await api.get(`/admin/notifications/${id}/preview-scheme-update`, {
    params: { schemeId },
  });
};

/**
 * Explicitly apply selected approved fields to Scheme record
 * @param {string} id - Notification ID
 * @param {Object} payload - { schemeId, selectedFields: string[], confirmUrlUpdate: boolean }
 */
export const applySchemeUpdate = async (id, payload) => {
  return await api.post(`/admin/notifications/${id}/apply-scheme-update`, payload);
};

// =========================================================================
// CITIZEN IN-APP NOTIFICATIONS (Phase 11 & Local Fallback)
// =========================================================================

const LOCAL_STORAGE_NOTIFS_KEY = "haqdwaar_citizen_notifications";

const DEFAULT_STATUTORY_NOTIFICATIONS = [
  {
    _id: "notif-statutory-01",
    title: "PM-KISAN DBT Credit Approved",
    message: "Direct Benefit Transfer (DBT) installment of ₹2,000 has been verified for disbursement to your Aadhaar-linked account.",
    type: "DBT_CREDIT",
    status: "UNREAD",
    priority: "HIGH",
    category: "KISAN",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    actionUrl: "/dashboard/applications",
  },
  {
    _id: "notif-statutory-02",
    title: "Document Expiry Notice: Income Certificate",
    message: "Your Annual Family Income Certificate will expire in 28 days. Renew via the Tehsildar desk or DigiLocker to avoid application pauses.",
    type: "DOCUMENT_EXPIRY",
    status: "UNREAD",
    priority: "MEDIUM",
    category: "GENERAL",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    actionUrl: "/dashboard/documents",
  },
  {
    _id: "notif-statutory-03",
    title: "Ayushman Golden Card Ready",
    message: "Your PM-JAY ABHA-linked Golden Card providing ₹5,00,000 cashless health coverage is verified and active.",
    type: "SCHEME_SANCTIONED",
    status: "READ",
    priority: "HIGH",
    category: "HEALTH",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    actionUrl: "/dashboard/benefit-passport",
  },
];

const getLocalNotifs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(DEFAULT_STATUTORY_NOTIFICATIONS));
      return DEFAULT_STATUTORY_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STATUTORY_NOTIFICATIONS;
  }
};

const saveLocalNotifs = (notifs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.warn("Could not save notifications to localStorage:", e);
  }
};

/**
 * Get current citizen notifications
 * @param {Object} params - { status, type, page, limit }
 */
export const getCitizenNotifications = async (params = {}) => {
  try {
    return await api.get("/notifications", { params });
  } catch (err) {
    console.warn("Notification server offline, using local statutory notifications:", err.message);
    let list = getLocalNotifs();
    if (params.status && params.status !== "ALL") {
      list = list.filter((n) => n.status === params.status);
    }
    return {
      success: true,
      data: {
        notifications: list,
        total: list.length,
        unreadCount: list.filter((n) => n.status === "UNREAD").length,
      },
      notifications: list,
    };
  }
};

/**
 * Get unread notification count for badge
 */
export const getUnreadCount = async () => {
  try {
    return await api.get("/notifications/unread-count");
  } catch (err) {
    const list = getLocalNotifs();
    const count = list.filter((n) => n.status === "UNREAD").length;
    return {
      success: true,
      data: { count },
      count,
    };
  }
};

/**
 * Mark a single notification as read
 * @param {string} id - Notification ID
 */
export const markNotificationAsRead = async (id) => {
  try {
    const res = await api.put(`/notifications/${id}/read`);
    const current = getLocalNotifs().map((n) => (n._id === id ? { ...n, status: "READ" } : n));
    saveLocalNotifs(current);
    return res;
  } catch (err) {
    const current = getLocalNotifs().map((n) => (n._id === id ? { ...n, status: "READ" } : n));
    saveLocalNotifs(current);
    return { success: true, message: "Marked as read" };
  }
};

/**
 * Dismiss a notification
 * @param {string} id - Notification ID
 */
export const dismissNotification = async (id) => {
  try {
    const res = await api.put(`/notifications/${id}/dismiss`);
    const current = getLocalNotifs().filter((n) => n._id !== id);
    saveLocalNotifs(current);
    return res;
  } catch (err) {
    const current = getLocalNotifs().filter((n) => n._id !== id);
    saveLocalNotifs(current);
    return { success: true, message: "Notification dismissed" };
  }
};

/**
 * Mark all notifications as read for current user
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const res = await api.put("/notifications/read-all");
    const current = getLocalNotifs().map((n) => ({ ...n, status: "READ" }));
    saveLocalNotifs(current);
    return res;
  } catch (err) {
    const current = getLocalNotifs().map((n) => ({ ...n, status: "READ" }));
    saveLocalNotifs(current);
    return { success: true, message: "All notifications marked as read" };
  }
};

/**
 * Trigger proactive alert cycle (Development & Testing)
 */
export const triggerAlertCycle = async () => {
  try {
    return await api.post("/notifications/trigger-alert-cycle");
  } catch (err) {
    const newAlert = {
      _id: `alert-cycle-${Date.now()}`,
      title: "Proactive Scheme Matching Complete",
      message: "Your Benefit Passport was matched against latest gazette notifications. 3 new schemes unlocked!",
      type: "SCHEME_MATCH",
      status: "UNREAD",
      priority: "HIGH",
      category: "GENERAL",
      createdAt: new Date().toISOString(),
      actionUrl: "/dashboard/recommendations",
    };
    const updated = [newAlert, ...getLocalNotifs()];
    saveLocalNotifs(updated);
    return { success: true, data: { triggered: true, newNotification: newAlert } };
  }
};

