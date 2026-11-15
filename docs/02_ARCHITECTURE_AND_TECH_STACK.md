# 🏛️ HAQ DWAAR AI — Volume 2: Architecture & Tech Stack

---

## 1. Full Technology Stack

### Frontend Architecture
- **Framework**: React 18 with Vite build tooling (ES Modules)
- **Styling**: Tailwind CSS (Indian GovTech palette: Deep Purple `#1e0a3c`, Ashoka Blue `#0284c7`, Saffron `#ea580c`, Emerald `#059669`)
- **Routing**: React Router DOM v6 with nested layout shell rendering and role-aware `ProtectedRoute` guards
- **State Management & Contexts**:
  - `AuthContext`: Manages citizen/admin session, token storage, and user profile state
  - `LanguageContext`: Global bilingual reactive switcher (English ↔ हिन्दी) with 500+ civic translation keys
  - `HaqAIContext`: Manages MITTRA floating voice assistant, recording states, and audio playback
- **Forms & Validation**: React Hook Form with Zod schema resolution
- **Visuals & Charts**: Lucide React iconography, Recharts (analytics), Framer Motion (animated waveforms)
- **Audio & Media**: Web MediaRecorder API + Bhashini Dhruva REST client + Web Speech API fallback

### Backend Architecture
- **Runtime & Framework**: Node.js (v18+) with Express.js (pure ES Modules `type: module`)
- **Database & ODM**: MongoDB with Mongoose ODM (Indexes, virtuals, cascade sanitization)
- **Authentication**: JWT (JSON Web Tokens) with dual-mode storage (HTTP-only cookies + Authorization header Bearer token), hashed with `bcryptjs`
- **File Parsing & Ingestion**:
  - `multer` for memory/disk multipart streaming (5MB ceiling, strict MIME type filtering)
  - `pdf-parse` for server-side text extraction from official government gazettes and notifications
- **AI & Natural Language Services**:
  - Google Gemini 1.5 Flash via `@google/generative-ai` SDK
  - Complete Deterministic Regex & Rule-Based Fallback Engine (`server/services/aiService.js`) ensuring 100% operational uptime if API key is absent or quota expires
- **Security & Network**: Helmet HTTP header protection, CORS origin whitelisting, express rate-limiting, and error sanitization

---

## 2. Directory Tree Map

```text
d:\HAQ-DWAAR-AI/
├── package.json              # Monorepo scripts (concurrently dev runner)
├── .env.example              # Environment variables template
├── vercel.json               # Vercel deployment configuration
├── docs/                     # Master Project Documentation & Blueprints
│   ├── 01_PROJECT_VISION_AND_PHILOSOPHY.md
│   ├── 02_ARCHITECTURE_AND_TECH_STACK.md
│   ├── 03_THE_3_DOOR_APPLICATION_SYSTEM.md
│   ├── 04_SINGLE_ADMIN_PANEL_AND_API_INGESTION.md
│   ├── 05_DATABASE_SCHEMAS_AND_MODELS.md
│   └── 06_PRODUCTION_DEPLOYMENT_AND_SECURITY.md
│
├── client/                   # Vite React Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx           # Main Route Registry
│       ├── main.jsx          # React DOM entry point
│       ├── context/          # AuthContext, LanguageContext, HaqAIContext, translations.js
│       ├── hooks/            # useAuth.js, custom reactivity hooks
│       ├── layouts/          # PublicLayout.jsx, CitizenLayout.jsx, AdminLayout.jsx
│       ├── pages/
│       │   ├── HomePage.jsx  # Landing Page
│       │   ├── public/       # BrowseSchemes.jsx, FAQ.jsx, About.jsx, NotFoundPage.jsx
│       │   ├── auth/         # LoginPage.jsx, RegisterPage.jsx
│       │   ├── citizen/      # BenefitPassport.jsx, Documents.jsx, Recommendations.jsx,
│       │   │                 # SchemeDetails.jsx, Readiness.jsx, Applications.jsx,
│       │   │                 # LifeSituation.jsx, Notifications.jsx
│       │   └── admin/        # AdminDashboard.jsx, AdminSchemes.jsx, AdminNotifications.jsx,
│       │                     # NotificationReview.jsx, AdminProfile.jsx
│       ├── components/
│       │   ├── common/       # Button, Card, Modal, Input, ProtectedRoute, StatusBadge
│       │   ├── dashboard/    # PersonalizedActionPlan, BenefitPassportCard, ReadinessRing
│       │   ├── haq-ai/       # HaqAIPanel, HaqAIVoiceOrb, HaqAITranscript, HaqAIWaveform
│       │   └── firewall/     # TrustBadge, BenefitFirewall indicators
│       ├── services/         # Axios API clients (api.js, schemeApi.js, applicationApi.js...)
│       └── utils/            # speechHelper.js, officerAvatars.js, govtDocumentSamples.js
│
└── server/                   # Node.js + Express + MongoDB Backend
    ├── server.js             # HTTP entry point (Port 5000)
    ├── app.js                # Express app setup, middleware, route mounts
    ├── config/db.js          # MongoDB connection handler
    ├── models/               # User, UserProfile, Scheme, Document, ApplicationTracker...
    ├── routes/               # schemeRoutes, authRoutes, matchingRoutes, readinessRoutes...
    ├── controllers/          # Business logic handlers
    ├── services/             # Core engines:
    │   ├── matchingService.js          # 100% Deterministic Scheme Matching Engine
    │   ├── readinessService.js         # 0-100 Preparation Readiness Engine
    │   ├── benefitFirewallService.js   # Trust & Safety Layer (Anti-hallucination)
    │   ├── aiService.js                # Gemini Flash + Regex fallback
    │   ├── mittraAgentService.js       # Contextual voice conversation agent
    │   ├── digilockerService.js        # Synthetic DigiLocker OAuth & cert import
    │   ├── bhashiniService.js          # Speech-to-Text & Text-to-Speech
    │   └── alertService.js             # IST-based deadline alerts (15d, 7d, 3d, 1d, 0d)
    ├── jobs/                 # deadlineAlertJob.js (Background interval scheduler)
    └── middleware/           # authMiddleware.js, roleMiddleware.js, errorHandler.js
```

---

## 3. The Benefit Firewall (Trust & Safety Engine)

Positioned at [`server/services/benefitFirewallService.js`](file:///D:/HAQ-DWAAR-AI/server/services/benefitFirewallService.js), this service acts as an independent application-level gateway between untrusted inputs (LLM outputs, user text, PDF transcripts) and citizen-facing outputs.

```text
[ Citizen Query / Voice ]  ──► [ Gemini 1.5 Flash ] ──► [ Benefit Firewall ] ──► [ Citizen ]
                                                              ▲
                                                              │ (Validates against DB)
                                                     [ Verified Scheme DB ]
```

### Guarantees Enforced:
1. **Zero Hallucinated Benefits**: If an AI claims a scheme gives "₹50,000", the firewall cross-references the verified `Scheme.benefitSummary`. If it does not match, the claim is intercepted and replaced with the verified database fact.
2. **Official URL Domain Protection (`isSafeHttpUrl`)**: Ensures links point to legitimate domains (`.gov.in`, `.nic.in`, `.ac.in`). Blocks malicious, phishing, or spoofed URLs.
3. **Prompt Injection Defense**: Evaluates all citizen inputs against an array of injection heuristics (`/ignore previous instructions/i`, `/system prompt/i`, `/make me eligible/i`). Untrusted text is strictly isolated and evaluated as passive data strings.
4. **Scheme Verification Gate**: Schemes with status `DRAFT` or `PENDING_REVIEW` are completely blocked from citizen recommendation endpoints.

---

## 4. Deterministic Matching Engine Architecture

Located at [`server/services/matchingService.js`](file:///D:/HAQ-DWAAR-AI/server/services/matchingService.js):

### Core Principle
**No Large Language Model evaluates eligibility.**
Eligibility is evaluated purely through mathematical code:
```javascript
Score = Math.round(max(0, (EarnedPoints - PenaltyPoints) / TotalMaxWeight) * 100)
```

- **Mandatory Rule Weight**: `2 points`
- **Optional Preference Weight**: `1 point`
- **Mandatory Failure Penalty**: Score capped at `35%` (Immediate `NOT_MATCHED` classification).
- **Missing Profile Data**: Handled safely via `STATUS: MISSING`—never penalizes the citizen as a failure; instead prompts them to fill the missing field in their Benefit Passport.

---

*HAQ DWAAR AI — Volume 2: Architecture & Tech Stack 🇮🇳*
