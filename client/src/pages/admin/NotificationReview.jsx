import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getNotificationById,
  analyzeNotification,
  updateNotification,
  approveNotification,
  rejectNotification,
  previewSchemeUpdate,
  applySchemeUpdate,
  getNotificationDownloadUrl,
} from "../../services/notificationApi";
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Download,
  Save,
  Check,
  Building,
  Calendar,
  Layers,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function NotificationReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Editable Form State
  const [formData, setFormData] = useState({});

  // Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approving, setApproving] = useState(false);

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  // Scheme Comparison / Update State
  const [selectedSchemeId, setSelectedSchemeId] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [confirmUrlUpdate, setConfirmUrlUpdate] = useState(false);
  const [applyingSchemeUpdate, setApplyingSchemeUpdate] = useState(false);

  const fetchNotification = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotificationById(id);
      const notif = res?.data?.notification;
      setData(res?.data);

      // Populate form state
      setFormData({
        title: notif.title || "",
        schemeName: notif.schemeName || "",
        issuingOrganization: notif.issuingOrganization || "",
        notificationNumber: notif.notificationNumber || "",
        notificationDate: notif.notificationDate ? notif.notificationDate.split("T")[0] : "",
        effectiveDate: notif.effectiveDate ? notif.effectiveDate.split("T")[0] : "",
        applicationStartDate: notif.applicationStartDate ? notif.applicationStartDate.split("T")[0] : "",
        applicationDeadline: notif.applicationDeadline ? notif.applicationDeadline.split("T")[0] : "",
        schemeId: notif.schemeId?._id || notif.schemeId || "",
      });

      if (notif.schemeId?._id || notif.schemeId) {
        setSelectedSchemeId(notif.schemeId?._id || notif.schemeId);
      }
    } catch (err) {
      console.error("Failed to load notification:", err);
      setError(err.response?.data?.message || err.message || "Failed to load notification details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNotification();
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdits = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await updateNotification(id, formData);
      setSuccessMsg("Extracted candidate fields updated and logged successfully.");
      await fetchNotification();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save edits.");
    } finally {
      setSaving(false);
    }
  };

  const handleReanalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await analyzeNotification(id);
      setSuccessMsg("Re-analysis completed. Candidate fields refreshed.");
      await fetchNotification();
    } catch (err) {
      console.error("Re-analysis error:", err);
      setError(err.response?.data?.message || err.message || "Failed to re-analyze PDF.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmApproval = async () => {
    setApproving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await approveNotification(id, reviewNotes || "Administrator reviewed and confirmed candidate metadata.");
      setSuccessMsg("Notification approved! Information is now verified for HAQ DWAAR AI administration.");
      setShowApproveModal(false);
      setReviewNotes("");
      await fetchNotification();
    } catch (err) {
      console.error("Approval error:", err);
      setError(err.response?.data?.message || err.message || "Failed to approve notification.");
    } finally {
      setApproving(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    setRejecting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await rejectNotification(id, rejectionReason.trim());
      setSuccessMsg("Notification rejected. This record cannot affect trusted scheme data.");
      setShowRejectModal(false);
      setRejectionReason("");
      await fetchNotification();
    } catch (err) {
      console.error("Rejection error:", err);
      setError(err.response?.data?.message || err.message || "Failed to reject notification.");
    } finally {
      setRejecting(false);
    }
  };

  const handlePreviewScheme = async (schemeIdToPreview) => {
    const sId = schemeIdToPreview || selectedSchemeId;
    if (!sId) {
      setError("Please select a target scheme to preview updates.");
      return;
    }

    setLoadingComparison(true);
    setError(null);
    try {
      const res = await previewSchemeUpdate(id, sId);
      setComparison(res?.data);
      setSelectedFields([]); // Defaults strictly UNCHECKED
      setConfirmUrlUpdate(false);
    } catch (err) {
      console.error("Preview scheme error:", err);
      setError(err.response?.data?.message || err.message || "Failed to generate scheme comparison.");
    } finally {
      setLoadingComparison(false);
    }
  };

  const toggleFieldSelection = (fieldKey) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey) ? prev.filter((k) => k !== fieldKey) : [...prev, fieldKey]
    );
  };

  const handleApplySchemeUpdate = async () => {
    if (selectedFields.length === 0) {
      setError("Please select at least one field checkbox to update on the scheme record.");
      return;
    }

    const hasUrlSelected = selectedFields.some((f) => f.includes("Url"));
    if (hasUrlSelected && !confirmUrlUpdate) {
      setError("You must check the URL confirmation checkbox before updating official URLs.");
      return;
    }

    setApplyingSchemeUpdate(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await applySchemeUpdate(id, {
        schemeId: comparison?.scheme?.id || selectedSchemeId,
        selectedFields,
        confirmUrlUpdate,
      });

      setSuccessMsg("Selected approved fields successfully updated on scheme record.");
      setComparison(null);
      setSelectedFields([]);
      await fetchNotification();
    } catch (err) {
      console.error("Apply update error:", err);
      setError(err.response?.data?.message || err.message || "Failed to apply scheme update.");
    } finally {
      setApplyingSchemeUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-600 font-medium">Loading notification review details...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.notification) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900">Notification Not Found</h2>
        <Link
          to="/admin/notifications"
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
        >
          Back to Notifications
        </Link>
      </div>
    );
  }

  const { notification, suggestedSchemes = [], auditLogs = [] } = data;
  const isApproved = notification.status === "APPROVED";
  const isRejected = notification.status === "REJECTED";
  const isReviewRequired = notification.status === "REVIEW_REQUIRED";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/notifications"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Notifications
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-bold text-indigo-400">Review &amp; Verify</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getNotificationDownloadUrl(notification._id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Original PDF
            </a>
            <button
              onClick={handleReanalyze}
              disabled={analyzing}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${analyzing ? "animate-spin" : ""}`} />
              Re-analyze
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* ======================================================== */}
        {/* TRUST STATUS BANNERS                                     */}
        {/* ======================================================== */}
        {isReviewRequired && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <h2 className="font-bold text-sm tracking-tight">
                UNVERIFIED CANDIDATE EXTRACTION — REQUIRES ADMIN REVIEW
              </h2>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed pl-7">
              The information below was extracted from the uploaded PDF and has not yet been approved. It cannot be used to update trusted scheme records until an administrator explicitly reviews and approves it.
            </p>
          </div>
        )}

        {isApproved && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <h2 className="font-bold text-sm tracking-tight">
                ADMIN REVIEWED &amp; APPROVED
              </h2>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed pl-7">
              Reviewed and approved by <strong>{notification.reviewedBy?.name || "Administrator"}</strong> on{" "}
              {new Date(notification.reviewedAt).toLocaleDateString()}. (Note: This indicates administrator confirmation for HAQ DWAAR AI; it does not claim independent government authentication).
            </p>
          </div>
        )}

        {isRejected && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <h2 className="font-bold text-sm tracking-tight">
                EXTRACTION REJECTED
              </h2>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed pl-7">
              <strong>Reason:</strong> {notification.rejectionReason}
            </p>
            <p className="text-[11px] text-rose-700 pl-7">
              This record is quarantined and cannot be applied to any verified scheme.
            </p>
          </div>
        )}

        {/* Feedback alerts */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold ml-2">×</button>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="font-bold ml-2">×</button>
          </div>
        )}

        {/* Document Metadata Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Document Information
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {notification.originalFileName}
            </span>
            <p className="text-slate-500">
              {(notification.fileSize / 1024).toFixed(1)} KB • {notification.pageCount} page(s) • Method: {notification.extractionMethod}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {notification.ocrRequired && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                OCR Required / Low Machine Text
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Confidence: {notification.extractionConfidence}
            </span>
          </div>
        </div>

        {/* Warnings Panel */}
        {notification.extractionWarnings?.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Parser &amp; Ambiguity Warnings ({notification.extractionWarnings.length})</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-amber-800">
              {notification.extractionWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ======================================================== */}
        {/* EDITABLE EXTRACTED CANDIDATE FIELDS                      */}
        {/* ======================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Candidate Extracted Information
              </h2>
              <p className="text-xs text-slate-500">
                Administrators can edit or correct candidate values before approval.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveEdits}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {saving ? "Saving..." : "Save Edits"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Scheme Name */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Scheme Name</label>
              <input
                type="text"
                value={formData.schemeName || ""}
                onChange={(e) => handleInputChange("schemeName", e.target.value)}
                placeholder="e.g. PM-KISAN, Post Matric Scholarship"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Notification Title */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Notification Title / Subject</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Notification subject line"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Issuing Organization */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Issuing Organization / Ministry</label>
              <input
                type="text"
                value={formData.issuingOrganization || ""}
                onChange={(e) => handleInputChange("issuingOrganization", e.target.value)}
                placeholder="e.g. Ministry of Agriculture and Farmers Welfare"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Notification Number */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Notification / Reference Number</label>
              <input
                type="text"
                value={formData.notificationNumber || ""}
                onChange={(e) => handleInputChange("notificationNumber", e.target.value)}
                placeholder="e.g. F.No. 12-34/2026-Agri"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Notification Date */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Notification Issue Date</label>
              <input
                type="date"
                value={formData.notificationDate || ""}
                onChange={(e) => handleInputChange("notificationDate", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Effective Date */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Effective Date</label>
              <input
                type="date"
                value={formData.effectiveDate || ""}
                onChange={(e) => handleInputChange("effectiveDate", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Application Start Date */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Application Start Date</label>
              <input
                type="date"
                value={formData.applicationStartDate || ""}
                onChange={(e) => handleInputChange("applicationStartDate", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            {/* Application Deadline */}
            <div className="space-y-1">
              <label className="font-bold text-rose-700">Application Deadline (Closing Date)</label>
              <input
                type="date"
                value={formData.applicationDeadline || ""}
                onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 text-rose-950 font-bold"
              />
            </div>
          </div>

          {/* Section Highlights */}
          <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Extracted Clauses &amp; Highlights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eligibility */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="font-bold text-slate-800 block">Eligibility Criteria Mentions</span>
                {notification.eligibilityHighlights?.length ? (
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    {notification.eligibilityHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400">No specific eligibility clauses detected.</p>
                )}
              </div>

              {/* Documents */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="font-bold text-slate-800 block">Required Document Mentions</span>
                {notification.documentHighlights?.length ? (
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    {notification.documentHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400">No specific document clauses detected.</p>
                )}
              </div>

              {/* Benefits */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="font-bold text-slate-800 block">Benefit / Financial Clauses</span>
                {notification.benefitHighlights?.length ? (
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    {notification.benefitHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400">No specific benefit clauses detected.</p>
                )}
              </div>

              {/* Policy Changes */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="font-bold text-slate-800 block">Policy Amendments / Extension Clauses</span>
                {notification.changeHighlights?.length ? (
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    {notification.changeHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400">No amendment clauses detected.</p>
                )}
              </div>
            </div>

            {/* Source references */}
            {notification.sourceReferences?.length > 0 && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="font-bold text-slate-800 block">Extracted URLs &amp; Source References</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {notification.sourceReferences.map((url, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 text-blue-700 font-mono"
                    >
                      {url}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  * Note: URLs extracted from PDFs are unverified and must never be automatically treated as official government portals.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* APPROVE / REJECT ACTIONS                                 */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Administrator Verification Decision
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approving records that an admin reviewed the data. It does not automatically mutate scheme records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
            >
              Reject Notification
            </button>
            <button
              type="button"
              onClick={() => setShowApproveModal(true)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition"
            >
              Approve Extraction →
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OPTIONAL SCHEME UPDATE (ONLY AFTER APPROVAL)             */}
        {/* ======================================================== */}
        {isApproved && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                Optional Scheme Update Workflow
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                Apply Approved Values to Scheme Record
              </h3>
              <p className="text-xs text-slate-500">
                Compare approved notification values against existing scheme data. Field updates are strictly field-specific and require explicit checkbox selection.
              </p>
            </div>

            {/* Target Scheme Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Select Target Scheme:
                </label>
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="">-- Choose a scheme --</option>
                  {suggestedSchemes.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.category} • {s.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:self-end">
                <button
                  type="button"
                  onClick={() => handlePreviewScheme(selectedSchemeId)}
                  disabled={!selectedSchemeId || loadingComparison}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-2xs transition disabled:opacity-50"
                >
                  {loadingComparison ? "Loading Preview..." : "Preview Scheme Comparison →"}
                </button>
              </div>
            </div>

            {/* Comparison Side-by-Side Table */}
            {comparison && (
              <div className="pt-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  Target: <strong>{comparison.scheme?.name}</strong> ({comparison.scheme?.category})
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase font-bold">
                      <tr>
                        <th className="p-3 w-10">Select</th>
                        <th className="p-3">Field</th>
                        <th className="p-3">Existing Scheme Value</th>
                        <th className="p-3">Approved Notification Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {comparison.comparisons?.map((c) => {
                        const isSelected = selectedFields.includes(c.field);
                        const hasProposed = Boolean(c.proposedValue);

                        return (
                          <tr key={c.field} className={isSelected ? "bg-blue-50/30" : ""}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={!hasProposed}
                                onChange={() => toggleFieldSelection(c.field)}
                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                              />
                            </td>
                            <td className="p-3 font-semibold text-slate-900">
                              {c.label}
                              {c.isUrl && (
                                <span className="block text-[10px] text-amber-700 font-normal">
                                  {c.warning}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-600 font-mono text-[11px] max-w-xs break-words">
                              {c.existingValue || "—"}
                            </td>
                            <td className="p-3 text-slate-900 font-mono text-[11px] max-w-xs break-words">
                              {c.proposedValue ? (
                                <span className={c.different ? "text-emerald-700 font-bold" : ""}>
                                  {c.proposedValue}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Not extracted</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* URL Explicit Confirmation Checkbox if any URL field is selected */}
                {selectedFields.some((f) => f.includes("Url")) && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2 text-xs text-amber-900">
                    <input
                      type="checkbox"
                      id="url-confirm-cb"
                      checked={confirmUrlUpdate}
                      onChange={(e) => setConfirmUrlUpdate(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <label htmlFor="url-confirm-cb" className="font-semibold cursor-pointer">
                      I explicitly confirm that the extracted URL was verified as an authorized government portal and should overwrite the existing official URL.
                    </label>
                  </div>
                )}

                {/* Apply Button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setComparison(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySchemeUpdate}
                    disabled={selectedFields.length === 0 || applyingSchemeUpdate}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {applyingSchemeUpdate ? "Applying Update..." : `Apply Selected (${selectedFields.length}) Field(s) →`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* AUDIT TRAIL LOG                                          */}
        {/* ======================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Audit History &amp; Actions Log</span>
          </h3>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400">No actions recorded yet.</p>
          ) : (
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log._id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-[10px] text-slate-400">
                        by {log.adminId?.name || "Admin"}
                      </span>
                    </div>
                    {log.notes && <p className="text-[11px] text-slate-600">{log.notes}</p>}
                    {log.changedFields?.length > 0 && (
                      <p className="text-[10px] text-slate-400">
                        Fields: {log.changedFields.join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* ======================================================== */}
      {/* APPROVAL CONFIRMATION MODAL                              */}
      {/* ======================================================== */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">
                Confirm Administrator Approval
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Approve this extracted information for use in HAQ DWAAR AI?
            </p>

            <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900 leading-relaxed border border-blue-200">
              <strong>Civic Trust Boundary:</strong> This action records that an administrator reviewed the extracted candidate metadata. It does not independently authenticate the original government document, nor does it automatically modify any Scheme record.
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Review Notes (Mandatory):</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="e.g. Reviewed extracted dates against uploaded notification PDF; confirmed valid."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={approving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                {approving ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REJECTION MODAL                                          */}
      {/* ======================================================== */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <XCircle className="w-6 h-6 text-rose-600" />
              <h3 className="font-bold text-base text-slate-900">
                Reject Notification Extraction
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Rejecting this notification marks it as rejected and permanently excludes its candidate data from updating any scheme.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Rejection Reason (Required):</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Document is illegible / deadline text is contradictory."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim() || rejecting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {rejecting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
