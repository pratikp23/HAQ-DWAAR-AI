import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NumberTicker, SpotlightCard } from "../common/ReactBits";
import { 
  UserCheck, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2,
  CheckCircle2,
  FolderCheck,
  ExternalLink,
  Coins
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import BenefitPassportCard from "./BenefitPassportCard";

/**
 * LOK SAMARTH — Citizen Experience Dashboard Hero Component
 * 
 * Fully Opened Layout (Matching the spacious, clear Public Page standard):
 * - Open, unboxed impactful greeting with authentic Devnagari typography
 * - Prominent Hindi 'ह' (हक / हकदार) sovereign civic emblem
 * - Open, high-visibility Document Vault Action Section (not cramped in an inner card)
 * - Clear entitlement breakdown & live trust signals
 */
export default function DashboardHero({
  user,
  profileData,
  completeness = 0,
  onPlayAudio,
  audioPlaying = false,
}) {
  const { language, t } = useLanguage();
  const [vaultDocCount, setVaultDocCount] = useState(4);

  // Synchronize live document count from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("lok_samarth_documents");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVaultDocCount(parsed.length);
        }
      }
    } catch {}
  }, []);

  const percent = Math.max(0, Math.min(100, Math.round(Number(completeness) || 0)));

  // Dynamic civic time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === "hi" ? "सुप्रभात" : language === "mr" ? "शुभ प्रभात" : "Good morning";
    }
    if (hour < 17) {
      return language === "hi" ? "शुभ दोपहर" : language === "mr" ? "शुभ दुपार" : "Good afternoon";
    }
    return language === "hi" ? "शुभ संध्या" : language === "mr" ? "शुभ संध्याकाळ" : "Good evening";
  };

  // Determine actual citizen name from profile or auth user
  const fullName = profileData?.personal?.fullName || user?.name || "Citizen";
  const firstName = fullName.trim() ? fullName.trim().split(" ")[0] : "Citizen";

  // Determine location from actual profile
  const district = profileData?.personal?.district || profileData?.location?.district;
  const state = profileData?.personal?.state || profileData?.location?.state;
  const locationString = district && state ? `${district}, ${state}` : (state || district || "Jabalpur, Madhya Pradesh");

  const villagePanchayat = profileData?.location?.gramPanchayat || profileData?.personal?.district || "Jabalpur Division";
  const rationStatus = profileData?.rationCardType ? `राशन: ${profileData.rationCardType}` : "Direct DBT Account Linkage";

  return (
    <section aria-label="Personalized Citizen Greeting" className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. FULLY OPENED TOP GREETING & SOVEREIGN CIVIC HEADER     */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-3">
          
          {/* Top Badges & Audio Narration */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* The Authentic Hindi 'ह' Emblem Badge */}
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#ebf3ed] text-[#234731] border border-[#c8ded0] text-base font-black shadow-2xs select-none">
              ह
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf3ed] text-[#234731] text-xs font-bold border border-[#c8ded0] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{percent >= 80 ? "Authenticated Citizen (Aadhaar e-KYC)" : "Authenticated Citizen"}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{locationString}</span>
            </span>

            {/* Audio Narration Trigger */}
            {onPlayAudio && (
              <button
                type="button"
                onClick={onPlayAudio}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  audioPlaying
                    ? "bg-[#ea580c] text-white border-orange-400 shadow-sm animate-pulse"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs"
                }`}
                aria-label={audioPlaying ? "Stop audio summary narration" : "Listen to dashboard summary narration"}
              >
                {audioPlaying ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>बोलकर सुनें</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Impactful Open Heading (Large, Clear, Unboxed) */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {getGreeting()}, <span className="text-[#234731]">{firstName}!</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Your sovereign citizen welfare workspace is active. All central &amp; state benefits are verified and mapped to your profile with zero commercial intermediaries.
            </p>
          </div>
        </div>

        {/* Right Metric Quick Pill */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          <div className="p-4 rounded-2xl bg-[#ebf3ed] border border-[#c8ded0] space-y-1">
            <span className="text-[11px] font-bold text-[#234731] uppercase tracking-wider block">
              Total Identified Entitlements
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#112318] tracking-tight">
                <NumberTicker value={percent > 0 ? 48000 : 36000} prefix="₹" suffix="+" />
              </span>
              <span className="text-xs text-slate-600 font-semibold">/ yr DBT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FULLY OPENED HIGH-VISIBILITY DOCUMENT VAULT HEROUI BAR */}
      {/* ======================================================== */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-[#112318] via-[#163321] to-[#1f422b] p-6 sm:p-7 text-white shadow-lg border border-[#234731] relative overflow-hidden">
        
        {/* Subtle Civic Watermark 'ह' in background */}
        <div 
          className="absolute -right-4 -bottom-10 opacity-15 pointer-events-none select-none text-[180px] sm:text-[220px] font-black text-white leading-none z-0"
          aria-hidden="true"
        >
          ह
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Vault Icon + Title + Real Certificates */}
          <div className="space-y-3.5 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#112318] flex items-center justify-center font-black shadow-md shrink-0">
                <FolderCheck className="w-6 h-6 text-[#15803d]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    Personal Document Vault • व्यक्तिगत दस्तावेज़ वॉल्ट
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DigiLocker Active</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-0.5">
                  {vaultDocCount} Certificates Secured &amp; Verified • Ready for Scheme Applications
                </p>
              </div>
            </div>

            {/* Clear Visible Certificate Badges Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aadhaar Card (UIDAI Verified)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Degree Marksheet (SRIT / RGPV)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Income Certificate (Tehsil Office)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Domicile Certificate (MP State)</span>
              </span>
            </div>
          </div>

          {/* Right: High-Impact Action Button to Open Document Vault */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/dashboard/documents"
              className="px-6 py-3.5 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm shadow-xl shadow-orange-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Open Document Vault"
            >
              <span>📁 Open Document Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. BENEFIT PASSPORT STATUS CARD (Clean & Compact)        */}
      {/* ======================================================== */}
      <div className="w-full">
        <BenefitPassportCard
          user={user}
          profileData={profileData}
          completeness={completeness}
        />
      </div>

    </section>
  );
}
