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
// CITIZEN IN-APP NOTIFICATIONS (Phase 11)
// =========================================================================

/**
 * Get current citizen notifications
 * @param {Object} params - { status, type, page, limit }
 */
export const getCitizenNotifications = async (params = {}) => {
  return await api.get("/notifications", { params });
};

/**
 * Get unread notification count for badge
 */
export const getUnreadCount = async () => {
  return await api.get("/notifications/unread-count");
};

/**
 * Mark a single notification as read
 * @param {string} id - Notification ID
 */
export const markNotificationAsRead = async (id) => {
  return await api.put(`/notifications/${id}/read`);
};

/**
 * Dismiss a notification
 * @param {string} id - Notification ID
 */
export const dismissNotification = async (id) => {
  return await api.put(`/notifications/${id}/dismiss`);
};

/**
 * Mark all notifications as read for current user
 */
export const markAllNotificationsAsRead = async () => {
  return await api.put("/notifications/read-all");
};

/**
 * Trigger proactive alert cycle (Development & Testing)
 */
export const triggerAlertCycle = async () => {
  return await api.post("/notifications/trigger-alert-cycle");
};

