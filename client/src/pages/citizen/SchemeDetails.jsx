import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSchemeById } from "../../services/schemeApi";
import { evaluateScheme } from "../../services/matchingApi";
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
  Shield,
  Info
} from "lucide-react";

export default function SchemeDetails() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Matching evaluation state
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalError, setEvalError] = useState(null);

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

    fetchDetails();
  }, [id]);

  const handleCheckMatch = async () => {
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-3 text-slate-600">
        <RefreshCw className="w-8 h-8 text-blue-700 animate-spin" />
        <p className="text-sm font-medium">Loading verified scheme specifications...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-xl border border-red-200 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Scheme Unavailable</h2>
          <p className="text-xs text-slate-600">
            {error || "The requested scheme could not be found or is not yet verified."}
          </p>
          <Link
            to="/dashboard/schemes"
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Back to Schemes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/dashboard/schemes"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Schemes
          </Link>
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Official Source
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Title Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
              {scheme.category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              State: {scheme.state}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Mode: {scheme.applicationMethod}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {scheme.name}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {scheme.fullDescription || scheme.shortDescription}
          </p>

          {/* Benefit Highlight Box */}
          <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-sm space-y-1">
            <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider">
              Official Benefit Summary
            </span>
            <p className="text-blue-900 font-medium leading-relaxed">{scheme.benefitSummary}</p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CHECK AGAINST MY PROFILE WIDGET (Phase 5 Feature)        */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-blue-900 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-400/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Deterministic Match Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Check Against My Profile</h2>
              <p className="text-xs text-blue-200">
                Compare your saved Benefit Passport directly against this scheme's verified rule conditions.
              </p>
            </div>

            <button
              onClick={handleCheckMatch}
              disabled={evaluating}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors flex-shrink-0 disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-blue-300" />
                  {evaluation ? "Re-evaluate Match" : "Check My Match"}
                </>
              )}
            </button>
          </div>

          {evalError && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200">
              {evalError}
            </div>
          )}

          {/* Evaluation Results Card */}
          {evaluation && (
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/15 space-y-4 text-xs">
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wider block">
                    Classification Result
                  </span>
                  <div className="mt-1">
                    {evaluation.classification === "MATCHED" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                        Matches Profile Criteria
                      </span>
                    )}
                    {evaluation.classification === "POTENTIAL_MATCH" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-400" />
                        Potential Match — Details Needed
                      </span>
                    )}
                    {evaluation.classification === "NOT_MATCHED" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <XCircle className="w-4 h-4 mr-1.5 text-rose-400" />
                        Criteria Not Currently Met
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wider block">
                    Profile Match Score
                  </span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {evaluation.matchScore}
                    <span className="text-xs font-normal text-blue-300">/100</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-slate-200 leading-relaxed font-medium">
                {evaluation.explanation?.summary}
              </p>

              {/* Rule stats pill strip */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  Total Rules: <strong>{evaluation.stats?.totalRules}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Passed: <strong>{evaluation.stats?.passedRules}</strong>
                </span>
                {evaluation.stats?.missingRules > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    Missing Info: <strong>{evaluation.stats?.missingRules}</strong>
                  </span>
                )}
                {evaluation.stats?.failedRules > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                    Unsatisfied: <strong>{evaluation.stats?.failedRules}</strong>
                  </span>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-white block uppercase tracking-wider">
                  Why this match?
                </span>

                {/* Matched reasons */}
                {evaluation.explanation?.matchedReasons?.map((m, i) => (
                  <div key={i} className="flex items-start space-x-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}

                {/* Missing information */}
                {evaluation.explanation?.missingInformation?.map((m, i) => (
                  <div key={i} className="flex items-start space-x-2 text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span>{m}</span>{" "}
                      <Link
                        to="/dashboard/benefit-passport"
                        className="text-blue-300 hover:text-blue-100 font-semibold underline ml-1"
                      >
                        Update Passport →
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Failed conditions */}
                {evaluation.explanation?.failedConditions?.map((m, i) => (
                  <div key={i} className="flex items-start space-x-2 text-rose-200">
                    <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-black/30 rounded-lg text-[11px] text-blue-200/90 leading-relaxed border border-white/10 flex items-start space-x-2">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" />
                <p>{evaluation.explanation?.disclaimer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Eligibility Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Eligibility Criteria</h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {scheme.eligibilitySummary}
          </p>

          {scheme.rules && scheme.rules.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Structured Criteria Checks:</span>
              <ul className="space-y-2 text-xs">
                {scheme.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{rule.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Required Documents */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-base">Required Documents</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {scheme.requiredDocuments?.map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{doc.documentType}</span>
                  {doc.mandatory && (
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Mandatory
                    </span>
                  )}
                </div>
                {doc.guidance && <p className="text-slate-500 text-[11px]">{doc.guidance}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Official Source & Verification Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-slate-900 text-base">Official Government Source</h2>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong className="text-slate-800">Source Authority:</strong> {scheme.sourceName}
            </p>
            <p>
              <strong className="text-slate-800">Source Type:</strong> {scheme.sourceType?.replace("_", " ")}
            </p>
            <p>
              <strong className="text-slate-800">Last Verified Date:</strong>{" "}
              {scheme.sourceLastVerified ? new Date(scheme.sourceLastVerified).toLocaleDateString() : "Verified"}
            </p>
            <p className="pt-1">
              <a
                href={scheme.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center"
              >
                View Official Notification / Guidelines <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </p>
          </div>
        </div>

        {/* Apply Callout Card */}
        {scheme.officialApplicationUrl && (
          <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-bold text-base">Ready to proceed to application?</h3>
              <p className="text-xs text-slate-300">
                Submit directly through the authorized government portal.
              </p>
            </div>
            <a
              href={scheme.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition-colors flex-shrink-0"
            >
              Open Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>
        )}

      </main>
    </div>
  );
}
