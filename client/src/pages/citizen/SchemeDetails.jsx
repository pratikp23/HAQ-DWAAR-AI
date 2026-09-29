import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSchemeById } from "../../services/schemeApi";
import { evaluateScheme } from "../../services/matchingApi";
import { getSchemeDocumentChecklist } from "../../services/documentApi";
import { getApplications, createApplication } from "../../services/applicationApi";
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

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSchemeById(id);
        setScheme(res?.data?.scheme);
      } catch (err) {
        setError(err.message || "Failed to load scheme details.");
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
        if (res?.data) {
          const found = res.data.find(
            (a) => (a.schemeId?._id || a.schemeId) === id
          );
          if (found) setTrackingApp(found);
        }
      } catch (err) {
        console.warn("Could not load application tracker:", err.message);
      }
    };

    fetchDetails();
    fetchChecklist();
    fetchTracking();
  }, [id, isAuthenticated]);

  const handleStartTracking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setTrackingLoading(true);
    try {
      const res = await createApplication({ schemeId: id });
      if (res?.data) {
        setTrackingApp(res.data);
        navigate(`/dashboard/applications/${res.data._id}`);
      }
    } catch (err) {
      console.error("Failed to start tracking application:", err);
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
      if (res?.data) {
        setEvaluation(res.data);
      }
    } catch (err) {
      setEvalError(err.message || "Unable to evaluate match against profile.");
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3 text-[#4b5563]">
        <RefreshCw className="w-8 h-8 text-[#ea580c] animate-spin" />
        <p className="text-xs font-black">Loading verified scheme specifications...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-black text-[#0f172a]">Scheme Specifications Unavailable</h2>
          <p className="text-xs text-[#4b5563] leading-relaxed">
            {error || "The requested government scheme could not be found or has not yet been verified."}
          </p>
          <Link
            to="/browse-schemes"
            className="inline-flex items-center text-xs font-black text-[#591d8f] hover:text-[#2b0f4c] underline"
          >
            ← Back to Scheme Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f5fa] text-[#0f172a] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ======================================================== */}
        {/* 1. TOP BREADCRUMB & METADATA STRIP (Section 20)           */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <Link
            to={isAuthenticated ? "/dashboard/schemes" : "/browse-schemes"}
            className="inline-flex items-center font-black text-[#4b5563] hover:text-[#2b0f4c] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to {isAuthenticated ? "Dashboard Schemes" : "Browse Schemes"}</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Verified Official Data
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SCHEME DETAILS HERO CARD (Section 21)                  */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e1f5] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hero Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-purple-50 text-[#2b0f4c] border border-purple-200 uppercase tracking-wide">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#fbf9fe] text-[#4b5563] border border-[#e9e1f5]">
                  {scheme.state}
                </span>
                {(scheme.applicationDeadline || scheme.deadline) && (
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 inline-flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-amber-700" />
                    Deadline: {new Date(scheme.applicationDeadline || scheme.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">
                {scheme.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed font-medium">
                {scheme.shortDescription}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {scheme.officialApplicationUrl && (
                  <a
                    href={scheme.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-black shadow-xs transition"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={handleCheckMatch}
                    disabled={evaluating}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white text-xs sm:text-sm font-black shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {evaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                        {evaluation ? "Re-Check Against My Profile" : "Check Against My Profile"}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-white text-[#2b0f4c] border-2 border-[#e9e1f5] hover:border-[#2b0f4c] text-xs sm:text-sm font-black transition"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-[#ea580c]" />
                    <span>Create Passport to Check Match</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Hero: Application Snapshot Card (Section 21) */}
            <div className="lg:col-span-5 bg-[#fbf9fe] rounded-2xl p-5 border border-[#e9e1f5] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e9e1f5]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c]">
                  Snapshot
                </span>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified ✓
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-[#4b5563]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Application Method:</span>
                  <strong className="text-[#0f172a] uppercase">{scheme.applicationMethod || "ONLINE"}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Required Documents:</span>
                  <strong className="text-[#0f172a]">{scheme.requiredDocuments?.length || 0} Certificates</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Applicable Geography:</span>
                  <strong className="text-[#0f172a]">{scheme.state || "All-India"}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Issuing Authority:</span>
                  <strong className="text-[#0f172a] text-right truncate max-w-[180px]">{scheme.sourceName || "Official Ministry"}</strong>
                </div>
              </div>

              {scheme.officialApplicationUrl && (
                <div className="pt-2 border-t border-[#e9e1f5]">
                  <a
                    href={scheme.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0f172a] border border-[#e9e1f5] font-black text-xs inline-flex items-center justify-center transition"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-[#ea580c]" />
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. DETERMINISTIC PROFILE EVALUATION RESULTS (When run)    */}
        {/* ======================================================== */}
        {isAuthenticated && evaluation && (
          <div className="bg-gradient-to-br from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white p-6 sm:p-7 rounded-3xl border border-[#591d8f]/30 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#fb923c] block">
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
                <span className="text-[10px] uppercase font-bold text-purple-200 block">
                  Match Score
                </span>
                <div className="text-2xl font-black text-white">
                  {evaluation.matchScore}
                  <span className="text-xs font-normal text-purple-300">/100</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
              {evaluation.explanation?.summary}
            </p>

            {/* Why This Match Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <span className="font-black text-white block uppercase tracking-wider text-[11px]">
                Why this match?
              </span>

              {evaluation.explanation?.matchedReasons?.map((m, i) => (
                <div key={i} className="flex items-start space-x-2 text-purple-100">
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

            <div className="p-3 bg-black/30 rounded-2xl text-[11px] text-purple-200 leading-relaxed border border-white/10 flex items-start space-x-2">
              <Info className="w-4 h-4 shrink-0 text-purple-300 mt-0.5" />
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
          <div className="bg-white rounded-3xl p-6 border border-[#e9e1f5] shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#e9e1f5]">
              <FileText className="w-4 h-4 text-[#591d8f]" />
              <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                About This Scheme
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              {scheme.fullDescription || scheme.shortDescription}
            </p>
            {scheme.targetAudience?.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748b] block mb-1">
                  Target Beneficiaries
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.targetAudience.map((aud, i) => (
                    <span key={i} className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#fbf9fe] text-[#0f172a] border border-[#e9e1f5]">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Benefits Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#e9e1f5] shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#e9e1f5]">
              <Sparkles className="w-4 h-4 text-[#ea580c]" />
              <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                Official Benefits
              </h2>
            </div>
            <div className="p-4 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5] text-xs sm:text-sm text-[#0f172a] font-semibold leading-relaxed">
              {scheme.benefitSummary}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. ELIGIBILITY SECTION (Section 23)                      */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e9e1f5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e9e1f5]">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#2b0f4c]" />
              <h2 className="text-base font-black text-[#0f172a]">
                Eligibility Criteria
              </h2>
            </div>
            <span className="text-[11px] text-[#64748b] font-semibold">
              Published Criteria Guidelines
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed bg-[#fbf9fe] p-4 rounded-2xl border border-[#e9e1f5]">
            {scheme.eligibilitySummary}
          </p>

          {/* Structured Criteria Rules */}
          {scheme.rules && scheme.rules.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-[#0f172a] uppercase tracking-wider block">
                Structured Rules:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scheme.rules.map((rule, idx) => (
                  <div key={idx} className="p-3 bg-[#fbf9fe] rounded-xl border border-[#e9e1f5] flex items-start space-x-2.5 text-xs text-[#0f172a]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">{rule.label}</span>
                      {rule.mandatory && (
                        <span className="ml-2 text-[10px] uppercase font-black text-purple-900 bg-purple-100 px-1.5 py-0.2 rounded">
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
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e9e1f5] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e9e1f5]">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-black text-[#0f172a]">
                  Required Documents
                </h2>
                <p className="text-[11px] text-[#64748b]">
                  Certificates required to prepare for official application submission
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <Link
                to={`/dashboard/readiness/${scheme._id}`}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black bg-purple-50 text-[#2b0f4c] border border-purple-200 hover:bg-purple-100 transition self-start sm:self-auto"
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
                className="bg-[#fbf9fe] rounded-2xl p-4 border border-[#e9e1f5] flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#591d8f] shrink-0" />
                    <span className="text-xs font-black text-[#0f172a]">{doc.documentType}</span>
                  </div>
                  {doc.mandatory ? (
                    <span className="text-[10px] uppercase font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      Mandatory
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-[#64748b] bg-slate-100 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                {doc.guidance && (
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    {doc.guidance}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-start space-x-2 text-[11px] text-[#4b5563]">
            <Lock className="w-4 h-4 text-[#591d8f] shrink-0 mt-0.5" />
            <p>
              <strong>Personal Document Vault:</strong> Certificates are stored securely in your private vault through manual file uploads or supported DigiLocker Demo imports. HAQ DWAAR AI does not share documents with third parties.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. HOW TO APPLY (Section 25)                             */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e9e1f5] shadow-xs space-y-5">
          <div className="pb-2 border-b border-[#e9e1f5]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] block">
              Application Sequence
            </span>
            <h2 className="text-base font-black text-[#0f172a]">
              How to Apply
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { num: "01", title: "Review requirements", desc: "Inspect published eligibility criteria and ensure your profile matches." },
              { num: "02", title: "Prepare required documents", desc: "Organize mandatory certificates in your Personal Document Vault." },
              { num: "03", title: "Check application readiness if signed in", desc: "Verify that all mandatory documents and criteria pass health checks." },
              { num: "04", title: "Continue to the official application portal", desc: "Access the authentic authorized government portal via the link below." },
              { num: "05", title: "Complete the application on the official portal", desc: "Fill in the official government application form and submit directly." },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5] flex items-start space-x-3.5"
              >
                <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#0f172a]">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final Direct Portal CTA */}
          <div className="pt-2 text-center">
            {scheme.officialApplicationUrl ? (
              <a
                href={scheme.officialApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs sm:text-sm shadow-md transition"
              >
                <span>Continue to Official Application Portal</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            ) : (
              <span className="text-xs text-[#64748b] italic">
                Official application portal URL is currently pending government notification update.
              </span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 8. OFFICIAL SOURCES (Section 26)                         */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e9e1f5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#e9e1f5]">
            <Building className="w-4 h-4 text-[#2b0f4c]" />
            <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
              Official Government Source
            </h2>
          </div>

          <div className="space-y-2 text-xs text-[#4b5563]">
            <p>
              <strong className="text-[#0f172a]">Source Authority:</strong> {scheme.sourceName || "Authorized Government Ministry"}
            </p>
            <p>
              <strong className="text-[#0f172a]">Source Classification:</strong> {scheme.sourceType?.replace("_", " ") || "Government Gazette / Portal"}
            </p>
            <p>
              <strong className="text-[#0f172a]">Last Verified:</strong>{" "}
              {scheme.sourceLastVerified ? new Date(scheme.sourceLastVerified).toLocaleDateString("en-IN") : "Verified"}
            </p>

            {scheme.officialSourceUrl && (
              <p className="pt-2">
                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#591d8f] hover:text-[#2b0f4c] font-black inline-flex items-center underline"
                >
                  <span>View Official Gazette / Notification Circular</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
