import React from "react";
import { Link } from "react-router-dom";
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
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

import BenefitPassportCard from "./BenefitPassportCard";

/**
 * HAQ DWAAR AI — Dashboard Hero Component
 * 
 * Features the signature 2-card header layout:
 * 1. Deep Pine/Emerald Green Hero Banner (left, 8 cols):
 *    - Civic trust greeting
 *    - Authenticated citizen badge
 *    - Total identified welfare entitlements summary (₹48,000+)
 *    - Audio narration button (बोलकर सुनें)
 * 2. Benefit Passport Status Card (right, 4 cols):
 *    - Realistic citizen welfare passbook credentials
 *    - Aadhaar e-KYC verified status
 *    - Clean tabular attribute chips (Category, Domicile, Income)
 *    - Single high-contrast progress bar
 *    - Actionable human guidance
 */
export default function DashboardHero({
  user,
  profileData,
  completeness = 80,
  onPlayAudio,
  audioPlaying = false,
}) {
  const { language, t } = useLanguage();

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

  // Determine actual citizen name (defaults to Pratik if empty)
  const fullName = profileData?.personal?.fullName || user?.name || "Pratik";
  const firstName = fullName.trim() ? fullName.trim().split(" ")[0] : "Pratik";

  // Determine location from actual profile (defaults to Jabalpur, Madhya Pradesh)
  const district = profileData?.personal?.district || profileData?.location?.district || "Jabalpur";
  const state = profileData?.personal?.state || profileData?.location?.state || "Madhya Pradesh";
  const locationString = `${district}, ${state}`;

  return (
    <section 
      aria-label="Personalized Citizen Greeting" 
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
    >
      {/* ======================================================== */}
      {/* 1. LEFT CARD: Deep Forest Pine Green Hero Banner (8 cols) */}
      {/* ======================================================== */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063028] via-[#094336] to-[#0c5949] p-5 sm:p-6 text-white shadow-lg border border-emerald-500/20 flex flex-col justify-between space-y-4">
        {/* Subtle decorative background watermark */}
        <div 
          className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none select-none text-[120px] font-bold text-emerald-300"
          aria-hidden="true"
        >
          ह
        </div>

        <div className="relative z-10 space-y-3">
          {/* Header Badges & Audio Narration Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authenticated Citizen</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>{locationString}</span>
              </span>
            </div>

            {/* Audio Narration Button */}
            {onPlayAudio && (
              <button
                type="button"
                onClick={onPlayAudio}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  audioPlaying
                    ? "bg-[#ea580c] text-white border-orange-400 shadow-sm animate-pulse"
                    : "bg-white/10 hover:bg-white/20 text-emerald-100 border-white/15 hover:text-white"
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
                    <Volume2 className="w-3.5 h-3.5 text-orange-300" />
                    <span>बोलकर सुनें</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              {getGreeting()}, <span className="text-amber-300 font-bold">{firstName}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-normal mt-1 leading-relaxed">
              Your benefit journey starts here. Discover, prepare, and navigate verified public welfare benefits.
            </p>
          </div>

          {/* Entitlement Highlight Inset Card */}
          <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-emerald-400/20 space-y-2">
            <span className="text-xs font-semibold text-emerald-300 tracking-normal block">
              Total Identified Entitlements • कुल पहचानी गई पात्रता
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ₹48,000+
              </span>
              <span className="text-xs sm:text-sm text-emerald-200 font-medium">
                वार्षिक सरकारी लाभ (Annual Welfare Benefits)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>₹36,000 Direct Cash DBT</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>₹12,000 Tuition &amp; Subsidy</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Location & Ration Card Details */}
        <div className="pt-3 border-t border-emerald-400/20 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-2 truncate">
            <span>📍 Gram Panchayat Kalyanpur</span>
            <span>•</span>
            <span>राशन: NFSA PHH Beneficiary</span>
          </div>
          <span className="text-xs text-emerald-300/90 shrink-0">
            Aadhaar NPCI Direct DBT Enabled
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RIGHT CARD: Benefit Passport Status (4 cols)          */}
      {/* ======================================================== */}
      <div className="lg:col-span-4 flex flex-col">
        <BenefitPassportCard
          user={user}
          profileData={profileData}
          completeness={completeness}
        />
      </div>
    </section>
  );
}
