import api from "./api";

/**
 * Fetch DigiLocker integration status (demo mode or real)
 */
export const getDigiLockerStatus = async () => {
  return await api.get("/digilocker/status");
};

/**
 * Initiate DigiLocker authorization flow and obtain state token
 */
export const startDigiLockerAuthorization = async () => {
  return await api.get("/digilocker/authorize");
};

/**
 * Submit simulated citizen consent
 * @param {Object} payload - { state: string }
 */
export const submitDigiLockerConsent = async (payload) => {
  return await api.post("/digilocker/consent", payload);
};

/**
 * Fetch available DigiLocker documents for authenticated user
 */
export const getDigiLockerDocuments = async () => {
  return await api.get("/digilocker/documents");
};

/**
 * Get details for a single DigiLocker document
 * @param {string} documentId
 */
export const getDigiLockerDocument = async (documentId) => {
  return await api.get(`/digilocker/documents/${documentId}`);
};

/**
 * Import a DigiLocker document into citizen's Personal Document Vault
 * @param {string} documentId
 */
export const importDigiLockerDocument = async (documentId) => {
  return await api.post(`/digilocker/import/${documentId}`);
};
