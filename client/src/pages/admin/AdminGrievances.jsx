import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  ExternalLink,
  Filter,
  Eye,
  Trash2,
  Clock,
  Sparkles,
  Search,
  Building,
  Flag
} from "lucide-react";
import { getSchemeReports, resolveSchemeReport } from "../../services/reportApi";
import { useAuth } from "../../hooks/useAuth";

export default function AdminGrievances() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, resolved: 0, delisted: 0 });
  const [statusFilter, setStatusFilter] = useState("PENDING_INVESTIGATION");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getSchemeReports(statusFilter);
      if (res?.success) {
        setReports(res.data.reports || []);
        if (res.data.counts) setCounts(res.data.counts);
      }
    } catch (err) {
      console.error("Failed to fetch grievance reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleResolve = async (reportId, action) => {
    const notes = window.prompt(
      `Enter investigation notes for action (${action}):`,
      action === "DELIST_SCHEME"
        ? "Confirmed fake portal/inaccurate claims. Delisted from citizen directory."
        : "Cross-verified against Gazette circular. Deemed authentic."
    );
    if (notes === null) return;

    setActionMessage(null);
    setActionError(null);
    try {
      const res = await resolveSchemeReport(reportId, {
        action,
        investigationNotes: notes,
      });
      if (res?.success) {
        setActionMessage(res.message);
        fetchReports();
      }
    } catch (err) {
      setActionError(err.message || "Failed to resolve report.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-950 to-purple-950 text-white p-6 rounded-3xl shadow-md border border-red-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
              {user?.role === "category_admin" ? `${user?.department} Fraud Watch` : "Apex Fraud Firewall"}
            </span>
            <span className="text-red-200 text-xs font-semibold">
              {user?.role === "category_admin" ? `Audit Queue for ${user?.department}` : "Citizen Grievance & Inaccuracy Audit Queue"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {user?.role === "category_admin"
              ? `${user?.department} Scheme Authenticity & Grievance Desk`
              : "Scheme Authenticity & Fraud Monitoring"}
          </h1>
          <p className="text-xs text-red-200 max-w-2xl leading-relaxed">
            {user?.role === "category_admin"
              ? `Review citizen reports regarding schemes under your ${user?.department} jurisdiction. Verify against official Gazette circulars and rectify inaccuracies.`
              : "Citizens can flag broken URLs, invalid requirements, or suspected fraudulent schemes. Chief Officer can delist fraudulent schemes or dismiss verified complaints."}
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition self-start md:self-auto shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Messages */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2.5 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e1f5] pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Report Status:
          </span>
          {[
            { id: "PENDING_INVESTIGATION", label: "Pending Audit", count: counts.pending },
            { id: "SCHEME_DELISTED", label: "Delisted / Frozen", count: counts.delisted },
            { id: "ALL", label: "All Reports", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                statusFilter === tab.id
                  ? "bg-[#2b0f4c] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-black">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <RefreshCw className="w-7 h-7 text-red-600 animate-spin mx-auto" />
          <p className="text-xs font-bold">Auditing Grievance Queue...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No Reports Found in this Queue
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All schemes in the directory are currently verified with zero unresolved grievances under this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => {
            const scheme = rep.schemeId;
            return (
              <div
                key={rep._id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center">
                        <Flag className="w-3 h-3 mr-1 text-red-600" />
                        {rep.reason.replace(/_/g, " ")}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.severity === "CRITICAL"
                            ? "bg-red-600 text-white"
                            : rep.severity === "HIGH"
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {rep.severity} SEVERITY
                      </span>

                      {scheme?.isFlagged && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                          ⚠️ AUTO-FLAGGED (Multiple Citizen Reports)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 mt-1">
                      Target Scheme: {rep.schemeName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reported by: <strong className="text-slate-700">{rep.reporterName || "Anonymous Citizen"}</strong>
                      {rep.reporterEmail && ` (${rep.reporterEmail})`} •{" "}
                      {new Date(rep.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase self-start ${
                      rep.status === "PENDING_INVESTIGATION"
                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                        : rep.status === "SCHEME_DELISTED"
                        ? "bg-rose-100 text-rose-900 border border-rose-200"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}
                  >
                    {rep.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Grievance description */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  "{rep.description}"
                </div>

                {/* Scheme Metadata if available */}
                {scheme && (
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 p-3 bg-purple-50/50 rounded-xl border border-purple-100 gap-2">
                    <div className="flex items-center space-x-3">
                      <span><strong>Category:</strong> {scheme.category}</span>
                      <span><strong>Geography:</strong> {scheme.state}</span>
                      <span><strong>Current Status:</strong> {scheme.verificationStatus}</span>
                    </div>

                    {scheme.officialApplicationUrl && (
                      <a
                        href={scheme.officialApplicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#591d8f] hover:text-[#2b0f4c] font-bold inline-flex items-center underline"
                      >
                        <span>Check Portal Link</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {rep.status === "PENDING_INVESTIGATION" && (
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => handleResolve(rep._id, "VERIFIED_VALID")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                    >
                      Dismiss & Verify Authentic ✓
                    </button>

                    <button
                      onClick={() => handleResolve(rep._id, "DELIST_SCHEME")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delist & Freeze Fraudulent Scheme</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
