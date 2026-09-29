import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

/**
 * HAQ DWAAR AI — ErrorState Component
 */
export default function ErrorState({
  title = "Unable to load information",
  message = "A temporary connection issue occurred. Please try again.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`p-8 text-center rounded-2xl bg-white border border-rose-200 shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto my-6 ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#dc2626] mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-[#0f172a] tracking-tight">
        {title}
      </h4>

      {message && (
        <p className="text-xs text-[#4b5563] mt-1 mb-4 max-w-sm">
          {message}
        </p>
      )}

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
