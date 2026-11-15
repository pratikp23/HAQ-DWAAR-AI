import api from "./api";

/**
 * Fetch scheme ingestion queue items with filtering and metrics
 * @param {Object} params - { status, source, search, page, limit }
 */
export const getIngestionQueue = async (params = {}) => {
  return await api.get("/admin/scheme-sync/queue", { params });
};

/**
 * Trigger on-demand sync across all government sources
 */
export const triggerLiveSync = async () => {
  return await api.post("/admin/scheme-sync/trigger");
};

/**
 * Approve a crawled draft and publish to public scheme directory
 * @param {string} id - SchemeIngestionQueue MongoDB ID
 * @param {Object} payload - Optional edited draft
 */
export const approveDraft = async (id, payload = {}) => {
  return await api.post(`/admin/scheme-sync/${id}/approve`, payload);
};

/**
 * Reject a crawled draft
 * @param {string} id - SchemeIngestionQueue MongoDB ID
 * @param {Object} payload - { notes }
 */
export const rejectDraft = async (id, payload = {}) => {
  return await api.post(`/admin/scheme-sync/${id}/reject`, payload);
};

/**
 * Update draft fields before approving
 * @param {string} id - SchemeIngestionQueue MongoDB ID
 * @param {Object} payload - { parsedDraft }
 */
export const updateDraft = async (id, payload = {}) => {
  return await api.put(`/admin/scheme-sync/${id}`, payload);
};
