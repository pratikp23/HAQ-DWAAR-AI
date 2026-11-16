import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Chip from "../../components/common/Chip";
import {
  getCoachRoadmap,
  saveOfficialReference,
  getPrintableFormUrl,
} from "../../services/schemeCoachApi";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  Printer,
  Send,
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldCheck,
  FileText,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Download,
  Building2,
  User,
  BadgeCheck,
  Bot,
  Compass,
  MapPin
} from "lucide-react";
import toast from "../../components/common/Toast";
import ErrorState from "../../components/common/ErrorState";
import { Skeleton, TableSkeleton } from "../../components/common/Skeleton";
import { formatUserError } from "../../utils/formatUserError";

export default function SchemeCoach() {
  const { schemeId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stepper State: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);

  // Pre-flight checked items
  const [checkedPreFlight, setCheckedPreFlight] = useState({});

  // 1-Tap Copy state tracking: { [fieldId]: boolean }
  const [copiedFields, setCopiedFields] = useState({});

  // Acknowledgement Saver state
  const [refNumberInput, setRefNumberInput] = useState("");
  const [refNotesInput, setRefNotesInput] = useState("");
  const [savingRef, setSavingRef] = useState(false);
  const [refSavedSuccess, setRefSavedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCoachRoadmap(schemeId);
        const roadmapData = res?.data || res;
        if (isMounted && (res?.success || res?.data?.success || roadmapData?.scheme || roadmapData?.steps)) {
          setRoadmap(roadmapData);
          // If citizen already applied, pre-fill reference
          if (roadmapData?.tracker?.referenceNumber) {
            setRefNumberInput(roadmapData.tracker.referenceNumber);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || "Failed to load SchemeCoach guide.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRoadmap();
    return () => {
      isMounted = false;
    };
  }, [schemeId]);

  // Copy to clipboard helper
  const handleCopy = (fieldId, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedFields((prev) => ({ ...prev, [fieldId]: true }));
    setTimeout(() => {
      setCopiedFields((prev) => ({ ...prev, [fieldId]: false }));
    }, 2000);
  };

  // Text-to-Speech Hindi Audio helper
  const handleSpeakHindi = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Save official reference number
  const handleSaveReference = async (e) => {
    e?.preventDefault();
    if (!refNumberInput.trim()) return;

    setSavingRef(true);
    try {
      const res = await saveOfficialReference(schemeId, {
        referenceNumber: refNumberInput.trim(),
        notes: refNotesInput.trim(),
      });
      if (res?.success || res?.data?.success || res?.data) {
        setRefSavedSuccess(true);
        toast.success("Acknowledgement saved", {
          description: "Your official reference number is securely mapped in your tracker.",
        });
      }
    } catch (err) {
      const sanitized = formatUserError(err);
      toast.error(sanitized.title, { description: sanitized.message });
    } finally {
      setSavingRef(false);
    }
  };

  const stepsMeta = [
    { number: 1, title: "पात्रता जाँच", subtitle: "Eligibility Check" },
    { number: 2, title: "दस्तावेज़", subtitle: "Documents" },
    { number: 3, title: "पोर्टल तैयारी", subtitle: "Pre-Flight" },
    { number: 4, title: "फॉर्म गाइड", subtitle: "Cheat Sheet" },
    { number: 5, title: "पोर्टल व रसीद", subtitle: "Portal & Ref" },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="p-8 rounded-2xl bg-[#eef5f0] border border-[#c6decb] space-y-3">
          <Skeleton animationType="shimmer" className="h-6 w-56 bg-[#d8ebd9] rounded-lg" />
          <Skeleton animationType="shimmer" className="h-4 w-80 bg-[#d8ebd9] rounded-md" />
        </div>
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ErrorState
          title="Scheme Coach Unavailable"
          message="We could not generate the step-by-step guidance for this scheme right now."
          error={error}
          showHome={true}
        />
      </div>
    );
  }

  const { scheme, eligibility, documents, preFlight, formGuide, tracker } = roadmap;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
          <Link
            to={`/dashboard/schemes/${scheme.id}`}
            className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            वापस योजना विवरण पर जाएँ (Scheme Details)
          </Link>

          <a
            href={getPrintableFormUrl(scheme.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-700" />
            <span>Print Pre-Filled Form</span>
          </a>
        </div>

        {/* Scheme Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#112318] via-[#1a3826] to-[#234731] text-white p-6 sm:p-7 rounded-3xl border border-[#234731]/60 shadow-md space-y-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ea580c] text-white shadow-xs">
              <Compass className="w-3 h-3 text-white shrink-0" />
              <span>Lok Samarth SchemeCoach</span>
            </span>
            <span className="text-[#c8ded0] text-xs font-bold">
              अनुमानित समय: ~{preFlight.estimatedTimeMinutes} मिनट
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{scheme.name}</h1>
          <p className="text-xs sm:text-sm text-[#ebf3ed] leading-relaxed font-medium">
            लाभांश: <span className="text-amber-400 font-bold">{scheme.benefitSummary}</span>
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto no-scrollbar">
          <div className="grid grid-cols-5 min-w-[320px] sm:min-w-0 gap-1 sm:gap-2">
            {stepsMeta.map((s) => {
              const isActive = currentStep === s.number;
              const isPast = currentStep > s.number;
              return (
                <button
                  key={s.number}
                  onClick={() => setCurrentStep(s.number)}
                  className={`py-2 px-1 sm:px-3 rounded-xl text-center transition flex flex-col items-center cursor-pointer ${
                    isActive
                      ? "bg-[#112318] text-white font-bold shadow-xs"
                      : isPast
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black">{s.number}</span>
                  <span className="text-[10px] sm:text-xs truncate w-full">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: ELIGIBILITY CHECK */}
        {currentStep === 1 && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                  चरण 1 (Step 1 of 5)
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  पात्रता जाँच (Eligibility Rule Check)
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                eligibility.isEligible ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              }`}>
                {eligibility.matchScore}% Match
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {eligibility.summary}
            </p>

            {/* Rule Checklist Cards */}
            <div className="space-y-2.5">
              {eligibility.ruleResults.map((r, idx) => {
                const isPass = r.status === "PASS";
                const isFail = r.status === "FAIL";
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-start space-x-3 text-xs ${
                      isPass
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                        : isFail
                        ? "bg-rose-50/50 border-rose-200 text-rose-950"
                        : "bg-amber-50/50 border-amber-200 text-amber-950"
                    }`}
                  >
                    {isPass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : isFail ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">{r.label}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{r.explanation}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center px-5 py-2.5 bg-[#112318] hover:bg-[#1a3826] text-white font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                <span>अगला: दस्तावेज़ देखें (Next: Documents)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DOCUMENT CHECKLIST */}
        {currentStep === 2 && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                  चरण 2 (Step 2 of 5)
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  आवश्यक दस्तावेज़ (Required Document Checklist)
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                documents.isReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {documents.missingCount === 0 ? "सभी दस्तावेज़ तैयार" : `${documents.missingCount} दस्तावेज़ बाकी`}
              </span>
            </div>

            <div className="space-y-3">
              {documents.checklist.map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition ${
                    doc.isAvailableInVault
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-white border-amber-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {doc.isAvailableInVault ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {doc.documentType.replace(/_/g, " ")}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {doc.guidance || "Official government certified document."}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      doc.isAvailableInVault ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {doc.isAvailableInVault ? "Vault me uplabdh" : "Missing"}
                    </span>
                  </div>

                  {/* "How to get this document" if missing */}
                  {!doc.isAvailableInVault && (
                    <div className="mt-3 pt-3 border-t border-amber-100 text-xs text-slate-700 space-y-1 bg-amber-50/50 p-2.5 rounded-xl">
                      <div className="font-bold text-amber-950 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>यह दस्तावेज़ कहाँ से प्राप्त करें?</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        • स्थान: <strong>{doc.howToGetHindi}</strong>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        • अनुमानित सरकारी शुल्क: <strong>{doc.estimatedCostHindi}</strong>
                      </div>
                      {doc.onlinePortalUrl && (
                        <div className="pt-1">
                          <a
                            href={doc.onlinePortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[11px] font-bold text-emerald-800 hover:underline"
                          >
                            <span>ऑनलाइन पोर्टल खोलें</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                पिछला (Back)
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center px-5 py-2.5 bg-[#112318] hover:bg-[#1a3826] text-white font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                <span>अगला: पोर्टल तैयारी (Next: Pre-Flight)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRE-FLIGHT READINESS CHECK */}
        {currentStep === 3 && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                  चरण 3 (Step 3 of 5)
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  पोर्टल तैयारी चेकलिस्ट (Pre-Flight Readiness)
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Session Timeout से बचाव
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              सरकारी वेबसाइट पर फॉर्म भरते समय 10-15 मिनट में सेशन समाप्त (Timeout) हो जाता है। कृपया पोर्टल खोलने से पहले नीचे दी गई चीज़ें अपने पास तैयार रखें:
            </p>

            <div className="space-y-2.5">
              {preFlight.checklist.map((item, idx) => {
                const isChecked = checkedPreFlight[idx];
                return (
                  <label
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-start space-x-3 cursor-pointer transition select-none text-xs ${
                      isChecked
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={(e) =>
                        setCheckedPreFlight((prev) => ({ ...prev, [idx]: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">{item.itemTitleHindi}</div>
                      <div className="text-[11px] text-slate-500">{item.guidanceHindi}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                पिछला (Back)
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center px-5 py-2.5 bg-[#112318] hover:bg-[#1a3826] text-white font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                <span>अगला: फॉर्म गाइड व कॉपी चीट शीट (Next: Form Guide)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FORM GUIDE & LIVE CHEAT SHEET */}
        {currentStep === 4 && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                  चरण 4 (Step 4 of 5)
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  लाइव फॉर्म गाइड (Live Form Companion &amp; Cheat Sheet)
                </h2>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1">
                <Copy className="w-3 h-3 text-orange-600" />
                <span>1-Tap Copy Active</span>
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start space-x-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                सरकारी पोर्टल पर जो बॉक्स पूछे जाएंगे, उनके सही उत्तर नीचे दिए गए हैं। आप <strong>[ Copy ]</strong> बटन दबाकर पोर्टल में सीधे पेस्ट कर सकते हैं।
              </p>
            </div>

            {/* Field-by-Field Cards */}
            <div className="space-y-4">
              {formGuide.fields.map((field) => {
                const isCopied = copiedFields[field.fieldId];
                return (
                  <div
                    key={field.fieldId}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        </span>
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            {field.fieldLabelHindi}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {field.fieldLabel}
                          </div>
                        </div>
                      </div>

                      {/* Voice Audio Listen Button */}
                      <button
                        onClick={() => handleSpeakHindi(field.voicePrompt || field.explanationHindi)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50 text-[11px] font-bold cursor-pointer"
                        title="आवाज़ में सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>सुनें</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{field.explanationHindi}</span>
                    </p>

                    {/* Pre-filled Value Display with 1-Tap Copy */}
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          आपके पासपोर्ट से मान (Value to Enter)
                        </span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {field.preFilledValue || field.exampleValue || "Not available"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(field.fieldId, field.preFilledValue || field.exampleValue)}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-[#112318] hover:bg-[#1a3826] text-white"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {field.commonMistakes?.length > 0 && (
                      <div className="text-[10px] text-amber-800 font-medium flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>सावधानी: {field.commonMistakes[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Common Trap Alerts */}
            {formGuide.commonTraps?.length > 0 && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <div className="font-bold text-amber-950 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>सरकारी पोर्टल की सामान्य गलतियों से बचें (Common Traps):</span>
                </div>
                <ul className="list-disc list-inside text-amber-900 text-[11px] space-y-1">
                  {formGuide.commonTraps.map((t, idx) => (
                    <li key={idx}>
                      <strong>{t.trapTitleHindi}:</strong> {t.solutionHindi}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                पिछला (Back)
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center px-5 py-2.5 bg-[#112318] hover:bg-[#1a3826] text-white font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                <span>अगला: सरकारी पोर्टल व रसीद (Next: Launch Portal)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: LAUNCH PORTAL & SAVE ACKNOWLEDGEMENT */}
        {currentStep === 5 && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                  चरण 5 (Step 5 of 5)
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  सरकारी पोर्टल खोलें एवं रसीद नंबर दर्ज करें
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Ready to Apply
              </span>
            </div>

            {/* Launch Official Portal Button */}
            <div className="p-6 bg-gradient-to-r from-[#112318] via-[#1a3826] to-[#234731] text-white rounded-3xl space-y-3 text-center shadow-lg border border-[#234731]/60">
              <h3 className="text-base font-bold">
                आधिकारिक सरकारी पोर्टल पर आवेदन करें
              </h3>
              <p className="text-xs text-[#c8ded0] max-w-md mx-auto">
                नीचे दिए गए बटन को क्लिक करें। सरकारी पोर्टल नए टैब में खुलेगा। पिछले चरण में दी गई चीट शीट देखकर फॉर्म पूरा करें।
              </p>
              <div className="pt-2">
                <a
                  href={scheme.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl font-black text-sm shadow-md transition transform hover:scale-102 cursor-pointer active:scale-95"
                >
                  <span>आधिकारिक पोर्टल खोलें ({new URL(scheme.officialApplicationUrl).hostname})</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Save Government Acknowledgement Ref */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>फॉर्म भरने के बाद प्राप्त Acknowledgement / Reference Number सेव करें</span>
              </h4>
              <p className="text-xs text-slate-600">
                जब आप सरकारी पोर्टल पर आवेदन पूरा कर लेंगे, तो आपको एक रसीद संख्या (Reference Number) मिलेगी। उसे यहाँ सेव करें ताकि Lok Samarth आपके आवेदन को ट्रैक कर सके।
              </p>

              {refSavedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>आवेदन संदर्भ संख्या सफलतापूर्वक Application Tracker में सेव हो गई है!</span>
                </div>
              )}

              <form onSubmit={handleSaveReference} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    सरकारी रसीद / संदर्भ संख्या (Official Reference No.) *
                  </label>
                  <input
                    type="text"
                    required
                    value={refNumberInput}
                    onChange={(e) => setRefNumberInput(e.target.value)}
                    placeholder="e.g. UP/2026/KISAN/98214"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    कोई व्यक्तिगत नोट या फॉलो-अप तारीख (Optional)
                  </label>
                  <input
                    type="text"
                    value={refNotesInput}
                    onChange={(e) => setRefNotesInput(e.target.value)}
                    placeholder="e.g. तहसील में 10 दिन बाद सत्यापन होना है"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="submit"
                    disabled={savingRef || !refNumberInput.trim()}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    {savingRef ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>सेव हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>रसीद नंबर सेव करें</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                पिछला (Back to Form Guide)
              </button>

              <Link
                to="/dashboard/applications"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#112318] hover:bg-[#1a3826] text-white rounded-2xl text-xs font-bold transition"
              >
                <span>मेरे आवेदन देखें (View Application Tracker)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
    </div>
  );
}
