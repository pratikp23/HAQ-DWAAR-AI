import React from "react";
import { Mic, Volume2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { MITTRA_STATES } from "../../context/HaqAIContext";

/**
 * HAQ AI — Voice Visualizer Orb
 * Multi-state pulsating orb reacting to citizen voice interactions using pure CSS/Tailwind.
 */
export default function HaqAIVoiceOrb({
  state = MITTRA_STATES.IDLE,
  onClick,
  size = "md", // "sm" | "md" | "lg"
  disabled = false,
}) {
  const isListening = state === MITTRA_STATES.LISTENING;
  const isTranscribing = state === MITTRA_STATES.TRANSCRIBING;
  const isThinking = state === MITTRA_STATES.THINKING;
  const isActing = state === MITTRA_STATES.ACTING;
  const isSpeaking = state === MITTRA_STATES.SPEAKING;
  const isError = state === MITTRA_STATES.ERROR;

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }[size] || "w-14 h-14";

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  }[size] || "w-7 h-7";

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer Halo Glow */}
      {(isListening || isSpeaking || isThinking) && (
        <div
          className={`absolute rounded-full pointer-events-none blur-md animate-pulse ${
            isListening
              ? "bg-orange-500/40"
              : isSpeaking
              ? "bg-purple-600/40"
              : "bg-blue-500/40"
          }`}
          style={{ inset: size === "lg" ? "-10px" : "-6px" }}
        />
      )}

      {/* Ripple Rings when Listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-orange-500 pointer-events-none animate-ping opacity-60" />
          <div className="absolute -inset-1 rounded-full border border-amber-400 pointer-events-none animate-pulse opacity-80" />
        </>
      )}

      {/* Main Interactive Button / Orb */}
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={
          isListening
            ? "सुनना बंद करें (Stop listening)"
            : "बोलकर बात करें (Click to speak to MITTRA)"
        }
        className={`relative z-10 ${sizeClasses} rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-90 hover:scale-105 focus:outline-none focus:ring-4 cursor-pointer ${
          isListening
            ? "bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 text-white shadow-orange-500/40 focus:ring-orange-300"
            : isSpeaking
            ? "bg-gradient-to-tr from-[#2b0f4c] via-purple-700 to-indigo-600 text-white shadow-purple-600/40 focus:ring-purple-300"
            : isThinking || isTranscribing || isActing
            ? "bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/40 focus:ring-blue-300"
            : isError
            ? "bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-rose-500/40 focus:ring-rose-300"
            : "bg-gradient-to-tr from-[#2b0f4c] via-[#4a154b] to-[#ea580c] text-white shadow-purple-900/30 hover:shadow-orange-500/30 focus:ring-purple-300"
        }`}
      >
        {isListening ? (
          <Mic className={`${iconSizes} animate-pulse drop-shadow-md`} />
        ) : isSpeaking ? (
          <Volume2 className={`${iconSizes} animate-bounce drop-shadow-md`} />
        ) : isThinking || isTranscribing || isActing ? (
          <Loader2 className={`${iconSizes} animate-spin drop-shadow-md`} />
        ) : isError ? (
          <AlertCircle className={`${iconSizes} drop-shadow-md`} />
        ) : (
          <Sparkles className={`${iconSizes} drop-shadow-md`} />
        )}
      </button>
    </div>
  );
}
