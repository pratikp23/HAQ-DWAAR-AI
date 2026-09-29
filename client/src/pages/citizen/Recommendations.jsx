import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../../services/matchingApi";
import Navbar from "../../components/layout/Navbar";
import { useLanguage } from "../../context/LanguageContext";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Shield,
  FileText,
  HelpCircle,
  Info
} from "lucide-react";

export default function Recommendations() {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecommendations();
      if (res?.data) {
        setRecommendations(res.data.recommendations || []);
        setProfileCompleteness(res.data.profileCompleteness || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load personalized recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  const filteredRecs = recommendations.filter((rec) => {
    if (filterType === "MATCHED") return rec.classification === "MATCHED";
    if (filterType === "POTENTIAL") return rec.classification === "POTENTIAL_MATCH";
    return true;
  });

  const matchedCount = recommendations.filter((r) => r.classification === "MATCHED").length;
  const potentialCount = recommendations.filter((r) => r.classification === "POTENTIAL_MATCH").length;

  return (
    <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] pb-16">
      {/* Universal GovTech Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Hero Banner */}
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2a0e4f] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-[#591d8f]/30">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/50 text-xs font-bold text-[#ffedd5]">
              <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
              <span>{t("topRecommendedTitle", "Personalized Matching Engine")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t("benefitsForYou", "Benefits & Entitlements For You")}
            </h1>
            <p className="text-[#e2e8f0] text-sm font-medium leading-relaxed">
              {t("benefitsSubtitle", "Based on the information in your Benefit Passport. Every match is evaluated deterministically against authentic government scheme criteria.")}
            </p>
          </div>

          {/* Informational Disclaimer Card */}
          <div className="mt-5 p-3.5 bg-[#140628]/80 border border-[#591d8f]/50 rounded-xl text-xs text-[#cbd5e1] flex items-start space-x-2.5 max-w-2xl font-medium">
            <Info className="w-4 h-4 flex-shrink-0 text-[#fb923c] mt-0.5" />
            <p>
              Ordering is arranged <span className="font-bold text-white">based on your profile information</span> and deterministic rule checks. This is an informational profile match and does not represent an eligibility probability or government approval.
            </p>
          </div>
        </div>

        {/* Filter Controls & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                filterType === "ALL"
                  ? "bg-[#240b49] text-white shadow-md ring-2 ring-[#591d8f]/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t("allMatches", "All Matches")} ({recommendations.length})
            </button>
            <button
              onClick={() => setFilterType("MATCHED")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
                filterType === "MATCHED"
                  ? "bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t("matchedFilter", "Matches Profile")} ({matchedCount})</span>
            </button>
            <button
              onClick={() => setFilterType("POTENTIAL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
                filterType === "POTENTIAL"
                  ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-400/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("potentialFilter", "Potential Matches")} ({potentialCount})</span>
            </button>
          </div>

          <button
            onClick={fetchRecs}
            disabled={loading}
            className="inline-flex items-center self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            {t("checkAgain", "Check Again")}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-xl border border-slate-200">
            <RefreshCw className="w-8 h-8 text-blue-700 animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              Evaluating your Benefit Passport against verified scheme criteria...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="font-bold text-red-900 text-sm">Failed to evaluate recommendations</h3>
            <p className="text-xs text-red-700">{error}</p>
            <button
              onClick={fetchRecs}
              className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecs.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No schemes match this filter</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try switching your filter or update your Benefit Passport with additional qualifications, occupation, or location details.
            </p>
            <Link
              to="/dashboard/benefit-passport"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800"
            >
              Update Benefit Passport
            </Link>
          </div>
        )}

        {/* Recommendations List */}
        {!loading && !error && filteredRecs.length > 0 && (
          <div className="space-y-4">
            {filteredRecs.map((rec) => {
              const isExpanded = expandedSchemeId === rec.schemeId;
              const isMatched = rec.classification === "MATCHED";
              const isPotential = rec.classification === "POTENTIAL_MATCH";

              return (
                <div
                  key={rec.schemeId}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                            {rec.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {rec.state === "All-India" || rec.state === "All India"
                              ? "Central (All-India)"
                              : `State: ${rec.state}`}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {rec.name}
                        </h2>
                        {rec.shortDescription && (
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {rec.shortDescription}
                          </p>
                        )}
                      </div>

                      {/* Profile Match Score & Classification Badge */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                        {/* Status Classification Badge */}
                        {isMatched && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Matches Profile
                          </span>
                        )}
                        {isPotential && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                            Potential Match
                          </span>
                        )}
                        {!isMatched && !isPotential && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <XCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            Criteria Not Met
                          </span>
                        )}

                        {/* Profile Match Score */}
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Profile Match Score</div>
                          <div className="text-lg font-black text-slate-900">
                            {rec.matchScore}
                            <span className="text-xs font-normal text-slate-400">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Benefit Highlight Box */}
                    {rec.benefitSummary && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start space-x-2">
                        <span className="font-bold text-slate-800 flex-shrink-0">Benefit:</span>
                        <span className="text-slate-700">{rec.benefitSummary}</span>
                      </div>
                    )}

                    {/* Matched Reasons Snippet */}
                    {rec.topReasons && rec.topReasons.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                          Matched Profile Criteria:
                        </div>
                        <div className="space-y-1">
                          {rec.topReasons.map((reason, idx) => (
                            <div key={idx} className="flex items-start text-xs text-slate-700 space-x-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Information Prompt Banner */}
                    {rec.missingInformationCount > 0 && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Information needed to complete check ({rec.missingInformationCount} item(s)):</span>
                          </div>
                          <Link
                            to="/dashboard/benefit-passport"
                            className="font-semibold text-blue-700 hover:text-blue-800 text-[11px]"
                          >
                            Update Passport →
                          </Link>
                        </div>
                        <ul className="list-disc list-inside text-amber-800 space-y-0.5 pl-1">
                          {rec.missingFields.slice(0, 2).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Expandable "Why This Match?" Section */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-200 space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-1.5">
                            <Shield className="w-4 h-4 text-blue-700" />
                            <span>Transparent Rule Evaluation Breakdown</span>
                          </h4>
                          <p className="text-xs text-slate-600">{rec.explanation?.summary}</p>
                        </div>

                        {/* Matched Rules */}
                        {rec.explanation?.matchedReasons?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-bold text-emerald-800 block">
                              Verified Matches ({rec.explanation.matchedReasons.length})
                            </span>
                            <div className="space-y-1 pl-1">
                              {rec.explanation.matchedReasons.map((m, i) => (
                                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>{m}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Information */}
                        {rec.explanation?.missingInformation?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-bold text-amber-800 block">
                              Missing Profile Fields ({rec.explanation.missingInformation.length})
                            </span>
                            <div className="space-y-1 pl-1">
                              {rec.explanation.missingInformation.map((m, i) => (
                                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <span>{m}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Failed Conditions */}
                        {rec.explanation?.failedConditions?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-bold text-rose-800 block">
                              Unsatisfied Criteria ({rec.explanation.failedConditions.length})
                            </span>
                            <div className="space-y-1 pl-1">
                              {rec.explanation.failedConditions.map((m, i) => (
                                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 flex-shrink-0" />
                                  <span>{m}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Disclaimer */}
                        <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-500 leading-relaxed border border-slate-200">
                          {rec.explanation?.disclaimer}
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => toggleExpand(rec.schemeId)}
                        className="inline-flex items-center font-bold text-[#240b49] hover:text-[#591d8f] transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            {t("hideWhyThisMatch", "Hide Match Details")} <ChevronUp className="w-4 h-4 ml-1" />
                          </>
                        ) : (
                          <>
                            {t("whyThisMatch", "Why This Match?")} <ChevronDown className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center space-x-2.5">
                        {rec.officialApplicationUrl && (
                          <a
                            href={rec.officialApplicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-slate-600 hover:text-slate-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {t("officialPortal", "Official Portal")} <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        <Link
                          to={`/dashboard/readiness/${rec.schemeId}`}
                          className="inline-flex items-center px-3.5 py-2 rounded-xl font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm transition-all text-xs"
                        >
                          {t("checkReadiness", "Check Readiness")} →
                        </Link>
                        <Link
                          to={`/dashboard/schemes/${rec.schemeId}`}
                          className="inline-flex items-center px-4 py-2 rounded-xl font-bold bg-[#240b49] hover:bg-[#1e0a3c] text-white shadow-sm transition-all text-xs"
                        >
                          {t("details", "Details")} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
