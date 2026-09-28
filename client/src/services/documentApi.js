import api from "./api";

/**
 * Upload a citizen document with automatic OCR extraction and health evaluation
 * @param {FormData} formData - Contains 'file' and 'documentType'
 */
export const uploadDocument = async (formData) => {
  return await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Fetch all documents uploaded by the current citizen
 */
export const getDocuments = async () => {
  return await api.get("/documents");
};

/**
 * Fetch a single document by ID
 * @param {string} id
 */
export const getDocumentById = async (id) => {
  return await api.get(`/documents/${id}`);
};

/**
 * Delete a document by ID
 * @param {string} id
 */
export const deleteDocument = async (id) => {
  return await api.delete(`/documents/${id}`);
};

/**
 * Fetch scheme-specific document availability checklist
 * @param {string} schemeId
 */
export const getSchemeDocumentChecklist = async (schemeId) => {
  return await api.get(`/documents/scheme/${schemeId}/checklist`);
};

/**
 * Securely stream and download a document file
 * @param {string} id
 * @param {string} fileName
 */
export const downloadDocumentFile = async (id, fileName) => {
  const token = localStorage.getItem("haqdwaar_token");
  const response = await fetch(`/api/documents/${id}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to download file");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
