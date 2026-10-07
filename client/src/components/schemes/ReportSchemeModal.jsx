import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileWarning
} from "lucide-react";
import { reportScheme } from "../../services/reportApi";

export default function ReportSchemeModal({ scheme, isOpen, onClose }) {
  const [reason, setReason] = useState("FAKE_OR_FRAUD");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !scheme) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("Please describe the specific issue or why this scheme seems suspicious/inaccurate.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        reason,
        description: description.trim(),
        severity,
        reporterName: reporterName.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
      };

      const res = await reportScheme(scheme._id, payload);

      if (res?.success) {
        setSubmitted(true);
      } else {
        setError(res?.message || "Failed to submit report. Please try again.");
      }
    } catch (err) {
      console.error("Report submission failed:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send grievance report to the verification desk."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError(null);
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) handleResetAndClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Report Scheme / Citizen Grievance
              </h3>
              <p className="text-[11px] text-red-100 font-medium truncate max-w-[280px] sm:max-w-xs">
                Target: {scheme.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            disabled={submitting}
            className="p-1.5 rounded-xl text-red-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  Grievance Logged Successfully
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Your report has been securely registered in the <strong>Chief Nodal Officer Grievance Queue</strong>.
                  Our administrative verification cell will cross-examine the Gazette notification and official source portal.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 text-left font-mono">
                <div>• Scheme ID: {scheme._id}</div>
                <div>• Auto-Fraud Guard: 3+ independent flags triggers automatic freeze</div>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  HAQ DWAAR AI enforces absolute authenticity. If this scheme contains misleading claims, an unauthorized phishing portal, or fake criteria, report it immediately for nodal investigation.
                </span>
              </div>

              {/* Grievance Category / Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nature of Grievance <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="FAKE_OR_FRAUD">🚨 Suspected Fake or Fraudulent Scheme</option>
                  <option value="BROKEN_OR_UNAUTHORIZED_LINK">🔗 Unauthorized / Phishing / Broken Portal URL</option>
                  <option value="INCORRECT_ELIGIBILITY_RULES">📋 Inaccurate Eligibility Criteria or Benefits</option>
                  <option value="EXPIRED_OR_DISCONTINUED">⏳ Scheme Expired / Officially Discontinued</option>
                  <option value="OTHER_INACCURACY">❓ Other Inaccuracy or Guideline Violation</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Urgency / Severity Level
                </label>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  {[
                    { id: "LOW", label: "Low", color: "hover:border-slate-400" },
                    { id: "MEDIUM", label: "Medium", color: "hover:border-amber-400" },
                    { id: "HIGH", label: "High", color: "hover:border-orange-500" },
                    { id: "CRITICAL", label: "Critical", color: "hover:border-red-600" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSeverity(lvl.id)}
                      className={`py-2 px-1 rounded-xl border transition ${
                        severity === lvl.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : `bg-slate-50 text-slate-700 border-slate-200 ${lvl.color}`
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why you believe this scheme or application link is invalid, misleading, or fraudulent..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-medium"
                />
              </div>

              {/* Optional Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Citizen / Advocate"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={submitting}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Transmitting..." : "Submit Grievance"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
