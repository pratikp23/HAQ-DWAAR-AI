import React from "react";
import { 
  Sparkles, 
  Mic, 
  Loader2, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  FileText 
} from "lucide-react";
import { MITTRA_STATES } from "../../context/HaqAIContext";

/**
 * HAQ AI — Action Status & State Pill Indicator
 * Clear multilingual status badge showing exactly what MITTRA is doing.
 */
export default function HaqAIActionStatus({ state = MITTRA_STATES.IDLE, currentTask, currentHighlight }) {
  const statusConfig = {
    [MITTRA_STATES.IDLE]: {
      label: "तैयार • बोलिए मैं सुन रही हूँ",
      subLabel: "Ready • Speak your need",
      icon: Sparkles,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      dot: "bg-purple-500",
    },
    [MITTRA_STATES.LISTENING]: {
      label: "सुन रही हूँ... बोलिए",
      subLabel: "Listening...",
      icon: Mic,
      color: "text-orange-700 bg-orange-50 border-orange-200 animate-pulse",
      dot: "bg-orange-500 animate-ping",
    },
    [MITTRA_STATES.TRANSCRIBING]: {
      label: "आवाज़ समझ रही हूँ...",
      subLabel: "Transcribing speech...",
      icon: Loader2,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      dot: "bg-amber-500",
      spin: true,
    },
    [MITTRA_STATES.THINKING]: {
      label: "योजना व जानकारी जाँच रही हूँ...",
      subLabel: "Checking scheme rules...",
      icon: Loader2,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      dot: "bg-blue-500",
      spin: true,
    },
    [MITTRA_STATES.ACTING]: {
      label: "कार्रवाई कर रही हूँ...",
      subLabel: "Guiding to target...",
      icon: Compass,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      dot: "bg-emerald-500",
    },
    [MITTRA_STATES.CONFIRMING]: {
      label: "सरकारी पोर्टल खोलने से पहले पुष्टि",
      subLabel: "Confirmation needed",
      icon: ShieldCheck,
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      dot: "bg-indigo-500",
    },
    [MITTRA_STATES.SPEAKING]: {
      label: "बोलकर समझा रही हूँ...",
      subLabel: "Speaking guidance...",
      icon: Volume2,
      color: "text-purple-700 bg-purple-100/70 border-purple-300",
      dot: "bg-purple-600 animate-bounce",
    },
    [MITTRA_STATES.ERROR]: {
      label: "कृपया दोबारा कहें",
      subLabel: "Please retry",
      icon: AlertTriangle,
      color: "text-rose-700 bg-rose-50 border-rose-200",
      dot: "bg-rose-500",
    },
  };

  const current = statusConfig[state] || statusConfig[MITTRA_STATES.IDLE];
  const IconComp = current.icon;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* State Badge */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${current.color}`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${current.dot}`} />
          <IconComp className={`w-3.5 h-3.5 shrink-0 ${current.spin ? "animate-spin" : ""}`} />
          <span className="font-semibold truncate">{current.label}</span>
        </div>
        <span className="text-[10px] opacity-75 hidden sm:inline ml-2 shrink-0">
          {current.subLabel}
        </span>
      </div>

      {/* Optional Highlight Target Sub-Pill */}
      {currentHighlight && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 font-medium animate-fadeIn">
          <FileText className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="truncate">स्क्रीन पर ध्यान दें: {currentHighlight}</span>
        </div>
      )}
    </div>
  );
}
