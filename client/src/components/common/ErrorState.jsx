import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, RefreshCw, Home, PhoneCall } from "lucide-react";
import Button from "./Button";
import { formatUserError } from "../../utils/formatUserError";

/**
 * LOK SAMARTH — HeroUI User-Centric ErrorState Component
 * 
 * Guarantees zero developer errors, technical jargon, or stack traces are shown to citizens.
 * Automatically sanitizes any technical error object or message into reassuring citizen guidance.
 */
export default function ErrorState({
  title,
  message,
  error,
  onRetry,
  showHome = false,
  showSupport = true,
  className = "",
}) {
  // If a raw error object or string is provided, pass through formatUserError
  const sanitized = formatUserError(error || message);
  const displayTitle = title || sanitized.title;
  const displayMessage = (message && !error && !message.includes("Error") && !message.includes("status"))
    ? message 
    : sanitized.message;

  return (
    <div
      className={`p-6 sm:p-8 text-center rounded-2xl bg-white border border-[#c6decb] shadow-xs flex flex-col items-center justify-center max-w-md mx-auto my-6 ${className}`}
      role="alert"
    >
      {/* HeroUI Alert Icon Badge */}
      <div className="w-12 h-12 rounded-2xl bg-[#ea580c]/10 border border-[#ea580c]/20 flex items-center justify-center text-[#ea580c] mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-[#112318] tracking-tight">
        {displayTitle}
      </h4>

      <p className="text-xs text-[#385a42] mt-1.5 mb-5 max-w-sm leading-relaxed">
        {displayMessage}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            onClick={onRetry}
            className="cursor-pointer"
          >
            {sanitized.actionLabel || "Try Again"}
          </Button>
        )}

        {showHome && (
          <Link to="/dashboard">
            <Button
              variant="secondary"
              size="sm"
              icon={Home}
              className="cursor-pointer"
            >
              Citizen Dashboard
            </Button>
          </Link>
        )}
      </div>

      {/* Citizen Helpline Footer */}
      {showSupport && (
        <div className="mt-5 pt-3.5 border-t border-[#c6decb]/60 w-full flex items-center justify-center gap-1.5 text-[11px] text-[#44684e]">
          <PhoneCall className="w-3 h-3 text-[#ea580c]" />
          <span>Need help? National Consumer Helpline:</span>
          <a href="tel:1915" className="font-bold text-[#ea580c] hover:underline">1915</a>
        </div>
      )}
    </div>
  );
}
