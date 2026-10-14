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
import RecommendationSection from "../../components/dashboard/RecommendationSection";
import ApplicationTrackerCard from "../../components/dashboard/ApplicationTrackerCard";
import MittraAssistantCard from "../../components/dashboard/MittraAssistantCard";
import DocumentHealthCard from "../../components/dashboard/DocumentHealthCard";
import NotificationPreview from "../../components/dashboard/NotificationPreview";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import CscCenterCard from "../../components/dashboard/CscCenterCard";
import { useHaqAI } from "../../context/HaqAIContext";

import { 
  CheckCircle2, 
  X, 
  AlertCircle, 
  RefreshCw 
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
  const [isDigiLockerDemo, setIsDigiLockerDemo] = useState(true);

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
        const mode = digiRes.value?.data?.mode || digiRes.value?.mode || "demo";
        setIsDigiLockerDemo(mode === "demo");
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

  // ⚡ 1-Click Quick Apply directly from citizen dashboard
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
      setActionSuccess(`⚡ Direct Quick Apply submitted for "${scheme.name}"! Reference Number: ${refNum}. Transmitted to Department Nodal Queue.`);

      // Refresh applications immediately so the card switches to "✓ Applied" and Application Tracker updates
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
          {/* STEP 3: APPLICATION TRACKER ("My Tracked Applications")  */}
          {/* ======================================================== */}
          <div id="step-tracker" data-haq-target="dashboard-tracker">
            <ApplicationTrackerCard
              applications={trackedApps}
              loading={loading}
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 4: 24x7 AI MITTRA VOICE & BHASHINI ASSISTANT       */}
          {/* ======================================================== */}
          <div id="step-mittra" data-haq-target="dashboard-mittra">
            <MittraAssistantCard
              onOpenVoiceModal={handleOpenVoiceModal}
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 5: DOCUMENT HEALTH VAULT + DEADLINES & NOTIFICATIONS */}
          {/* ======================================================== */}
          <div id="step-vault" data-haq-target="dashboard-document-health" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
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
