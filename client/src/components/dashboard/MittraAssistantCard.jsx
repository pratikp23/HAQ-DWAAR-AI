import React, { useState } from "react";
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Volume2
} from "lucide-react";
import { BhashiniLogo } from "../common/GovLogos";
import { useLanguage } from "../../context/LanguageContext";

/**
 * HAQ DWAAR AI — MITTRA Life Situation Assistant Card
 * 
 * Redesigned with:
 * - Prominent, readable fonts (clear headings, comfortable line heights, no AI jargon)
 * - Larger animated microphone button with smooth acoustic ripple pulse
 * - 5 diverse, authentic citizen situation examples so the card never looks empty
 * - Natural, human typography tailored for Hindi and regional citizen understanding
 */
export default function MittraAssistantCard({ onOpenVoiceModal, onSelectPrompt }) {
  const { language, t } = useLanguage();
  const [inputText, setInputText] = useState("");

  const promptChips = [
    { label: "🎓 बेटी की कॉलेज फीस व छात्रवृत्ति", query: "मेरी बेटी की कॉलेज फीस में छात्रवृत्ति कैसे मिलेगी?" },
    { label: "🌾 पीएम किसान 17वीं किस्त व खाद सहायता", query: "पीएम किसान सम्मान निधि 17वीं किस्त और खाद सब्सिडी" },
    { label: "🏠 ग्रामीण पक्के मकान हेतु आवास योजना", query: "पीएम आवास योजना ग्रामीण की पात्रता कैसे चेक करें?" },
    { label: "💼 सिलाई मशीन व छोटा व्यवसाय लोन", query: "सिलाई मशीन टूलकिट योजना और मुद्रा लोन आवेदन" },
    { label: "👴 वरिष्ठ नागरिक वृद्धावस्था पेंशन", query: "वृद्धावस्था पेंशन योजना के लिए जरूरी दस्तावेज" },
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
    <section 
      aria-label="MITTRA Voice and Natural Language Assistant"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0836] via-[#240b49] to-[#3a0f5d] p-5 sm:p-6 text-white shadow-xl border border-purple-500/25 text-center flex flex-col justify-between h-full space-y-4"
    >
      {/* Background ambient warm glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ea580c]/15 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 space-y-3.5">
        
        {/* 1. Badge & Large Heading */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/40 text-xs sm:text-[13px] font-semibold text-orange-200">
            <BhashiniLogo className="w-4 h-4 rounded-sm shrink-0" />
            <span>AI MITTRA • Bhashini Voice AI (24x7)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-normal leading-snug">
            Tell MITTRA what you need.
          </h2>
          
          <p className="text-xs sm:text-sm text-purple-200 font-normal max-w-md mx-auto leading-relaxed">
            बोलकर या लिखकर अपनी परिस्थिति बताएं — हिंदी, भोजपुरी, मैथिली या English
          </p>
        </div>

        {/* 2. Larger Animated Voice Microphone */}
        <div className="flex flex-col items-center justify-center gap-2 py-1">
          <div className="relative inline-flex items-center justify-center">
            {/* Animated acoustic ripple waves */}
            <span className="absolute w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-orange-500/20 animate-ping pointer-events-none duration-1000" />
            <span className="absolute w-19 h-19 sm:w-21 sm:h-21 rounded-full bg-orange-400/25 animate-pulse pointer-events-none" />

            <button
              type="button"
              onClick={() => onOpenVoiceModal && onOpenVoiceModal("")}
              className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] hover:from-[#c2410c] hover:to-[#ea580c] text-white flex items-center justify-center shadow-lg shadow-orange-950/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-orange-400/40"
              aria-label="Start MITTRA with Voice"
              title="Click and speak your situation"
            >
              <Mic className="w-8 h-8 text-white drop-shadow-sm" />
            </button>
          </div>
          
          <div>
            <p className="text-sm sm:text-base font-semibold text-white leading-normal">
              "{t("micPrompt", "बोलकर अपनी समस्या या ज़रूरत बताएं")}"
            </p>
            <p className="text-xs text-purple-200/90 font-normal mt-0.5">
              माइक दबाएं और सीधे अपनी भाषा में बोलें
            </p>
          </div>
        </div>

        {/* 3. Search Input Bar (Clear, Readable) */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative w-full">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="या यहाँ लिखें: खाद सब्सिडी, बेटी की छात्रवृत्ति, आवास सहायता..."
              className="w-full pl-4 pr-32 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-white placeholder-purple-200/75 text-xs sm:text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
              aria-label="Describe your situation in plain words"
            />
            <button
              type="submit"
              className="absolute right-1 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* 4. Multiple Realistic Situation Examples (No Longer Empty) */}
        <div className="space-y-1.5 pt-1 max-w-2xl mx-auto">
          <span className="text-[11px] font-medium text-purple-200/80 block">
            अक्सर पूछे जाने वाले विषय (Quick Examples):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.query)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 hover:text-white text-xs font-medium border border-white/15 hover:border-white/30 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Civic Transparency Note */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-purple-200/80 font-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Deterministic verified gazettes decide all scheme matches. AI only assists with natural language.
          </span>
        </div>

      </div>
    </section>
  );
}
