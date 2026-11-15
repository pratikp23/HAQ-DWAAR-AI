import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../../services/matchingApi";
import { useLanguage } from "../../context/LanguageContext";
import Chip from "../../components/common/Chip";
import { SpotlightCard } from "../../components/common/ReactBits";
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
  Info,
  Compass
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
      const payload = res?.data || res;
      if (payload) {
        const recs = payload.recommendations || (Array.isArray(payload) ? payload : []);
        setRecommendations(recs);
        setProfileCompleteness(payload.profileCompleteness || res?.profileCompleteness || 0);
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
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Hero Banner */}
        <div className="bg-gradient-to-r from-[#112318] via-[#1b3524] to-[#234731] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-800/40">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t("topRecommendedTitle", "Personalized Matching Engine")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t("benefitsForYou", "Benefits & Entitlements For You")}
            </h1>
            <p className="text-slate-200 text-sm font-medium leading-relaxed">
              {t("benefitsSubtitle", "Based on the information in your Benefit Passport. Every match is evaluated deterministically against authentic government scheme criteria.")}
            </p>
          </div>

          {/* Informational Disclaimer Card */}
          <div className="mt-5 p-3.5 bg-black/30 border border-white/10 rounded-xl text-xs text-slate-300 flex items-start space-x-2.5 max-w-2xl font-medium">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-300 mt-0.5" />
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
                  ? "bg-[#234731] text-white shadow-md ring-2 ring-emerald-500/30"
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
          <div data-haq-target="scheme-recommendation-list" className="space-y-4">
            {filteredRecs.map((rec) => {
              const isExpanded = expandedSchemeId === rec.schemeId;
              const isMatched = rec.classification === "MATCHED";
              const isPotential = rec.classification === "POTENTIAL_MATCH";

              return (
                <SpotlightCard
                  key={rec.schemeId}
                  className="rounded-3xl border border-[#e9e1f5] shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip size="sm" variant="flat" color="primary">
                            {rec.category}
                          </Chip>
                          <span className="text-xs text-slate-500 font-medium">
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
                          <Chip size="sm" variant="flat" color="success" startContent={<CheckCircle className="w-3.5 h-3.5 mr-1" />}>
                            Matches Profile
                          </Chip>
                        )}
                        {isPotential && (
                          <Chip size="sm" variant="flat" color="warning" startContent={<AlertTriangle className="w-3.5 h-3.5 mr-1" />}>
                            Potential Match
                          </Chip>
                        )}
                        {!isMatched && !isPotential && (
                          <Chip size="sm" variant="flat" color="default" startContent={<XCircle className="w-3.5 h-3.5 mr-1" />}>
                            Criteria Not Met
                          </Chip>
                        )}

                        {/* Profile Match Score */}
                        <div className="text-right">
                          <div className="text-[11px] text-slate-500 font-medium">Match Score</div>
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
                        className="inline-flex items-center font-bold text-[#234731] hover:text-[#183323] transition-colors"
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
                          to={`/dashboard/coach/${rec.schemeId}`}
                          className="inline-flex items-center px-3.5 py-2 rounded-xl font-bold bg-[#ebf3ed] text-[#234731] hover:bg-[#dceade] border border-[#c8ded0] transition-all text-xs"
                        >
                          <Compass className="w-3.5 h-3.5 mr-1" />
                          <span>Coach</span>
                        </Link>
                        <Link
                          to={`/dashboard/readiness/${rec.schemeId}`}
                          className="inline-flex items-center px-3.5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-all text-xs"
                        >
                          {t("checkReadiness", "Check Readiness")} →
                        </Link>
                        <Link
                          to={`/dashboard/schemes/${rec.schemeId}`}
                          className="inline-flex items-center px-4 py-2 rounded-xl font-bold bg-[#234731] hover:bg-[#183323] text-white shadow-xs transition-all text-xs"
                        >
                          {t("details", "Details")} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

    </div>
  );
}
