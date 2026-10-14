import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../../services/applicationApi";
import {
  Briefcase,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Trash2,
  FileCheck2,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Building2,
  Copy,
  Check,
} from "lucide-react";

const STAGES = [
  { key: "INTERESTED", label: "Interested" },
  { key: "PREPARING", label: "Preparing Docs" },
  { key: "READY_TO_APPLY", label: "Ready to Apply" },
  { key: "APPLIED", label: "Citizen-marked Applied" },
  { key: "FOLLOW_UP", label: "Follow Up" },
  { key: "COMPLETED", label: "Citizen-marked Completed" },
];

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [currentStatus, setCurrentStatus] = useState("INTERESTED");
  const [notes, setNotes] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getApplicationById(id);
      const app = res?.data?.application || res?.application || res?.data;
      setApplication(app);
      if (app) {
        setCurrentStatus(app.status || "INTERESTED");
        setNotes(app.notes || "");
        setReferenceNumber(app.referenceNumber || "");
      }
    } catch (err) {
      console.error("Failed to load application details:", err);
      setError(err.message || "Failed to load application details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRef = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleUpdate = async (newStatus = currentStatus) => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      const payload = {
        status: newStatus,
        notes,
        referenceNumber,
        confirmJump: true,
      };

      const res = await updateApplication(id, payload);
      const updated = res?.data?.application || res?.application || res?.data;
      if (updated) {
        setApplication(updated);
        if (updated.status) setCurrentStatus(updated.status);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.message || "Failed to update application tracker.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await deleteApplication(id);
      navigate("/dashboard/applications", { replace: true });
    } catch (err) {
      alert("Failed to delete application tracker: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Application Record Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">{error || "The requested tracking record could not be loaded."}</p>
          <Link
            to="/dashboard/applications"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 text-white"
          >
            Back to Application Tracker
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const scheme = application.schemeId;
  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <div className="min-h-screen bg-[#f7f5fa] flex flex-col text-[#0f172a]">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to All Applications
          </Link>
        </div>

        {/* Scheme Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                  {scheme?.category || "General"}
                </span>
                <span className="text-xs text-slate-500">
                  Started on {new Date(application.startedAt).toLocaleDateString("en-IN")}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {scheme?.name}
              </h1>
            </div>

            {scheme?._id && (
              <Link
                to={`/dashboard/readiness/${scheme._id}`}
                className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition flex-shrink-0"
              >
                <FileCheck2 className="w-4 h-4 mr-1.5 text-emerald-700" />
                Check Preparation Readiness
              </Link>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {scheme?.benefitSummary}
          </p>

          {/* Trusted Deadline Banner */}
          {application.deadlineEvaluation?.hasDeadline && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-slate-500" />
                Official Application Deadline:
              </span>
              <span className="font-bold text-slate-900">
                {application.deadlineEvaluation.formattedDate}
                {application.deadlineEvaluation.daysRemaining !== null && (
                  <span className="ml-1 text-slate-500">
                    ({application.deadlineEvaluation.daysRemaining} days remaining)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Status Stepper Progression */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Application Progress Stepper
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => {
                    setCurrentStatus(stage.key);
                    handleUpdate(stage.key);
                  }}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    isCurrent
                      ? "bg-[#240b49] border-[#240b49] text-white font-bold shadow-md ring-2 ring-[#591d8f]/30"
                      : isPast
                      ? "bg-[#240b49]/10 border-[#240b49]/20 text-[#240b49] font-semibold hover:bg-[#240b49]/15"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold opacity-75">Step {idx + 1}</div>
                  <div className="text-xs mt-0.5">{stage.label}</div>
                </button>
              );
            })}
          </div>

          {currentStatus === "CANCELLED" && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-700 flex items-center justify-between">
              <span className="font-bold flex items-center">
                <AlertCircle className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                This application tracker is currently Cancelled.
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentStatus("INTERESTED");
                  handleUpdate("INTERESTED");
                }}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition"
              >
                Re-activate Tracker
              </button>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Next Action: </span>
              {application.nextAction}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 leading-tight">
              Application tracker statuses are self-reported by citizens for personal planning and do not represent government approval or real-time government status.
            </span>
            {currentStatus !== "CANCELLED" && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to mark this application as Cancelled?")) {
                    setCurrentStatus("CANCELLED");
                    handleUpdate("CANCELLED");
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 underline font-semibold whitespace-nowrap self-end sm:self-auto"
              >
                Mark as Cancelled
              </button>
            )}
          </div>
        </div>

        {/* Ministry Nodal Officer Direct Queue & Dossier Section */}
        {application.submissionType === "QUICK_APPLY" && (
          <div className="mt-6 bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      1-Click Quick Apply Dossier
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Department: <strong>{application.department || scheme?.category || "Gov Desk"}</strong>
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                    Ministry Nodal Officer Review &amp; DBT Verification
                  </h3>
                </div>
              </div>

              {/* Reference Code with Copy button */}
              {application.referenceNumber && (
                <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 self-start sm:self-auto">
                  <span className="text-xs font-mono font-black text-purple-900">{application.referenceNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyRef(application.referenceNumber)}
                    className="p-1 text-purple-700 hover:text-purple-900 rounded hover:bg-purple-100 transition cursor-pointer"
                    title="Copy Reference Number"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Nodal Officer Review Status Card */}
            {application.nodalReview?.actionTaken === "APPROVED" && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Direct Benefit Transfer (DBT) Sanctioned &amp; Approved!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Reviewed by Nodal Officer <strong>{application.nodalReview.officerName || "Ministry Nodal Officer"}</strong> on{" "}
                  {new Date(application.nodalReview.reviewedAt).toLocaleDateString("en-IN")}.
                </p>
                {application.nodalReview.remarks && (
                  <p className="text-xs font-medium bg-white/70 p-2.5 rounded-lg border border-emerald-200 mt-2">
                    <strong>Official Remarks:</strong> {application.nodalReview.remarks}
                  </p>
                )}
              </div>
            )}

            {(application.nodalReview?.actionTaken === "DOCS_REQUESTED" || application.nodalReview?.actionTaken === "NEEDS_DOCUMENTS") && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-sm text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Additional Documents Requested by Department</span>
                </div>
                <p className="text-xs text-amber-800">
                  Reviewed by Nodal Officer <strong>{application.nodalReview.officerName || "Ministry Nodal Desk"}</strong> on{" "}
                  {new Date(application.nodalReview.reviewedAt).toLocaleDateString("en-IN")}.
                </p>
                {application.nodalReview.remarks && (
                  <p className="text-xs font-medium bg-white/70 p-2.5 rounded-lg border border-amber-200 mt-2">
                    <strong>Nodal Officer Note:</strong> {application.nodalReview.remarks}
                  </p>
                )}
              </div>
            )}

            {application.nodalReview?.actionTaken === "REJECTED" && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-sm text-rose-900">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Application Not Approved by Department</span>
                </div>
                <p className="text-xs text-rose-800">
                  Reviewed by Nodal Officer <strong>{application.nodalReview.officerName || "Ministry Nodal Desk"}</strong> on{" "}
                  {new Date(application.nodalReview.reviewedAt).toLocaleDateString("en-IN")}.
                </p>
                {application.nodalReview.remarks && (
                  <p className="text-xs font-medium bg-white/70 p-2.5 rounded-lg border border-rose-200 mt-2">
                    <strong>Reason:</strong> {application.nodalReview.remarks}
                  </p>
                )}
              </div>
            )}

            {!application.nodalReview?.actionTaken && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 flex items-start space-x-3">
                <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-indigo-900">In Ministry Review Queue</p>
                  <p className="text-indigo-800 leading-relaxed">
                    Your complete Benefit Passport and DigiLocker verified proofs have been securely bundled and placed into the verified queue for the <strong>{application.department || "Category"} Nodal Officer</strong>. You will be notified immediately upon nodal action.
                  </p>
                </div>
              </div>
            )}

            {/* Attached Proofs & Snapshot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Attached DigiLocker Documents</span>
                {application.documentsAttached && application.documentsAttached.length > 0 ? (
                  <div className="space-y-1">
                    {application.documentsAttached.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-600 text-[11px]">
                        <span>• {doc.documentType}</span>
                        <span className="text-emerald-700 font-bold">Verified ({doc.source})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px]">DigiLocker KYC Proofs Linked</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Eligibility Snapshot at Submission</span>
                <div className="text-slate-600 text-[11px] space-y-0.5">
                  <p>Match Score: <strong className="text-purple-700">{application.eligibilitySnapshot?.matchScore || 100}%</strong></p>
                  {application.applicantDetails?.state && <p>State: <strong>{application.applicantDetails.state}</strong></p>}
                  {application.applicantDetails?.socialCategory && <p>Category: <strong>{application.applicantDetails.socialCategory}</strong></p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Application Portal Gateway */}
        <div className="mt-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">Official Government Application Channel</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When you are ready to apply, proceed directly to the authentic government portal. Remember that clicking this link opens the government portal in a new tab. When finished submitting, return here to mark your application as "Applied".
          </p>

          <div className="pt-2">
            {scheme?.officialApplicationUrl ? (
              <a
                href={scheme.officialApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 transition shadow"
              >
                Open Official Portal
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            ) : (
              <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800 p-2.5 rounded-xl">
                Official application link is not available in HAQ DWAAR AI for this scheme. Please check the official gazette source.
              </div>
            )}
          </div>
        </div>

        {/* Citizen Notes & Reference Number */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Citizen Application Record &amp; Private Notes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Application Reference / Acknowledgement Number
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. SCH-2026-981248"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Citizen-entered reference number (unverified). Stored for your tracking convenience.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Application Submission Date
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                {application.submittedAt
                  ? new Date(application.submittedAt).toLocaleDateString("en-IN")
                  : "Not yet submitted (Citizen-marked)"}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Private Citizen Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need to upload renewed Income Certificate. Visited Tehsil office on Tuesday."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Private notes are stored securely and never shared with third parties.
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {deleteConfirm ? "Click again to confirm removal" : "Stop Tracking Scheme"}
            </button>

            <button
              type="button"
              onClick={() => handleUpdate(currentStatus)}
              disabled={saving}
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save Updates"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
