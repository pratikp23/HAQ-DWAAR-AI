# MITTRA Architecture Audit — HAQ DWAAR AI
**Audit Date:** 2026-10-07  
**Project:** HAQ DWAAR AI ("Scheme se Application Tak")  
**Module:** MITTRA — Voice-First Citizen Task Agent

---

## 1. Executive Summary
HAQ DWAAR AI is an established civic technology platform designed to bridge the gap between Indian welfare schemes and citizen applications. The goal of this task is to elevate MITTRA from a localized dashboard card into a persistent, voice-first **AI Citizen Task Agent**. 

This audit maps existing frontend and backend capabilities to ensure **zero disruption to existing architecture, zero deletion of working features, and strict reuse of existing services and models**.

---

## 2. Inventory of Existing Architecture & Components

### 2.1 Existing MITTRA & Voice Components
- **`client/src/components/dashboard/MittraAssistantCard.jsx`**: Stationary dashboard prompt card inviting citizens to speak with MITTRA.
- **`client/src/components/dashboard/AiMitraVoiceModal.jsx`**: Interactive modal triggering life situation analysis via Gemini/fallback, extracting demographic signals, and displaying preview matches.
- **`client/src/components/dashboard/VoiceSaathiGuide.jsx`**: Step-by-step visual spotlight tour on Citizen Dashboard.
- **`client/src/utils/speechHelper.js`**: Native browser SpeechSynthesis and SpeechRecognition wrapper with failsafe audio chimes and silence detection.

### 2.2 Voice & AI Backend Services
- **`server/services/bhashiniService.js`**: Official Bhashini integration wrapper supporting multi-lingual STT (`/api/bhashini/stt`) and TTS (`/api/bhashini/tts`). Supports `mock` and `real` modes gracefully.
- **`server/services/aiService.js`**: Gemini 1.5 Flash NLU service with structured Zod parsing and deterministic fallback keyword/regex extraction (`getDeterministicFallback`).
- **`server/routes/lifeSituationRoutes.js`**: Endpoints `/api/life-situation/analyze`, `/preview-matches`, and `/apply-signals`.

### 2.3 Citizen Layout & Routing
- **`client/src/layouts/CitizenLayout.jsx`**: Master wrapper for all authenticated citizen views, rendering `CitizenNavbar`, `main`, `CitizenFooter`, and `MobileBottomNav`.
- **`client/src/App.jsx`**: Citizen routes:
  - `/dashboard` (DashboardPlaceholder)
  - `/dashboard/benefit-passport` (BenefitPassport)
  - `/dashboard/life-situation` (LifeSituation)
  - `/dashboard/recommendations` (Recommendations)
  - `/dashboard/documents` (Documents)
  - `/dashboard/schemes` & `/dashboard/schemes/:id` (Schemes & SchemeDetails)
  - `/dashboard/readiness/:schemeId` (Readiness)
  - `/dashboard/applications` & `/dashboard/applications/:id` (Applications & ApplicationDetails)
  - `/dashboard/notifications` (Notifications)

### 2.4 Existing APIs & Services Ready for Reuse
| Domain | Service / Endpoint | Reusable Methods |
| :--- | :--- | :--- |
| **Profile** | `profileApi.js` (`/api/profile`) | `getProfile()`, `updateProfile(data)` |
| **Matching** | `matchingApi.js` (`/api/matching`) | `getRecommendations()`, `evaluateScheme(id)` |
| **Readiness** | `readinessApi.js` (`/api/readiness`) | `getSchemeReadiness(schemeId)` |
| **Documents** | `documentApi.js` (`/api/documents`) | `getDocuments()`, `uploadDocument()`, `deleteDocument()` |
| **Applications**| `applicationApi.js` (`/api/applications`) | `getApplications()`, `createApplication()`, `updateApplication()` |
| **Voice** | `bhashiniApi.js` (`/api/bhashini`) | `transcribeAudio()`, `synthesizeSpeech()`, `getVoiceStatus()` |
| **Life Situation** | `lifeSituationApi.js` (`/api/life-situation`) | `analyzeLifeSituation()`, `previewMatches()`, `applySignalsToPassport()` |
| **Notifications** | `notificationApi.js` (`/api/citizen-notifications`) | `getCitizenNotifications()`, `getUnreadCount()` |

### 2.5 Data Models & Schemas
- **`Scheme.js`**: `name`, `category` (STUDENT, KISAN, BUSINESS, EMPLOYMENT, GENERAL), `benefitSummary`, `rules`, `requiredDocuments`, `officialApplicationUrl`, `officialSourceUrl`.
- **`UserProfile.js`**: `personal` (age, gender, category, differentlyAbled), `location` (state, district, areaType), `education` (qualification, currentCourse), `occupation` (occupationType, annualIncome), `kisanDetails` (isFarmer, landholdingAcres).
- **`Document.js`**: `documentType`, `status`, `healthStatus`, `ocrData`, `extractedMetadata`.
- **`ApplicationTracker.js`**: `schemeId`, `status`, `referenceNumber`, `timeline`, `notes`.

---

## 3. Key Non-Negotiable Safety Boundaries
1. **Zero LLM Code Execution**: Gemini never generates executable code or direct database queries.
2. **Deterministic Source of Truth**: Scheme matching and eligibility are governed strictly by `matchingService.js` and verified Mongo records, never hallucinated by LLM.
3. **Official Portals Handoff**: `officialApplicationUrl` is loaded exclusively from the verified Scheme record. User confirmation is required before redirection.
4. **Structured Allowlisted Commands**: Every MITTRA action is validated through Zod against the strict action allowlist (`NAVIGATE`, `HIGHLIGHT`, `FILL_FIELD`, `SHOW_SCHEMES`, etc.).
5. **No Secret Key Exposure**: Keys (`GEMINI_API_KEY`, `BHASHINI_API_KEY`) remain strictly on the backend.

---

## 4. Implementation Roadmap
- **Milestone 1**: Foundation — `HaqAIContext.jsx`, `mittraAgentService.js`, `HaqAIAssistant.jsx`, Floating Orb, Panel, State Machine, Greeting & Basic Actions.
- **Milestone 2**: Form Field Registry & Conversational Form Filling (`data-haq-field`, `FILL_FIELD`, `ASK_USER`, `HaqAISpotlight`).
- **Milestone 3**: Natural Language Life Situation, Matching & Why-Match Explanation.
- **Milestone 4**: Document Health, DigiLocker Demo & Action Plan.
- **Milestone 5**: Application Preparation, User Confirmation, Official Handoff & Tracking.
- **Milestone 6**: End-to-End Verification across Mobile & Desktop views.
