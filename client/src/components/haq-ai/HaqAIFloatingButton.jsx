import React from "react";
import { Sparkles, Mic, Volume2 } from "lucide-react";
import { useHaqAI, MITTRA_STATES } from "../../context/HaqAIContext";

/**
 * HAQ AI — Collapsed Floating Assistant Button
 * Pinned to bottom-right: [ ✨ HAQ AI 🎙️ ] using pure CSS/Tailwind.
 */
export default function HaqAIFloatingButton() {
  const { isOpen, toggleAssistant, assistantState } = useHaqAI();

  if (isOpen) return null;

  const isListening = assistantState === MITTRA_STATES.LISTENING;
  const isSpeaking = assistantState === MITTRA_STATES.SPEAKING;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 select-none">
      {/* Background Pulse Aura when Assistant is active */}
      {(isListening || isSpeaking) && (
        <div
          className={`absolute inset-0 rounded-full blur-md animate-pulse ${
            isListening ? "bg-orange-500/60" : "bg-purple-600/60"
          }`}
        />
      )}

      {/* Main Pill Button */}
      <button
        type="button"
        onClick={toggleAssistant}
        aria-label="Open HAQ AI Voice Assistant"
        className="relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-[#2b0f4c] via-[#4a154b] to-[#ea580c] text-white shadow-[0_8px_25px_rgba(43,15,76,0.35)] border-2 border-white/80 backdrop-blur-md cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        {/* Glowing Sparkle Icon */}
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        </span>

        {/* Text Label */}
        <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
          <span>HAQ AI</span>
          <span className="text-[11px] font-normal text-amber-200 hidden xs:inline">
            • MITTRA
          </span>
        </span>

        {/* Animated Mic / Speaker Icon */}
        <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
          {isSpeaking ? (
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <Mic className={`w-3.5 h-3.5 ${isListening ? "animate-pulse" : ""}`} />
          )}
        </span>
      </button>
    </div>
  );
}
