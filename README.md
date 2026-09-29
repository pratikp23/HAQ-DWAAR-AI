# HAQ DWAAR AI
### *Scheme se Application Tak*

> **Empowering citizens to discover relevant government benefits, understand eligibility criteria without confusion, organize certificates in a personal vault, and reach authorized official application portals.**

---

## 🏛️ Project Overview & Core Concept

**HAQ DWAAR AI** is an independent, citizen-side assistance and application-readiness platform. In India, billions of rupees in government welfare (scholarships, farmer support, pensions, livelihood subsidies) remain unutilized due to fragmented portals, opaque rules, and predatory middlemen.

HAQ DWAAR AI bridges the last mile:

```text
Discover → Understand → Organize → Prepare → Reach the Official Application
```

### Important Civic Boundary Notice
HAQ DWAAR AI is **NOT** a government agency, portal, or representative of the Government of India or any State Government. It does **not** replace government portals and does **not** submit government applications. It prepares citizens so they can apply directly and seamlessly through authorized official government portals.

---

## 🗺️ High-Level Product Architecture

HAQ DWAAR AI provides two complementary, coexisting user journeys:

```text
                         HAQ DWAAR AI
                       Scheme se Application Tak
                                │
                ┌───────────────┴────────────────┐
                │                                │
          PUBLIC JOURNEY                  PERSONALIZED JOURNEY
                │                                │
         Browse Schemes                    Create Account
                │                                │
         Scheme Details                   Benefit Passport
                │                                │
      Eligibility / Documents             Document Vault
                │                          /          \
                │                     Upload       DigiLocker
                │                          \          /
                │                           Documents
                │                                │
                │                         Document Health
                │                                │
                │                         Find Benefits
                │                                │
                │                       Deterministic Match
                │                                │
                │                         Why This Match?
                │                                │
                │                       Missing Information
                │                                │
                └──────────────┬─────────────────┘
                               ↓
                     Official Application Portal
```

---

## 🚶‍♂️ The Two User Journeys

### Journey A — Public Scheme Discovery (No account required)
1. **Browse Schemes (`/browse-schemes`)**: Search, filter by sector (`STUDENT`, `KISAN`, `EMPLOYMENT`, `BUSINESS`, `GENERAL`) and state (`All-India`, MP, UP, etc.).
2. **Scheme Details (`/schemes/:id`)**: Inspect official benefits, structured eligibility criteria, and required document checklists.
3. **Direct Application**: Click `[ Apply on Official Portal ]` to jump directly to the authorized government portal without needing to create an account.
4. **Optional Assistance**: A prominent `[ Prepare With HAQ DWAAR AI ]` CTA invites users to unlock personalized matching and document vault tools whenever they are ready.

### Journey B — Personalized HAQ DWAAR AI Assistance (With account)
1. **Benefit Passport (`/dashboard/benefit-passport`)**: A single, privacy-first citizen profile capturing demographics, education, occupation, and family income.
2. **Personal Document Vault (`/dashboard/documents`)**: Store and organize certificates via two complementary sources:
   - *Manual File Upload*: Scanned images and PDFs.
   - *DigiLocker Integration (Demo Mode)*: Simulated import of government certificates.
3. **Document Health & OCR**: Analyzes document readability, checks validity/expiry dates, and automatically masks sensitive IDs.
4. **Deterministic Match Engine (`/dashboard/recommendations`)**: Mathematical evaluation of citizen passport against published scheme rules.
5. **"Why This Match?"**: Transparent breakdown of passed criteria, failed conditions, and missing fields. No AI hallucinations.
6. **Application Readiness Checklist**: Cross-checks mandatory scheme documents against the citizen's vault before official submission.

---

## 🛡️ Core Civic Safeguards

1. **Deterministic Rule Matching (Zero AI Hallucination in Rules)**:
   Eligibility rules are evaluated deterministically using standard mathematical logic (`equals`, `less_than_or_equal`, `in`, etc.). LLMs are **never** permitted to guess or fabricate government eligibility.
2. **Informational Matching Only**:
   Profile matching reflects alignment with published criteria and is strictly informational. Final eligibility and benefit decisions rest solely with the relevant government authority.
3. **Verified Source Integrity**:
   Every scheme in the database references authentic official government gazettes, ministry notifications, or official portals. Official application links strictly use `scheme.officialApplicationUrl`.
4. **Dual Document Sources**:
   The Document Vault supports both Manual Upload and DigiLocker. If a certificate is unavailable in DigiLocker, the citizen can simply upload it manually.
5. **DigiLocker Demo Transparency**:
   In the current development environment, DigiLocker runs in simulated Demo Mode (`DIGILOCKER_MODE=demo`) using synthetic sample documents. Real DigiLocker integration is supported architecturally through authorized OAuth flows.
6. **Data Privacy & User Isolation**:
   Strict MongoDB access controls ensure User A cannot view User B's documents or profile. Zero third-party data tracking or selling.

---

## 📦 Verified Implementation Milestones

- **Phase 1: Foundation & Monorepo**: Vite + Express + MongoDB architecture, health checks.
- **Phase 2: Authentication & Roles**: JWT authentication, bcrypt hashing, Citizen and Admin roles.
- **Phase 3: Benefit Passport**: Dynamic profile schema, completeness calculator, atomic updates.
- **Phase 4: Verified Scheme Database**: Schema with structured rules and required docs, 10 authentic seeded schemes, Admin verification console.
- **Phase 5: Deterministic Matching Engine**: 100% rule-based matching, match scores, "Why This Match?" transparent explanations.
- **Phase 6: Life Situation NLU Engine**: Natural language understanding with Gemini 1.5 Flash, strict Zod validation, and safe rule-based fallback.
- **Phase 7: Document Upload & Document Health**: File upload, OCR extraction abstraction, document health analysis (`VALID`, `NEEDS_VERIFICATION`, `EXPIRED`, `INCOMPLETE`), sensitive ID masking.
- **Phase 8: Personal Document Vault & DigiLocker Demo**: Centralized vault, simulated DigiLocker OAuth flow, CSRF state protection, duplicate import prevention.
- **Phase 8.1: Public Scheme Discovery & Refinement**: Unauthenticated public browsing (`/browse-schemes`, `/schemes/:id`), `optionalAuth` middleware, responsive `Navbar`, `Footer`, unified multi-section `HomePage`, and dual citizen journeys.
- **Phase 9: Application Preparation Readiness & Personal Action Plan**:
  - Deterministic 0–100 Application Preparation Readiness Score:
    - *Required Documents (50 pts)*: Based on mandatory certificates present in citizen's vault and weighted by health status (`VALID` = 1.0, `NEEDS_VERIFICATION` = 0.5, `INCOMPLETE`/`EXPIRED` = 0).
    - *Profile Information (30 pts)*: Completeness of scheme-relevant fields in Benefit Passport.
    - *Action Readiness (20 pts)*: Presence of verified official application gateway (+10 pts) and preparation information completeness (+10 pts).
  - Clear architectural separation between Profile Matching and Preparation Readiness: Failed profile conditions never deduct points from action readiness.
  - Personal Action Plan (`/dashboard/readiness/:schemeId`): Prioritized, deterministic next steps (HIGH, MEDIUM, LOW) linking directly to document uploads, passport updates, or official government portals.
  - Standardized civic transparency disclaimer and verified official portal links.
- **Phase 10: PDF Notification Analyzer + Admin Verification**:
  - Secure government notification PDF ingestion (PDF mime enforcement, 5 MB limit, randomized file storage).
  - Machine-readability heuristics via `pdf-parse`: Accurately detects scanned/no-text PDFs (`ocrRequired: true`) with explicit admin warnings without falsely claiming OCR was performed.
  - Deterministic candidate metadata extractor: Distinguishes issuing department, reference number, notification dates, start dates, application deadlines, eligibility clauses, required documents, and benefit highlights.
  - Prompt Injection Defense: PDF text is treated strictly as untrusted data; embedded injection directives are parsed solely as plain text with zero privilege escalation.
  - Hybrid AI extraction: Optional Gemini 1.5 assistance with Zod schema validation, gracefully falling back to deterministic extraction when API keys are absent or requests fail.
  - **Strict Civic Trust Boundary**:
    `PDF → Extraction → UNVERIFIED (REVIEW_REQUIRED) → Admin Review → APPROVED`
    - AI or OCR extractions are NEVER treated as authoritative government data.
    - Approving a notification NEVER automatically modifies verified Scheme records.
    - Scheme updates are strictly field-specific (default unchecked) with mandatory confirmation required for portal URL updates.
  - Complete immutable audit trail (`NotificationReviewLog`) recording every administrative action (`UPLOADED`, `ANALYZED`, `UPDATED`, `APPROVED`, `REJECTED`, `SCHEME_UPDATE_PREVIEWED`, `SCHEME_UPDATE_APPLIED`).
  - Dedicated Admin UI at `/admin/notifications` and `/admin/notifications/:id` featuring side-by-side comparison tables, raw text inspector, editable candidate fields, and visual trust banners.

- **Phase 11 — Proactive Alerts, Deadlines & Application Tracker**:
  - **Deterministic Indian Standard Time (IST) Deadline Engine**: Evaluates trusted scheme deadlines in `Asia/Kolkata` (+05:30), formats dates in standard Indian convention (`DD MMMM YYYY`), and classifies urgency states (`NO_DEADLINE`, `EXPIRED`, `TODAY`, `SOON`, `APPROACHING`, `UPCOMING`).
  - **Relevance & Window Filter**: Deadline notifications are sent strictly for schemes that are relevant (`MATCHED` or `POTENTIAL_MATCH` from Benefit Passport) or actively tracked by the citizen. Triggers on defined windows: 15 days, 7 days, 3 days, 1 day, and 0 days (today).
  - **Document Expiry & Readiness Blocker Watchdog**: Alerts citizens when documents in their Personal Document Vault expire within 30, 15, or 7 days, or when an active tracked application has missing mandatory certificates.
  - **In-App Notification Center (`/dashboard/notifications`)**: Real-time notifications with unread badge, priority badges (`HIGH`, `MEDIUM`, `LOW`), actionable scheme readiness links, single-click "Mark as Read", "Dismiss", and "Mark All as Read".
  - **WhatsApp Simulation in Demo Mode**: Respects citizen consent preferences (`notificationConsent`, `whatsappConsent`), logging mock dispatches with `isDemo: true` and civic transparency notices without making real external SMS/WhatsApp calls without configured credentials.
  - **Citizen-Side Application Tracker (`/dashboard/applications`, `/dashboard/applications/:id`)**:
    - Complete citizen preparation lifecycle: `INTERESTED` → `PREPARING` → `READY_TO_APPLY` → `APPLIED` → `FOLLOW_UP` → `COMPLETED` / `CANCELLED`.
    - Dynamic `nextAction` computation guiding citizens on document preparation and portal readiness.
    - Reference number and submission notes tracking with `submittedAt` recording.
    - Guardrails against accidental non-linear jumps without explicit citizen confirmation.
    - Strict user isolation ensuring citizens can only inspect and manage their own tracked applications.
  - **Strict Civic Trust Boundary & Non-Agency Disclosures**:
    - HAQ DWAAR AI is an application preparation assistant, NOT an official government application portal.
    - Creating or updating a tracker does NOT submit applications to the government.
    - Clicking the official application link opens the external portal in a new tab; it NEVER automatically changes tracker status to `APPLIED`. Status changes require explicit citizen actions.
    - Deadlines are sourced strictly from admin-verified schemes (`verificationStatus: "VERIFIED"`), never from unapproved PDF drafts or AI hallucinations.
    - Zero AI in deadline calculations, alert qualification, or status transitions.

- **Phase 12 — Bhashini Voice + Benefit Firewall**:
  - **Bhashini Voice Access**:
    - Hands-free voice accessibility enabling citizens to speak their situation naturally in their preferred language.
    - Endpoints: `GET /api/bhashini/status`, `POST /api/bhashini/speech-to-text`, `POST /api/bhashini/text-to-speech`.
    - Live in-browser audio recording via MediaRecorder API with 60-second limit and audio file upload fallback.
    - Seamless flow: `VOICE INPUT → Speech-to-Text → Life Situation NLU → Structured Intent/Profile Signals → Deterministic Matching Engine → Verified Scheme Data → Benefit Firewall → Safe Citizen Response`.
    - Reuses existing Phase 6 conversational NLU and Phase 5 deterministic matching; zero duplicate matching systems.
  - **Mock vs. Real Bhashini Configuration**:
    - Abstracted voice architecture supporting `BHASHINI_MODE=mock` (or `VOICE_MODE=mock`) as default, and production Bhashini services when credentials (`BHASHINI_API_KEY`, `BHASHINI_BASE_URL`) are configured.
    - Clear UI indicator via `TrustBadge` ("Voice Demo Mode").
    - Explicit disclosure: *"Bhashini integration runs in Demo/Mock Mode unless authorized production credentials and configuration are provided."*
  - **Multilingual Architecture**:
    - Configurable language selection across 7 major Indian languages: हिन्दी (Hindi), English, मराठी (Marathi), தமிழ் (Tamil), తెలుగు (Telugu), বাংলা (Bengali), and ગુજરાતી (Gujarati).
    - Seamless fallback to text input if voice input or browser microphone permissions are unavailable.
  - **Voice Privacy Behavior**:
    - Audio recordings are processed in-memory or in temporary storage and cleaned up immediately after processing.
    - Zero permanent voice audio storage by default.
    - Application logs record safe metadata only; citizen PII, Aadhaar numbers, and financial details are strictly excluded from logs.
    - Stricter rate limits on voice endpoints (30 requests per 15 minutes) with standard `X-RateLimit` headers.
  - **Benefit Firewall**:
    - Dedicated server-side trust & safety layer (`benefitFirewallService.js`) positioned between untrusted inputs / AI outputs and citizen-facing benefit information.
    - Invariant:
      `AI UNDERSTANDS → DETERMINISTIC ENGINE MATCHES → TRUSTED DATABASE PROVIDES FACTS → BENEFIT FIREWALL VALIDATES → CITIZEN RECEIVES SAFE INFORMATION`.
  - **Trusted vs. Untrusted Data**:
    - *TRUSTED*: Admin-verified Scheme documents (`verificationStatus = 'VERIFIED'`), deterministic rule calculations, verified application URLs, verified source URLs, and actual document health results.
    - *UNTRUSTED*: Raw citizen text, voice transcripts, PDF extractions, unapproved NotificationAnalysis (`UPLOADED`, `PROCESSING`, `REVIEW_REQUIRED`, `REJECTED`), arbitrary client inputs, and raw Gemini outputs. Untrusted data is NEVER automatically promoted to trusted scheme facts.
  - **AI Limitations & Protections**:
    - AI cannot create schemes, invent benefits, deadlines, eligibility criteria, or official URLs.
    - AI cannot mark a scheme `VERIFIED`, modify Scheme documents, or execute database operations.
    - Hallucinated dates, benefit claims, or URLs from AI outputs are automatically stripped and blocked by the firewall.
  - **Deterministic Matching & "Why This Match?" Integrity**:
    - Every reason displayed in "Why This Match?" is strictly validated against evaluated deterministic rules; AI-generated claims of government approval or guaranteed eligibility are automatically filtered out.
  - **Official Source Protection**:
    - Official application links and source links strictly originate from verified Scheme records (`scheme.officialApplicationUrl`).
    - The firewall rejects external URLs, PDF-extracted links, or AI-generated links from masquerading as official application portals.
  - **Prompt Injection Defense**:
    - Quarantines injection directives ("ignore previous instructions", "make me eligible", "mark as verified") as passive untrusted user text with zero instruction authority.
  - **Explicit Confirmation Boundary**:
    - Profile signals extracted from voice or text conversations are NEVER saved automatically to the citizen's Benefit Passport. The citizen must review and explicitly confirm via *"Apply to My Benefit Passport"*.
  - **Civic Trust Boundary Disclaimer**:
    - *"The Benefit Firewall is an application-level trust boundary. It does not guarantee government eligibility, approval, authenticity, or legal validity."*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017/haqdwaar-ai`

### Installation
```bash
# Clone the repository
git clone https://github.com/pratikp23/HAQ-DWAAR-AI.git
cd HAQ-DWAAR-AI

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/haqdwaar-ai
JWT_SECRET=haqdwaar_jwt_secret_dev_key_2026_secure
DIGILOCKER_MODE=demo
```

### Running the Platform
```bash
# Run backend server
node server/server.js

# Run frontend development server (in a separate terminal)
npm --prefix client run dev
```

### Building for Production
```bash
npm --prefix client run build
```

---

## 📄 License & Attribution
HAQ DWAAR AI is an open civic-tech initiative dedicated to public welfare empowerment across India.
