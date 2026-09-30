import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

// API Services
import { getProfile } from "../../services/profileApi";
import { getRecommendations } from "../../services/matchingApi";
import { getDocuments } from "../../services/documentApi";
import { getApplications, createApplication } from "../../services/applicationApi";
import { getCitizenNotifications, getUnreadCount } from "../../services/notificationApi";
import { getDigiLockerStatus } from "../../services/digilockerApi";
import { getSchemeReadiness } from "../../services/readinessApi";

// Citizen Dashboard Components
import DashboardHero from "../../components/dashboard/DashboardHero";
import BenefitReadinessCard from "../../components/dashboard/BenefitReadinessCard";
import MittraAssistantCard from "../../components/dashboard/MittraAssistantCard";
import QuickActionGrid from "../../components/dashboard/QuickActionGrid";
import RecommendationSection from "../../components/dashboard/RecommendationSection";
import LifeSituationSectors from "../../components/dashboard/LifeSituationSectors";
import DocumentHealthCard from "../../components/dashboard/DocumentHealthCard";
import NotificationPreview from "../../components/dashboard/NotificationPreview";
import ApplicationTrackerCard from "../../components/dashboard/ApplicationTrackerCard";
import BenefitJourney from "../../components/dashboard/BenefitJourney";
import TrustInformationCard from "../../components/dashboard/TrustInformationCard";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import AiMitraVoiceModal from "../../components/dashboard/AiMitraVoiceModal";

import { 
  CheckCircle2, 
  X, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";

/**
 * HAQ DWAAR AI — Authenticated Citizen Experience Dashboard
 * 
 * Journey Flow:
 * CITIZEN
 * → BENEFIT PASSPORT
 * → LIFE SITUATION
 * → BENEFIT MATCHING
 * → WHY THIS MATCH?
 * → DOCUMENT HEALTH
 * → READINESS
 * → ACTION PLAN
 * → DEADLINE / NOTIFICATION
 * → OFFICIAL APPLICATION
 * → APPLICATION TRACKING
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
  const [isDigiLockerDemo, setIsDigiLockerDemo] = useState(true);

  // Scheme Readiness State
  const [targetSchemeReadiness, setTargetSchemeReadiness] = useState(null);
  const [targetScheme, setTargetScheme] = useState(null);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  // Interactive Voice Modal States
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceInitialQuery, setVoiceInitialQuery] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);

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
      if (profileRes.status === "fulfilled" && profileRes.value?.data) {
        setProfileData(profileRes.value.data.profile || null);
        setCompleteness(profileRes.value.data.profileCompleteness || 0);
      }

      // 2. Recommendations
      let recs = [];
      if (matchRes.status === "fulfilled") {
        recs = matchRes.value?.data?.data?.recommendations || [];
        setMatchedSchemes(recs);
      }

      // 3. Document Vault
      if (docRes.status === "fulfilled") {
        const docs = docRes.value?.data?.documents || docRes.value?.data?.data?.documents || [];
        setVaultDocuments(docs);
      }

      // 4. Applications Tracker
      let apps = [];
      if (appsRes.status === "fulfilled") {
        apps = appsRes.value?.data?.data?.applications || [];
        setTrackedApps(apps);
      }

      // 5. Notifications
      if (notifRes.status === "fulfilled") {
        setNotifications(notifRes.value?.data?.data?.notifications || []);
      }

      // 6. Unread Count
      if (unreadRes.status === "fulfilled") {
        setUnreadCount(unreadRes.value?.data?.data?.unreadCount || 0);
      }

      // 7. DigiLocker Status
      if (digiRes.status === "fulfilled") {
        const mode = digiRes.value?.data?.data?.mode || "demo";
        setIsDigiLockerDemo(mode === "demo");
      }

      // 8. Fetch scheme readiness for top recommendation or tracked application
      const firstCandidate = apps[0]?.schemeId || recs[0];
      if (firstCandidate) {
        const cid = firstCandidate._id || firstCandidate.schemeId || firstCandidate.id;
        if (cid) {
          try {
            const readinessRes = await getSchemeReadiness(cid);
            if (readinessRes?.data?.data) {
              setTargetSchemeReadiness(readinessRes.data.data.readiness);
              setTargetScheme(readinessRes.data.data.scheme);
            }
          } catch (rErr) {
            // Non-blocking readiness fetch
            console.debug("Target scheme readiness non-critical error:", rErr);
          }
        }
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

  // Open Voice Modal with initial query
  const handleOpenVoiceModal = (query = "") => {
    setVoiceInitialQuery(query);
    setVoiceModalOpen(true);
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
      textToSpeak += `Welcome to your HAQ DWAAR AI workspace. Your Benefit Passport is ${completeness}% complete. You have ${matchedSchemes.length} verified benefit opportunities available, and ${vaultDocuments.length} documents in your health vault.`;
    } else {
      textToSpeak += `हकद्वार एआई में आपका स्वागत है। आपका बेनिफिट पासपोर्ट ${completeness} प्रतिशत पूर्ण है। आपके लिए ${matchedSchemes.length} सत्यापित सरकारी योजनाएं पहचानी गई हैं, और आपके डॉक्यूमेंट वॉल्ट में ${vaultDocuments.length} प्रमाणपत्र हैं।`;
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

  const topSchemeId = targetScheme?._id || targetScheme?.id || matchedSchemes[0]?.schemeId || matchedSchemes[0]?._id || null;

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 sm:space-y-8">
      
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
          {/* 1. PERSONALIZED GREETING / PROFILE STATUS               */}
          {/* ======================================================== */}
          <DashboardHero
            user={user}
            profileData={profileData}
            completeness={completeness}
            onPlayAudio={handlePlayAudio}
            audioPlaying={audioPlaying}
          />

          {/* ======================================================== */}
          {/* 2. BENEFIT READINESS & MITTRA SIDE-BY-SIDE ON DESKTOP   */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Benefit Readiness Card (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col">
              <BenefitReadinessCard
                readinessData={targetSchemeReadiness}
                targetScheme={targetScheme || matchedSchemes[0]}
                profileCompleteness={completeness}
                vaultDocuments={vaultDocuments}
                loading={loading}
              />
            </div>

            {/* MITTRA / Life Situation Assistant Card (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col">
              <MittraAssistantCard
                onOpenVoiceModal={handleOpenVoiceModal}
              />
            </div>

          </div>

          {/* ======================================================== */}
          {/* 3. QUICK ACTIONS GRID (6 Core Civic Gateways)            */}
          {/* ======================================================== */}
          <QuickActionGrid
            completeness={completeness}
            unreadCount={unreadCount}
            vaultDocCount={vaultDocuments.length}
            trackedAppCount={trackedApps.length}
            topSchemeId={topSchemeId}
          />

          {/* ======================================================== */}
          {/* 4. FOR YOU — VERIFIED OPPORTUNITIES                     */}
          {/* ======================================================== */}
          <RecommendationSection
            recommendations={matchedSchemes}
            loading={loading}
            onRetry={fetchDashboardData}
            onTrackScheme={handleTrackScheme}
            trackedSchemeIds={trackedSchemeIds}
          />

          {/* ======================================================== */}
          {/* 4.1. QUICK SECTORS — त्वरित श्रेणियां                    */}
          {/* ======================================================== */}
          <LifeSituationSectors />

          {/* ======================================================== */}
          {/* 5. DOCUMENT HEALTH VAULT + NOTIFICATIONS PREVIEW        */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Document Health Card (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <DocumentHealthCard
                documents={vaultDocuments}
                isDemoMode={isDigiLockerDemo}
                loading={loading}
              />
            </div>

            {/* Notifications & Deadlines Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <NotificationPreview
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
              />
            </div>

          </div>

          {/* ======================================================== */}
          {/* 6. APPLICATION TRACKER ("My Applications")               */}
          {/* ======================================================== */}
          <ApplicationTrackerCard
            applications={trackedApps}
            loading={loading}
          />

          {/* ======================================================== */}
          {/* 7. BENEFIT JOURNEY VISUAL (Scheme se Application Tak)    */}
          {/* ======================================================== */}
          <BenefitJourney
            completeness={completeness}
            vaultDocCount={vaultDocuments.length}
            trackedApps={trackedApps}
          />

          {/* ======================================================== */}
          {/* 8. TRUST / CITIZEN INFORMATION PANEL                    */}
          {/* ======================================================== */}
          <TrustInformationCard />
        </>
      )}

      {/* Interactive AI MITTRA Voice Modal */}
      <AiMitraVoiceModal
        isOpen={voiceModalOpen}
        initialQuery={voiceInitialQuery}
        onClose={() => setVoiceModalOpen(false)}
        onPassportUpdated={fetchDashboardData}
      />

    </div>
  );
}
