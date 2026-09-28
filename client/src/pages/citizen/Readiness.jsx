import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSchemeReadiness } from "../../services/readinessApi";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  XCircle,
  FileText,
  ArrowRight,
  Info,
  Clock,
  UploadCloud,
  Check,
  AlertCircle,
  Shield,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function Readiness() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchReadiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSchemeReadiness(schemeId);
      setData(res?.data);
    } catch (err) {
      console.error("Failed to load readiness data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load application readiness details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schemeId) {
      fetchReadiness();
    }
  }, [schemeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 font-medium text-sm">
            Evaluating document health, profile completeness, and action readiness...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Readiness Evaluation Unavailable</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {error || "The requested scheme could not be evaluated or is currently under review."}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/dashboard/schemes"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schemes
            </Link>
            <button
              onClick={fetchReadiness}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { scheme, readiness, actionPlan } = data;
  const { readinessScore, label, breakdown, documents, profileFields, matchingConditions } = readiness;

  // Filter actions
  const filteredActions = (actionPlan || []).filter((act) => {
    if (priorityFilter === "ALL") return true;
    return act.priority === priorityFilter;
  });

  // Color scheme based on readiness label
  const getScoreTheme = (score, lbl) => {
    if (score >= 80) {
      return {
        badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
        ringColor: "text-emerald-600",
        barColor: "bg-emerald-600",
        textColor: "text-emerald-700",
        border: "border-emerald-200",
        bgLight: "bg-emerald-50/60",
      };
    }
    if (score >= 50) {
      return {
        badgeBg: "bg-amber-500/10 text-amber-700 border-amber-500/30",
        ringColor: "text-amber-500",
        barColor: "bg-amber-500",
        textColor: "text-amber-700",
        border: "border-amber-200",
        bgLight: "bg-amber-50/60",
      };
    }
    return {
      badgeBg: "bg-rose-500/10 text-rose-700 border-rose-500/30",
      ringColor: "text-rose-600",
      barColor: "bg-rose-600",
      textColor: "text-rose-700",
      border: "border-rose-200",
      bgLight: "bg-rose-50/60",
    };
  };

  const theme = getScoreTheme(readinessScore, label);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to={`/dashboard/schemes/${scheme.id}`}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Scheme Overview
          </Link>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Verified Scheme Data
            </span>
          </div>
        </div>

        {/* Scheme Header Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              {scheme.level === "Central" ? "Central Scheme" : `State: ${scheme.state || "State"}`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
              {scheme.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {scheme.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-slate-400" />
            {scheme.department}
          </p>
          {scheme.benefitsSummary && (
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong>Key Benefit:</strong> {scheme.benefitsSummary}
            </p>
          )}
        </div>

        {/* ======================================================== */}
        {/* APPLICATION PREPARATION READINESS SCORE BANNER           */}
        {/* ======================================================== */}
        <div className={`p-6 sm:p-8 rounded-2xl border ${theme.border} ${theme.bgLight} shadow-sm space-y-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Score & Gauge */}
            <div className="flex items-center space-x-6">
              <div className="relative w-28 h-28 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200 flex-shrink-0">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={theme.ringColor}
                    strokeDasharray={`${readinessScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {readinessScore}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">/ 100</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Application Preparation Readiness
                </span>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border bg-white shadow-2xs">
                  <span className={`w-2 h-2 rounded-full mr-2 ${theme.barColor}`} />
                  <span className={theme.textColor}>{label}</span>
                </div>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed pt-1">
                  Measures your preparedness across required documents, passport profile details, and official gateway actionability.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
              <Link
                to="/dashboard/documents"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition"
              >
                <UploadCloud className="w-3.5 h-3.5 mr-2 text-blue-600" />
                Upload Documents
              </Link>
              <Link
                to="/dashboard/benefit-passport"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition"
              >
                <FileText className="w-3.5 h-3.5 mr-2 text-blue-600" />
                Update Benefit Passport
              </Link>
            </div>
          </div>

          {/* 3 Component Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* 1. Required Documents */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <FileCheck2 className="w-4 h-4 mr-1.5 text-blue-600" />
                  Required Documents
                </span>
                <span className="font-extrabold text-slate-900">
                  {breakdown.documents.score} <span className="text-slate-400 font-normal">/ {breakdown.documents.maxScore}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(breakdown.documents.score / breakdown.documents.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {breakdown.documents.summary}
              </p>
            </div>

            {/* 2. Profile Information */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Profile Information
                </span>
                <span className="font-extrabold text-slate-900">
                  {breakdown.profile.score} <span className="text-slate-400 font-normal">/ {breakdown.profile.maxScore}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(breakdown.profile.score / breakdown.profile.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {breakdown.profile.summary}
              </p>
            </div>

            {/* 3. Action Readiness */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Action Readiness
                </span>
                <span className="font-extrabold text-slate-900">
                  {breakdown.action.score} <span className="text-slate-400 font-normal">/ {breakdown.action.maxScore}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(breakdown.action.score / breakdown.action.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {breakdown.action.summary}
              </p>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* REQUIRED DOCUMENTS READINESS CHECKLIST                   */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                Required Documents Checklist
              </h2>
              <p className="text-xs text-slate-500">
                Verified against your Personal Document Vault and extracted health status.
              </p>
            </div>
            <Link
              to="/dashboard/documents"
              className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
            >
              Open Document Vault →
            </Link>
          </div>

          {documents.evaluation.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No specific documents are declared as mandatory for this scheme.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.evaluation.map((doc, idx) => {
                const isMandatory = doc.mandatory;
                const status = doc.status;

                let badge = {
                  bg: "bg-slate-100 text-slate-700 border-slate-200",
                  icon: <AlertCircle className="w-3.5 h-3.5" />,
                  label: "Not Uploaded",
                };

                if (status === "VALID") {
                  badge = {
                    bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
                    label: "Ready & Valid",
                  };
                } else if (status === "NEEDS_VERIFICATION") {
                  badge = {
                    bg: "bg-amber-100 text-amber-800 border-amber-200",
                    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                    label: "Needs Verification",
                  };
                } else if (status === "INCOMPLETE") {
                  badge = {
                    bg: "bg-orange-100 text-orange-800 border-orange-200",
                    icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
                    label: "Incomplete Data",
                  };
                } else if (status === "EXPIRED") {
                  badge = {
                    bg: "bg-rose-100 text-rose-800 border-rose-200",
                    icon: <Clock className="w-3.5 h-3.5 text-rose-600" />,
                    label: "Expired",
                  };
                }

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {doc.requiredDocumentType}
                        </span>
                        {isMandatory ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Mandatory
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Optional
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border space-x-1.5 ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>

                    {doc.guidance && (
                      <p className="text-[11px] text-slate-600 leading-snug">
                        <strong>Guidance:</strong> {doc.guidance}
                      </p>
                    )}

                    {doc.userDocument ? (
                      <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            Matched File: {doc.userDocument.originalFileName}
                          </span>
                          {doc.userDocument.maskedDocumentNumber && (
                            <span className="text-slate-500 block">
                              Doc Number: {doc.userDocument.maskedDocumentNumber}
                            </span>
                          )}
                          {doc.userDocument.issuesDetected?.length > 0 && (
                            <span className="text-amber-700 block">
                              Notice: {doc.userDocument.issuesDetected.join(", ")}
                            </span>
                          )}
                        </div>
                        <Link
                          to="/dashboard/documents"
                          className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline"
                        >
                          Manage in Vault →
                        </Link>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                        <span>No certificate of this type found in your Document Vault.</span>
                        <Link
                          to="/dashboard/documents"
                          className="text-xs font-bold text-blue-700 hover:text-blue-800 underline"
                        >
                          Upload Now →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SCHEME PROFILE MATCH CONDITIONS (PROMINENTLY SEPARATED) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Scheme Profile Match Conditions
              </h2>
              <p className="text-xs text-slate-500">
                Independent profile criteria matching from Phase 5 (does not deduct preparation readiness points).
              </p>
            </div>
            
            <div>
              {matchingConditions.classification === "MATCHED" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-xs bg-emerald-500/20 text-emerald-800 border border-emerald-400">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Profile Meets Criteria
                </span>
              )}
              {matchingConditions.classification === "POTENTIAL_MATCH" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-xs bg-amber-500/20 text-amber-800 border border-amber-400">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
                  Potential Match — Needs Info
                </span>
              )}
              {matchingConditions.classification === "NOT_MATCHED" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-xs bg-rose-500/20 text-rose-800 border border-rose-400">
                  <XCircle className="w-4 h-4 mr-1.5 text-rose-600" />
                  Criteria Not Met
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl text-xs text-blue-900 leading-relaxed border border-blue-200 flex items-start space-x-2">
            <Info className="w-4 h-4 flex-shrink-0 text-blue-600 mt-0.5" />
            <p>
              <strong>Matching vs. Preparation Readiness:</strong> The readiness score measures your documents and paperwork preparation. Profile matching conditions reflect whether your demographic, income, or category details match the published rules. An unsatisfied rule generates an advisory item in your action plan, but does not penalize your preparation score.
            </p>
          </div>

          {/* Rule Breakdown List */}
          {matchingConditions.ruleResults && matchingConditions.ruleResults.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {matchingConditions.ruleResults.map((r, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block">
                      {r.label || r.rule?.label || r.fieldPath || r.rule?.fieldPath || "Requirement"}
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {r.explanation || "Evaluated against saved Benefit Passport data"}
                    </p>
                  </div>
                  <div>
                    {r.status === "PASS" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        PASS
                      </span>
                    )}
                    {r.status === "MISSING" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        MISSING
                      </span>
                    )}
                    {r.status === "FAIL" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        UNSATISFIED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-2">
              No specific automated profile matching rules are defined for this scheme.
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <Link
              to="/dashboard/benefit-passport"
              className="inline-flex items-center text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline"
            >
              Update Benefit Passport Details →
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PERSONAL ACTION PLAN                                     */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Personal Action Plan
              </h2>
              <p className="text-xs text-slate-500">
                Prioritized, deterministic next steps to reach full application readiness.
              </p>
            </div>

            {/* Priority Filter Chips */}
            <div className="flex items-center space-x-1.5 text-xs">
              {["ALL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setPriorityFilter(lvl)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    priorityFilter === lvl
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {filteredActions.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">
                No pending actions found for this filter.
              </p>
              <p className="text-[11px] text-slate-500">
                Your preparation requirements for this priority level are complete!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActions.map((action) => {
                const isHigh = action.priority === "HIGH";
                const isMed = action.priority === "MEDIUM";
                const isExternal = action.actionUrl && action.actionUrl.startsWith("http");

                return (
                  <div
                    key={action.id}
                    className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isHigh
                        ? "bg-rose-50/40 border-rose-200"
                        : isMed
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-slate-50/60 border-slate-200"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isHigh
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : isMed
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-slate-200 text-slate-700 border border-slate-300"
                          }`}
                        >
                          {action.priority} Priority
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-600 border border-slate-200">
                          {action.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {action.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    {action.actionLabel && action.actionUrl && (
                      <div className="flex-shrink-0">
                        {isExternal ? (
                          <a
                            href={action.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition whitespace-nowrap"
                          >
                            {action.actionLabel}
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </a>
                        ) : (
                          <Link
                            to={action.actionUrl}
                            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition whitespace-nowrap"
                          >
                            {action.actionLabel}
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* OFFICIAL APPLICATION GATEWAY                             */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                Official Government Gateway
              </span>
              <h3 className="text-lg font-bold text-white">
                Ready to Submit Your Official Application?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                HAQ DWAAR AI is an application preparation assistant. Formal scheme applications must be submitted directly through the authorized government portal.
              </p>
            </div>

            <div className="flex-shrink-0">
              {scheme.officialApplicationUrl ? (
                <a
                  href={scheme.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition whitespace-nowrap"
                >
                  Open Official Application Portal
                  <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </a>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-slate-300 border border-white/20">
                  Official link not available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CIVIC DISCLAIMER                                         */}
        {/* ======================================================== */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-1">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-700" />
            Civic Transparency & Legal Notice
          </p>
          <p>
            {readiness.disclaimer}
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
