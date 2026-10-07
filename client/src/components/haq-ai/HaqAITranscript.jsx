import React, { useEffect, useRef } from "react";
import { Sparkles, User, Volume2, ShieldAlert, ArrowRight, Mic } from "lucide-react";
import { speechService } from "../../utils/speechHelper";

/**
 * HAQ AI — Transcript & Conversation Feed
 * Renders citizen dialogue, assistant guidance, action status, and quick prompt chips.
 */
export default function HaqAITranscript({
  history = [],
  interimTranscript = "",
  isListening = false,
  onSelectPrompt,
}) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message or interim update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, interimTranscript]);

  const quickPrompts = [
    { label: "मेरी बेटी के लिए छात्रवृत्ति", query: "मेरी बेटी के लिए कौन सी छात्रवृत्ति योजनाएं हैं?" },
    { label: "खेती के लिए सहायता", query: "खेती और कृषि के लिए कौन सी सरकारी योजना उपलब्ध है?" },
    { label: "मेरे दस्तावेज़ चेक करो", query: "मेरे कौन से दस्तावेज़ तैयार हैं और कौन से बाकी हैं?" },
    { label: "प्रोफाइल पूरा करो", query: "मेरा प्रोफाइल पूरा करने में मदद करो" },
    { label: "आवेदन की स्थिति", query: "मेरे सरकारी आवेदनों का स्टेटस क्या है?" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable Conversation History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 text-sm scroll-smooth"
      >
        {history.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 transition-all duration-200 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {/* MITTRA Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2b0f4c] to-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-[#2b0f4c] text-white rounded-tr-xs"
                    : "bg-white text-slate-800 border border-purple-100 rounded-tl-xs shadow-[0_2px_8px_rgba(43,15,76,0.06)]"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-purple-50 pb-1">
                    <span className="font-bold text-[11px] text-[#2b0f4c] flex items-center gap-1">
                      MITTRA
                      <span className="text-[10px] text-amber-600 font-normal">
                        (डिजिटल सहायक)
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => speechService.speak(msg.text)}
                      className="text-slate-400 hover:text-purple-700 transition-colors cursor-pointer"
                      title="दोबारा सुनें (Listen again)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Uncertainty Language Footer on MITTRA messages */}
                {!isUser && (
                  <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-500">
                    <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>सरकारी नियमों पर आधारित संभावित जानकारी</span>
                  </div>
                )}
              </div>

              {/* Citizen User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-[#2b0f4c] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live Interim Voice Speech Bubbles */}
        {isListening && interimTranscript && (
          <div className="flex justify-end gap-2 animate-fadeIn">
            <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm bg-purple-50 border border-purple-200 text-purple-900 rounded-tr-xs shadow-xs italic flex items-center gap-2">
              <Mic className="w-4 h-4 text-orange-500 animate-pulse shrink-0" />
              <span>{interimTranscript}...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Starter Chips */}
      {history.length <= 2 && (
        <div className="px-4 py-2 border-t border-purple-100 bg-purple-50/40">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            आप पूछ सकते हैं (Suggested queries):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(p.query)}
                className="px-2.5 py-1 rounded-full bg-white border border-purple-200 text-[11px] text-[#2b0f4c] font-medium hover:bg-purple-100/60 hover:border-purple-300 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>{p.label}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
