import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSchemeById } from "../../services/schemeApi";
import { STATUTORY_SCHEMES } from "../../data/statutorySchemes";
import { evaluateScheme } from "../../services/matchingApi";
import { getSchemeDocumentChecklist } from "../../services/documentApi";
import { getApplications, createApplication } from "../../services/applicationApi";
import { getProfile } from "../../services/profileApi";
import { getSchemeReadiness } from "../../services/readinessApi";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  Sparkles,
  AlertTriangle,
  XCircle,
  FileText,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Check,
  Layers,
  FileQuestion,
  FileCode
} from "lucide-react";
import PersonalizedActionPlan from "../../components/dashboard/PersonalizedActionPlan";
import ReportSchemeModal from "../../components/schemes/ReportSchemeModal";
import ErrorState from "../../components/common/ErrorState";
import { Skeleton } from "../../components/common/Skeleton";

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Matching evaluation state (for authenticated users)
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalError, setEvalError] = useState(null);

  // Document checklist state (for authenticated users)
  const [checklist, setChecklist] = useState(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  // Application Tracking state (for authenticated users)
  const [trackingApp, setTrackingApp] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Profile & Readiness state
  const [profileData, setProfileData] = useState(null);
  const [readinessData, setReadinessData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSchemeById(id);
        const data = res?.data?.scheme || res?.scheme || res?.data;
        if (data) {
          setScheme(data);
        } else {
          const fallback = STATUTORY_SCHEMES.find((s) => s._id === id || s.id === id);
          if (fallback) setScheme(fallback);
          else setError("Scheme details not found in current catalog.");
        }
      } catch (err) {
        const fallback = STATUTORY_SCHEMES.find((s) => s._id === id || s.id === id);
        if (fallback) {
          setScheme(fallback);
        } else {
          setError(err.message || "Failed to load scheme details.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchChecklist = async () => {
      if (!isAuthenticated) return;
      setLoadingChecklist(true);
      try {
        const res = await getSchemeDocumentChecklist(id);
        if (res?.success) {
          setChecklist(res);
        }
      } catch (err) {
        console.warn("Could not load document checklist:", err.message);
      } finally {
        setLoadingChecklist(false);
      }
    };

    const fetchTracking = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await getApplications();
        const list = res?.data?.applications || res?.applications || res?.data || [];
        if (Array.isArray(list)) {
          const found = list.find(
            (a) => (a.schemeId?._id || a.schemeId) === id
          );
          if (found) setTrackingApp(found);
        }
      } catch (err) {
        console.warn("Could not load application tracker:", err.message);
      }
    };

    const fetchProfileAndReadiness = async () => {
      if (!isAuthenticated) return;
      try {
        const [profRes, readRes] = await Promise.allSettled([
          getProfile(),
          getSchemeReadiness(id),
        ]);
        if (profRes.status === "fulfilled") {
          const p = profRes.value?.data?.profile || profRes.value?.profile || profRes.value?.data;
          if (p) setProfileData(p);
        }
        if (readRes.status === "fulfilled") {
          const r = readRes.value?.data || readRes.value;
          if (r) {
            setReadinessData(r);
            if (r.readiness?.matchingConditions && !evaluation) {
              setEvaluation(r.readiness.matchingConditions);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load profile or readiness:", err.message);
      }
    };

    fetchDetails();
    fetchChecklist();
    fetchTracking();
    fetchProfileAndReadiness();
  }, [id, isAuthenticated]);

  const handleStartTracking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setTrackingLoading(true);
    try {
      const res = await createApplication({ schemeId: id });
      const newApp = res?.data?.application || res?.application || res?.data;
      if (newApp) {
        setTrackingApp(newApp);
        navigate(`/dashboard/applications/${newApp._id || newApp.id}`);
      }
    } catch (err) {
      console.error("Failed to start tracking application:", err);
      const existing = err.data?.data?.application || err.data?.application;
      if (existing?._id) {
        setTrackingApp(existing);
        navigate(`/dashboard/applications/${existing._id}`);
      }
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCheckMatch = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setEvaluating(true);
    setEvalError(null);
    try {
      const res = await evaluateScheme(id);
      const evalData = res?.data?.evaluation || res?.data || res?.evaluation || res;
      setEvaluation(evalData);
    } catch (err) {
      setEvalError(err.message || "Unable to evaluate match against profile.");
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8faf8] min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        <Skeleton animationType="shimmer" className="h-6 w-36 bg-[#e2ede5] rounded-md" />
        <div className="bg-white rounded-3xl border border-[#c6decb] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton animationType="shimmer" className="h-6 w-28 bg-[#e2ede5] rounded-full" />
            <Skeleton animationType="shimmer" className="h-6 w-24 bg-[#e2ede5] rounded-full" />
          </div>
          <Skeleton animationType="shimmer" className="h-8 w-3/4 bg-[#e2ede5] rounded-lg" />
          <Skeleton animationType="shimmer" className="h-4 w-1/2 bg-[#e2ede5] rounded-md" />
          <Skeleton animationType="shimmer" className="h-28 w-full bg-[#eef5f0] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ErrorState
          title="Scheme Not Located"
          message="The requested welfare scheme could not be found or may have been updated in the gazette."
          error={error}
          showHome={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf8] text-slate-900 min-h-screen py-6 px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="w-full space-y-6">

        {/* ======================================================== */}
        {/* 1. TOP BREADCRUMB & METADATA STRIP (Section 20)           */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <Link
            to={isAuthenticated ? "/dashboard/schemes" : "/browse-schemes"}
            className="inline-flex items-center font-black text-slate-600 hover:text-[#234731] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to {isAuthenticated ? "Dashboard Schemes" : "Browse Schemes"}</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
              <span>Report Scheme / Grievance</span>
            </button>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-[#ebf3ed] text-[#234731] border border-[#c8ded0]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Verified Official Data
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SCHEME DETAILS HERO CARD (Section 21)                  */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hero Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#ebf3ed] text-[#234731] border border-[#c8ded0] uppercase tracking-wide">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                  {scheme.state}
                </span>
                {(scheme.applicationDeadline || scheme.deadline) && (
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 inline-flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-amber-700" />
                    Deadline: {new Date(scheme.applicationDeadline || scheme.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {scheme.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {scheme.shortDescription}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {scheme.officialApplicationUrl && (
                  <a
                    href={scheme.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#234731] hover:bg-[#183323] text-white text-xs sm:text-sm font-black shadow-xs transition"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={handleCheckMatch}
                    disabled={evaluating}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {evaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 text-slate-950" />
                        {evaluation ? "Re-Check Against My Profile" : "Check Against My Profile"}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-white text-[#234731] border-2 border-[#c8ded0] hover:border-[#234731] text-xs sm:text-sm font-black transition"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                    <span>Create Passport to Check Match</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Hero: Application Snapshot Card (Section 21) */}
            <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl p-5 border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                  Snapshot
                </span>
                <span className="text-[10px] font-black text-emerald-800 bg-[#ebf3ed] px-2 py-0.5 rounded-full border border-[#c8ded0] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Scheme</span>
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Application Method:</span>
                  <strong className="text-slate-900 uppercase">{scheme.applicationMethod || "ONLINE"}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Required Documents:</span>
                  <strong className="text-slate-900">{scheme.requiredDocuments?.length || 0} Certificates</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Applicable Geography:</span>
                  <strong className="text-slate-900">{scheme.state || "All-India"}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Issuing Authority:</span>
                  <strong className="text-slate-900 text-right truncate max-w-[180px]">{scheme.sourceName || "Official Ministry"}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                {scheme.officialApplicationUrl && (
                  <a
                    href={scheme.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-black text-xs inline-flex items-center justify-center transition"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-amber-600" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="w-full text-center py-2 px-3 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs inline-flex items-center justify-center transition cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                  <span>Report Inaccuracy or Fraud</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. DETERMINISTIC PROFILE EVALUATION RESULTS (When run)    */}
        {/* ======================================================== */}
        {isAuthenticated && evaluation && (
          <div className="bg-gradient-to-br from-[#112318] via-[#1a3524] to-[#234731] text-white p-6 sm:p-7 rounded-3xl border border-emerald-800/40 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                  Deterministic Profile Evaluation
                </span>
                <div className="mt-1">
                  {evaluation.classification === "MATCHED" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full font-black text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                      Matches Profile Criteria
                    </span>
                  )}
                  {evaluation.classification === "POTENTIAL_MATCH" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full font-black text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-400" />
                      Potential Match — Details Needed
                    </span>
                  )}
                  {evaluation.classification === "NOT_MATCHED" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <XCircle className="w-4 h-4 mr-1.5 text-rose-400" />
                      Criteria Not Met in Profile
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Match Score
                </span>
                <div className="text-2xl font-black text-white">
                  {evaluation.matchScore}
                  <span className="text-xs font-normal text-emerald-300">/100</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {evaluation.explanation?.summary}
            </p>

            {/* Why This Match Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <span className="font-black text-white block uppercase tracking-wider text-[11px]">
                Why this match?
              </span>

              {evaluation.explanation?.matchedReasons?.map((m, i) => (
                <div key={i} className="flex items-start space-x-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}

              {evaluation.explanation?.missingInformation?.map((m, i) => (
                <div key={i} className="flex items-start space-x-2 text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span>{m}</span>
                    <Link
                      to="/dashboard/benefit-passport"
                      className="text-amber-300 underline font-bold ml-1.5 hover:text-white"
                    >
                      Update Benefit Passport →
                    </Link>
                  </div>
                </div>
              ))}

              {evaluation.explanation?.failedConditions?.map((m, i) => (
                <div key={i} className="flex items-start space-x-2 text-rose-200">
                  <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-black/30 rounded-2xl text-[11px] text-slate-300 leading-relaxed border border-white/10 flex items-start space-x-2">
              <Info className="w-4 h-4 shrink-0 text-amber-300 mt-0.5" />
              <p>
                <strong>Informational profile match:</strong> This evaluation reflects how your saved Benefit Passport compares with published scheme rules. It does not constitute a legal government decision.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. ABOUT THIS SCHEME & BENEFITS (Section 22)             */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About This Scheme Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <FileText className="w-4 h-4 text-[#234731]" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                About This Scheme
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {scheme.fullDescription || scheme.shortDescription}
            </p>
            {scheme.targetAudience?.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  Target Beneficiaries
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.targetAudience.map((aud, i) => (
                    <span key={i} className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-900 border border-slate-200">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Benefits Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Official Benefits
              </h2>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
              {scheme.benefitSummary}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. ELIGIBILITY SECTION (Section 23)                      */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#234731]" />
              <h2 className="text-base font-black text-slate-900">
                Eligibility Criteria
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              Published Criteria Guidelines
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {scheme.eligibilitySummary}
          </p>

          {/* Structured Criteria Rules */}
          {scheme.rules && scheme.rules.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Structured Rules:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scheme.rules.map((rule, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">{rule.label}</span>
                      {rule.mandatory && (
                        <span className="ml-2 text-[10px] uppercase font-black text-[#234731] bg-[#ebf3ed] px-1.5 py-0.2 rounded border border-[#c8ded0]">
                          Mandatory
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 6. REQUIRED DOCUMENTS (Section 24)                       */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Required Documents
                </h2>
                <p className="text-[11px] text-slate-500">
                  Certificates required to prepare for official application submission
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <Link
                to={`/dashboard/readiness/${scheme._id}`}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black bg-[#ebf3ed] text-[#234731] border border-[#c8ded0] hover:bg-[#dceade] transition self-start sm:self-auto"
              >
                Check Application Readiness →
              </Link>
            )}
          </div>

          {/* Clean Document Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {scheme.requiredDocuments?.map((doc, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#234731] shrink-0" />
                    <span className="text-xs font-black text-slate-900">{doc.documentType}</span>
                  </div>
                  {doc.mandatory ? (
                    <span className="text-[10px] uppercase font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      Mandatory
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                {doc.guidance && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {doc.guidance}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-[#ebf3ed]/60 rounded-2xl border border-[#c8ded0] flex items-start space-x-2 text-[11px] text-slate-600">
            <Lock className="w-4 h-4 text-[#234731] shrink-0 mt-0.5" />
            <p>
              <strong>Personal Document Vault:</strong> Certificates are stored securely in your private vault through manual file uploads or supported DigiLocker statutory sync. Lok Samarth does not share documents with third parties.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. PERSONALIZED ACTION PLAN (Scheme se Application Tak)  */}
        {/* ======================================================== */}
        <section aria-label="Personalized Action Plan" className="w-full">
          <PersonalizedActionPlan
            scheme={scheme}
            user={user}
            profileData={profileData}
            readinessData={readinessData}
            evaluation={evaluation}
            onSaveApplication={handleStartTracking}
            isTracking={!!trackingApp}
            trackingLoading={trackingLoading}
          />
        </section>

        {/* ======================================================== */}
        {/* 8. OFFICIAL SOURCES (Section 26)                         */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
            <Building className="w-4 h-4 text-[#234731]" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Official Government Source
            </h2>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong className="text-slate-900">Source Authority:</strong> {scheme.sourceName || "Authorized Government Ministry"}
            </p>
            <p>
              <strong className="text-slate-900">Source Classification:</strong> {scheme.sourceType?.replace("_", " ") || "Government Gazette / Portal"}
            </p>
            <p>
              <strong className="text-slate-900">Last Verified:</strong>{" "}
              {scheme.sourceLastVerified ? new Date(scheme.sourceLastVerified).toLocaleDateString("en-IN") : "Verified"}
            </p>

            {scheme.officialSourceUrl && (
              <p className="pt-2">
                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#234731] hover:text-[#112318] font-black inline-flex items-center underline"
                >
                  <span>View Official Gazette / Notification Circular</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Citizen Fraud & Grievance Reporting Modal */}
        <ReportSchemeModal
          scheme={scheme}
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
        />

      </div>
    </div>
  );
}
