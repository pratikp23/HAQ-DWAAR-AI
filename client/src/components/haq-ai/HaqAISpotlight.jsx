import React, { useEffect, useState, useCallback, useRef } from "react";
import { Check } from "lucide-react";
import HaqAIArrow from "./HaqAIArrow";

/**
 * HAQ AI — Viewport Spotlight Halo
 * Uses fixed-position getBoundingClientRect to highlight fields and sections on screen using pure CSS.
 */
export default function HaqAISpotlight({ targetId, onDismiss }) {
  const [targetRect, setTargetRect] = useState(null);
  const rafRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!targetId) {
      setTargetRect(null);
      return;
    }

    const cleanFieldId = targetId.startsWith("field-") ? targetId.replace("field-", "") : targetId;

    // Multi-selector discovery
    const el =
      document.querySelector(`[data-haq-target="${targetId}"]`) ||
      document.querySelector(`[data-haq-field="${cleanFieldId}"]`) ||
      document.querySelector(`[data-haq-field="${targetId}"]`) ||
      document.getElementById(targetId);

    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      });
    } else {
      setTargetRect(null);
    }
  }, [targetId]);

  useEffect(() => {
    if (!targetId) return;

    // Scroll element smoothly into center view
    const cleanFieldId = targetId.startsWith("field-") ? targetId.replace("field-", "") : targetId;
    const el =
      document.querySelector(`[data-haq-target="${targetId}"]`) ||
      document.querySelector(`[data-haq-field="${cleanFieldId}"]`) ||
      document.querySelector(`[data-haq-field="${targetId}"]`) ||
      document.getElementById(targetId);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    updatePosition();

    const handleScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    // Auto-dismiss after 12 seconds so user is never locked
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 12000);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetId, updatePosition, onDismiss]);

  if (!targetId || !targetRect) return null;

  const padding = 8;
  const top = Math.max(0, targetRect.top - padding);
  const left = Math.max(0, targetRect.left - padding);
  const width = targetRect.width + padding * 2;
  const height = targetRect.height + padding * 2;

  // Arrow position: if there's room above, place above pointing down, else below
  const placeAbove = top > 50;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
      {/* Pulsating Glowing Focus Box around element */}
      <div
        style={{
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="rounded-2xl border-3 border-[#ea580c] shadow-[0_0_0_9999px_rgba(15,23,42,0.45),0_0_25px_rgba(234,88,12,0.6)] pointer-events-none transition-all duration-150 animate-pulse"
      >
        {/* Subtle Corner Accents */}
        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#ea580c] rounded-full" />
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#ea580c] rounded-full" />
        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#ea580c] rounded-full" />
        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#ea580c] rounded-full" />
      </div>

      {/* Directional Guide Arrow and Dismiss Action */}
      <div
        style={{
          position: "fixed",
          top: placeAbove ? `${Math.max(10, top - 44)}px` : `${top + height + 10}px`,
          left: `${Math.max(12, left + width / 2 - 80)}px`,
        }}
        className="pointer-events-auto flex items-center gap-2"
      >
        <HaqAIArrow
          direction={placeAbove ? "top" : "bottom"}
          label="यहाँ ध्यान दें"
        />

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="px-2.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold hover:bg-black transition-colors shadow-md flex items-center gap-1 cursor-pointer"
            title="हाइलाइट हटाएं"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>समझ गया</span>
          </button>
        )}
      </div>
    </div>
  );
}
