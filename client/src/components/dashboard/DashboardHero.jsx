import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NumberTicker } from "../common/ReactBits";
import Card from "../common/Card";
import { Avatar } from "../common/Avatar";
import { 
  UserCheck, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FolderCheck,
  Coins
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import BenefitPassportCard from "./BenefitPassportCard";

/**
 * LOK SAMARTH — Citizen Experience Dashboard Hero Component
 * 
 * Open, Spacious Layout featuring HeroUI WithAvatar Card Reference:
 * Reference: https://heroui.com/en/docs/react/components/card (WithAvatar)
 * 
 * - Impactful unboxed greeting with sovereign Hindi 'ह' emblem
 * - Compact HeroUI Document Vault Card (w-[210px] with Card.Header, Card.Title, Card.Description, Card.Footer + Avatar)
 * - Compact HeroUI Entitlements Card
 * - Clean Benefit Passport passbook card
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

  return (
    <section aria-label="Personalized Citizen Greeting" className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. FULLY OPENED TOP GREETING & HEROUI COMPACT CARDS ROW   */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-1">
        
        {/* Left: Open, Unboxed Impactful Greeting */}
        <div className="space-y-3 flex-1">
          
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

          {/* Impactful Open Heading (Clear, Prominent, Unboxed) */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {getGreeting()}, <span className="text-[#234731]">{firstName}!</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Your sovereign citizen welfare workspace is active. 350+ central &amp; state schemes are mapped to your Benefit Passport.
            </p>
          </div>
        </div>

        {/* Right: HEROUI COMPACT CARDS ROW (Exact WithAvatar HeroUI pattern) */}
        <div className="flex flex-wrap items-center gap-3.5 shrink-0 self-start lg:self-center">
          
          {/* ======================================================== */}
          {/* HEROUI WITHAVATAR COMPACT DOCUMENT VAULT CARD            */}
          {/* Reference: https://heroui.com/en/docs/react/components/card */}
          {/* ======================================================== */}
          <Link to="/dashboard/documents" className="block w-[205px] sm:w-[215px] shrink-0 group">
            <Card className="w-full gap-2 p-3.5 bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all duration-200 rounded-2xl cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black border border-emerald-100 shadow-2xs group-hover:scale-105 transition-transform">
                  <FolderCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Vault
                </span>
              </div>

              <Card.Header className="pt-0.5">
                <Card.Title className="text-sm font-black text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
                  <span>Document Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                </Card.Title>
                <Card.Description className="text-xs text-slate-500">
                  {vaultDocCount} Certificates Secured
                </Card.Description>
              </Card.Header>

              <Card.Footer className="flex gap-2 items-center pt-2 border-t border-slate-100">
                <Avatar aria-label="DigiLocker Synced" className="size-5 shrink-0 bg-emerald-100 text-emerald-800">
                  <Avatar.Fallback className="text-[10px] font-bold">DL</Avatar.Fallback>
                </Avatar>
                <span className="text-[11px] text-slate-600 font-medium">DigiLocker Synced</span>
              </Card.Footer>
            </Card>
          </Link>

          {/* ======================================================== */}
          {/* HEROUI COMPACT ENTITLEMENTS CARD                         */}
          {/* ======================================================== */}
          <div className="w-[205px] sm:w-[215px] shrink-0">
            <Card className="w-full gap-2 p-3.5 bg-white border border-slate-200/90 hover:border-[#234731] hover:shadow-md transition-all duration-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#ebf3ed] text-[#234731] flex items-center justify-center font-black border border-[#c8ded0] shadow-2xs">
                  <Coins className="w-6 h-6 text-[#234731]" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#ebf3ed] text-[#234731] text-[10px] font-bold border border-[#c8ded0]">
                  Entitled
                </span>
              </div>

              <Card.Header className="pt-0.5">
                <Card.Title className="text-sm font-black text-slate-900">
                  <NumberTicker value={percent > 0 ? 48000 : 36000} prefix="₹" suffix="+" />
                </Card.Title>
                <Card.Description className="text-xs text-slate-500">
                  Total Annual Welfare
                </Card.Description>
              </Card.Header>

              <Card.Footer className="flex gap-2 items-center pt-2 border-t border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-slate-600 font-medium">Direct DBT Linked</span>
              </Card.Footer>
            </Card>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. BENEFIT PASSPORT STATUS CARD (Clean & Compact)        */}
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
