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
