import React from "react";
import { ExternalLink, ShieldAlert, Check, X } from "lucide-react";

/**
 * HAQ AI — Consequential Action Confirmation Modal
 * Strict safety barrier before leaving HAQ DWAAR to an external official government portal.
 */
export default function HaqAIConfirmation({
  isOpen = false,
  message,
  targetUrl,
  schemeName,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-purple-200/90 max-w-lg w-full p-6 overflow-hidden relative transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              सुरक्षा पुष्टि (Safety Check)
            </span>
            <h3 id="confirm-dialog-title" className="text-lg font-bold text-slate-900 mt-1 leading-snug">
              सरकारी पोर्टल पर प्रस्थान की पुष्टि
            </h3>
          </div>
        </div>

        {/* Scheme Name if provided */}
        {schemeName && (
          <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-200 text-sm font-semibold text-[#2b0f4c]">
            योजना: {schemeName}
          </div>
        )}

        {/* Body Speech / Message */}
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {message ||
            "अब मैं आपको संबंधित सरकारी application portal पर ले जा सकती हूँ। Final submission आपको वहाँ स्वयं करना होगा। क्या आप आगे बढ़ना चाहते हैं?"}
        </p>

        {/* Transparent Target Portal URL */}
        {targetUrl && (
          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate font-mono mr-2">{targetUrl}</span>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        )}

        {/* Mandatory Disclaimers */}
        <div className="mb-5 p-3 bg-rose-50/80 rounded-xl border border-rose-200/80 text-xs text-rose-900 space-y-1">
          <p className="font-semibold">⚠️ महत्वपूर्ण नागरिक सूचना:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
            <li>HAQ DWAAR AI केवल मार्गदर्शन व तैयारी में सहायता करता है।</li>
            <li>सरकारी पोर्टल पर अंतिम आवेदन और दस्तावेज़ सबमिशन आपको स्वयं करना होगा।</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            नहीं, अभी रहने दें
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            हाँ, सरकारी पोर्टल खोलें
          </button>
        </div>
      </div>
    </div>
  );
}
