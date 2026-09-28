import * as digilockerService from "../services/digilockerService.js";

/**
 * Get DigiLocker integration status
 * GET /api/digilocker/status
 */
export async function getStatus(req, res) {
  try {
    const mode = digilockerService.getMode();
    return res.status(200).json({
      success: true,
      mode,
      connected: false,
      message:
        mode === "demo"
          ? "DigiLocker Demo Mode active. No real DigiLocker account is accessed."
          : "DigiLocker Real Mode active.",
    });
  } catch (error) {
    console.error("DigiLocker getStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve DigiLocker status.",
    });
  }
}

/**
 * Start DigiLocker authorization/consent flow
 * GET /api/digilocker/authorize
 */
export async function getAuthorize(req, res) {
  try {
    const result = await digilockerService.getAuthorizationUrl(req.user.id);
    if (!result.success && result.mode === "real") {
      return res.status(503).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("DigiLocker getAuthorize error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate DigiLocker authorization.",
    });
  }
}

/**
 * Submit citizen consent for DigiLocker document fetch
 * POST /api/digilocker/consent
 */
export async function submitConsent(req, res) {
  try {
    const { state } = req.body;
    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State token is required for consent submission.",
      });
    }

    const result = await digilockerService.submitConsent(req.user.id, state);
    return res.status(200).json(result);
  } catch (error) {
    console.error("DigiLocker submitConsent error:", error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Failed to confirm DigiLocker consent.",
    });
  }
}

/**
 * List available DigiLocker documents for authenticated user
 * GET /api/digilocker/documents
 */
export async function getDocuments(req, res) {
  try {
    const result = await digilockerService.listDocuments(req.user.id);
    if (!result.success && result.mode === "real") {
      return res.status(503).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("DigiLocker getDocuments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve DigiLocker documents.",
    });
  }
}

/**
 * Get single DigiLocker document detail
 * GET /api/digilocker/documents/:documentId
 */
export async function getDocumentById(req, res) {
  try {
    const document = await digilockerService.getDocument(
      req.user.id,
      req.params.documentId
    );
    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve document details.",
    });
  }
}

/**
 * Import a selected DigiLocker document into citizen's Personal Document Vault
 * POST /api/digilocker/import/:documentId
 */
export async function importDocument(req, res) {
  try {
    const importedDoc = await digilockerService.importDocument(
      req.user.id,
      req.params.documentId
    );
    return res.status(201).json({
      success: true,
      message: "DigiLocker document imported to your Personal Document Vault successfully.",
      document: importedDoc,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to import DigiLocker document.",
    });
  }
}
