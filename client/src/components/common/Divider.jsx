import React from "react";

/**
 * HAQ DWAAR AI — Divider Component
 */
export default function Divider({
  label,
  className = "",
  orientation = "horizontal",
}) {
  if (orientation === "vertical") {
    return <div className={`inline-block w-px self-stretch bg-[#e9e1f5] ${className}`} />;
  }

  if (label) {
    return (
      <div className={`relative flex py-3 items-center ${className}`}>
        <div className="flex-grow border-t border-[#e9e1f5]" />
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[#4b5563] bg-[#f7f5fa] px-2">
          {label}
        </span>
        <div className="flex-grow border-t border-[#e9e1f5]" />
      </div>
    );
  }

  return <hr className={`border-0 border-t border-[#e9e1f5] my-4 ${className}`} />;
}
