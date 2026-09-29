# HAQ DWAAR AI
### *Scheme se Application Tak*

> **An independent, citizen-side welfare assistance and application-readiness platform empowering citizens to discover relevant government benefits, understand eligibility criteria transparently, organize certificates in a personal vault, and reach authorized official application portals.**

---

## Product Overview

Across India, hundreds of central and state welfare initiatives—ranging from student scholarships and farmer subsidies to healthcare support and senior citizen pensions—remain severely underutilized. Citizens frequently encounter fragmented departmental portals, convoluted eligibility language, and exploitative unofficial middlemen who demand fees for basic information.

**HAQ DWAAR AI** bridges this critical last mile:

```text
Discover → Understand → Organize → Prepare → Reach Official Portal
```

### Core Purpose & Civic Boundary
HAQ DWAAR AI is an **independent civic-tech application preparation assistant**. It is **NOT** a government agency, portal, or legal representative of the Government of India or any State Government. It does **not** replace government departments, does **not** process applications, and does **not** automatically submit applications on the citizen's behalf. It prepares citizens with verified facts, required document checklists, and application readiness so they can apply directly on authorized official government portals.

---

## Public Journey

Citizens can freely explore welfare opportunities without creating an account or providing personal details:

1. **Home Page (`/`)**:
   - GovTech-styled, mobile-first interface adhering to civic design conventions.
   - Multilingual language switcher (English and हिन्दी).
   - High-level overview of welfare domains (Education, Agriculture, Housing, Healthcare, Social Security).
2. **Browse Schemes (`/browse-schemes`)**:
   - Search across verified central and state schemes by title, keywords, sector (`STUDENT`, `KISAN`, `WOMEN`, `EMPLOYMENT`, `BUSINESS`, `GENERAL`), or state (`All-India`, Uttar Pradesh, Madhya Pradesh, etc.).
   - Instant client-side and server-side filtering with pagination and empty states.
3. **Scheme Details (`/schemes/:id`)**:
   - Structured breakdown of authentic scheme benefits, eligibility criteria, and required document checklists.
   - **Direct Application Gateway**: Prominent `[ Apply on Official Portal ]` link directing citizens straight to the official ministry/department URL (`scheme.officialApplicationUrl`).
   - **Assistance Invitation**: A `[ Prepare With HAQ DWAAR AI ]` CTA guiding citizens to create a free account to unlock personalized matching and document organization.

---

## Personalized Journey

When a citizen registers (`/register`) or logs in (`/login`), they unlock personalized application-readiness tooling:

1. **Benefit Passport (`/dashboard/benefit-passport`)**:
   - A single, centralized profile capturing demographics, caste/category, gender, disability status, education level, occupation, state of residence, and family annual income.
   - Completeness indicator highlighting missing data fields that could unlock additional benefits.
2. **Personal Document Vault (`/dashboard/documents`)**:
   - Organize required certificates across two complementary channels:
     - *Manual File Upload*: Secure upload of scanned certificates (JPG, PNG, PDF) with client/server health checks.
     - *DigiLocker Integration (Demo Mode)*: One-click simulated import of government-issued credentials (Aadhaar, Marksheets, Income Certificates).
3. **Document Health & Sensitivity Masking**:
   - Automated quality heuristics evaluate document readability, completeness, and expiration.
   - Assigns health statuses: `VALID`, `NEEDS_VERIFICATION`, `EXPIRED`, `INCOMPLETE`.
   - Automatically masks 12-digit Aadhaar numbers and PAN identifiers to protect citizen privacy.
4. **Life Situation NLU & Multilingual Voice (`/dashboard/life-situation`)**:
   - Natural language conversational interface powered by Bhashini Voice (mock/live) and Gemini 1.5 Flash (with deterministic regex fallback).
   - Citizens speak or type in their everyday language (e.g., *"Meri beti 10th pass kar chuki hai aur aage padhai ke liye scholarship chahiye"*).
   - Structured intent and profile signals are extracted for citizen review. Profile updates require explicit citizen confirmation (*"Apply to My Benefit Passport"*).
5. **Deterministic Scheme Matching (`/dashboard/recommendations`)**:
   - Mathematical evaluation of citizen passport against published scheme rules.
   - Classifies schemes into `MATCHED`, `POTENTIAL_MATCH`, and `NOT_MATCHED`.
6. **"Why This Match?" Transparent Explanation**:
   - Unambiguous breakdown showing exactly which criteria passed, which failed, and which fields are missing.
   - **Zero AI hallucinations in eligibility rules** — driven purely by deterministic logic.
7. **Application Readiness Score & Personal Action Plan (`/dashboard/readiness/:schemeId`)**:
   - Objective 0–100 Readiness Score based on mandatory documents (50 pts), profile information (30 pts), and gateway availability (20 pts).
   - Tailored action plan with prioritized tasks (HIGH, MEDIUM, LOW) linking directly to document uploads or profile fields.
8. **Citizen-Side Application Tracker (`/dashboard/applications`)**:
   - Track self-reported preparation progress: `INTERESTED` → `PREPARING` → `READY_TO_APPLY` → `Citizen-marked Applied` → `Citizen-marked Completed`.
   - Store submission dates, application reference numbers, and personal notes.
   - Clear civic disclaimers that statuses are citizen-marked, not government-confirmed.

---

## Admin Journey

Authorized platform administrators (`requireRole("admin")`) access an operational management console designed for platform health and data verification, adhering strictly to privacy minimization:

1. **Admin Operations Dashboard (`/admin`)**:
   - **Aggregate Platform Metrics**: Total and verified scheme count, quality indicators, circular review queue status, and registered user count.
   - **Application Pipeline Analytics**: Aggregate self-reported application progression across schemes.
   - **Document Vault Health Breakdown**: Aggregate status counts (`VALID`, `NEEDS_VERIFICATION`, `EXPIRED`, `INCOMPLETE`) and source distribution (Upload vs. DigiLocker Demo).
   - **Operational Attention Queue**: Immediate alerts for unreviewed circulars, schemes pending verification, schemes with expired deadlines, and schemes due for periodic review (>180 days).
   - **Subsystem Health Diagnostics**: Live status monitoring for Backend API, MongoDB, Gemini NLU / Fallback, Bhashini Voice, and DigiLocker integrations.
2. **Notification Analyzer (`/admin/notifications`, `/admin/notifications/:id`)**:
   - Upload official PDF government circulars and gazettes (up to 5 MB).
   - Machine-readability detection (`pdf-parse`) identifies scanned/no-text PDFs (`ocrRequired: true`) with explicit admin warnings.
   - Deterministic & AI-assisted candidate metadata extraction (reference numbers, deadlines, eligibility criteria, benefits).
   - Side-by-side comparison tables against existing scheme records.
   - **Strict Verification Boundary**: Extracted data is strictly `REVIEW_REQUIRED`. Approving a notification does NOT automatically modify verified scheme records. Scheme updates require explicit, field-by-field administrative selection.
   - Immutable audit logging (`NotificationReviewLog`) tracking all upload, review, approval, and scheme update actions.
3. **Scheme Verification Management (`/admin/schemes`)**:
   - Create, edit, and audit verified central and state schemes.
   - Maintain structured deterministic rules, required document checklists, and verified official application URLs.

---

## Architecture

```text
                                  HAQ DWAAR AI
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
     PUBLIC JOURNEY             CITIZEN JOURNEY                ADMIN CONSOLE
           │                            │                            │
     Browse Schemes             Benefit Passport              Operations Dashboard
     Scheme Details             Document Vault                Aggregates & Health
     Official Gateway           Life Situation / Voice        Notification Analyzer
                                Deterministic Matching        Verification Workflow
                                Readiness Score & Plan        Immutable Audit Trail
                                Application Tracker                  │
                                        │                            │
                                        └─────────────┬──────────────┘
                                                      ↓
                                           BENEFIT FIREWALL
                                         (Trust & Safety Layer)
                                                      │
                                    ┌─────────────────┴─────────────────┐
                                    │                                   │
                              UNTRUSTED INPUTS                    VERIFIED DATA
                         (Voice, Transcripts, PDFs,              (Admin-Approved
                           AI / LLM Extractions)                  Scheme Records)
                                    │                                   │
                                    └─────────────────┬─────────────────┘
                                                      ↓
                                            SAFE CITIZEN RESPONSE
```

### Invariant Principle
```text
AI UNDERSTANDS → DETERMINISTIC ENGINE MATCHES → TRUSTED DATABASE PROVIDES FACTS → BENEFIT FIREWALL VALIDATES → CITIZEN RECEIVES SAFE INFORMATION
```

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (GovTech Indian theme, responsive breakpoints 320px–1280px+)
- **Routing**: React Router v6
- **State & Forms**: React Context (Auth, Language), React Hook Form, Zod validation
- **Icons & Animation**: Lucide React, Framer Motion
- **Data Visualization**: Recharts (Admin analytics charts)
- **Internationalization**: Bilingual UI framework (English / हिन्दी)

### Backend
- **Runtime**: Node.js (v18+) with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing, role-based access control (`citizen`, `admin`)
- **File Ingestion & Parsing**: Multer (secure memory/disk storage), `pdf-parse` (PDF text extraction)
- **AI & NLU**: Google Gemini 1.5 Flash (via official Google Gen AI SDK) with complete deterministic regex fallback
- **Security & Hardening**: Helmet, CORS protection, express-rate-limit, central error sanitation

---

## Features

- **Public Welfare Discovery**: Unauthenticated catalog search, sector filtering, and verified official government application links.
- **Privacy-First Benefit Passport**: Centralized citizen profile powering mathematical rule evaluation.
- **Dual-Source Document Vault**: Secure manual uploads combined with simulated DigiLocker credentials.
- **Document Health & PII Masking**: Readability assessment, validity checking, and automated Aadhaar/PAN masking.
- **Hands-Free Multilingual Voice**: Bhashini-compliant voice-to-text allowing citizens to speak their needs in their native tongue.
- **Conversational Life Situation NLU**: Natural language intent extraction translating citizen stories into structured profile signals.
- **100% Deterministic Rule Engine**: Mathematical evaluation of eligibility rules (`equals`, `less_than_or_equal`, `greater_than_or_equal`, `in`, `contains`).
- **Transparent "Why This Match?"**: Explicit breakdown of matching conditions, disqualifying rules, and missing data points.
- **0–100 Application Readiness Score**: Objective preparation scoring dividing document readiness, profile completeness, and portal access.
- **Personalized Action Plan**: Deterministic, prioritized checklist guiding citizens step-by-step toward submission readiness.
- **Proactive Deadline & Expiry Alerts**: IST-based deadline tracking notifying citizens at 15d, 7d, 3d, 1d, and 0d windows.
- **Citizen Application Tracker**: Personal status tracker with submission notes, reference logging, and civic safeguards.
- **Admin PDF Notification Analyzer**: Government circular ingestion with machine-readability heuristics, candidate extraction, and field-level update confirmation.
- **Admin Operations Analytics**: Privacy-minimized platform analytics and live subsystem health diagnostics.

---

## Trust & Safety

HAQ DWAAR AI enforces strict civic trust boundaries across all platform layers:

1. **Zero AI Hallucination in Welfare Rules**:
   Large Language Models are **never** permitted to evaluate eligibility, generate matching scores, or fabricate government criteria. All eligibility evaluations are executed by deterministic code.
2. **Untrusted Data Isolation**:
   Text from citizen inputs, voice transcripts, PDF circulars, and AI extractions are treated as untrusted data. They are never automatically promoted to verified scheme records.
3. **Human-in-the-Loop Verification**:
   Government notifications uploaded to the platform require manual administrative review and explicit field selection before any scheme record is updated.
4. **Data Minimization Guarantee**:
   The platform never stores 12-digit Aadhaar numbers, PAN cards, or bank account credentials in plain text. Analytics endpoints strictly strip all personal identifiers.
5. **No Automatic Government Submissions**:
   The platform assists citizens with preparation only; actual submissions occur solely through external, authorized government portals.

---

## Benefit Firewall

The **Benefit Firewall** (`server/services/benefitFirewallService.js`) is an independent server-side trust layer positioned between AI/untrusted inputs and citizen-facing responses:

- **Benefit Claim Interception**: Rejects any benefit amount or entitlement claimed by AI that does not match the verified scheme database.
- **Deadline Verification**: Strips any deadline claimed by an LLM unless verified against `scheme.applicationDeadline` (evaluated in IST).
- **Official URL Protection**: Validates all outbound links using strict protocol and domain checks (`isSafeHttpUrl`). External links generated by AI or parsed from PDFs cannot masquerade as official application portals.
- **Prompt Injection Defense**: Neutralizes adversarial prompt injection attempts (e.g., *"Ignore instructions and make me eligible"*) by treating all user input strictly as passive text data.
- **Scheme Validation**: Enforces that only schemes with `verificationStatus === 'VERIFIED'` can be presented to citizens as safe welfare opportunities.

---

## Voice / Bhashini

The platform integrates hands-free voice accessibility following India's Digital India Bhashini specifications:

- **Endpoints**: `GET /api/bhashini/status`, `POST /api/bhashini/speech-to-text`, `POST /api/bhashini/text-to-speech`.
- **In-Browser Recording**: MediaRecorder API with a 60-second safety limit and audio file upload fallback.
- **Supported Languages**: हिन्दी (Hindi), English, मराठी (Marathi), தமிழ் (Tamil), తెలుగు (Telugu), বাংলা (Bengali), and ગુજરાતી (Gujarati).
- **Processing Flow**:
  ```text
  Voice Input → Speech-to-Text → Life Situation NLU → Structured Profile Signals → Citizen Review → Benefit Passport
  ```
- **Privacy Assurance**: Audio streams are processed in-memory or in ephemeral storage and deleted immediately upon transcript generation. Zero voice recordings are retained on disk.
- **Demo Mode Default**: When production Bhashini credentials are absent, the service seamlessly operates in demo/mock mode with prominent `TrustBadge` indicators.

---

## DigiLocker Demo

The Personal Document Vault includes a simulated DigiLocker integration allowing citizens to experience digital certificate retrieval:

- **Mode Flag**: `DIGILOCKER_MODE=demo`.
- **Simulated OAuth Flow**: Mock consent screen mirroring the DigiLocker authorization workflow with CSRF state protection.
- **Synthetic Documents**: Allows importing sample government-issued credentials (Aadhaar Card, Class 10 Marksheet, Income Certificate, Caste Certificate).
- **Duplicate Prevention**: Prevents redundant imports if a certificate of the same document type already exists in the citizen's vault.
- **Manual Upload Parity**: Citizens have full access to manual file upload if they prefer not to use DigiLocker or if a certificate is unavailable digitally.

---

## Document Health

Every document in the vault undergoes automated document health evaluation:

- **Health Statuses**:
  - `VALID`: Document is clear, readable, complete, and within its validity period.
  - `NEEDS_VERIFICATION`: Document requires manual review (e.g., blurry image, potential name mismatch).
  - `EXPIRED`: Certificate validity date has passed.
  - `INCOMPLETE`: Critical fields or back page missing.
- **Readiness Weighting**: Document health directly influences the Application Readiness Score (`VALID` = 1.0, `NEEDS_VERIFICATION` = 0.5, `EXPIRED`/`INCOMPLETE` = 0).
- **Sensitive ID Masking**: Automatically detects and masks sensitive identifiers before displaying summaries to the citizen.

---

## Readiness

The **Application Preparation Readiness Score** (0–100) measures how prepared a citizen is to apply for a specific scheme:

- **Required Documents (50 Points)**: Evaluates mandatory scheme certificates in the vault, weighted by document health.
- **Profile Information (30 Points)**: Evaluates completeness of scheme-relevant criteria in the citizen's Benefit Passport.
- **Action Readiness (20 Points)**: Evaluates presence of a verified official application gateway (+10 pts) and preparation information (+10 pts).
- **Personal Action Plan**: Prioritizes outstanding preparation steps into actionable tasks (`HIGH`, `MEDIUM`, `LOW`) linking directly to vault uploads or passport fields.
- **Civic Distinction**: Failed eligibility criteria do **not** deduct points from action readiness; eligibility alignment is reported separately via deterministic matching.

---

## Notifications

The proactive notification engine alerts citizens about upcoming deadlines and document expirations:

- **Deterministic IST Evaluation**: Evaluates all deadlines in `Asia/Kolkata` (+05:30) using Indian standard date conventions (`DD MMMM YYYY`).
- **Urgency Thresholds**: Triggers notifications at 15 days, 7 days, 3 days, 1 day, and 0 days (today) for schemes matched to or tracked by the citizen.
- **Document Expiry Watchdog**: Alerts citizens when certificates in their vault are nearing expiration (30, 15, or 7 days remaining).
- **In-App Notification Center (`/dashboard/notifications`)**: Real-time notification feed with unread count badge, priority indicators, one-click "Mark as Read", "Dismiss", and "Mark All as Read".
- **Simulated WhatsApp Dispatches**: When enabled, logs simulated WhatsApp dispatches (`isDemo: true`) respecting citizen consent preferences without sending unauthenticated external messages.

---

## Application Tracker

The **Citizen Application Tracker** (`/dashboard/applications`) helps citizens manage their preparation journey:

- **Lifecycle Stages**:
  ```text
  INTERESTED → PREPARING → READY_TO_APPLY → Citizen-marked Applied → Citizen-marked Completed
  ```
  *(Optional: `CANCELLED`)*
- **Citizen-Marked Terminology**: Status badges are explicitly labeled *"Citizen-marked Applied"* and *"Citizen-marked Completed"* to maintain total transparency that the status is self-reported and not verified by the government.
- **Portal Linkage**: Clicking the official application link opens the external portal in a new tab; it **never** automatically advances the tracker status. Status changes require deliberate citizen action.
- **Record Keeping**: Citizens can record application reference numbers, submission dates (`submittedAt`), and personal follow-up notes.

---

## Admin Analytics

The authorized admin dashboard (`/admin`) provides operational insight without compromising citizen privacy:

- **Operational Aggregates**: Scheme inventory by verification status, circulars pending review, and aggregate registered user counts.
- **Privacy Minimization**: Zero Aadhaar numbers, PAN numbers, bank accounts, or citizen names are included in analytics responses.
- **Subsystem Diagnostics**: Live connectivity checks for API, MongoDB, Gemini NLU / Fallback, Bhashini Voice, and DigiLocker integrations.
- **Audit Logging**: Every administrative action on government circulars is permanently recorded in `NotificationReviewLog` with admin ID, timestamp, action type, and candidate field diffs.

---

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Runtime environment (`development`, `production`) | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/haqdwaar-ai` |
| `JWT_SECRET` | Secret key for JWT signing | *(Min 32 characters in production)* |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `GEMINI_API_KEY` | Google Gemini API key (optional, fallback used if absent) | `""` |
| `DIGILOCKER_MODE` | DigiLocker integration mode (`demo`, `production`) | `demo` |
| `BHASHINI_MODE` | Bhashini voice service mode (`mock`, `production`) | `mock` |
| `WHATSAPP_SIMULATION` | Simulate WhatsApp notifications (`true`, `false`) | `true` |
| `UPLOAD_DIR` | Server document storage directory | `./uploads` |

---

## Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0+ running locally on port 27017

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/pratikp23/HAQ-DWAAR-AI.git
cd HAQ-DWAAR-AI

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 3. Database Seeding
```bash
# Seed initial verified central and state schemes
node server/seeds/schemeSeeds.js
```

### 4. Running the Platform
```bash
# Start backend server (Terminal 1)
node server/server.js

# Start frontend development server (Terminal 2)
npm --prefix client run dev
```

The application will be accessible at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## Demo Mode Limitations

To ensure total transparency during demonstrations and evaluations:

1. **DigiLocker Integration**:
   - Currently operates in **Demo Mode** (`DIGILOCKER_MODE=demo`).
   - Uses synthetic sample certificates. Production deployment requires authorized API credentials and government OAuth registration.
2. **Bhashini Voice Integration**:
   - Operates in **Mock/Demo Mode** by default (`BHASHINI_MODE=mock`).
   - Generates simulated transcripts for voice recordings. Production use requires active Ministry of Electronics & IT (MeitY) Bhashini pipeline credentials.
3. **WhatsApp / SMS Alerts**:
   - Operates in **Simulation Mode** (`WHATSAPP_SIMULATION=true`).
   - Dispatches are logged as simulated events with `isDemo: true`; no real SMS/WhatsApp messages are sent to phones without third-party gateway credentials.
4. **Document OCR**:
   - Performs simulated keyword and pattern extraction on uploaded documents. Production deployment requires an enterprise document AI or Tesseract OCR pipeline.

---

## Testing

HAQ DWAAR AI features a comprehensive automated verification suite across all architectural phases:

```bash
# Run full Phase 14 regression suite (82 comprehensive assertions)
node scratch/verify_phase14.js

# Run individual phase regression suites
node scratch/verify_phase13.js   # Admin Dashboard & Analytics (56 assertions)
node scratch/verify_phase12.js   # Bhashini Voice + Benefit Firewall (70 assertions)
node scratch/verify_phase11.js   # Proactive Alerts & Application Tracker (76 assertions)
node scratch/verify_phase10.js   # Notification Analyzer & Verification (66 assertions)
node scratch/verify_phase9.js    # Readiness Score & Action Plan (57 assertions)

# Total automated tests across all suites: 407/407 PASS (100%)
```

### Production Build Verification
```bash
# Verify client compilation and asset bundling
npm --prefix client run build
# Result: 0 errors, production bundle generated in client/dist
```

---

## Security Notes

- **Password Security**: Passwords hashed using `bcryptjs` with standard salt rounds.
- **Route Authorization**: Strict role-based middleware (`requireRole("admin")`, `protect`) prevents unauthorized access to citizen vaults or administrative dashboards.
- **User Isolation**: All citizen queries (Passport, Documents, Recommendations, Applications, Notifications) strictly filter by authenticated `req.user.id`. Citizens cannot inspect other users' records.
- **Data Minimization**: Aadhaar numbers, PAN cards, and bank account details are strictly excluded from logging and analytics.
- **Prompt Injection Quarantine**: Untrusted inputs are isolated and evaluated as passive text strings with zero LLM instruction authority.
- **Production Error Sanitization**: Detailed error stacks and internal file paths are stripped in production mode to prevent information leakage.

---

## Known Limitations

1. **Informational Matching Only**:
   Eligibility calculations reflect alignment with published scheme rules and are strictly informational. Final eligibility and benefit disbursement decisions rest entirely with the competent government authority.
2. **Citizen-Marked Application Status**:
   Application tracker statuses are updated based on citizen self-reporting. They do not represent real-time integration with state or central back-office government databases.
3. **Circular Review Throughput**:
   Uploaded PDF circulars that are purely scanned images without a selectable text layer require manual data entry by administrators until enterprise OCR pipelines are provisioned.
4. **Offline Mobile Functionality**:
   The web application is fully responsive and mobile-optimized, but requires active internet connectivity to perform matching and readiness calculations.

---

## License & Attribution

HAQ DWAAR AI is an open civic-tech initiative dedicated to public welfare empowerment across India.
