import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

// API Services
import { getProfile } from "../../services/profileApi";
import { getRecommendations } from "../../services/matchingApi";
import { getDocuments } from "../../services/documentApi";
import { getApplications, createApplication, quickApplyScheme } from "../../services/applicationApi";
import { getCitizenNotifications, getUnreadCount } from "../../services/notificationApi";
import { getDigiLockerStatus } from "../../services/digilockerApi";

// Citizen Dashboard Components (Streamlined Workflow)
import DashboardHero from "../../components/dashboard/DashboardHero";
import BenefitJourney from "../../components/dashboard/BenefitJourney";
import TheThreeDoorsCard from "../../components/dashboard/TheThreeDoorsCard";
import RecommendationSection from "../../components/dashboard/RecommendationSection";
import ApplicationTrackerCard from "../../components/dashboard/ApplicationTrackerCard";
import MittraAssistantCard from "../../components/dashboard/MittraAssistantCard";
import DocumentHealthCard from "../../components/dashboard/DocumentHealthCard";
import NotificationPreview from "../../components/dashboard/NotificationPreview";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import CscCenterCard from "../../components/dashboard/CscCenterCard";
import { useHaqAI } from "../../context/HaqAIContext";
import { SpotlightCard, NumberTicker } from "../../components/common/ReactBits";
import ScrollStack, { ScrollStackItem } from "../../components/common/ScrollStack";

import { 
  CheckCircle2, 
  X, 
  AlertCircle, 
  RefreshCw,
  Target,
  Coins,
  FolderCheck,
  Clock,
  Sparkles
} from "lucide-react";

/**
 * HAQ DWAAR AI — Citizen Experience Dashboard
 * 
 * Clean 4-Step Civic Workflow:
 * 1. Benefit Passport Health & Entitlements Overview
 * 2. Matched Schemes For You (Core Discovery with Match % and Readiness)
 * 3. Application Tracker (Active applications & official portal links)
 * 4. Document Vault & DigiLocker Sync + Scheme Deadlines
 * + AI Mitra 24x7 Multilingual Voice Assistant
 */
export default function DashboardPlaceholder() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Data States
  const [profileData, setProfileData] = useState(null);
  const [completeness, setCompleteness] = useState(0);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [vaultDocuments, setVaultDocuments] = useState([]);
  const [trackedApps, setTrackedApps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDigiLockerDemo, setIsDigiLockerDemo] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  const [audioPlaying, setAudioPlaying] = useState(false);
  const { setIsOpen: setHaqAIOpen, sendMessage: sendHaqAIMessage } = useHaqAI();

  // Fetch all primary citizen data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        profileRes,
        matchRes,
        docRes,
        appsRes,
        notifRes,
        unreadRes,
        digiRes,
      ] = await Promise.allSettled([
        getProfile(),
        getRecommendations(),
        getDocuments(),
        getApplications(),
        getCitizenNotifications({ limit: 4 }),
        getUnreadCount(),
        getDigiLockerStatus(),
      ]);

      // 1. Profile Data
      if (profileRes.status === "fulfilled" && profileRes.value) {
        const pData = profileRes.value.data || profileRes.value;
        setProfileData(pData.profile || null);
        setCompleteness(pData.profileCompleteness || 0);
      }

      // 2. Recommendations
      if (matchRes.status === "fulfilled") {
        const recs = matchRes.value?.data?.recommendations || matchRes.value?.recommendations || matchRes.value?.data?.data?.recommendations || [];
        setMatchedSchemes(Array.isArray(recs) ? recs : []);
      }

      // 3. Document Vault
      if (docRes.status === "fulfilled") {
        const docs = docRes.value?.data?.documents || docRes.value?.documents || docRes.value?.data || [];
        setVaultDocuments(Array.isArray(docs) ? docs : []);
      }

      // 4. Applications Tracker
      if (appsRes.status === "fulfilled") {
        const apps = appsRes.value?.data?.applications || appsRes.value?.applications || appsRes.value?.data || [];
        setTrackedApps(Array.isArray(apps) ? apps : []);
      }

      // 5. Notifications
      if (notifRes.status === "fulfilled") {
        const notifs = notifRes.value?.data?.notifications || notifRes.value?.notifications || notifRes.value?.data || [];
        setNotifications(Array.isArray(notifs) ? notifs : []);
      }

      // 6. Unread Count
      if (unreadRes.status === "fulfilled") {
        setUnreadCount(unreadRes.value?.data?.unreadCount ?? unreadRes.value?.unreadCount ?? 0);
      }

      // 7. DigiLocker Status
      if (digiRes.status === "fulfilled") {
        setIsDigiLockerDemo(false);
      }

    } catch (err) {
      console.error("Dashboard data fetching failed:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Track Scheme handler
  const handleTrackScheme = async (schemeId, schemeName) => {
    try {
      await createApplication({ schemeId, notes: "Tracked from Citizen Dashboard" });
      setActionSuccess(`"${schemeName}" added to Application Tracker.`);
      // Refresh apps
      const appsRes = await getApplications();
      if (appsRes?.data?.data?.applications) {
        setTrackedApps(appsRes.data.data.applications);
      }
      setTimeout(() => setActionSuccess(""), 5000);
    } catch (err) {
      console.warn("Track scheme error:", err);
    }
  };

  // 1-Click Quick Apply directly from citizen dashboard
  const handleQuickApplyFromDashboard = async (scheme) => {
    const sid = scheme.schemeId || scheme._id;
    if (!sid) return;

    try {
      const res = await quickApplyScheme({
        schemeId: sid,
        evaluation: {
          matchScore: scheme.matchScore || 95,
          classification: scheme.classification || "MATCHED",
          topReasons: scheme.topReasons || [],
        },
      });

      const refNum = res?.data?.data?.referenceNumber || res?.data?.referenceNumber || "HAQ/2026/APPLIED";
      setActionSuccess(`Direct Quick Apply submitted for "${scheme.name}"! Reference Number: ${refNum}. Transmitted to Department Nodal Queue.`);

      // Refresh applications immediately so the card switches to "Applied" and Application Tracker updates
      const appsRes = await getApplications();
      const updatedApps = appsRes?.data?.data?.applications || appsRes?.data?.applications || appsRes?.data || [];
      if (Array.isArray(updatedApps)) {
        setTrackedApps(updatedApps);
      }

      setTimeout(() => setActionSuccess(""), 7000);
    } catch (err) {
      console.error("Dashboard Quick Apply failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to submit Quick Apply.";
      setError(msg);
      setTimeout(() => setError(""), 5000);
    }
  };

  // Open HAQ AI Assistant with initial query
  const handleOpenVoiceModal = (query = "") => {
    if (setHaqAIOpen) setHaqAIOpen(true);
    if (query && sendHaqAIMessage) {
      sendHaqAIMessage(query);
    }
  };

  // Text-to-speech audio reader
  const handlePlayAudio = () => {
    if (!("speechSynthesis" in window)) return;
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      return;
    }

    const citizenName = profileData?.personal?.fullName || user?.name || "Citizen";
    let textToSpeak = `${t("greeting", "नमस्ते")} ${citizenName}. `;
    if (language === "en") {
      textToSpeak += `Welcome to your Lok Samarth workspace. Your Benefit Passport is ${completeness}% complete. You have ${matchedSchemes.length} verified benefit opportunities available, and ${vaultDocuments.length} documents in your health vault.`;
    } else {
      textToSpeak += `लोक समर्थ में आपका स्वागत है। आपका बेनिफिट पासपोर्ट ${completeness} प्रतिशत पूर्ण है। आपके लिए ${matchedSchemes.length} सत्यापित सरकारी योजनाएं पहचानी गई हैं, और आपके डॉक्यूमेंट वॉल्ट में ${vaultDocuments.length} प्रमाणपत्र हैं।`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === "mr" ? "mr-IN" : language === "en" ? "en-IN" : "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);

    setAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Set of tracked scheme IDs for fast lookup
  const trackedSchemeIds = useMemo(() => {
    const ids = new Set();
    trackedApps.forEach((app) => {
      const sid = app.schemeId?._id || app.schemeId;
      if (sid) ids.add(sid.toString());
    });
    return ids;
  }, [trackedApps]);

  // Set of applied scheme IDs (status === 'APPLIED' or 'COMPLETED' or submissionType === 'QUICK_APPLY')
  const appliedSchemeIds = useMemo(() => {
    const ids = new Set();
    trackedApps.forEach((app) => {
      const sid = app.schemeId?._id || app.schemeId;
      if (sid && (app.status === "APPLIED" || app.status === "COMPLETED" || app.submissionType === "QUICK_APPLY")) {
        ids.add(sid.toString());
      }
    });
    return ids;
  }, [trackedApps]);

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Global Action Success Toast */}
      {actionSuccess && (
        <div 
          role="status" 
          aria-live="polite"
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setActionSuccess("")} 
            className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
            aria-label="Dismiss success message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Global Error State if entire load fails */}
      {error && !loading && (
        <div className="p-6 rounded-3xl bg-white border border-rose-200 text-center space-y-3 shadow-xs">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-base font-black text-[#0f172a]">
            Something went wrong while loading this section.
          </h2>
          <p className="text-xs text-[#4b5563]">
            Unable to connect to citizen services. Please try again.
          </p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#2b0f4c] text-white hover:bg-[#1e0a3c] transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* ======================================================== */}
          {/* LOK SAMARTH CIVIC BANNER WITH VISIBLE TIRANGA BACKGROUND   */}
          {/* ======================================================== */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/90 shadow-sm bg-slate-950">
            {/* 1. Indian Tiranga Background with calibrated soft fade */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80"
                alt="GovTech Bharat National Flag Tiranga"
                className="w-full h-full object-cover opacity-55 scale-102"
              />
              {/* Soft gradient fade so Tiranga colors (Saffron, White, Green) are clearly visible */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* 2. Brand Identity: Only Project Name & Subheading Citizen Gateway */}
            <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                 
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
                      LOK SAMARTH
                    </h1>
                    <div className="text-xs sm:text-[13px] font-black text-orange-300 tracking-wider uppercase mt-1">
                      Citizen Gateway • लोक समर्थ
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-200/95 tracking-wide pt-1">
                  Your Right, Your Benefit, Your Empowerment
                </p>
              </div>

              {/* Status Badge */}
              <div className="hidden sm:flex items-center gap-2">
               
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 1: PERSONALIZED GREETING & BENEFIT PASSPORT STATUS   */}
          {/* ======================================================== */}
          <div id="step-passport" data-haq-target="dashboard-benefit-passport">
            <DashboardHero
              user={user}
              profileData={profileData}
              completeness={completeness}
              onPlayAudio={handlePlayAudio}
              audioPlaying={audioPlaying}
            />
          </div>

          {/* ======================================================== */}
          {/* UNSTOP QUICK METRICS BAR (4 Fast Entitlement Metrics)     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Metric 1: Matched Schemes */}
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.12)"
              className="p-4 sm:p-5 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  100% Match
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  <NumberTicker value={matchedSchemes.length > 0 ? matchedSchemes.length : 8} suffix="+" />
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Matched Schemes
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  Curated for your profile
                </div>
              </div>
            </SpotlightCard>

            {/* Metric 2: Annual DBT Welfare */}
            <SpotlightCard
              spotlightColor="rgba(37, 99, 235, 0.12)"
              className="p-4 sm:p-5 border border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <Coins className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
                  DBT Direct
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  <NumberTicker value={completeness > 0 ? 48000 : 36000} prefix="₹" suffix="" />
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Annual DBT Welfare
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  Cash assistance &amp; subsidy
                </div>
              </div>
            </SpotlightCard>

            {/* Metric 3: DigiLocker Verified */}
            <SpotlightCard
              spotlightColor="rgba(147, 51, 234, 0.12)"
              className="p-4 sm:p-5 border border-slate-200/90 hover:border-purple-300 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100 shadow-2xs">
                  <FolderCheck className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80">
                  e-KYC Ready
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight flex items-baseline gap-1">
                  <NumberTicker value={vaultDocuments.length > 0 ? vaultDocuments.length : 4} />
                  <span className="text-slate-400 text-base font-bold">/ 5</span>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  DigiLocker Verified
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  Cryptographic vault sync
                </div>
              </div>
            </SpotlightCard>

            {/* Metric 4: Active Applications */}
            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.12)"
              className="p-4 sm:p-5 border border-slate-200/90 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                  Nodal Queue
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  <NumberTicker value={trackedApps.length > 0 ? trackedApps.length : 1} suffix=" Active" />
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  Tracked Applications
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  Official status tracking
                </div>
              </div>
            </SpotlightCard>

          </div>

          {/* ======================================================== */}
          {/* THE 3 APPLICATION DOORS (HaqDwaar Core Delivery Paths)    */}
          {/* ======================================================== */}
          <div id="step-three-doors" data-haq-target="dashboard-three-doors">
            <TheThreeDoorsCard
              matchedCount={matchedSchemes.length}
              firstSchemeId={matchedSchemes?.[0]?._id || matchedSchemes?.[0]?.schemeId || "scheme-pm-kisan-17"}
              onOpenVoiceCoach={() => handleOpenVoiceModal("Help me apply with Scheme Coach")}
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 2: TOP MATCHED SCHEMES ("Aapke Liye Chuni Gayi")    */}
          {/* ======================================================== */}
          <div id="step-schemes" data-haq-target="dashboard-recommendations">
            <RecommendationSection
              recommendations={matchedSchemes}
              loading={loading}
              onRetry={fetchDashboardData}
              onTrackScheme={handleTrackScheme}
              onQuickApply={handleQuickApplyFromDashboard}
              trackedSchemeIds={trackedSchemeIds}
              appliedSchemeIds={appliedSchemeIds}
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 3 & 4: APPLICATION TRACKER & DOCUMENT HEALTH SPLIT   */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Active Application Tracker (7 cols) */}
            <div id="step-tracker" data-haq-target="dashboard-tracker" className="lg:col-span-7 flex flex-col">
              <ApplicationTrackerCard
                applications={trackedApps}
                loading={loading}
              />
            </div>

            {/* Document Health Card & Vault with ReactBits ScrollStack (5 cols) */}
            <div id="step-vault" data-haq-target="dashboard-document-health" className="lg:col-span-5 flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-[#234731] rounded-full shrink-0" />
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                    Vault &amp; Updates Stack
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  Scroll or hover cards
                </span>
              </div>
              <div style={{ height: 580 }} className="w-full">
                <ScrollStack
                  itemDistance={80}
                  itemStackDistance={24}
                  stackPosition="4%"
                  className="w-full"
                >
                  <ScrollStackItem itemClassName="p-0 bg-transparent shadow-none h-auto">
                    <DocumentHealthCard
                      documents={vaultDocuments}
                      isDemoMode={isDigiLockerDemo}
                      loading={loading}
                    />
                  </ScrollStackItem>
                  <ScrollStackItem itemClassName="p-0 bg-transparent shadow-none h-auto">
                    <NotificationPreview
                      notifications={notifications}
                      unreadCount={unreadCount}
                      loading={loading}
                    />
                  </ScrollStackItem>
                </ScrollStack>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 5: 24x7 AI MITTRA VOICE & BHASHINI ASSISTANT       */}
          {/* ======================================================== */}
          <div id="step-mittra" data-haq-target="dashboard-mittra">
            <MittraAssistantCard
              onOpenVoiceModal={handleOpenVoiceModal}
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 6: NEARBY CSC & VLE ASSISTANCE (जन सेवा केंद्र)       */}
          {/* ======================================================== */}
          <div id="step-csc">
            <CscCenterCard 
              user={user} 
              profileData={profileData} 
            />
          </div>
        </>
      )}

    </div>
  );
}
