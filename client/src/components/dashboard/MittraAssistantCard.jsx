import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Volume2,
  GraduationCap,
  Tractor,
  Home,
  Briefcase,
  Users,
  Bot,
  Compass
} from "lucide-react";
import { SpotlightCard } from "../common/ReactBits";
import { BhashiniLogo } from "../common/GovLogos";
import { useLanguage } from "../../context/LanguageContext";

/**
 * HAQ DWAAR AI — MITTRA Life Situation Assistant Card
 * 
 * Rebuilt using HeroUI Card standards:
 * - HeroUI Card with Images: Cover banner with GovTech Bharat theme & Bhashini overlay
 * - HeroUI Card with Avatar: Bordered circular avatar with live status, title & header CTA
 * - HeroUI CardBody: Balanced 2-column grid (5 cols voice mic & search, 7 cols life situation cards)
 * - HeroUI CardFooter: Civic trust badge and Door 02 Scheme Coach indicator
 */
export default function MittraAssistantCard({ onOpenVoiceModal, onSelectPrompt }) {
  const { language, t } = useLanguage();
  const [inputText, setInputText] = useState("");

  const promptChips = [
    { label: "बेटी की कॉलेज फीस व छात्रवृत्ति", icon: GraduationCap, query: "मेरी बेटी की कॉलेज फीस में छात्रवृत्ति कैसे मिलेगी?" },
    { label: "पीएम किसान 17वीं किस्त व खाद सहायता", icon: Tractor, query: "पीएम किसान सम्मान निधि 17वीं किस्त और खाद सब्सिडी" },
    { label: "ग्रामीण पक्के मकान हेतु आवास योजना", icon: Home, query: "पीएम आवास योजना ग्रामीण की पात्रता कैसे चेक करें?" },
    { label: "सिलाई मशीन व छोटा व्यवसाय लोन", icon: Briefcase, query: "सिलाई मशीन टूलकिट योजना और मुद्रा लोन आवेदन" },
    { label: "वरिष्ठ नागरिक वृद्धावस्था पेंशन", icon: Users, query: "वृद्धावस्था पेंशन योजना के लिए जरूरी दस्तावेज" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      if (onOpenVoiceModal) {
        onOpenVoiceModal(inputText.trim());
      }
    }
  };

  const handleChipClick = (promptQuery) => {
    setInputText(promptQuery);
    if (onOpenVoiceModal) {
      onOpenVoiceModal(promptQuery);
    }
  };

  return (
    <SpotlightCard
      spotlightColor="rgba(234, 88, 12, 0.12)"
      className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300"
    >
      {/* 1. HERO UI CARD WITH IMAGES (Top Visual Cover Banner) */}
      <div className="relative w-full h-32 sm:h-40 overflow-hidden bg-gradient-to-r from-[#1c0836] via-[#2b0f4c] to-[#4c1d95]">
        {/* Thematic Civic Welfare Image with Overlay */}
        <img
          src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80"
          alt="GovTech Bharat Civic Background"
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c0836] via-transparent to-black/30 pointer-events-none" />

        {/* Header Badges Overlay */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-orange-200">
            <BhashiniLogo className="w-4 h-4 rounded-sm shrink-0" />
            <span>Bhashini Voice AI • Door 02 Action Center</span>
          </div>
          <span className="text-[11px] font-bold text-white/90 bg-emerald-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>22 Languages Active</span>
          </span>
        </div>

        {/* Hero Banner Bottom Strip */}
        <div className="absolute bottom-2.5 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-orange-300">
              Scheme se Application Tak
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              Your 24x7 Conversational Welfare Guide
            </p>
          </div>
        </div>
      </div>

      {/* 2. HERO UI CARD WITH AVATAR & CONTENT */}
      <div className="p-5 sm:p-6 space-y-5">
        
        {/* CardHeader with Avatar & Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              {/* Bordered Avatar Ring */}
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 via-amber-400 to-purple-600 shadow-sm">
                <div className="w-full h-full rounded-full bg-[#1e0a3c] flex items-center justify-center text-white font-black">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
                </div>
              </div>
              {/* Live Status Indicator */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/40 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  AI MITTRA (सहायक मित्र)
                </h3>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  Door 02
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-1">
                @haqdwaar_ai • GovTech Bharat • Voice &amp; Text Assistant
              </span>
            </div>
          </div>

          {/* Action CTA in Header */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/dashboard/coach/scheme-pm-kisan-17"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Launch Scheme Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. CardBody: Balanced 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column: Voice Mic & Input (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-50/70 via-orange-50/40 to-slate-50/80 rounded-2xl p-5 border border-purple-100/80 flex flex-col justify-between space-y-4 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Voice Assisted Consultation
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                माइक दबाएं और सीधे अपनी भाषा में बोलें
              </p>
            </div>

            {/* Animated Acoustic Waves Microphone */}
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="relative inline-flex items-center justify-center">
                <span className="absolute w-20 h-20 rounded-full bg-orange-500/20 animate-ping pointer-events-none duration-1000" />
                <span className="absolute w-16 h-16 rounded-full bg-orange-400/25 animate-pulse pointer-events-none" />

                <button
                  type="button"
                  onClick={() => onOpenVoiceModal && onOpenVoiceModal("")}
                  className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] hover:from-[#c2410c] hover:to-[#ea580c] text-white flex items-center justify-center shadow-md shadow-orange-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-orange-200"
                  aria-label="Start MITTRA with Voice"
                  title="Click and speak your situation"
                >
                  <Mic className="w-6 h-6 text-white drop-shadow-xs" />
                </button>
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2">
                "{t("micPrompt", "बोलकर अपनी समस्या या ज़रूरत बताएं")}"
              </span>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="या यहाँ लिखें: खाद सब्सिडी, बेटी की फीस..."
                  className="w-full pl-3 pr-20 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all shadow-2xs"
                  aria-label="Describe your situation in plain words"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Ask</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Direct Citizen Situation Prompts (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                अक्सर पूछे जाने वाले विषय (Quick Life Situations):
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                1-Click Instant Guidance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {promptChips.map((chip, idx) => {
                const ChipIcon = chip.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip.query)}
                    className="p-3 rounded-xl bg-white hover:bg-orange-50/50 border border-slate-200/90 hover:border-orange-300 text-left transition-all duration-200 flex items-start gap-2.5 shadow-2xs hover:shadow-xs group cursor-pointer active:scale-[0.99]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-orange-700 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <ChipIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-orange-950 block leading-snug">
                        {chip.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                        {chip.query}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 font-medium pt-1">
              Tip: Tap any situation above to immediately trigger voice coaching with verified department forms.
            </p>
          </div>

        </div>

        {/* 4. CardFooter with Civic Trust Guarantee */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">
              Deterministic verified gazettes decide all scheme matches. AI only assists with natural language.
            </span>
          </div>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
            Door 02 • Scheme Coach
          </span>
        </div>

      </div>
    </SpotlightCard>
  );
}
