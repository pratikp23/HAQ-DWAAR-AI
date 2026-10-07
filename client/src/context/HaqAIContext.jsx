import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendMittraMessage, getMittraContext } from "../services/mittraApi";
import { speechService } from "../utils/speechHelper";
import { useAuth } from "../hooks/useAuth";

const HaqAIContext = createContext(null);

export const MITTRA_STATES = {
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  TRANSCRIBING: "TRANSCRIBING",
  THINKING: "THINKING",
  CONFIRMING: "CONFIRMING",
  ACTING: "ACTING",
  SPEAKING: "SPEAKING",
  ERROR: "ERROR",
};

export const ALLOWED_ACTIONS = [
  "NAVIGATE",
  "HIGHLIGHT",
  "NAVIGATE_AND_GUIDE",
  "ASK_USER",
  "FILL_FIELD",
  "SELECT_OPTION",
  "SHOW_SCHEMES",
  "SHOW_SCHEME",
  "SHOW_MATCH_REASON",
  "SHOW_DOCUMENTS",
  "OPEN_DOCUMENT_UPLOAD",
  "ANALYZE_DOCUMENT",
  "SHOW_READINESS",
  "SHOW_ACTION_PLAN",
  "PREPARE_APPLICATION",
  "OPEN_APPLICATION_REVIEW",
  "OPEN_OFFICIAL_APPLICATION",
  "TRACK_APPLICATION",
  "READ_PAGE",
  "CONFIRM_ACTION",
  "CANCEL_TASK",
];

export function HaqAIProvider({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Assistant UI & State Machine
  const [isOpen, setIsOpen] = useState(false);
  const [assistantState, setAssistantState] = useState(MITTRA_STATES.IDLE);
  const [language, setLanguage] = useState("hi");
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [errorMessage, setErrorMessage] = useState("");

  // Conversation & Transcription
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);

  // Active Task Management
  const [currentTask, setCurrentTask] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [pendingSteps, setPendingSteps] = useState([]);
  const [lastIntent, setLastIntent] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [lastActionResult, setLastActionResult] = useState(null);

  // Spotlight & Target Highlighting
  const [currentTarget, setCurrentTarget] = useState(null);
  const [currentHighlight, setCurrentHighlight] = useState(null);

  // Confirmation Flow (for consequential external handoff / destructive operations)
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  // Snapshots
  const [profileSnapshot, setProfileSnapshot] = useState(null);
  const [documentSnapshot, setDocumentSnapshot] = useState(null);
  const [matchingSnapshot, setMatchingSnapshot] = useState(null);
  const [sessionStartedAt] = useState(() => Date.now());

  // Greeting tracking
  const hasGreetedRef = useRef(false);

  // Sync route
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname]);

  // Load fresh context snapshot on mount if authenticated
  const refreshContext = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getMittraContext();
      if (res.data?.success) {
        const snap = res.data.data;
        setProfileSnapshot(snap.profileSummary);
        setDocumentSnapshot(snap.docSummary);
        setMatchingSnapshot(snap.topSchemes);
      }
    } catch (err) {
      console.warn("Failed to refresh MITTRA context snapshot:", err);
    }
  }, [user]);

  useEffect(() => {
    refreshContext();
  }, [refreshContext]);

  // Initial welcome greeting for citizen
  const playWelcomeGreeting = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    const welcomeText =
      "नमस्ते 🙏 HAQ DWAAR में आपका स्वागत है। मैं MITTRA हूँ। मैं सरकारी योजनाओं और जरूरी दस्तावेज़ों को समझने और तैयार करने में आपकी मदद कर सकती हूँ। आपको वेबसाइट चलाने की जरूरत नहीं है। आप बस मुझसे बोलकर बताइए कि आपको किस चीज़ की मदद चाहिए। बताइए, मैं आपकी क्या मदद कर सकती हूँ?";

    setConversationHistory([
      {
        id: "msg-welcome",
        sender: "mittra",
        text: welcomeText,
        timestamp: new Date().toISOString(),
      },
    ]);

    setAssistantState(MITTRA_STATES.SPEAKING);
    speechService.speak(
      welcomeText,
      () => setAssistantState(MITTRA_STATES.SPEAKING),
      () => setAssistantState(MITTRA_STATES.IDLE)
    );
  }, []);

  // UI Spotlight Trigger
  const triggerHighlight = useCallback((targetId) => {
    if (!targetId) {
      setCurrentHighlight(null);
      return;
    }

    // Attempt finding element by data-haq-target, then id
    const el =
      document.querySelector(`[data-haq-target="${targetId}"]`) ||
      document.getElementById(targetId);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentHighlight(targetId);
    } else {
      setCurrentHighlight(targetId);
    }
  }, []);

  const clearHighlight = useCallback(() => {
    setCurrentHighlight(null);
    setCurrentTarget(null);
  }, []);

  // Central Action Executor with Strict Allowlist & Authorization
  const executeAction = useCallback(
    async (command) => {
      if (!command || !command.action) return;

      const { action, target, highlight, field, value, requiresConfirmation, speech, metadata } = command;

      // 1. Check Allowlist
      if (!ALLOWED_ACTIONS.includes(action)) {
        console.error("Action not in allowlist:", action);
        setAssistantState(MITTRA_STATES.ERROR);
        setErrorMessage("इस कार्रवाई की अनुमति नहीं है।");
        return;
      }

      setLastAction(action);

      // 2. Consequential Actions require Confirmation
      if (requiresConfirmation && action === "OPEN_OFFICIAL_APPLICATION") {
        setAssistantState(MITTRA_STATES.CONFIRMING);
        setPendingConfirmation({
          action,
          target,
          metadata,
          message:
            speech ||
            "अब मैं आपको संबंधित सरकारी application portal पर ले जा सकती हूँ। Final submission आपको वहाँ स्वयं करना होगा। क्या आप आगे बढ़ना चाहते हैं?",
        });
        return;
      }

      setAssistantState(MITTRA_STATES.ACTING);

      try {
        switch (action) {
          case "NAVIGATE":
          case "NAVIGATE_AND_GUIDE":
            if (target) {
              navigate(target);
            }
            if (highlight) {
              setTimeout(() => triggerHighlight(highlight), 450);
            }
            break;

          case "HIGHLIGHT":
            if (highlight || target) {
              triggerHighlight(highlight || target);
            }
            break;

          case "FILL_FIELD":
            if (field) {
              // Locate input with data-haq-field
              const inputEl = document.querySelector(`[data-haq-field="${field}"]`);
              if (inputEl) {
                inputEl.value = value;
                inputEl.dispatchEvent(new Event("input", { bubbles: true }));
                inputEl.dispatchEvent(new Event("change", { bubbles: true }));
                triggerHighlight(`field-${field}`);
              }
            }
            break;

          case "SHOW_SCHEMES":
            navigate("/dashboard/recommendations");
            break;

          case "SHOW_DOCUMENTS":
            navigate("/dashboard/documents");
            break;

          case "SHOW_READINESS":
            if (metadata?.schemeId) {
              navigate(`/dashboard/readiness/${metadata.schemeId}`);
            } else {
              navigate("/dashboard/recommendations");
            }
            break;

          case "CANCEL_TASK":
            setCurrentTask(null);
            setTaskId(null);
            clearHighlight();
            break;

          case "ASK_USER":
          default:
            // Just conversational guidance
            break;
        }

        setLastActionResult({ success: true, action });

        // Speak the assistant's response
        if (speech) {
          setAssistantState(MITTRA_STATES.SPEAKING);
          speechService.speak(
            speech,
            () => setAssistantState(MITTRA_STATES.SPEAKING),
            () => setAssistantState(MITTRA_STATES.IDLE)
          );
        } else {
          setAssistantState(MITTRA_STATES.IDLE);
        }
      } catch (err) {
        console.error("Action execution error:", err);
        setAssistantState(MITTRA_STATES.ERROR);
        setErrorMessage("कार्रवाई पूरी करने में त्रुटि हुई।");
      }
    },
    [navigate, triggerHighlight, clearHighlight]
  );

  // Confirm pending consequential action
  const confirmAction = useCallback(() => {
    if (!pendingConfirmation) return;
    const { action, target } = pendingConfirmation;
    setPendingConfirmation(null);

    if (action === "OPEN_OFFICIAL_APPLICATION" && target) {
      window.open(target, "_blank", "noopener,noreferrer");
      setAssistantState(MITTRA_STATES.IDLE);
      setConversationHistory((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "mittra",
          text: "सरकारी पोर्टल नए टैब में खोल दिया गया है। अंतिम आवेदन वहीं पूरा करें।",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [pendingConfirmation]);

  // Cancel pending action
  const cancelAction = useCallback(() => {
    setPendingConfirmation(null);
    setAssistantState(MITTRA_STATES.IDLE);
    const cancelMsg = "जी ठीक है, सरकारी पोर्टल पर नहीं भेजा गया है।";
    setConversationHistory((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "mittra",
        text: cancelMsg,
        timestamp: new Date().toISOString(),
      },
    ]);
    speechService.speak(cancelMsg);
  }, []);

  // Send citizen message (voice or text)
  const sendMessage = useCallback(
    async (userText) => {
      const q = (userText || transcript).trim();
      if (!q) return;

      // 1. Add user message to history
      const userMsgId = `msg-user-${Date.now()}`;
      setConversationHistory((prev) => [
        ...prev,
        {
          id: userMsgId,
          sender: "user",
          text: q,
          timestamp: new Date().toISOString(),
        },
      ]);

      setTranscript("");
      setInterimTranscript("");
      setAssistantState(MITTRA_STATES.THINKING);

      try {
        // 2. Call backend agent pipeline
        const res = await sendMittraMessage({
          query: q,
          language,
          currentRoute,
          conversationHistory: conversationHistory.slice(-4),
        });

        if (res.data?.success && res.data?.command) {
          const command = res.data.command;

          // Add assistant message to history
          setConversationHistory((prev) => [
            ...prev,
            {
              id: `msg-mittra-${Date.now()}`,
              sender: "mittra",
              text: command.speech,
              action: command.action,
              timestamp: new Date().toISOString(),
            },
          ]);

          // Execute structured command
          await executeAction(command);
        } else {
          throw new Error("Invalid agent response");
        }
      } catch (err) {
        console.error("MITTRA Agent error:", err);
        const fallbackSpeech =
          "अभी मैं आपकी request समझ नहीं पा रही हूँ। आप दोबारा बोल सकते हैं या नीचे type कर सकते हैं।";
        setAssistantState(MITTRA_STATES.ERROR);
        setErrorMessage(fallbackSpeech);
        setConversationHistory((prev) => [
          ...prev,
          {
            id: `msg-err-${Date.now()}`,
            sender: "mittra",
            text: fallbackSpeech,
            timestamp: new Date().toISOString(),
          },
        ]);
        speechService.speak(fallbackSpeech, () => {}, () => setAssistantState(MITTRA_STATES.IDLE));
      }
    },
    [transcript, language, currentRoute, conversationHistory, executeAction]
  );

  // Continuous speech-to-text input
  const startListening = useCallback(() => {
    speechService.stopSpeaking();
    setAssistantState(MITTRA_STATES.LISTENING);
    setTranscript("");
    setInterimTranscript("");

    speechService.startListening(
      (finalText) => {
        setAssistantState(MITTRA_STATES.TRANSCRIBING);
        setTranscript(finalText);
        setInterimTranscript("");
        sendMessage(finalText);
      },
      (interim) => {
        setInterimTranscript(interim);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setAssistantState(MITTRA_STATES.IDLE);
      }
    );
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    if (interimTranscript) {
      sendMessage(interimTranscript);
    } else {
      setAssistantState(MITTRA_STATES.IDLE);
    }
  }, [interimTranscript, sendMessage]);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !hasGreetedRef.current) {
        setTimeout(() => playWelcomeGreeting(), 300);
      }
      return next;
    });
  }, [playWelcomeGreeting]);

  return (
    <HaqAIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleAssistant,
        assistantState,
        setAssistantState,
        language,
        setLanguage,
        currentRoute,
        transcript,
        interimTranscript,
        conversationHistory,
        sendMessage,
        startListening,
        stopListening,
        currentHighlight,
        triggerHighlight,
        clearHighlight,
        pendingConfirmation,
        confirmAction,
        cancelAction,
        currentTask,
        setCurrentTask,
        completedSteps,
        pendingSteps,
        profileSnapshot,
        documentSnapshot,
        matchingSnapshot,
        errorMessage,
        sessionStartedAt,
        refreshContext,
      }}
    >
      {children}
    </HaqAIContext.Provider>
  );
}

export function useHaqAI() {
  const context = useContext(HaqAIContext);
  return context || {
    isOpen: false,
    setIsOpen: () => {},
    toggleAssistant: () => {},
    assistantState: MITTRA_STATES.IDLE,
    sendMessage: () => {},
    startListening: () => {},
    stopListening: () => {},
    triggerHighlight: () => {},
    clearHighlight: () => {},
  };
}
