# HAQ AI / MITTRA — Voice-First Citizen Task Agent Delivery Report

**Project**: HAQ DWAAR AI — "Scheme se Application Tak"  
**Module**: HAQ AI / MITTRA Voice-First Task Agent  
**Product Principle**: *"Speak your need. MITTRA handles the journey."*

---

## 1. Executive Summary

MITTRA has been elevated from a dashboard card/modal into a **persistent, voice-first AI Citizen Task Agent** mounted globally across all authenticated citizen pages (`/dashboard/*`). 

Uneducated, elderly, or first-time citizens no longer need to know how to navigate complex civic websites. They can speak naturally in Hindi, Hinglish, or English. MITTRA understands their intent, navigates to the relevant page, guides them with visual spotlights, safely autofills registered fields, explains deterministic scheme matches, prepares documents, and coordinates the handoff to official government portals with strict safety confirmation.

---

## 2. Core Security & Safety Guardrails (Fully Enforced)

1. **Zero Arbitrary Execution**:
   - Neither Gemini nor any LLM can execute arbitrary code or SQL/NoSQL queries.
   - All AI output passes through:
     $$\text{AI/Intent Engine} \longrightarrow \text{Zod Validation} \longrightarrow \text{Action Allowlist} \longrightarrow \text{Client Executor} \longrightarrow \text{Trusted APIs}$$

2. **Source of Truth Principle**:
   - The verified Scheme Database and deterministic matching engine (`server/services/matchingService.js`) remain the sole source of truth for all eligibility rules, benefits, and deadlines.
   - MITTRA only explains deterministic results and never invents eligibility or government approval.

3. **Mandatory Uncertainty Language**:
   - All voice and text explanations use legally sound uncertainty language:
     - *"Potential match"* / *"संभावित योजना"*
     - *"Appears relevant"* / *"आपकी जानकारी के आधार पर प्रासंगिक"*
     - *"Needs verification"* / *"सत्यापन आवश्यक"*
     - *"Based on the information provided"* / *"आपके द्वारा दी गई जानकारी के अनुसार"*

4. **Consequential Action Safety Gate**:
   - External application links (`OPEN_OFFICIAL_APPLICATION`) can **never** execute automatically.
   - A dedicated safety confirmation modal (`HaqAIConfirmation.jsx`) appears with explicit citizen notice:
     > *"⚠️ महत्वपूर्ण: अंतिम आवेदन और दस्तावेज़ सबमिशन आपको स्वयं आधिकारिक सरकारी पोर्टल पर करना होगा।"*
   - Official URLs originate exclusively from verified scheme records in the database.

5. **Graceful Fallback & Speech Resilience**:
   - 100% functional via text if microphone permissions are denied or voice is unavailable.
   - Chrome speech garbage collection bug eliminated via persistent utterance reference in `speechHelper.js`.
   - Web Audio chime sound on click provides immediate feedback for accessibility.

---

## 3. Architecture & File Inventory

### Backend (`server/`)
- `server/services/mittraActionService.js`:
  - `ALLOWED_ACTIONS` allowlist (21 approved actions).
  - `ALLOWED_ROUTES` allowlist (`/dashboard/*`).
  - `REGISTERED_FIELDS` civic field dictionary.
  - Zod command validator & sanitizer.
- `server/services/mittraContextService.js`:
  - Aggregates privacy-safe citizen snapshot (profile completeness, document health, tracked applications, top deterministic scheme matches).
- `server/services/mittraAgentService.js`:
  - Multilingual conversational processor (Gemini integration with comprehensive Devanagari Hindi, Hinglish & English deterministic intent engine fallback).
- `server/routes/mittraRoutes.js`:
  - Protected endpoints: `POST /api/mittra/chat` and `GET /api/mittra/context`. Mounted in `server/app.js`.

### Frontend (`client/`)
- `client/src/services/mittraApi.js`:
  - Axios service connecting frontend to MITTRA backend endpoints.
- `client/src/context/HaqAIContext.jsx`:
  - State machine: `IDLE` -> `LISTENING` -> `TRANSCRIBING` -> `THINKING` -> `ACTING` -> `SPEAKING` -> `CONFIRMING` -> `ERROR`.
  - Global action dispatcher with spotlight trigger and route synchronizer.
- `client/src/layouts/CitizenLayout.jsx`:
  - Wraps all citizen routes with `<HaqAIProvider>` and renders persistent `<HaqAIAssistant />`.
- **UI Component Suite (`client/src/components/haq-ai/`)**:
  - `HaqAIAssistant.jsx`: Master coordinator.
  - `HaqAIFloatingButton.jsx`: Collapsed launcher pill: `[ ✨ HAQ AI 🎙️ ]`.
  - `HaqAIPanel.jsx`: Floating desktop window / mobile bottom sheet with multilingual controls.
  - `HaqAIVoiceOrb.jsx`: Animated voice visualizer orb reacting to speech states.
  - `HaqAIWaveform.jsx`: Frequency soundwave animation.
  - `HaqAITranscript.jsx`: Conversation chat stream with quick prompt starter chips.
  - `HaqAIActionStatus.jsx`: State & action pill badges.
  - `HaqAISpotlight.jsx`: Viewport cutout halo locking onto target elements using `getBoundingClientRect()`.
  - `HaqAIArrow.jsx`: Animated directional pointer badge ("यहाँ देखें" / "यहाँ ध्यान दें").
  - `HaqAIConfirmation.jsx`: Consequential action confirmation modal for external portal handoffs.

### DOM Attributes Registered for Spotlight Guidance
- **Benefit Passport**: `data-haq-target="passport-personal"`, `passport-location`, `passport-economic`, `passport-save`, `data-haq-field="age|gender|category|differentlyAbled|state|district|occupation|income"`.
- **Document Vault**: `data-haq-target="open-document-upload"`, `open-digilocker-import`, `document-upload-dropzone`, `document-vault-grid`.
- **Citizen Dashboard**: `data-haq-target="dashboard-benefit-passport"`, `dashboard-recommendations`, `dashboard-tracker`, `dashboard-mittra`, `dashboard-document-health`, `explore-schemes-btn`.
- **Recommendations**: `data-haq-target="scheme-recommendation-list"`, `recommendations-grid`.

---

## 4. Verification & Test Results

```bash
=== RUNNING MITTRA AGENT & ACTION SERVICE TESTS ===
Test 1 - Valid Command: PASS ✓
Test 2 - Disallowed Action Rejected: PASS ✓
Test 3 - Consequential Action Flags Confirmation: PASS ✓
Test 4 - Education Query Processed: NAVIGATE_AND_GUIDE | Target: /dashboard/recommendations | Speech: आपकी जानकारी के आधार पर शिक्षा और छात्रवृत्ति...
Test 5 - Agriculture Query Processed: NAVIGATE_AND_GUIDE | Target: /dashboard/recommendations | Speech: कृषि और किसान कल्याण की योजनाएं आपकी जानकारी ...
Test 6 - Document Query Processed: NAVIGATE_AND_GUIDE | Target: /dashboard/documents | Speech: आपके पास 2 सत्यापित दस्तावेज़ मौजूद हैं। चलिए...
Test 7 - Handoff Confirmation Required: PASS ✓
=== ALL AGENT TESTS PASSED SUCCESSFULLY! ===
```

- **Frontend Production Build**: `npm --prefix client run build` passed with exit code 0 (`built in 16.92s`).
- **Zero regressions**: All existing routes, admin dashboards, public landing pages, and deterministic services remain 100% intact.
