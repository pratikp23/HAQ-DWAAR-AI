import React from "react";
import { Loader2 } from "lucide-react";

/**
 * HAQ DWAAR AI — LoadingState Component
 */
export default function LoadingState({
  title = "Loading information...",
  message = "Please wait while we verify records from the secure gateway.",
  className = "",
}) {
  return (
    <div
      className={`p-10 text-center rounded-2xl bg-white border border-[#e9e1f5] shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto my-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#fbf9fe] border border-[#e9e1f5] flex items-center justify-center text-[#ea580c] mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#ea580c]" />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-[#0f172a] tracking-tight">
        {title}
      </h4>

      {message && (
        <p className="text-xs text-[#4b5563] mt-1 max-w-sm">
          {message}
        </p>
      )}
    </div>
  );
}
