import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { getApplications } from "../../services/applicationApi";
import {
  Briefcase,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function Applications() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = statusFilter !== "ALL" ? { status: statusFilter } : {};
      const res = await getApplications(params);
      setApplications(res.data?.data?.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setError(err.message || "Failed to load application trackers.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "INTERESTED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Interested</span>;
      case "PREPARING":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Preparing Docs</span>;
      case "READY_TO_APPLY":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Ready to Apply</span>;
      case "APPLIED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Applied (Citizen)</span>;
      case "FOLLOW_UP":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">Follow Up</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getDeadlineBadge = (evaluation) => {
    if (!evaluation || !evaluation.hasDeadline) {
      return (
        <span className="text-xs text-slate-500 flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
          No Fixed Deadline
        </span>
      );
    }

    if (evaluation.isExpired) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
          Deadline Passed ({evaluation.formattedDate})
        </span>
      );
    }

    if (evaluation.daysRemaining === 0) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1 text-red-600" />
          Deadline Today! ({evaluation.formattedDate})
        </span>
      );
    }

    if (evaluation.daysRemaining <= 3) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1 text-red-600" />
          {evaluation.daysRemaining} days left ({evaluation.formattedDate})
        </span>
      );
    }

    if (evaluation.daysRemaining <= 15) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
          {evaluation.daysRemaining} days left ({evaluation.formattedDate})
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
        <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
        {evaluation.formattedDate} ({evaluation.daysRemaining} days)
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f5fa] flex flex-col text-[#0f172a]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* GovTech Hero Banner */}
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2a0e4f] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#591d8f]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/50 text-xs font-bold text-[#ffedd5]">
                <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                <span>{t("applicationsTitle", "Applications & DBT Tracker")}</span>
                <span>•</span>
                <span>Live Government Timeline</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
                <Briefcase className="w-7 h-7 mr-2.5 text-[#fb923c]" />
                {t("applicationsTitle", "My Application Tracker")}
              </h1>
              <p className="text-[#e2e8f0] text-sm font-medium leading-relaxed max-w-2xl">
                {t("applicationsSub", "Organize your benefit applications, monitor upcoming government deadlines, track next preparation steps, and navigate to authorized official application portals.")}
              </p>
            </div>

            <Link
              to="/browse-schemes"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Track New Scheme
            </Link>
          </div>

          {/* Civic Boundary Disclaimer Notice */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#140628]/80 border border-[#591d8f]/50 text-[#cbd5e1] text-xs flex items-start space-x-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-[#fb923c] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Citizen-Side Application Progress Tool: </span>
              <span>
                This tracker helps you stay organized. Marking an application as "Applied" records your personal submission notes. HAQ DWAAR AI does not submit or manage official government application records.
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {["ALL", "INTERESTED", "PREPARING", "READY_TO_APPLY", "APPLIED", "FOLLOW_UP", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                statusFilter === tab
                  ? "bg-[#240b49] text-white font-black shadow-md ring-2 ring-[#591d8f]/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab === "ALL" ? t("allMatches", "All Tracked") : tab.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="mt-12 text-center py-12 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading your tracked applications...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="mt-8 text-center py-16 bg-white rounded-2xl border border-slate-200 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No applications tracked yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Explore government benefits in the Scheme Registry or view your personalized recommendations to start tracking.
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <Link
                to="/browse-schemes"
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition"
              >
                Browse Schemes
              </Link>
              <Link
                to="/dashboard/recommendations"
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                View Recommendations
              </Link>
            </div>
          </div>
        )}

        {/* Applications List */}
        {!loading && applications.length > 0 && (
          <div className="mt-6 space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {app.schemeId?.category || "General"}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                    <Link
                      to={`/dashboard/applications/${app._id}`}
                      className="text-base font-extrabold text-slate-900 hover:text-blue-700 transition block"
                    >
                      {app.schemeId?.name || "Unknown Scheme"}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getDeadlineBadge(app.deadlineEvaluation)}
                  </div>
                </div>

                {/* Next Action Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Next Recommended Step:</span>
                    <span className="text-slate-600">{app.nextAction}</span>
                  </div>

                  {app.referenceNumber && (
                    <div className="sm:text-right">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Ref / Ack No:</span>
                      <span className="font-mono font-bold text-slate-800">{app.referenceNumber}</span>
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-500">
                    Last updated: {new Date(app.lastUpdatedAt || app.updatedAt).toLocaleDateString("en-IN")}
                  </div>

                  <div className="flex items-center space-x-2">
                    {app.schemeId?._id && (
                      <Link
                        to={`/dashboard/readiness/${app.schemeId._id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                        Check Readiness
                      </Link>
                    )}

                    <Link
                      to={`/dashboard/applications/${app._id}`}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-[#240b49] hover:bg-[#1e0a3c] text-white shadow-sm transition-all"
                    >
                      View Tracker Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
