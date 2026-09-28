import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocumentFile,
} from "../../services/documentApi";
import {
  startDigiLockerAuthorization,
  submitDigiLockerConsent,
  getDigiLockerDocuments,
  importDigiLockerDocument,
} from "../../services/digilockerApi";

const DOCUMENT_TYPES = [
  "Aadhaar",
  "Income Certificate",
  "Caste Certificate",
  "Domicile Certificate",
  "Marksheet",
  "Bank Passbook",
  "Land Ownership Document",
  "Disability Certificate",
  "Other",
];

const HEALTH_CONFIG = {
  VALID: {
    label: "Valid & Readable",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    icon: (
      <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  NEEDS_VERIFICATION: {
    label: "Needs Review",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
    icon: (
      <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  EXPIRED: {
    label: "Expired",
    badgeClass: "bg-red-50 text-red-800 border-red-300",
    icon: (
      <svg className="w-4 h-4 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  INCOMPLETE: {
    label: "Incomplete",
    badgeClass: "bg-orange-50 text-orange-800 border-orange-300",
    icon: (
      <svg className="w-4 h-4 mr-1 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [selectedType, setSelectedType] = useState("Aadhaar");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [filterSource, setFilterSource] = useState("ALL");

  // DigiLocker Modal State
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);
  const [digiLockerStep, setDigiLockerStep] = useState(1); // 1 = Consent, 2 = Document Selection
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);
  const [digiLockerState, setDigiLockerState] = useState("");
  const [digiLockerDocs, setDigiLockerDocs] = useState([]);
  const [importingDocId, setImportingDocId] = useState(null);
  const [digiLockerError, setDigiLockerError] = useState("");
  const [digiLockerSuccess, setDigiLockerSuccess] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await getDocuments();
      if (res.success) {
        setDocuments(res.documents || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB limit. Please upload a smaller scan or PDF.");
      setSelectedFile(null);
      e.target.value = null;
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", selectedType);

      const res = await uploadDocument(formData);
      if (res.success) {
        setSuccessMessage(`'${res.document.documentType}' uploaded to your Document Vault.`);
        setSelectedFile(null);
        const fileInput = document.getElementById("doc-file-input");
        if (fileInput) fileInput.value = null;
        await fetchDocuments();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Upload failed. Please check the file format and size.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, docType) => {
    if (!window.confirm(`Are you sure you want to delete your ${docType} from your Document Vault? This will remove it from scheme readiness checks.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await deleteDocument(id);
      if (res.success) {
        setDocuments((prev) => prev.filter((d) => d._id !== id));
        setSuccessMessage("Document deleted from vault successfully.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      await downloadDocumentFile(id, fileName);
    } catch (err) {
      alert("Could not download file: " + err.message);
    }
  };

  // --- DigiLocker Handlers ---
  const handleOpenDigiLocker = async () => {
    setIsDigiLockerOpen(true);
    setDigiLockerStep(1);
    setDigiLockerError("");
    setDigiLockerSuccess("");
    setDigiLockerLoading(true);

    try {
      const res = await startDigiLockerAuthorization();
      if (res.success) {
        setDigiLockerState(res.state);
      } else {
        setDigiLockerError(res.reason || "Failed to start DigiLocker authorization.");
      }
    } catch (err) {
      setDigiLockerError(err.message || "DigiLocker authorization unavailable.");
    } finally {
      setDigiLockerLoading(false);
    }
  };

  const handleConfirmConsent = async () => {
    try {
      setDigiLockerLoading(true);
      setDigiLockerError("");

      // Submit state-bound simulated consent
      await submitDigiLockerConsent({ state: digiLockerState });

      // Fetch available synthetic documents
      const docsRes = await getDigiLockerDocuments();
      if (docsRes.success) {
        setDigiLockerDocs(docsRes.documents || []);
        setDigiLockerStep(2);
      } else {
        setDigiLockerError(docsRes.reason || "Unable to list DigiLocker documents.");
      }
    } catch (err) {
      setDigiLockerError(err.message || "Consent verification failed.");
    } finally {
      setDigiLockerLoading(false);
    }
  };

  const handleImportDoc = async (docId) => {
    try {
      setImportingDocId(docId);
      setDigiLockerError("");
      setDigiLockerSuccess("");

      const res = await importDigiLockerDocument(docId);
      if (res.success) {
        setDigiLockerSuccess(`'${res.document.documentType}' imported to your Document Vault successfully!`);
        // Mark as imported locally in the modal
        setDigiLockerDocs((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, alreadyImported: true } : d))
        );
        // Refresh main Document Vault
        await fetchDocuments();
      }
    } catch (err) {
      if (err.status === 409) {
        setDigiLockerError("This DigiLocker document is already in My Documents.");
        setDigiLockerDocs((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, alreadyImported: true } : d))
        );
      } else {
        setDigiLockerError(err.message || "Failed to import DigiLocker document.");
      }
    } finally {
      setImportingDocId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesType = filterType === "ALL" || doc.documentType === filterType;
    const matchesSource = filterSource === "ALL" || doc.source === filterSource;
    return matchesType && matchesSource;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              <span>Personal Document Vault</span>
              <span>•</span>
              <span>Phase 8 Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              My Document Vault
            </h1>
            <p className="text-slate-600 max-w-2xl text-sm md:text-base leading-relaxed">
              Keep your benefit-related documents in one personal vault. Upload documents yourself or import them through simulated DigiLocker, and reuse those documents when checking different government schemes.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>

            <button
              onClick={handleOpenDigiLocker}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Import from DigiLocker
            </button>
          </div>
        </div>

        {/* Informational Readiness Disclaimer */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Application Readiness Assistant:</span> Document health evaluations indicate file readability, completeness, and detected expiration dates. This is an informational application-readiness assistant and <span className="underline">does not constitute official government authentication</span> or legal verification.
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between shadow-sm">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-red-700 hover:text-red-900 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Manual Upload Section (Collapsible) */}
      {showUploadForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Document to Vault
            </h2>
            <span className="text-xs text-slate-500">Source: Upload (PDF, PNG, JPG)</span>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Select the certificate category.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Choose File <span className="text-red-500">*</span>
                </label>
                <input
                  id="doc-file-input"
                  type="file"
                  accept=".pdf, .png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Max 5MB. Sensitive IDs are automatically masked.</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white transition flex items-center gap-2 shadow-sm ${
                  uploading || !selectedFile
                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Evaluating Scan &amp; Health...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload &amp; Evaluate Health
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Vault Gallery */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Your Document Vault</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {documents.length}
            </span>
          </div>

          {/* Filters */}
          {documents.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-xs font-medium">Source:</span>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Sources</option>
                  <option value="UPLOAD">Uploaded</option>
                  <option value="DIGILOCKER">DigiLocker Demo</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-xs font-medium">Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Types</option>
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-3 text-slate-500 text-sm">Loading your personal document vault...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Your Document Vault is empty</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                Upload your certificates or click <strong>"Import from DigiLocker"</strong> to add simulated documents for instant scheme readiness checks.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleOpenDigiLocker}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white transition shadow-sm"
              >
                Launch DigiLocker Simulation →
              </button>
            </div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No documents in vault match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => {
              const health = HEALTH_CONFIG[doc.healthStatus] || HEALTH_CONFIG.NEEDS_VERIFICATION;
              const extracted = doc.extractedData || {};
              const isDigiLocker = doc.source === "DIGILOCKER";

              return (
                <div
                  key={doc._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div className="p-6 space-y-4">
                    {/* Card Top: Type & Source */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            {doc.documentType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              isDigiLocker
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {isDigiLocker ? "Source: DigiLocker Demo" : "Source: Uploaded"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 truncate" title={doc.originalFileName}>
                          {doc.originalFileName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatFileSize(doc.fileSize)} • Added {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      {/* Health Status Badge */}
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${health.badgeClass}`}
                        title="Document health status based on scan readability and dates"
                      >
                        {health.icon}
                        {health.label}
                      </div>
                    </div>

                    {/* Masked Document Number */}
                    {extracted.maskedDocumentNumber && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Identifier:</span>
                        <span className="font-mono font-bold text-slate-800 tracking-wider">
                          {extracted.maskedDocumentNumber}
                        </span>
                      </div>
                    )}

                    {/* Extracted Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Holder Name:</span>
                        <span className="font-medium text-slate-800 truncate block">
                          {extracted.holderName || "Not detected"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Date of Birth:</span>
                        <span className="font-medium text-slate-800 block">
                          {extracted.dateOfBirth || "N/A"}
                        </span>
                      </div>
                      {extracted.income !== null && extracted.income !== undefined && (
                        <div>
                          <span className="text-slate-400 block">Annual Income:</span>
                          <span className="font-medium text-slate-800 block">
                            ₹{Number(extracted.income).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                      {extracted.expiryDate && (
                        <div>
                          <span className="text-slate-400 block">Valid Upto:</span>
                          <span className={`font-medium block ${doc.healthStatus === "EXPIRED" ? "text-red-600 font-bold" : "text-slate-800"}`}>
                            {new Date(extracted.expiryDate).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      )}
                      {extracted.issuingAuthority && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block">Issuing Authority:</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {extracted.issuingAuthority}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Issues Detected Box */}
                    {doc.issuesDetected && doc.issuesDetected.length > 0 && (
                      <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                        doc.healthStatus === "EXPIRED"
                          ? "bg-red-50 border-red-200 text-red-800"
                          : doc.healthStatus === "INCOMPLETE"
                          ? "bg-orange-50 border-orange-200 text-orange-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>
                        <div className="font-semibold">Issues Identified:</div>
                        <ul className="list-disc list-inside space-y-0.5 pl-1">
                          {doc.issuesDetected.map((issue, idx) => (
                            <li key={idx} className="leading-tight">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Bottom */}
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleDownload(doc._id, doc.originalFileName)}
                      className="inline-flex items-center text-blue-700 hover:text-blue-900 font-semibold gap-1 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>

                    <button
                      onClick={() => handleDelete(doc._id, doc.documentType)}
                      disabled={deletingId === doc._id}
                      className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold gap-1 transition disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {deletingId === doc._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* DIGILOCKER DEMO MODAL / DRAWER                           */}
      {/* ======================================================== */}
      {isDigiLockerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-800/80 text-blue-200 text-xs font-semibold border border-blue-700">
                  <span>DigiLocker Demo Mode</span>
                </div>
                <h3 className="text-xl font-bold">Import from DigiLocker</h3>
              </div>
              <button
                onClick={() => setIsDigiLockerOpen(false)}
                className="text-blue-200 hover:text-white text-2xl font-light"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {digiLockerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
                  <span>{digiLockerError}</span>
                  <button onClick={() => setDigiLockerError("")} className="font-bold ml-2">✕</button>
                </div>
              )}

              {digiLockerSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span>{digiLockerSuccess}</span>
                  <button onClick={() => setDigiLockerSuccess("")} className="font-bold ml-2">✕</button>
                </div>
              )}

              {/* STEP 1: Prototype Consent & Reality Check */}
              {digiLockerStep === 1 && (
                <div className="space-y-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-sm text-amber-950">
                      <span>Prototype Simulation Notice</span>
                    </div>
                    <p className="leading-relaxed">
                      This is an interactive prototype simulation of the DigiLocker document retrieval flow. <strong>No real DigiLocker account will be accessed</strong> and no actual government credentials are used.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block text-sm">The simulation demonstrates:</span>
                    <ul className="space-y-1.5 pl-1">
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span> Citizen authorization &amp; consent flow
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span> DigiLocker synthetic document directory
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span> Direct import into your Personal Document Vault
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span> Automatic document health &amp; scheme readiness check
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsDigiLockerOpen(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmConsent}
                      disabled={digiLockerLoading}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {digiLockerLoading ? "Preparing Simulation..." : "Continue Simulation →"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Synthetic Document Picker */}
              {digiLockerStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Available Simulated Documents</h4>
                      <p className="text-xs text-slate-500">Select documents to import into your vault</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Simulated DigiLocker
                    </span>
                  </div>

                  {digiLockerDocs.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No documents available.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {digiLockerDocs.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{item.documentName}</span>
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                DigiLocker Demo
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              Issuer: {item.issuer} • ID: <span className="font-mono">{item.maskedDocumentNumber}</span>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Holder: {item.holderName} • Date: {item.issuedDate}
                            </p>
                          </div>

                          <div>
                            {item.alreadyImported ? (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-200 border border-slate-300">
                                ✓ In Vault
                              </span>
                            ) : (
                              <button
                                onClick={() => handleImportDoc(item.id)}
                                disabled={importingDocId === item.id}
                                className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition shadow-sm disabled:opacity-50"
                              >
                                {importingDocId === item.id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Importing...
                                  </>
                                ) : (
                                  "Import to Vault"
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setDigiLockerStep(1)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      ← Back to Consent
                    </button>
                    <button
                      onClick={() => setIsDigiLockerOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
