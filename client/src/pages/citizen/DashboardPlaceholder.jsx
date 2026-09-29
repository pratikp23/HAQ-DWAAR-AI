import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import Navbar from "../../components/layout/Navbar";
import { getProfile } from "../../services/profileApi";
import { getRecommendations } from "../../services/matchingApi";
import { getDocuments } from "../../services/documentApi";
import { getApplications, createApplication } from "../../services/applicationApi";
import { getCitizenNotifications, getUnreadCount } from "../../services/notificationApi";
import ReadinessRing from "../../components/dashboard/ReadinessRing";
import CscAssistanceCard from "../../components/dashboard/CscAssistanceCard";
import AiMitraVoiceModal from "../../components/dashboard/AiMitraVoiceModal";
import {
  Mic,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Bell,
  Briefcase,
  ExternalLink,
  RefreshCw,
  Phone,
  Share2,
  Download,
  Volume2,
  Check,
  X,
  Clock,
  ChevronRight,
  Layers,
  GraduationCap,
  Sprout,
  HeartPulse,
  Landmark,
  UserCheck,
  ChevronDown
} from "lucide-react";

export default function DashboardPlaceholder() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Data states
  const [profileData, setProfileData] = useState(null);
  const [completeness, setCompleteness] = useState(0);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [vaultDocuments, setVaultDocuments] = useState([]);
  const [trackedApps, setTrackedApps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // UI Interactive states
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedSector, setSelectedSector] = useState(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [fontSize, setFontSize] = useState("normal"); // 'small', 'normal', 'large'
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const speechRecognitionRef = useRef(null);

  // Fetch all citizen data from Phases 1–11 APIs
  const fetchDashboardData = async () => {
    try {
      const [profileRes, matchRes, docRes, appsRes, notifRes, unreadRes] = await Promise.allSettled([
        getProfile(),
        getRecommendations(),
        getDocuments(),
        getApplications(),
        getCitizenNotifications({ limit: 4 }),
        getUnreadCount(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value?.data) {
        setProfileData(profileRes.value.data.profile);
        setCompleteness(profileRes.value.data.profileCompleteness || 0);
      }

      if (matchRes.status === "fulfilled" && matchRes.value?.data?.data?.recommendations) {
        setMatchedSchemes(matchRes.value.data.data.recommendations);
      }

      if (docRes.status === "fulfilled" && docRes.value?.data?.data?.documents) {
        setVaultDocuments(docRes.value.data.data.documents);
      }

      if (appsRes.status === "fulfilled" && appsRes.value?.data?.data?.applications) {
        setTrackedApps(appsRes.value.data.data.applications);
      }

      if (notifRes.status === "fulfilled" && notifRes.value?.data?.data?.notifications) {
        setNotifications(notifRes.value.data.data.notifications);
      }

      if (unreadRes.status === "fulfilled" && unreadRes.value?.data?.data?.unreadCount !== undefined) {
        setUnreadCount(unreadRes.value.data.data.unreadCount);
      }
    } catch (err) {
      console.warn("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Web Speech API Voice Recognition
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceModalOpen(true);
      return;
    }

    try {
      if (isListening && speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      speechRecognitionRef.current = recognition;
      recognition.lang = language === "mr" ? "mr-IN" : language === "en" ? "en-IN" : "hi-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setVoiceQuery(transcript);
        setVoiceModalOpen(true);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceModalOpen(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceModalOpen(true);
    }
  };

  // Text-to-Speech audio reader
  const handlePlayAudio = () => {
    if (!("speechSynthesis" in window)) return;
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      return;
    }

    const citizenName = profileData?.personal?.fullName || user?.name || "Citizen";
    let textToSpeak = `${t("greeting", "नमस्ते")} ${citizenName}! `;
    if (language === "en") {
      textToSpeak += `Based on your profile on HAQ DWAAR AI, over 48,000 rupees in annual welfare benefits have been identified. Your overall readiness is 82 percent.`;
    } else if (language === "mr") {
      textToSpeak += `हकद्वार एआय मध्ये आपल्या प्रोफाइलनुसार ४८ हजार रुपयांपेक्षा जास्त वार्षिक शासकीय लाभ ओळखले गेले आहेत. आपली समग्र सज्जता ८२ टक्के आहे.`;
    } else {
      textToSpeak += `हकद्वार एआई में आपके प्रोफाइल के आधार पर कुल 48 हजार रुपये से अधिक के वार्षिक सरकारी लाभ पहचाने गए हैं। आपकी समग्र तत्परता 82 प्रतिशत है।`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === "mr" ? "mr-IN" : language === "en" ? "en-IN" : "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);

    setAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // 1-Click Track Scheme handler
  const handleTrackScheme = async (schemeId, schemeName) => {
    try {
      await createApplication({ schemeId, notes: "Tracked from Citizen Dashboard" });
      setActionSuccess(`"${schemeName}" added to Application Tracker!`);
      fetchDashboardData();
      setTimeout(() => setActionSuccess(""), 5000);
    } catch (err) {
      console.warn("Track scheme error:", err);
    }
  };

  // Filter schemes
  const filteredSchemes = matchedSchemes.filter((item) => {
    if (selectedSector && item.category !== selectedSector) return false;
    if (selectedFilter === "HIGH_MATCH") return item.matchScore >= 90;
    if (selectedFilter === "KISAN") return item.category === "KISAN";
    if (selectedFilter === "STUDENT") return item.category === "STUDENT";
    return true;
  });

  const fontScaleClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";

  return (
    <div className={`min-h-screen bg-[#f7f5fa] text-[#0f172a] font-sans antialiased pb-20 md:pb-12 ${fontScaleClass}`}>
      {/* Top Global Navigation Bar with Language Dropdown */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Action Success Toast */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess("")} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. CITIZEN HERO & READINESS SPLIT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Card: Citizen Identity & Entitlement Banner (7 cols) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#1e0a3c] via-[#240b49] to-[#2a0e4f] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none select-none">
              <span className="text-9xl font-black">ह</span>
            </div>

            <div className="space-y-4">
              {/* Header tags & Audio trigger */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    {t("greeting", "नमस्ते")}, {profileData?.personal?.fullName || user?.name || "प्रतीक कुमार"}!
                  </h1>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {t("verifiedCitizen", "सत्यापित नागरिक")}
                  </span>
                </div>
                <button
                  onClick={handlePlayAudio}
                  type="button"
                  className={`p-2 rounded-xl border transition flex items-center space-x-1.5 text-xs font-bold ${
                    audioPlaying
                      ? "bg-[#ea580c] text-white border-orange-400 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-purple-200 border-white/15"
                  }`}
                  title="Audio Narration"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("audioNarration", "ध्वनि / Audio")}</span>
                </button>
              </div>

              {/* Subtitle / Location */}
              <p className="text-xs sm:text-sm text-purple-200 font-semibold flex flex-wrap items-center gap-2">
                <span>📍 {profileData?.personal?.district || "Samastipur"}, {profileData?.personal?.state || "Bihar"}</span>
                <span>•</span>
                <span>Gram Panchayat Kalyanpur</span>
                <span>•</span>
                <span>राशन: NFSA</span>
              </p>

              {/* Entitlement Highlight Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-200">
                  {t("totalEntitlements", "TOTAL IDENTIFIED ENTITLEMENTS • कुल पहचानी गई पात्रता")}
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    ₹48,000+
                  </span>
                  <span className="text-xs sm:text-sm text-purple-200 font-bold">
                    {t("annualWelfare", "वार्षिक सरकारी लाभ (Annual Welfare Benefits)")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ ₹36,000 {t("directCashDbt", "Direct Cash DBT")}
                  </span>
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/30">
                    ✓ ₹12,000 {t("tuitionSkillSubsidy", "Tuition & Skill Subsidy")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-5 border-t border-white/10 mt-5">
              <Link
                to="/dashboard/applications"
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-white text-[#240b49] hover:bg-purple-50 transition shadow-xs"
              >
                <Briefcase className="w-4 h-4 mr-1.5 text-[#591d8f]" />
                {t("checkAppStatus", "Check Application Status")} ({trackedApps.length})
              </Link>
              <Link
                to="/dashboard/benefit-passport"
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition"
              >
                <FileText className="w-4 h-4 mr-1.5 text-purple-200" />
                Passport ({completeness}%)
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "HAQ DWAAR AI - My Welfare Benefits",
                      text: "I checked my verified government welfare benefits on HAQ DWAAR AI!",
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                className="inline-flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-purple-200 transition"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
            </div>
          </div>

          {/* Right Card: Benefit Readiness & Vault Check (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {t("benefitReadiness", "Benefit Readiness")}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {t("readinessSubtitle", "समग्र पात्रता व दस्तावेज़ स्थिति")}
                  </p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("aadhaarLinked", "Aadhaar Linked")}
                </span>
              </div>

              {/* Gauge & Details */}
              <div className="flex items-center space-x-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <ReadinessRing score={82} size={88} strokeWidth={8} />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {t("veryHighMatch", "Very High Eligibility Match")}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-snug">
                    {t("readinessDescription", "4 verified certificates out of 6 required for complete entitlement unlocking.")}
                  </p>
                  <div className="flex items-center space-x-2 pt-0.5 text-[11px] font-bold">
                    <span className="text-emerald-700">✓ 4 {t("verifiedCount", "Verified")}</span>
                    <span className="text-amber-700">• 2 {t("actionPending", "Action Pending")}</span>
                  </div>
                </div>
              </div>

              {/* Blocker Alert Notice */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-[#fff7f4] border border-[#ea580c]/30 text-xs text-[#a83210] flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">
                    {t("blockerAlert", "2 Documents required to unlock remaining grants:")}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    {t("blockerDetails", "Income Certificate and Land Record are pending.")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sync DigiLocker CTA */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/dashboard/documents"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-[#240b49] hover:bg-[#1e0a3c] text-white shadow-xs transition"
              >
                <RefreshCw className="w-4 h-4 mr-2 text-purple-300" />
                {t("syncDigilocker", "Sync DigiLocker to Auto-Unlock (ऑटो-सिंक करें)")}
              </Link>
            </div>
          </div>
        </section>

        {/* 2. AI MITRA • जन सहायक वॉइस (Voice & Dialect Interaction Hub) */}
        <section className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#3b1261] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-center space-y-5">
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/40 text-xs font-black text-orange-300">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse"></span>
              <span>{t("aiMitraTitle", "AI MITRA • जन सहायक वॉइस (LIVE 24x7)")}</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 font-semibold">
              {t("aiMitraSub", "Bilingual & Dialect Aware (Hindi, Bhojpuri, Maithili, English)")}
            </p>
          </div>

          {/* Central Glowing Saffron Microphone Button */}
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <button
              onClick={handleMicClick}
              type="button"
              className={`w-20 h-20 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center shadow-lg transition transform hover:scale-105 active:scale-95 relative ${
                isListening ? "ring-8 ring-orange-400/50 animate-pulse" : "hover:ring-4 hover:ring-orange-300/30"
              }`}
              title="Click and speak"
            >
              <Mic className="w-9 h-9" />
              {isListening && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
              )}
            </button>
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-black text-white">
                "{t("micPrompt", "बोलकर अपनी समस्या या ज़रूरत बताएं")}"
              </h3>
              <p className="text-xs text-purple-200 mt-0.5 font-medium">
                {t("micSubtext", "Click the mic & ask anything in Hindi or regional dialects. No typing needed.")}
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={voiceQuery}
              onChange={(e) => setVoiceQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && voiceQuery.trim()) {
                  setVoiceModalOpen(true);
                }
              }}
              placeholder={t("searchInputPlaceholder", "या यहाँ लिखें, जैसे: मुझे खाद सब्सिडी या बेटी की छात्रवृत्ति चाहिए...")}
              className="w-full pl-4 pr-32 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-purple-200/60 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            />
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl text-xs font-black bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center shadow-xs transition"
            >
              {t("searchButton", "खोजें (Ask AI)")}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Quick-tap Prompt Chips */}
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 pt-1">
            {[
              { label: "⚡ 'मेरी बेटी की कॉलेज फीस में छात्रवृत्ति कैसे मिलेगी?'", q: "मेरी बेटी की कॉलेज फीस में छात्रवृत्ति कैसे मिलेगी?" },
              { label: "⚡ 'पीएम किसान सम्मान निधि की 17वीं किस्त कब आएगी?'", q: "पीएम किसान सम्मान निधि 17वीं किस्त की स्थिति" },
              { label: "⚡ 'पीएम आवास योजना ग्रामीण की पात्रता कैसे चेक करें?'", q: "पीएम आवास योजना ग्रामीण पात्रता" },
              { label: "⚡ 'सिलाई मशीन टूल किट योजना का आवेदन कैसे करें?'", q: "सिलाई मशीन टूलकिट योजना आवेदन" },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setVoiceQuery(chip.q);
                  setVoiceModalOpen(true);
                }}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 border border-white/15 transition"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. QUICK LIFE-SITUATION SECTORS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-[#591d8f]" />
              {t("sectorsTitle", "त्वरित श्रेणियां (Life-Situation Sectors)")}
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {t("sectorsSub", "5 प्रमुख कल्याणकारी क्षेत्र")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              {
                id: "STUDENT",
                title: t("sectorEducation", "शिक्षा व छात्रवृत्ति"),
                eng: "Education & Scholarships",
                tag: "High Grant",
                count: "14 Active Schemes",
                icon: GraduationCap,
                color: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                id: "KISAN",
                title: t("sectorKisan", "खेती व किसान"),
                eng: "Agriculture & Kisan Grants",
                tag: "Instant DBT",
                count: "8 Active Schemes",
                icon: Sprout,
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
              {
                id: "EMPLOYMENT",
                title: t("sectorVocational", "रोज़गार व कौशल"),
                eng: "Vocational & Toolkit",
                tag: "PMKVY 4.0",
                count: "11 Active Schemes",
                icon: Briefcase,
                color: "bg-purple-50 text-purple-700 border-purple-200",
              },
              {
                id: "HEALTH",
                title: t("sectorHealth", "स्वास्थ्य सुरक्षा"),
                eng: "Ayushman & Health",
                tag: "₹5L Cover",
                count: "6 Active Schemes",
                icon: HeartPulse,
                color: "bg-rose-50 text-rose-700 border-rose-200",
              },
              {
                id: "GENERAL",
                title: t("sectorPension", "पेंशन व सुरक्षा"),
                eng: "Social Security & Old Age",
                tag: "Direct Cash",
                count: "9 Active Schemes",
                icon: Landmark,
                color: "bg-amber-50 text-amber-700 border-amber-200",
              },
            ].map((sector) => {
              const IconComp = sector.icon;
              const isSelected = selectedSector === sector.id;
              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(isSelected ? null : sector.id)}
                  type="button"
                  className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-purple-50 border-[#591d8f] ring-2 ring-[#591d8f]/30 shadow-xs"
                      : "bg-white border-slate-200 hover:border-purple-200 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${sector.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {sector.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      {sector.title}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 truncate">{sector.eng}</p>
                    <p className="text-[11px] font-extrabold text-[#591d8f] mt-1.5 flex items-center">
                      {sector.count} <ChevronRight className="w-3 h-3 ml-0.5" />
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. MAIN SPLIT: 8-COL SCHEMES + 4-COL SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 8 COLUMNS: Top Recommended Schemes */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Header & Filter Pill Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                  {t("topRecommendedTitle", "आपके लिए अनुशंसित शीर्ष योजनाएं")}
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Total {matchedSchemes.length || 12} {t("qualifiedCount", "Qualified Schemes")} based on Benefit Passport
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "ALL", label: t("allMatches", "All Matches") },
                  { id: "HIGH_MATCH", label: t("highMatch", "High Match (>90%)") },
                  { id: "STUDENT", label: t("sectorEducation", "Education") },
                  { id: "KISAN", label: t("sectorKisan", "Kisan & Agriculture") },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedFilter(pill.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                      selectedFilter === pill.id
                        ? "bg-[#240b49] text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Cards */}
            <div className="space-y-4">
              {/* Card 1: Education Grant */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-purple-200 transition space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      STATE GOVT OF BIHAR
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Higher Education</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    95% Match (Income & Caste Match)
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    मुख्यमंत्री मेधावी विद्यार्थी योजना (Mukhyamantri Medhavi Vidyarthi Yojana)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                    State-sponsored affirmative sponsorship for meritorious rural candidates pursuing engineering, medical, and general undergraduate university programs.
                  </p>
                </div>

                {/* Benefit Pill */}
                <div className="p-3.5 bg-purple-50/80 border border-purple-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#591d8f] block">
                      TUITION FEE REIMBURSEMENT GRANT
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      Up to ₹1,50,000 / Academic Year
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-white text-purple-900 border border-purple-200 shadow-2xs">
                    Direct to College DBT
                  </span>
                </div>

                {/* Auto-matched Criteria Chips from DigiLocker */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tight">
                    Criteria Auto-Matched from DigiLocker:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold flex items-center">
                      <Check className="w-3 h-3 mr-1 text-emerald-600" /> Bihar Domicile (Verified)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold flex items-center">
                      <Check className="w-3 h-3 mr-1 text-emerald-600" /> 12th Marks ≥ 78% (76.4%)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold flex items-center">
                      <Check className="w-3 h-3 mr-1 text-emerald-600" /> Family &lt; ₹3 Lakhs/Yr
                    </span>
                  </div>
                </div>

                {/* Blocker Alert Box */}
                <div className="p-3.5 bg-[#fff7f4] border border-[#ea580c]/30 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-[#a83210]">
                    <AlertTriangle className="w-4 h-4 text-[#ea580c] shrink-0" />
                    <div>
                      <span className="font-black">⚠️ {t("missingDocument", "दस्तावेज़ अनुपलब्ध:")} Income Certificate (आय प्रमाण पत्र)</span>
                      <p className="text-[10px] text-slate-600 font-medium">
                        Validity required after 1st April 2024 to initiate automatic sanction.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/documents"
                    className="px-3 py-1.5 rounded-lg text-xs font-black bg-[#ea580c] hover:bg-[#c2410c] text-white shrink-0 transition"
                  >
                    {t("fetchDigilocker", "1-Click Fetch DigiLocker")}
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to="/dashboard/readiness/6abb060778213f9aa29122a1"
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#240b49] hover:bg-[#1e0a3c] text-white shadow-xs transition"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5 text-orange-400" />
                    {t("viewActionPlan", "View Action Plan & Readiness")}
                  </Link>
                  <a
                    href="https://medhasoft.bih.nic.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {t("officialPortal", "Official Portal Link")}
                  </a>
                </div>
              </div>

              {/* Card 2: PM-Kisan Samman Nidhi */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-purple-200 transition space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      CENTRAL GOVT
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Agriculture & Farmers</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    100% Match • Active Beneficiary
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    PM-Kisan Samman Nidhi (17वीं किस्त / 17th Installment)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                    Direct income support of ₹6,000 per year in three equal 4-monthly installments directly credited to Aadhaar-seeded Jan Dhan accounts.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 flex items-center">
                    ✓ e-KYC Completed
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 font-extrabold border border-blue-200 flex items-center">
                    ✓ NPCI Seeding OK
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 font-extrabold border border-amber-200 flex items-center">
                    Next: ₹2,000 in Aug 2026
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono font-bold text-xs">
                    Account: State Bank of India •••• 4091
                  </span>
                  <button
                    onClick={() => handleTrackScheme("6abb060778213f9aa29122a2", "PM-Kisan Samman Nidhi")}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#1e0a3c] hover:bg-[#240b49] text-white shadow-xs transition"
                  >
                    {t("trackStatus", "Track DBT Status")} →
                  </button>
                </div>
              </div>

              {/* Card 3: PM Vishwakarma */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-purple-200 transition space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      ALL INDIA
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Traditional Artisans & Trades</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                    88% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    PM Vishwakarma Yojana - Modern Toolkit Incentive & Collateral Loan
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                    Support for traditional rural trade craftspersons: ₹15,000 digital voucher for modern toolkits, stipend during training, and ₹1,00,000 credit at 5% interest rate.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-black uppercase block">TOOLKIT GRANT</span>
                    <span className="font-black text-slate-900 text-sm">₹15,000 E-Voucher</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-black uppercase block">TRAINING STIPEND</span>
                    <span className="font-black text-slate-900 text-sm">₹500 / Day</span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                  <Link
                    to="/dashboard/recommendations"
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                  >
                    {t("checkEligibility", "Check Eligibility & Apply")} →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Civic Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* DigiLocker Vault Health Card */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                    {t("vaultHealthTitle", "DigiLocker Vault Health")}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500">
                    {t("vaultHealthSub", "Official Government Repository Sync")}
                  </p>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("digilockerDirectApi", "Direct API v3")}
                </span>
              </div>

              {/* Document List */}
              <div className="p-4 space-y-2.5">
                {[
                  { name: "Aadhaar Card (UIDAI Verified)", sub: "UIDAI •••• 9912", status: "Verified", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                  { name: "Ration Card (NFSA Verified)", sub: "PHH Category • Kalyanpur", status: "Verified", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                  { name: "10th / 12th Board Certificate", sub: "BSEB Patna • 2021 Passed", status: "Verified", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                  { name: "Income Certificate (आय प्रमाण)", sub: "Expired (Issued 2022)", status: "Re-apply", color: "bg-rose-50 text-rose-800 border-rose-200" },
                  { name: "Land Record / Khatauni (खतौनी)", sub: "Action Pending", status: "Fetch", color: "bg-amber-50 text-amber-800 border-amber-200" },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-black text-slate-900 truncate text-xs">{doc.name}</p>
                      <p className="text-[10px] font-medium text-slate-500 truncate">{doc.sub}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 ${doc.color}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}

                <Link
                  to="/dashboard/documents"
                  className="w-full text-center block pt-2 text-xs font-black text-[#591d8f] hover:underline"
                >
                  {t("manageVault", "Manage DigiLocker Vault")} ({vaultDocuments.length || 6}) →
                </Link>
              </div>
            </div>

            {/* CSC Local Assistance Center Card */}
            <CscAssistanceCard
              userDistrict={profileData?.personal?.district || "Samastipur"}
              userState={profileData?.personal?.state || "Bihar"}
            />

            {/* My Active Applications Snapshot */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1.5 text-blue-600" />
                  {t("navTracker", "Application Tracker")}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {trackedApps.length} Active
                </span>
              </div>

              {trackedApps.length > 0 ? (
                <div className="space-y-2">
                  {trackedApps.slice(0, 3).map((app, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 truncate text-xs">
                          {app.schemeId?.name || "Tracked Scheme"}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate">
                        {app.nextAction?.guidance || "Continue application steps"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No applications tracked yet. Click "Track" on any scheme to start.</p>
              )}

              <Link
                to="/dashboard/applications"
                className="w-full text-center block pt-1 text-xs font-black text-blue-700 hover:underline"
              >
                Open Full Application Tracker →
              </Link>
            </div>
          </div>
        </div>

        {/* 5. BOTTOM CITIZEN RIGHTS & GRIEVANCE BAR */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2.5 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-black text-slate-900 block">
                {t("rightsGuarantee", "हकद्वार नागरिक गारंटी (Citizens Rights Commitment)")}
              </span>
              <p className="text-xs text-slate-500 font-medium">
                {t("rightsSub", "Automated grievance escalation within 72 hours under National Public Service Guarantee Act.")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => alert("Grievance Escalation Portal link ready for active cases.")}
              className="text-xs font-extrabold text-[#591d8f] hover:underline"
            >
              {t("fileGrievance", "शिकायत दर्ज करें (File Grievance)")}
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => alert("RTI Status tracking module active.")}
              className="text-xs font-extrabold text-slate-600 hover:underline"
            >
              {t("checkRti", "RTI स्थिति जांचें")}
            </button>
          </div>
        </div>

        {/* 6. SOVEREIGN WELFARE NETWORK FOOTER */}
        <footer className="pt-6 border-t border-slate-200/80 space-y-4 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="font-black text-slate-800 text-sm">
                HaqDwaar Sovereign Welfare Network
              </p>
              <p className="text-xs text-slate-500 font-medium max-w-xl">
                {t("disclaimerNotice", "An affirmative citizen-first gateway powering automated scheme discovery, Aadhaar-consented entitlement matching, and direct benefit processing.")}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-black block uppercase">
                  {t("tollFree", "CITIZEN TOLL-FREE HELPLINE (24x7)")}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  1800-180-8841
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 text-[#591d8f] border border-purple-200">
                <Phone className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3 text-xs font-bold">
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="hover:text-slate-900">Privacy Policy (गोपनीयता नीति)</Link>
              <Link to="/citizen-charter" className="hover:text-slate-900">Citizen Charter (नागरिक अधिकार)</Link>
              <Link to="/rti" className="hover:text-slate-900">RTI Disclosure (सूचना का अधिकार)</Link>
              <Link to="/security" className="hover:text-slate-900">Security Compliance</Link>
            </div>

            {/* Accessibility dynamic font resizing */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-xs">Accessibility:</span>
              <button
                onClick={() => setFontSize("small")}
                className={`px-2 py-0.5 rounded font-black text-xs ${fontSize === "small" ? "bg-[#240b49] text-white" : "bg-slate-100 text-slate-700"}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("normal")}
                className={`px-2 py-0.5 rounded font-black text-xs ${fontSize === "normal" ? "bg-[#240b49] text-white" : "bg-slate-100 text-slate-700"}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-2 py-0.5 rounded font-black text-xs ${fontSize === "large" ? "bg-[#240b49] text-white" : "bg-slate-100 text-slate-700"}`}
              >
                A+
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-400 font-semibold pt-2">
            © 2026 Ministry of Public Welfare & Citizen Entitlement • HaqDwaar AI Framework. All citizen rights reserved.
          </p>
        </footer>
      </main>

      {/* AI Mitra Voice Modal */}
      <AiMitraVoiceModal
        isOpen={voiceModalOpen}
        initialQuery={voiceQuery}
        onClose={() => setVoiceModalOpen(false)}
        onPassportUpdated={fetchDashboardData}
      />
    </div>
  );
}
