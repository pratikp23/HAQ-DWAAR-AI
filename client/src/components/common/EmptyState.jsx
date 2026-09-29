import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

/**
 * HAQ DWAAR AI — EmptyState Component
 */
export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records matching your criteria right now.",
  actionLabel,
  onAction,
  actionTo,
  actionIcon,
  className = "",
}) {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl bg-white border border-[#e9e1f5] shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-6 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#fbf9fe] border border-[#e9e1f5] flex items-center justify-center text-[#591d8f] mb-4 shadow-xs">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#0f172a] tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#4b5563] mt-1 mb-5 max-w-md leading-relaxed">
        {description}
      </p>

      {(actionLabel && (onAction || actionTo)) && (
        <Button
          variant="orange"
          size="sm"
          icon={actionIcon}
          onClick={onAction}
          to={actionTo}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
