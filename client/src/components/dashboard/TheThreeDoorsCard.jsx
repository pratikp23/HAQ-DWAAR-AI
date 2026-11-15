import React from "react";
import { Link } from "react-router-dom";
import { SpotlightCard } from "../common/ReactBits";
import {
  Zap,
  Bot,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Compass
} from "lucide-react";

/**
 * HAQ DWAAR AI — The 3 Application Doors Action Center
 * 
 * Signature 3-Path Civic Delivery Workflow:
 * 1. Door 1: 1-Click Quick Apply (Instant digital submission for 100% matched schemes)
 * 2. Door 2: AI Scheme Coach (Interactive conversational guidance & form pre-fill in 22 languages)
 * 3. Door 3: Assisted Mode (Nearby Jan Seva Kendra / CSC VLE locator for biometric KYC)
 */
export default function TheThreeDoorsCard({
  matchedCount = 0,
  firstSchemeId = "scheme-pm-kisan-17",
  onOpenVoiceCoach,
}) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section aria-label="The 3 Application Doors" className="space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#234731] rounded-full shrink-0" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              The 3 Application Doors • आवेदन के तीन द्वार
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 ml-4">
            Choose how you wish to claim your verified welfare entitlements
          </p>
        </div>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ======================================================== */}
        {/* DOOR 1: 1-Click Quick Apply                               */}
        {/* ======================================================== */}
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.14)"
          className="p-5 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shadow-2xs">
                <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                Door 01 • द्वार 1
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                1-Click Quick Apply
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Direct automated submission for schemes with 100% eligibility. Instantly transmits verified credentials to Nodal Officer review queue.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero redundant paperwork</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Submits in &lt; 30 seconds</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("step-schemes")}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <span>View Eligible Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </SpotlightCard>

        {/* ======================================================== */}
        {/* DOOR 2: AI Scheme Coach                                  */}
        {/* ======================================================== */}
        <SpotlightCard
          spotlightColor="rgba(147, 51, 234, 0.14)"
          className="p-5 border border-slate-200/90 hover:border-purple-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black shadow-2xs">
                <Bot className="w-5 h-5 text-purple-700" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80">
                Door 02 • द्वार 2
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-purple-800 transition-colors">
                AI Scheme Coach
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Step-by-step interactive guidance. Coach auto-fills complex department forms, translates criteria into 22 languages, and checks document validity.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>22 Indian Languages &amp; Voice</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Proactive rejection prevention</span>
              </div>
            </div>
          </div>

          <Link
            to={`/dashboard/coach/${firstSchemeId}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-2xs hover:shadow-xs transition"
          >
            <span>Launch Scheme Coach</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </SpotlightCard>

        {/* ======================================================== */}
        {/* DOOR 3: Assisted Mode (CSC Jan Seva Kendra)               */}
        {/* ======================================================== */}
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.14)"
          className="p-5 border border-slate-200/90 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black shadow-2xs">
                <Building2 className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80">
                Door 03 • द्वार 3
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                Assisted Mode (CSC VLE)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Prefer in-person assistance or require biometric e-KYC? Locate your nearest Jan Seva Kendra / CSC center with certified Village Level Entrepreneurs.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Geo-located CSC Kendra &amp; VLE phone</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Biometric finger &amp; iris scanning ready</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("step-csc")}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <span>Locate Nearest CSC</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </SpotlightCard>

      </div>
    </section>
  );
}
