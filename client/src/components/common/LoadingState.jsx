import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./Skeleton";

/**
 * LOK SAMARTH — HeroUI LoadingState Component
 * 
 * Supports:
 * - variant: "spinner" (default HeroUI dual-ring card) | "skeleton"
 * - title & message reassurance
 */
export default function LoadingState({
  title = "Verifying Welfare Records...",
  message = "Please wait while we securely connect with the statutory gateway.",
  variant = "spinner",
  className = "",
}) {
  if (variant === "skeleton") {
    return (
      <div className={`p-6 rounded-2xl border border-[#c6decb] bg-white space-y-4 max-w-lg mx-auto my-6 ${className}`}>
        <div className="flex items-center gap-3">
          <Skeleton animationType="shimmer" className="h-10 w-10 rounded-full bg-[#e2ede5] shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton animationType="shimmer" className="h-4 w-3/5 rounded-md bg-[#e2ede5]" />
            <Skeleton animationType="shimmer" className="h-3 w-2/5 rounded-md bg-[#e2ede5]" />
          </div>
        </div>
        <Skeleton animationType="shimmer" className="h-24 w-full rounded-xl bg-[#e2ede5]" />
      </div>
    );
  }

  return (
    <div
      className={`p-8 sm:p-10 text-center rounded-2xl bg-white border border-[#c6decb] shadow-xs flex flex-col items-center justify-center max-w-md mx-auto my-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* HeroUI Dual-ring Spinner Badge */}
      <div className="w-12 h-12 rounded-2xl bg-[#eef5f0] border border-[#c6decb] flex items-center justify-center text-[#ea580c] mb-3.5 relative">
        <Loader2 className="w-6 h-6 animate-spin text-[#ea580c]" />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-[#112318] tracking-tight">
        {title}
      </h4>

      {message && (
        <p className="text-xs text-[#385a42] mt-1.5 max-w-xs leading-relaxed">
          {message}
        </p>
      )}
    </div>
  );
}
