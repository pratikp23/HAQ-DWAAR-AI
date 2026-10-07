import React from "react";
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

/**
 * HAQ AI — Directional Pointer Arrow Badge
 * Guides the citizen visually to the highlighted target element using pure CSS.
 */
export default function HaqAIArrow({
  direction = "bottom", // "top" | "bottom" | "left" | "right"
  label = "यहाँ देखें (Look here)",
}) {
  const getIcon = () => {
    switch (direction) {
      case "top":
        return <ArrowDown className="w-4 h-4 text-white animate-bounce" />;
      case "bottom":
        return <ArrowUp className="w-4 h-4 text-white animate-bounce" />;
      case "left":
        return <ArrowRight className="w-4 h-4 text-white animate-bounce" />;
      case "right":
      default:
        return <ArrowLeft className="w-4 h-4 text-white animate-bounce" />;
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ea580c] to-amber-600 text-white font-bold text-xs shadow-xl border-2 border-white pointer-events-none select-none z-50 whitespace-nowrap transition-transform duration-200">
      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
      <span>{label}</span>
      {getIcon()}
    </div>
  );
}
