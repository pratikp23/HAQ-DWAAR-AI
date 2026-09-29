import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useLanguage } from "../../context/LanguageContext";
import {
  analyzeLifeSituation,
  previewMatches,
  applySignalsToPassport,
} from "../../services/lifeSituationApi";
import VoiceInput from "../../components/voice/VoiceInput";
import TrustBadge from "../../components/firewall/TrustBadge";
import {
  Sparkles,
  Shield,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileText,
  Save,
  Check,
  X,
  Info,
  Mic,
  Edit3,
} from "lucide-react";

export default function LifeSituation() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Mode: "voice" vs "text" (if URL ?voice=true or clicked)
  const [inputMode, setInputMode] = useState(
    searchParams.get("voice") === "true" ? "voice" : "text"
  );

  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisSource, setAnalysisSource] = useState(null);
  const [isVoiceInput, setIsVoiceInput] = useState(false);

  // Preview matching state
  const [previewing, setPreviewing] = useState(false);
  const [previewRecs, setPreviewRecs] = useState(null);

  // Passport update confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applyingPassport, setApplyingPassport] = useState(false);
  const [passportSuccess, setPassportSuccess] = useState(null);

  const samplePrompts = [
    "I am a college student from Madhya Pradesh pursuing B.Tech. My family annual income is around 2.5 lakhs and I belong to OBC.",
    "I am a farmer with 3 acres of land looking for crop insurance and credit assistance.",
    "I recently completed my ITI Diploma and need an employment allowance or apprentice support.",
    "I want to know what healthcare coverage schemes are available for my family under Ayushman Bharat.",
  ];

  const executeAnalysis = async (textToAnalyze, fromVoice = false) => {
    const inputContent = (textToAnalyze || text).trim();
    if (!inputContent || inputContent.length < 3) {
      setError("Please describe your situation with at least 3 characters.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setPreviewRecs(null);
    setPassportSuccess(null);
    setIsVoiceInput(fromVoice);

    try {
      const res = await analyzeLifeSituation(inputContent);
      if (res?.data?.analysis) {
        setAnalysisResult(res.data.analysis);
        setAnalysisSource(res.data.source || "gemini");
      }
    } catch (err) {
      setError(
        err.message || "Failed to analyze your statement. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTextAnalyze = (e) => {
    e?.preventDefault();
    executeAnalysis(text, false);
  };

  const handleVoiceTranscript = (spokenText) => {
    setText(spokenText);
    executeAnalysis(spokenText, true);
  };

  const handlePreviewMatches = async () => {
    if (!analysisResult?.extractedProfileSignals) return;
    setPreviewing(true);
    try {
      const res = await previewMatches(analysisResult.extractedProfileSignals);
      if (res?.data?.recommendations) {
        setPreviewRecs(res.data.recommendations);
      }
    } catch (err) {
      setError(err.message || "Failed to preview matching benefits.");
    } finally {
      setPreviewing(false);
    }
  };

  const handleApplyPassport = async () => {
    if (!analysisResult?.extractedProfileSignals) return;
    setApplyingPassport(true);
    try {
      const res = await applySignalsToPassport(
        analysisResult.extractedProfileSignals
      );
      if (res?.success) {
        setPassportSuccess(
          "Benefit Passport successfully updated with confirmed signals!"
        );
        setShowConfirmModal(false);
      }
    } catch (err) {
      setError(err.message || "Failed to update Benefit Passport.");
    } finally {
      setApplyingPassport(false);
    }
  };

  const signals = analysisResult?.extractedProfileSignals;

  return (
    <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] pb-20">
      {/* Universal GovTech Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2a0e4f] rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4 border border-[#591d8f]/30">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/50 text-xs font-bold text-[#ffedd5]">
              <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
              <span>Bhashini Voice + Conversational NLU</span>
            </div>
            <TrustBadge type="DEMO_MODE" label="Voice Demo Mode" size="sm" />
            <TrustBadge
              type="VERIFIED_SCHEME"
              label="Benefit Firewall Protected"
              size="sm"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t("aiMitraTitle", "Tell Us What You Need")}
          </h1>
          <p className="text-[#e2e8f0] text-sm font-medium leading-relaxed max-w-2xl">
            Describe your situation naturally using voice or text. We convert your speech into structured signals to evaluate verified government benefits.
          </p>

          <div className="p-3.5 bg-[#140628]/80 border border-[#591d8f]/50 rounded-xl text-xs text-[#cbd5e1] flex items-start space-x-2.5 font-medium">
            <Info className="w-4 h-4 flex-shrink-0 text-[#fb923c] mt-0.5" />
            <p>
              AI is used solely to comprehend conversational speech and extract profile signals. Scheme eligibility and benefit amounts are strictly protected and verified by our Benefit Firewall.
            </p>
          </div>
        </div>

        {/* Input Mode Selector & Card */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-slate-200/70 p-1.5 rounded-2xl max-w-sm">
            <button
              type="button"
              onClick={() => setInputMode("voice")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                inputMode === "voice"
                  ? "bg-[#240b49] text-white shadow-md"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speak (Voice)</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                inputMode === "text"
                  ? "bg-[#240b49] text-white shadow-md"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Write instead</span>
            </button>
          </div>

          {/* Voice Input Interface */}
          {inputMode === "voice" ? (
            <VoiceInput
              onTranscriptComplete={handleVoiceTranscript}
              onCancel={() => setInputMode("text")}
            />
          ) : (
            /* Text Input Interface */
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <label
                htmlFor="situation-text"
                className="font-bold text-slate-900 text-sm block"
              >
                Describe your background, occupation, education, or what assistance you are seeking:
              </label>

              <textarea
                id="situation-text"
                rows={4}
                maxLength={2000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. I am a 20-year-old student doing B.Tech in Madhya Pradesh. My father is a small farmer with 2 acres of land and our annual family income is 2 lakhs. What scholarships or farm subsidies can we apply for?"
                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#240b49] text-sm text-slate-800 placeholder-slate-400 resize-y"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-500 font-medium">
                  {text.length} / 2000 characters
                </span>

                <button
                  onClick={handleTextAnalyze}
                  disabled={analyzing || text.trim().length < 3}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Statement...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 text-[#fed7aa]" />
                      Analyze My Situation
                    </>
                  )}
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">
                  Or tap a sample prompt to try:
                </span>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setText(prompt)}
                      className="text-left text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                    >
                      "{prompt.slice(0, 60)}..."
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Passport Saved Alert */}
        {passportSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">{passportSuccess}</span>
              <div className="mt-1">
                <Link
                  to="/dashboard/benefit-passport"
                  className="underline font-semibold"
                >
                  View your updated Benefit Passport →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WHAT WE UNDERSTOOD (ANALYSIS RESULTS CARD)               */}
        {/* ======================================================== */}
        {analysisResult && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
            {/* Header / Source badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Intent: {analysisResult.intent?.primary}
                  </span>
                  <TrustBadge type="AI_NLU" size="sm" />
                  {isVoiceInput && (
                    <TrustBadge
                      type="DEMO_MODE"
                      label="Voice Input Source"
                      size="sm"
                    />
                  )}
                  {analysisSource === "gemini" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                      Gemini NLU
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Shield className="w-3 h-3 mr-1 text-amber-600" />
                      Deterministic Fallback
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 pt-1">
                  What We Understood
                </h3>
              </div>
            </div>

            {/* Transcript / Utterance Quote */}
            {text && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Citizen Statement {isVoiceInput ? "(Voice Transcript)" : ""}:
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed">
                  "{text}"
                </p>
              </div>
            )}

            {/* Situation Summary */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Summary:
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                {analysisResult.situationSummary || "Statement analyzed."}
              </p>
            </div>

            {/* Extracted Profile Signals Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Extracted Profile Signals:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified against passport criteria
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {signals?.state && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      State
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {signals.state}
                    </span>
                  </div>
                )}
                {signals?.category && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Caste / Social Category
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {signals.category}
                    </span>
                  </div>
                )}
                {signals?.occupationType && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Occupation
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {signals.occupationType}
                    </span>
                  </div>
                )}
                {signals?.qualification && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Qualification
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {signals.qualification}
                    </span>
                  </div>
                )}
                {signals?.annualIncome && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Annual Income
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{signals.annualIncome.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {signals?.isFarmer && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Farmer Status
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      Active Cultivator
                    </span>
                  </div>
                )}
                {signals?.landholdingAcres && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Landholding
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {signals.landholdingAcres} Acres
                    </span>
                  </div>
                )}
                {signals?.age && (
                  <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Age
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {signals.age} years
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Missing Information Alerts */}
            {Array.isArray(analysisResult.missingInformation) &&
              analysisResult.missingInformation.length > 0 && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Missing Information Needed for Full Verification:</span>
                  </div>
                  <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5">
                    {analysisResult.missingInformation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setInputMode("text")}
                  className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Statement</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2 text-purple-700" />
                  Apply to Benefit Passport
                </button>

                <button
                  onClick={handlePreviewMatches}
                  disabled={previewing}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {previewing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Evaluating Schemes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Find Relevant Benefits
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PREVIEW MATCHING RESULTS (Non-persistent preview)        */}
        {/* ======================================================== */}
        {previewRecs && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm text-emerald-950">
                    Potential benefits based on the information provided
                  </h3>
                  <TrustBadge type="VERIFIED_SCHEME" size="sm" />
                </div>
                <p className="text-emerald-800 mt-1">
                  Evaluated using our deterministic matching engine against verified government scheme records (Benefit Firewall Validated).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {previewRecs.map((rec) => (
                <div
                  key={rec.schemeId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 hover:border-purple-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                          {rec.category}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {rec.state === "All-India"
                            ? "All-India"
                            : `State: ${rec.state}`}
                        </span>
                        <TrustBadge type="DETERMINISTIC_MATCH" size="sm" />
                      </div>
                      <h4 className="font-black text-slate-900 text-base">
                        {rec.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                        Profile Match:{" "}
                        <strong className="text-[#ea580c]">
                          {rec.matchScore}/100
                        </strong>
                      </span>
                    </div>
                  </div>

                  {rec.benefitSummary && (
                    <p className="text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-200 font-medium">
                      <strong className="text-slate-900 font-bold">
                        Official Benefit:
                      </strong>{" "}
                      {rec.benefitSummary}
                    </p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs border-t border-slate-100 gap-2">
                    <span className="text-slate-500 font-medium">
                      {rec.explanation?.summary}
                    </span>
                    <Link
                      to={`/dashboard/schemes/${rec.schemeId}`}
                      className="font-extrabold text-[#ea580c] hover:text-[#c2410c] inline-flex items-center flex-shrink-0"
                    >
                      <span>Check Readiness & Checklist</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* EXPLICIT CONFIRMATION MODAL TO UPDATE BENEFIT PASSPORT    */}
      {/* ======================================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#240b49]" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Confirm Benefit Passport Update
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We understood the following information from your statement. In accordance with Benefit Firewall privacy rules, information is never written to your Benefit Passport without your explicit confirmation.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-black text-slate-900 mb-2">
                Proposed Profile Values:
              </div>
              {signals?.state && (
                <div>
                  • <strong>State:</strong> {signals.state}
                </div>
              )}
              {signals?.category && (
                <div>
                  • <strong>Category:</strong> {signals.category}
                </div>
              )}
              {signals?.qualification && (
                <div>
                  • <strong>Qualification:</strong> {signals.qualification}
                </div>
              )}
              {signals?.occupationType && (
                <div>
                  • <strong>Occupation:</strong> {signals.occupationType}
                </div>
              )}
              {signals?.annualIncome && (
                <div>
                  • <strong>Annual Income:</strong> ₹
                  {signals.annualIncome.toLocaleString("en-IN")}
                </div>
              )}
              {signals?.isFarmer && (
                <div>
                  • <strong>Farmer Status:</strong> Active Farmer
                </div>
              )}
              {signals?.landholdingAcres && (
                <div>
                  • <strong>Landholding:</strong> {signals.landholdingAcres} Acres
                </div>
              )}
              {signals?.age && (
                <div>
                  • <strong>Age:</strong> {signals.age} years
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Continue Without Saving
              </button>
              <button
                type="button"
                onClick={handleApplyPassport}
                disabled={applyingPassport}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {applyingPassport ? "Saving..." : "Apply to My Benefit Passport"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
