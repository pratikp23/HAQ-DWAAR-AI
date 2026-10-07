import React from "react";
import { useHaqAI } from "../../context/HaqAIContext";
import HaqAIFloatingButton from "./HaqAIFloatingButton";
import HaqAIPanel from "./HaqAIPanel";
import HaqAISpotlight from "./HaqAISpotlight";
import HaqAIConfirmation from "./HaqAIConfirmation";

/**
 * HAQ AI — Persistent Assistant Coordinator
 * Mounted in CitizenLayout to ensure global availability on all authenticated routes.
 */
export default function HaqAIAssistant() {
  const {
    currentHighlight,
    clearHighlight,
    pendingConfirmation,
    confirmAction,
    cancelAction,
  } = useHaqAI();

  return (
    <>
      {/* Floating launcher button (shown when collapsed) */}
      <HaqAIFloatingButton />

      {/* Main voice assistant panel (desktop floating / mobile bottom sheet) */}
      <HaqAIPanel />

      {/* Interactive Viewport Spotlight Overlay */}
      {currentHighlight && (
        <HaqAISpotlight
          targetId={currentHighlight}
          onDismiss={clearHighlight}
        />
      )}

      {/* Consequential Action Confirmation Modal */}
      {pendingConfirmation && (
        <HaqAIConfirmation
          isOpen={!!pendingConfirmation}
          message={pendingConfirmation.message}
          targetUrl={pendingConfirmation.target}
          schemeName={pendingConfirmation.metadata?.schemeName}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
    </>
  );
}
