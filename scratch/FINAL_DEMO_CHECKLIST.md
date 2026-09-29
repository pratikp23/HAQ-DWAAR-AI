# HAQ DWAAR AI — Hackathon Demo Checklist
### *Scheme se Application Tak*

---

## 1. BEFORE DEMO (Pre-Flight System Check)

Ensure all services, credentials, and seed data are verified prior to the presentation:

- [ ] **MongoDB Service Available**:
  - Local instance running on port `27017` (`mongodb://127.0.0.1:27017/haqdwaar-ai`).
  - Connection verified via `GET /api/health` or `GET /api/admin/health`.

- [ ] **Environment Configuration (`.env`)**:
  - File exists at project root (`d:\HAQ-DWAAR-AI\.env`).
  - `PORT=5000`
  - `NODE_ENV=development`
  - `JWT_SECRET` configured (minimum 32 characters in production).
  - `DIGILOCKER_MODE=demo` (ensures synthetic certificate flow works offline).
  - `BHASHINI_MODE=mock` (or credentials configured for live Bhashini API).
  - `WHATSAPP_SIMULATION=true` (simulates WhatsApp dispatches safely).

- [ ] **Gemini 1.5 NLU & Deterministic Fallback**:
  - If `GEMINI_API_KEY` is present: verify live conversational NLU extraction.
  - If `GEMINI_API_KEY` is absent or quota-limited: verified regex/heuristic fallback activates automatically with zero runtime errors.

- [ ] **DigiLocker Demo Status**:
  - Demo mode active (`DIGILOCKER_MODE=demo`).
  - Synthetic documents ready for instant import (Aadhaar Card, Class 10 Marksheet, Caste Certificate).
  - Manual upload fallback verified with sample JPG/PDF files.

- [ ] **Seed Data & Schemes**:
  - Verified Central & State schemes seeded in database:
    - *Post-Matric Scholarship for SC Students* (Education)
    - *PM-KISAN Samman Nidhi* (Agriculture)
    - *Pradhan Mantri Awas Yojana - Gramin* (Housing)
    - *Mukhya Mantri Kanya Sumangala Yojana* (Women/Child)
    - *Atal Pension Yojana* (Social Security)
    - *National Means-cum-Merit Scholarship* (Education)
  - All schemes contain verified rules, required documents, and official portal URLs.

- [ ] **Admin Account**:
  - Pre-seeded admin user: `admin@haqdwaar.gov.in` (or created via admin seed script).
  - Role: `admin`.

- [ ] **Demo Citizen Account**:
  - Pre-seeded citizen: `rahul.kumar@example.com` / `password123`.
  - Profile seeded with student demographics (OBC/SC, Annual Income ₹1,80,000, 12th standard completed).

- [ ] **Frontend & Backend Running**:
  - Backend: `node server/server.js` on `http://localhost:5000`.
  - Frontend: `npm --prefix client run dev` on `http://localhost:5173`.
  - Production build verified: `npm --prefix client run build` succeeds with zero errors.

---

## 2. DEMO FLOW (Step-by-Step Presentation Script)

### Step 1: Public Discovery (No Login Required)
1. **Home Page (`/`)**:
   - Highlight the GovTech theme, bilingual language switcher (English / हिन्दी), and clear civic boundary disclaimer (*"HAQ DWAAR AI is an independent citizen preparation platform, not an official government agency"*).
   - Scroll to the four pillars: *Discover, Understand, Organize, Apply*.
2. **Browse Schemes (`/browse-schemes`)**:
   - Filter by Sector (e.g. *Education*, *Agriculture*) or State (*All-India*).
   - Observe real-time filtering, responsive cards, and zero auth requirements.
3. **Scheme Details (`/schemes/:id`)**:
   - View structured eligibility criteria, required documents, and deadlines.
   - Point out the `[ Apply on Official Portal ]` external link (opens verified government portal).
   - Point out the `[ Prepare With HAQ DWAAR AI ]` CTA directing citizens to the personalized journey.

### Step 2: Citizen Authentication & Benefit Passport
1. **Login (`/login`)**:
   - Login as the demo citizen (`rahul.kumar@example.com` or register a new citizen).
2. **Benefit Passport (`/dashboard/benefit-passport`)**:
   - Show the centralized, privacy-first citizen profile (Demographics, Education, Category, Annual Income).
   - Point out the Completeness Indicator.

### Step 3: Document Vault & DigiLocker Demo
1. **Document Vault (`/dashboard/documents`)**:
   - Show existing certificates with Document Health badges (`VALID`, `NEEDS_VERIFICATION`).
   - Demonstrate the dual-source model:
     - Click `[ Connect DigiLocker (Demo) ]` → select and import a verified synthetic certificate (e.g. Income Certificate or Marksheet).
     - Or demonstrate manual upload with immediate OCR & health analysis.
   - Point out sensitive ID masking (Aadhaar/PAN numbers are masked for privacy).

### Step 4: Multilingual Voice Access & Life Situation NLU
1. **Life Situation (`/dashboard/life-situation`)**:
   - Demonstrate Bhashini Voice accessibility:
     - Click the microphone icon, select Hindi or English, and speak (or type):
       *"Mere ghar ki annual income 2 lakh se kam hai aur mujhe college graduation ke liye scholarship chahiye."*
   - Observe the NLU extraction:
     - Extracted intent: `SCHOLARSHIP`
     - Extracted income: `200000`
     - Extracted education: `COLLEGE`
   - Point out the Trust Boundary: Extracted attributes are presented for citizen review. The citizen clicks `[ Apply to My Benefit Passport ]` to explicitly confirm profile updates.

### Step 5: Deterministic Matching & "Why This Match?"
1. **Find Benefits (`/dashboard/recommendations`)**:
   - Show matched schemes ranked by eligibility alignment (`MATCHED`, `POTENTIAL_MATCH`).
   - Click `[ Why This Match? ]`:
     - Inspect the transparent mathematical breakdown: passed rules (green), unmet conditions (red), and missing profile fields.
     - Emphasize: **Zero AI hallucination in eligibility rules** — pure deterministic logic.

### Step 6: Application Readiness Score & Personal Action Plan
1. **Check Readiness (`/dashboard/readiness/:schemeId`)**:
   - Show the 0–100 Application Readiness Score:
     - Required Documents (50 pts, weighted by vault health)
     - Profile Information (30 pts)
     - Action Readiness (20 pts, verified official portal gateway)
   - Inspect the prioritized Personal Action Plan (HIGH / MEDIUM / LOW tasks):
     - e.g., *"Upload Income Certificate"*, *"Verify Aadhaar name spelling"*.

### Step 7: Application Tracker (Citizen-Side Lifecyle)
1. **Track Application (`/dashboard/applications`)**:
   - Create or open a tracked application for the scheme.
   - Show the status progression: `INTERESTED` → `PREPARING` → `READY_TO_APPLY` → `Citizen-marked Applied` → `Citizen-marked Completed`.
   - Point out the civic distinction: The status is citizen-marked, NOT government-confirmed.
   - Click the external application button to open the verified government portal.

### Step 8: Trust & Safety — Benefit Firewall
1. **Firewall Defense Demonstration**:
   - Show how the platform isolates untrusted inputs from verified scheme facts.
   - Untrusted voice transcripts, PDF text, or AI outputs cannot fabricate benefits, alter deadlines, or modify official URLs.
   - If an unverified URL or hallucinated deadline is encountered, the Benefit Firewall blocks it and falls back to verified database records.

### Step 9: Admin Operations Dashboard & Circular Review
1. **Admin Login (`/login`)**:
   - Log in as `admin@haqdwaar.gov.in`.
2. **Admin Operations Dashboard (`/admin`)**:
   - Show aggregate platform metrics: verified scheme inventory, circular review queue, Document Vault health distribution, and self-reported application pipeline.
   - Inspect the Operational Attention Queue (schemes pending review, unanalyzed circulars).
   - View live Subsystem Health (API, Database, Gemini/Fallback, Bhashini, DigiLocker).
3. **Notification Analyzer (`/admin/notifications`)**:
   - Show government PDF circular upload and text extraction.
   - Show side-by-side candidate field review.
   - Emphasize: AI extraction is strictly `REVIEW_REQUIRED`. Approving a notification does NOT automatically alter Scheme records without explicit field selection.
   - Show the immutable audit trail (`NotificationReviewLog`).

---

## 3. RESILIENT FALLBACK PATHS (Live Presentation Insurance)

If an external service or live network dependency experiences degradation during the presentation, seamlessly switch to these verified fallback paths:

| Subsystem | Failure Scenario | Fallback Mechanism | Status |
| :--- | :--- | :--- | :--- |
| **Gemini AI NLU** | API key missing, rate limited (HTTP 429), or network timeout | The platform automatically activates the deterministic regex/heuristic NLU engine. Extracts income, education, caste, and intent without error. | **100% Functional** |
| **Bhashini Voice** | Microphone permission blocked or voice API unavailable | Citizen uses the standard bilingual text input field on the Life Situation page. Complete conversational flow proceeds identically. | **100% Functional** |
| **DigiLocker** | External DigiLocker OAuth or network unavailable | Citizen clicks "Upload Document" in the Document Vault. Accepts scanned PDF/JPG with local client OCR parsing. | **100% Functional** |
| **WhatsApp Alerts** | SMS/WhatsApp gateway credentials not configured | System automatically logs simulated dispatches (`isDemo: true`) and surfaces high-priority notifications in the In-App Notification Center (`/dashboard/notifications`). | **100% Functional** |
| **PDF Machine Readability** | Uploaded circular is a scanned image with no text layer | System automatically detects `ocrRequired: true`, displays an explicit admin warning, and preserves the document for manual entry without crashing. | **100% Functional** |

---

## 4. CIVIC TRUST REMINDERS DURING PRESENTATION

Always reinforce these core civic boundaries to the judges:
1. **Independent Civic Tech**: HAQ DWAAR AI is a citizen preparation tool, not a government agency.
2. **Deterministic Rules**: Eligibility is computed via standard logic, never fabricated by LLMs.
3. **Citizen-Marked Status**: The platform tracks the citizen's personal preparation journey; official application processing happens entirely on authorized government portals.
4. **Data Minimization**: Zero Aadhaar, PAN, or bank account numbers are stored in plain text or exposed in analytics.
