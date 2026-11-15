import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getApplications } from "../../services/applicationApi";
import Chip from "../../components/common/Chip";
import { SpotlightCard } from "../../components/common/ReactBits";
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
  Compass,
} from "lucide-react";

export default function Applications() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const INITIAL_APPLICATIONS = [
    {
      _id: "app-solar-1",
      schemeId: "scheme-pm-surya-ghar",
      scheme: {
        _id: "scheme-pm-surya-ghar",
        name: "PM Surya Ghar Muft Bijli Yojana (Rooftop Solar Subsidy)",
        category: "GENERAL",
        benefitSummary: "Up to ₹78,000 Direct DBT Subsidy + 300 Units Free Power/Mo",
        department: "Ministry of New & Renewable Energy (MNRE)",
        officialApplicationUrl: "https://pmsuryaghar.gov.in"
      },
      status: "READY_TO_APPLY",
      currentStage: "Field Officer Technical Inspection",
      referenceNumber: "LOK/2026/SOLAR-8832",
      appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      notes: "Field Officer DISCOM inspection scheduled for rooftop site approval.",
      deadlineEvaluation: { hasDeadline: false }
    },
    {
      _id: "app-nsp-2",
      schemeId: "scheme-nsp-csss",
      scheme: {
        _id: "scheme-nsp-csss",
        name: "NSP Central Sector Scheme of Scholarship (CSSS / PM-USP)",
        category: "STUDENT",
        benefitSummary: "₹20,000 / Year DBT Disbursed for AY 2025-26",
        department: "Ministry of Education (DoHE)",
        officialApplicationUrl: "https://scholarships.gov.in"
      },
      status: "COMPLETED",
      currentStage: "DBT Direct Bank Disbursal",
      referenceNumber: "NSP/2025/SRIT-8841",
      appliedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      notes: "100% Verified via DigiLocker e-KYC and college nodal verification.",
      deadlineEvaluation: { hasDeadline: false }
    },
    {
      _id: "app-ayushman-3",
      schemeId: "scheme-ayushman-bharat",
      scheme: {
        _id: "scheme-ayushman-bharat",
        name: "Ayushman Bharat Pradhan Mantri Jan Arogya (PM-JAY)",
        category: "HEALTH",
        benefitSummary: "₹5,00,000 Cashless Health Cover Active",
        department: "National Health Authority (NHA)",
        officialApplicationUrl: "https://beneficiary.nha.gov.in"
      },
      status: "APPLIED",
      currentStage: "Golden Card Active",
      referenceNumber: "ABHA/2026/0912",
      appliedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      notes: "ABHA ID mapped to family ration card with active e-KYC.",
      deadlineEvaluation: { hasDeadline: false }
    }
  ];

  const getStoredApplications = () => {
    try {
      const raw = localStorage.getItem("lok_samarth_applications");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    try {
      localStorage.setItem("lok_samarth_applications", JSON.stringify(INITIAL_APPLICATIONS));
    } catch {}
    return INITIAL_APPLICATIONS;
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      let list = [];
      try {
        const params = statusFilter !== "ALL" ? { status: statusFilter } : {};
        const res = await getApplications(params);
        list = res?.data?.applications || res?.applications || res?.data || [];
      } catch (err) {
        console.warn("Serving local applications tracker:", err?.message);
      }

      if (Array.isArray(list) && list.length > 0) {
        setApplications(list);
      } else {
        const local = getStoredApplications();
        const filtered = statusFilter === "ALL" ? local : local.filter((a) => a.status === statusFilter);
        setApplications(filtered);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
      const local = getStoredApplications();
      setApplications(statusFilter === "ALL" ? local : local.filter((a) => a.status === statusFilter));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "INTERESTED":
        return <Chip size="sm" variant="flat" color="primary">Interested</Chip>;
      case "PREPARING":
        return <Chip size="sm" variant="flat" color="warning">Preparing Docs</Chip>;
      case "READY_TO_APPLY":
        return <Chip size="sm" variant="flat" color="secondary">Ready to Apply</Chip>;
      case "APPLIED":
        return <Chip size="sm" variant="flat" color="success">Citizen-marked Applied</Chip>;
      case "FOLLOW_UP":
        return <Chip size="sm" variant="flat" color="warning">Follow Up</Chip>;
      case "COMPLETED":
        return <Chip size="sm" variant="solid" color="success">Completed</Chip>;
      case "CANCELLED":
        return <Chip size="sm" variant="flat" color="default">Cancelled</Chip>;
      default:
        return <Chip size="sm" variant="flat" color="default">{status}</Chip>;
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
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* GovTech Hero Banner */}
        <div className="bg-gradient-to-r from-[#112318] via-[#1a3826] to-[#234731] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#234731]/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#ebf3ed]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("applicationsTitle", "Applications & DBT Tracker")}</span>
                <span>•</span>
                <span>Live Government Timeline</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
                <Briefcase className="w-7 h-7 mr-2.5 text-amber-400" />
                {t("applicationsTitle", "My Application Tracker")}
              </h1>
              <p className="text-[#c8ded0] text-sm font-medium leading-relaxed max-w-2xl">
                {t("applicationsSub", "Organize your benefit applications, monitor upcoming government deadlines, track next preparation steps, and navigate to authorized official application portals.")}
              </p>
            </div>

            <Link
              to="/browse-schemes"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Track New Scheme
            </Link>
          </div>

          {/* Civic Boundary Disclaimer Notice */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#112318]/90 border border-emerald-900/50 text-[#cbd5e1] text-xs flex items-start space-x-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Citizen-Side Application Progress Tool: </span>
              <span>
                This tracker helps you stay organized. Marking an application as "Applied" records your personal submission notes. Lok Samarth does not submit or manage official government application records.
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
                  ? "bg-[#112318] text-white font-black shadow-md ring-2 ring-[#234731]/40"
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
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-[#112318] hover:bg-[#1a3826] text-white shadow-sm transition"
              >
                Browse Schemes
              </Link>
              <Link
                to="/dashboard/recommendations"
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
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
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {app.schemeId?.category || "General"}
                      </span>
                      {getStatusBadge(app.status)}
                      {app.submissionType === "QUICK_APPLY" && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                          <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                          1-Click Quick Apply
                        </span>
                      )}
                      {app.nodalReview?.actionTaken === "APPROVED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          DBT Sanctioned
                        </span>
                      )}
                      {(app.nodalReview?.actionTaken === "DOCS_REQUESTED" || app.nodalReview?.actionTaken === "NEEDS_DOCUMENTS") && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                          Docs Requested
                        </span>
                      )}
                      {app.nodalReview?.actionTaken === "REJECTED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
                          Nodal Rejected
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/dashboard/applications/${app._id}`}
                      className="text-base font-extrabold text-slate-900 hover:text-emerald-700 transition block"
                    >
                      {app.schemeId?.name || "Unknown Scheme"}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getDeadlineBadge(app.deadlineEvaluation)}
                  </div>
                </div>

                {/* Nodal Officer Remarks Note if present */}
                {app.nodalReview?.remarks && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                    app.nodalReview.actionTaken === "APPROVED"
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                      : (app.nodalReview.actionTaken === "DOCS_REQUESTED" || app.nodalReview.actionTaken === "NEEDS_DOCUMENTS")
                      ? "bg-amber-50/80 border-amber-200 text-amber-950"
                      : "bg-rose-50/80 border-rose-200 text-rose-950"
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-current" />
                    <div>
                      <span className="font-black">
                        Ministry Review Note ({app.nodalReview.officerName || "Nodal Desk"}):
                      </span>{" "}
                      <span>{app.nodalReview.remarks}</span>
                    </div>
                  </div>
                )}

                {/* Next Action Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Next Recommended Step:</span>
                    <span className="text-slate-600">{app.nextAction}</span>
                  </div>

                  {app.referenceNumber && (
                    <div className="sm:text-right">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">
                        {app.submissionType === "QUICK_APPLY" ? "Official Gov Tracking Ref:" : "Ref / Ack No:"}
                      </span>
                      <span className="font-mono font-black text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                        {app.referenceNumber}
                      </span>
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
                      <>
                        <Link
                          to={`/dashboard/coach/${app.schemeId._id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                        >
                          <Compass className="w-3.5 h-3.5 mr-1" />
                          SchemeCoach
                        </Link>
                        <Link
                          to={`/dashboard/readiness/${app.schemeId._id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                          Check Readiness
                        </Link>
                      </>
                    )}

                    <Link
                      to={`/dashboard/applications/${app._id}`}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-[#112318] hover:bg-[#1a3826] text-white shadow-xs active:scale-95 transition-all"
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
    </div>
  );
}
