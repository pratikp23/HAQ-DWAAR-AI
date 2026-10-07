import React from "react";

/**
 * HAQ AI — Voice Waveform Visualizer
 * Animates realistic audio frequencies when listening or speaking using pure CSS/Tailwind.
 */
export default function HaqAIWaveform({ isActive = false, mode = "listening", barCount = 7 }) {
  if (!isActive) return null;

  const isSpeaking = mode === "speaking";

  return (
    <div className="flex items-center justify-center gap-1.5 h-6 px-2" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, idx) => {
        const delays = ["delay-0", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300", "delay-100"];
        const delayClass = delays[idx % delays.length];

        return (
          <span
            key={idx}
            className={`w-1 rounded-full transition-all duration-300 animate-pulse ${delayClass} ${
              isSpeaking
                ? "bg-gradient-to-t from-purple-600 to-indigo-500 h-4"
                : "bg-gradient-to-t from-orange-500 to-amber-400 h-3"
            }`}
            style={{
              height: `${Math.max(6, ((idx * 7) % 18) + 6)}px`,
            }}
          />
        );
      })}
    </div>
  );
}
