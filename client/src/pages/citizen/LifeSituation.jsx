import React, { useState } from "react";
import { Link } from "react-router-dom";
import { analyzeLifeSituation, previewMatches, applySignalsToPassport } from "../../services/lifeSituationApi";
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
  Info
} from "lucide-react";

export default function LifeSituation() {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisSource, setAnalysisSource] = useState(null);

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

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!text.trim() || text.trim().length < 3) {
      setError("Please describe your situation with at least 3 characters.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setPreviewRecs(null);
    setPassportSuccess(null);

    try {
      const res = await analyzeLifeSituation(text);
      if (res?.data?.analysis) {
        setAnalysisResult(res.data.analysis);
        setAnalysisSource(res.data.source || "gemini");
      }
    } catch (err) {
      setError(err.message || "Failed to analyze your statement. Please try again.");
    } finally {
      setAnalyzing(false);
    }
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
      const res = await applySignalsToPassport(analysisResult.extractedProfileSignals);
      if (res?.success) {
        setPassportSuccess("Benefit Passport successfully updated with confirmed signals!");
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ह
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                HaqDwaar <span className="text-blue-700">AI</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard/recommendations"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Benefits For You
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-400/30 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Conversational NLU Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tell Us What You Need
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
            Describe your situation in your own words. We’ll turn it into structured information to help discover relevant benefits.
          </p>

          <div className="p-3 bg-blue-950/70 border border-blue-400/30 rounded-xl text-xs text-blue-200 flex items-start space-x-2">
            <Info className="w-4 h-4 flex-shrink-0 text-blue-300 mt-0.5" />
            <p>
              Gemini is used solely to comprehend natural language and extract criteria signals. Government scheme eligibility rules are strictly evaluated by our verified deterministic engine.
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <label htmlFor="situation-text" className="font-bold text-slate-900 text-sm block">
            Describe your background, occupation, education, or what assistance you are seeking:
          </label>

          <textarea
            id="situation-text"
            rows={4}
            maxLength={2000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. I am a 20-year-old student doing B.Tech in Madhya Pradesh. My father is a small farmer with 2 acres of land and our annual family income is 2 lakhs. What scholarships or farm subsidies can we apply for?"
            className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-800 placeholder-slate-400 resize-y"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-500">
              {text.length} / 2000 characters
            </span>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || text.trim().length < 3}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-700 hover:bg-blue-600 text-white shadow-md transition-colors disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Statement...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-blue-300" />
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
                <Link to="/dashboard/benefit-passport" className="underline font-semibold">
                  View your updated Benefit Passport →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ANALYSIS RESULTS CARD                                     */}
        {/* ======================================================== */}
        {analysisResult && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
            
            {/* Header / Source badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Intent: {analysisResult.intent?.primary}
                  </span>
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
                <h2 className="text-lg font-bold text-slate-900">What We Understood</h2>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                <span className="text-[11px] text-slate-500">Signal Clarity</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    analysisResult.confidence === "HIGH"
                      ? "bg-emerald-100 text-emerald-800"
                      : analysisResult.confidence === "MEDIUM"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {analysisResult.confidence}
                </span>
              </div>
            </div>

            {/* Situation Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Summary of your statement:</strong>
              {analysisResult.situationSummary}
            </div>

            {/* Extracted Profile Signals Grid */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Information Detected from Your Message:
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {signals?.state && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">State</span>
                    <strong className="text-slate-800">{signals.state}</strong>
                  </div>
                )}
                {signals?.category && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Social Category</span>
                    <strong className="text-slate-800">{signals.category}</strong>
                  </div>
                )}
                {signals?.qualification && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Qualification</span>
                    <strong className="text-slate-800">{signals.qualification}</strong>
                  </div>
                )}
                {signals?.currentCourse && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Course / Study</span>
                    <strong className="text-slate-800">{signals.currentCourse}</strong>
                  </div>
                )}
                {signals?.occupationType && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Occupation</span>
                    <strong className="text-slate-800">{signals.occupationType}</strong>
                  </div>
                )}
                {signals?.annualIncome && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Annual Income</span>
                    <strong className="text-slate-800">
                      ₹{signals.annualIncome.toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
                {signals?.isFarmer && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Farmer Status</span>
                    <strong className="text-slate-800">Active Cultivator</strong>
                  </div>
                )}
                {signals?.landholdingAcres && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Landholding</span>
                    <strong className="text-slate-800">{signals.landholdingAcres} Acres</strong>
                  </div>
                )}
                {signals?.age && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-slate-500 block">Age</span>
                    <strong className="text-slate-800">{signals.age} years</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Missing Information Checklist */}
            {analysisResult.missingInformation?.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Information still needed to complete eligibility checks:</span>
                </div>
                <ul className="list-disc list-inside text-amber-800 space-y-1 pl-1">
                  {analysisResult.missingInformation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handlePreviewMatches}
                disabled={previewing}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors disabled:opacity-50"
              >
                {previewing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Finding Benefits...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Find Relevant Benefits
                  </>
                )}
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4 mr-2 text-blue-700" />
                Apply to My Benefit Passport
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PREVIEW MATCHING RESULTS (Non-persistent preview)        */}
        {/* ======================================================== */}
        {previewRecs && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Potential benefits based on the information you provided</h3>
                <p className="text-emerald-800 mt-0.5">
                  Calculated using our deterministic matching engine against verified government schemes (Preview Mode).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {previewRecs.map((rec) => (
                <div
                  key={rec.schemeId}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                          {rec.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {rec.state === "All-India" ? "All-India" : `State: ${rec.state}`}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{rec.name}</h4>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        Match Score: <strong className="text-slate-900">{rec.matchScore}/100</strong>
                      </span>
                    </div>
                  </div>

                  {rec.benefitSummary && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-800">Benefit:</strong> {rec.benefitSummary}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="text-slate-500">{rec.explanation?.summary}</span>
                    <Link
                      to={`/dashboard/schemes/${rec.schemeId}`}
                      className="font-bold text-blue-700 hover:text-blue-800 inline-flex items-center flex-shrink-0"
                    >
                      View Scheme Checklist <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">Confirm Passport Update</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Review the detected details below. Gemini will never write to your Benefit Passport automatically without your explicit confirmation.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 mb-2">Proposed Profile Values:</div>
              {signals?.state && <div>• <strong>State:</strong> {signals.state}</div>}
              {signals?.category && <div>• <strong>Category:</strong> {signals.category}</div>}
              {signals?.qualification && <div>• <strong>Qualification:</strong> {signals.qualification}</div>}
              {signals?.occupationType && <div>• <strong>Occupation:</strong> {signals.occupationType}</div>}
              {signals?.annualIncome && (
                <div>• <strong>Annual Income:</strong> ₹{signals.annualIncome.toLocaleString("en-IN")}</div>
              )}
              {signals?.isFarmer && <div>• <strong>Farmer Status:</strong> Active Farmer</div>}
              {signals?.landholdingAcres && <div>• <strong>Landholding:</strong> {signals.landholdingAcres} Acres</div>}
              {signals?.age && <div>• <strong>Age:</strong> {signals.age} years</div>}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyPassport}
                disabled={applyingPassport}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white shadow-md transition-colors disabled:opacity-50"
              >
                {applyingPassport ? "Saving..." : "Confirm & Save to Passport"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
