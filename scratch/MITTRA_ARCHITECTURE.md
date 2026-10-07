# MITTRA Voice-First Citizen Task Agent — Architecture Specification

## 1. System Overview
**MITTRA** is HAQ DWAAR AI's voice-first citizen task agent. Its mission is to eliminate bureaucratic friction for Indian citizens (especially rural farmers, elderly individuals, and those with low digital literacy) by translating natural voice/text intent into guided actions across the portal:
> *"Speak your need. MITTRA handles the journey."*

---

## 2. End-to-End Pipeline
```
Citizen Voice / Text Input
         ↓
Speech-to-Text (Bhashini STT with Browser Fallback)
         ↓
MITTRA Agent Service (`/api/mittra/chat`)
         ↓
Intent Analysis & Task Planner (Gemini with deterministic fallback)
         ↓
Structured Command Generation (Zod validated schema)
         ↓
Action Allowlist Validation (Strictly enforced on Server & Client)
         ↓
Action Executor (Client-side routing, field setting, modal triggers)
         ↓
Existing HAQ DWAAR Services (Profile, Scheme DB, Matching, Readiness, Documents)
         ↓
Structured Result + Grounded Explanation (Uncertainty language)
         ↓
Text-to-Speech (Bhashini TTS / Browser Fallback) + Visual Spotlight
```

---

## 3. State Machine Model
MITTRA operates as an explicit finite state machine:

- **`IDLE`**: Floating orb is resting in soft glow.
- **`LISTENING`**: Microphone is active, capturing continuous speech with live interim transcript.
- **`TRANSCRIBING`**: Audio is sent to STT or interim transcript is being finalized.
- **`THINKING`**: Backend agent analyzes intent and generates structured commands.
- **`CONFIRMING`**: User confirmation requested before consequential actions (e.g., official portal redirect).
- **`ACTING`**: Allowed action is being executed (navigating, spotlighting, filling fields).
- **`SPEAKING`**: Audio is playing while visual speech waveform animates.
- **`ERROR`**: User-friendly, graceful recovery message shown (never raw errors).

---

## 4. Security & Safety Boundaries
1. **Allowlist Enforcement**: Every action must belong to the approved `ALLOWED_ACTIONS` list.
2. **Route Security**: Navigation is constrained to authenticated citizen routes (`/dashboard/*`). Arbitrary external URL generation by LLMs is strictly blocked.
3. **Data Integrity**: Scheme eligibility, benefits, and required documents are strictly loaded from verified MongoDB records. Gemini output cannot override deterministic matching logic.
4. **Handoff Safety**: External government portal navigation is derived exclusively from `scheme.officialApplicationUrl` with mandatory explicit citizen confirmation.
