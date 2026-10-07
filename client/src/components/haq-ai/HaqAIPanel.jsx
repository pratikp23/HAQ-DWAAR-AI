import React, { useState } from "react";
import { 
  X, 
  Send, 
  Sparkles, 
  VolumeX, 
  Volume2 
} from "lucide-react";
import { useHaqAI, MITTRA_STATES } from "../../context/HaqAIContext";
import HaqAIVoiceOrb from "./HaqAIVoiceOrb";
import HaqAIWaveform from "./HaqAIWaveform";
import HaqAIActionStatus from "./HaqAIActionStatus";
import HaqAITranscript from "./HaqAITranscript";
import { speechService } from "../../utils/speechHelper";

/**
 * HAQ AI — Floating Assistant Panel
 * Desktop: Floating bottom-right window.
 * Mobile: Slide-up bottom sheet with safe-area padding and 44px+ touch targets using pure CSS/Tailwind.
 */
export default function HaqAIPanel() {
  const {
    isOpen,
    setIsOpen,
    assistantState,
    language,
    setLanguage,
    conversationHistory,
    sendMessage,
    startListening,
    stopListening,
    interimTranscript,
    currentTask,
    currentHighlight,
  } = useHaqAI();

  const [inputText, setInputText] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  const isListening = assistantState === MITTRA_STATES.LISTENING;
  const isSpeaking = assistantState === MITTRA_STATES.SPEAKING;

  const handleOrbClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean) return;
    sendMessage(clean);
    setInputText("");
  };

  const toggleMute = () => {
    if (!isMuted) {
      speechService.stopSpeaking();
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  return (
    <aside
      aria-label="HAQ AI Voice Assistant Panel"
      className="fixed z-50 bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[400px] h-[85vh] sm:h-[650px] max-h-[90vh] bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl shadow-[0_12px_45px_rgba(43,15,76,0.22)] border border-purple-200/90 flex flex-col overflow-hidden pb-[calc(env(safe-area-inset-bottom,0px)+8px)] sm:pb-0 transition-transform duration-300 transform translate-y-0"
    >
      {/* Panel Header */}
      <header className="px-4 py-3 bg-gradient-to-r from-[#2b0f4c] via-[#4a154b] to-[#2b0f4c] text-white flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm tracking-tight">HAQ AI</h2>
              <span className="text-[10px] bg-orange-500/80 px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider">
                MITTRA
              </span>
            </div>
            <p className="text-[11px] text-purple-200 truncate font-medium">
              आपकी डिजिटल सहायक
            </p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          {/* Language Toggle */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/10 hover:bg-white/20 text-white text-[11px] rounded-lg px-2 py-1 border border-white/20 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
            title="भाषा चुनें (Select language)"
            aria-label="Language selector"
          >
            <option value="hi" className="text-slate-900">हिंदी</option>
            <option value="hi-Latn" className="text-slate-900">Hinglish</option>
            <option value="en" className="text-slate-900">English</option>
          </select>

          {/* Mute/Sound Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isMuted ? "आवाज़ चालू करें" : "आवाज़ बंद करें"}
            aria-label={isMuted ? "Unmute voice" : "Mute voice"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Close / Minimize */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="बंद करें"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* State / Action Status Bar */}
      <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-100">
        <HaqAIActionStatus
          state={assistantState}
          currentTask={currentTask}
          currentHighlight={currentHighlight}
        />
      </div>

      {/* Conversation Transcript Feed */}
      <HaqAITranscript
        history={conversationHistory}
        interimTranscript={interimTranscript}
        isListening={isListening}
        onSelectPrompt={(text) => sendMessage(text)}
      />

      {/* Voice Frequency Waveform */}
      {(isListening || isSpeaking) && (
        <div className="py-1 bg-gradient-to-r from-purple-50/40 via-orange-50/60 to-purple-50/40 flex justify-center">
          <HaqAIWaveform
            isActive={true}
            mode={isSpeaking ? "speaking" : "listening"}
            barCount={11}
          />
        </div>
      )}

      {/* Control Footer */}
      <footer className="p-3 bg-white border-t border-purple-100 flex flex-col gap-2.5">
        {/* Main Voice Orb Button & Prompt */}
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] text-slate-500 font-medium">
            {isListening
              ? "🎙️ बोलिए, मैं सुन रही हूँ..."
              : isSpeaking
              ? "🔊 बोल रही हूँ..."
              : "बोलने के लिए माइक दबाएँ"}
          </span>

          <div className="flex items-center gap-2">
            <HaqAIVoiceOrb
              state={assistantState}
              onClick={handleOrbClick}
              size="md"
            />
          </div>
        </div>

        {/* Text Input Fallback (for noisy environments or no mic) */}
        <form onSubmit={handleTextSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="या यहाँ लिखकर पूछें (Type here)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-xl bg-[#2b0f4c] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0 min-w-[44px]"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </aside>
  );
}
