import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * HAQ DWAAR AI — Accessible Modal Dialog
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md", // "sm" | "md" | "lg" | "xl"
  className = "",
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeMap[size] || sizeMap.md} bg-white rounded-2xl shadow-xl border border-[#e9e1f5] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e9e1f5] flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 id="modal-title" className="font-bold text-lg text-[#0f172a] tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#4b5563] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-[#0f172a] text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-[#e9e1f5] bg-[#fbf9fe] flex items-center justify-end space-x-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
