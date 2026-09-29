import React, { useState, useEffect } from "react";
import { 
  X, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  FileText,
  Volume2
} from "lucide-react";
import { analyzeLifeSituation, previewMatches, applySignalsToPassport } from "../../services/lifeSituationApi";
import { useNavigate } from "react-router-dom";
import TrustBadge from "../firewall/TrustBadge";

export default function AiMitraVoiceModal({ isOpen, onClose, initialQuery = "", onPassportUpdated }) {
  const [query, setQuery] = useState(initialQuery);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [matchingSchemes, setMatchingSchemes] = useState([]);
  const [savingSignals, setSavingSignals] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && initialQuery) {
      setQuery(initialQuery);
      handleAnalyze(initialQuery);
    } else if (isOpen) {
      setQuery("");
      setAnalysisResult(null);
      setMatchingSchemes([]);
      setSuccessMsg("");
      setErrorMsg("");
    }
  }, [isOpen, initialQuery]);

  const handleAnalyze = async (textToAnalyze) => {
    const q = textToAnalyze || query;
    if (!q || !q.trim()) return;

    setAnalyzing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Analyze with Gemini/Fallback NLU
      const res = await analyzeLifeSituation(q);
      const extracted = res.data?.data?.extractedSignals || {};
      setAnalysisResult(res.data?.data || null);

      // 2. Preview matching schemes
      if (Object.keys(extracted).length > 0) {
        const previewRes = await previewMatches(extracted);
        setMatchingSchemes(previewRes.data?.data?.matches || []);
      }
    } catch (err) {
      console.error("AI Mitra analysis error:", err);
      setErrorMsg(err.response?.data?.message || "विश्लेषण करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplySignals = async () => {
    if (!analysisResult?.extractedSignals) return;
    setSavingSignals(true);
    try {
      await applySignalsToPassport(analysisResult.extractedSignals);
      setSuccessMsg("आपके बेनिफिट पासपोर्ट में जानकारी सफलतापूर्वक सुरक्षित कर ली गई!");
      if (onPassportUpdated) onPassportUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "पासपोर्ट अपडेट करने में विफल।");
    } finally {
      setSavingSignals(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">
                AI MITRA • जन सहायक वॉइस
              </h2>
              <TrustBadge type="DEMO_MODE" label="Voice Demo Mode" size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              Natural Language & Dialect Understanding (Hindi, English, Bhojpuri)
            </p>
          </div>
        </div>

        {/* Query Input */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze(query)}
              placeholder="बोलकर या लिखकर बताएं... (जैसे: मुझे किसान लोन और खाद सब्सिडी चाहिए)"
              className="w-full pl-4 pr-24 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-hidden transition"
            />
            <button
              onClick={() => handleAnalyze(query)}
              disabled={analyzing || !query.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white flex items-center shadow-xs transition"
            >
              {analyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>खोजें (Ask AI)</>
              )}
            </button>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              "मेरी बेटी की कॉलेज फीस में छात्रवृत्ति कैसे मिलेगी?",
              "पीएम किसान सम्मान निधि की 17वीं किस्त कब आएगी?",
              "पीएम आवास योजना ग्रामीण की पात्रता कैसे चेक करें?",
              "सिलाई मशीन टूल किट योजना का आवेदन कैसे करें?",
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(chip);
                  handleAnalyze(chip);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 transition border border-slate-200"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {analyzing && (
          <div className="my-8 py-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              AI मित्र आपकी स्थिति का विश्लेषण कर रहा है...
            </p>
            <p className="text-[11px] text-slate-500">
              Analyzing life situation signals and mapping to verified schemes
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysisResult && !analyzing && (
          <div className="mt-6 space-y-5">
            {/* Extracted Signals Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 mr-1.5" />
                  पहचाने गए संकेत (Extracted Signals)
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {analysisResult.extractedSignals ? Object.keys(analysisResult.extractedSignals).length : 0} Signals
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(analysisResult.extractedSignals || {}).map(([key, val]) => (
                  <div key={key} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-bold text-slate-800 capitalize truncate block">
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button to save signals to Benefit Passport */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  क्या आप इन संकेतों को अपने बेनिफिट पासपोर्ट में जोड़ना चाहते हैं?
                </span>
                <button
                  onClick={handleApplySignals}
                  disabled={savingSignals}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition flex items-center"
                >
                  {savingSignals ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  पासपोर्ट में सुरक्षित करें
                </button>
              </div>
            </div>

            {/* Matched Schemes List */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                पात्र सरकारी योजनाएं (Matching Schemes)
              </h4>
              {matchingSchemes.length > 0 ? (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {matchingSchemes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-300 transition flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.scheme?.name || item.name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            {item.matchScore ? `${item.matchScore}% Match` : "पात्र"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.scheme?.benefitSummary || item.benefitSummary || "सरकारी कल्याणकारी लाभ"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/schemes/${item.scheme?._id || item.schemeId}`);
                        }}
                        className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold shrink-0 transition"
                      >
                        देखें <ArrowRight className="w-3 h-3 inline ml-0.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                  इस स्थिति के लिए कोई सीधी योजना नहीं मिली। कृपया अधिक विवरण जोड़ें।
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
