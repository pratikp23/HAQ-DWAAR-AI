# 🏛️ HAQ DWAAR AI — Master Project Bible & Specification
*Scheme se Application Tak — The Complete Technical & Vision Blueprint*

> **Quick Summary**: This single file serves as the definitive briefing for ChatGPT, Claude, any developer, architect, or investor. It contains the complete functional, technical, and operational anatomy of **HAQ DWAAR AI**.

---

## 📑 Table of Contents & Documentation Suite
For full deep-dive specifications, refer to the files in `docs/`:
1. [docs/01_PROJECT_VISION_AND_PHILOSOPHY.md](file:///D:/HAQ-DWAAR-AI/docs/01_PROJECT_VISION_AND_PHILOSOPHY.md) — The Two Personas, Unstop comparison, and core mission.
2. [docs/02_ARCHITECTURE_AND_TECH_STACK.md](file:///D:/HAQ-DWAAR-AI/docs/02_ARCHITECTURE_AND_TECH_STACK.md) — Tech stack, directory tree, Benefit Firewall, and matching engine.
3. [docs/03_THE_3_DOOR_APPLICATION_SYSTEM.md](file:///D:/HAQ-DWAAR-AI/docs/03_THE_3_DOOR_APPLICATION_SYSTEM.md) — SchemeCoach Co-Pilot, ⚡ Quick Apply Dossier, Pre-Filled PDF.
4. [docs/04_SINGLE_ADMIN_PANEL_AND_API_INGESTION.md](file:///D:/HAQ-DWAAR-AI/docs/04_SINGLE_ADMIN_PANEL_AND_API_INGESTION.md) — Single Admin Panel, Govt API Cron Worker (`data.gov.in`, PIB), Ingestion Queue.
5. [docs/05_DATABASE_SCHEMAS_AND_MODELS.md](file:///D:/HAQ-DWAAR-AI/docs/05_DATABASE_SCHEMAS_AND_MODELS.md) — Full Mongoose Schemas for all collections.
6. [docs/06_PRODUCTION_DEPLOYMENT_AND_SECURITY.md](file:///D:/HAQ-DWAAR-AI/docs/06_PRODUCTION_DEPLOYMENT_AND_SECURITY.md) — Security checklist, real government APIs, and cloud deployment guide.
7. [docs/07_UI_DESIGN_SYSTEM_HEROUI_AND_REACTBITS.md](file:///D:/HAQ-DWAAR-AI/docs/07_UI_DESIGN_SYSTEM_HEROUI_AND_REACTBITS.md) — HeroUI design system + React Bits animations & micro-interactions.

---

## 🎯 What is HAQ DWAAR AI?

HAQ DWAAR AI is an independent, citizen-side welfare assistance and application-readiness platform for India.
It solves the three biggest barriers in Indian public welfare:
1. **Discovery Barrier**: Citizens don't know what schemes exist for them.
2. **Language & Literacy Barrier**: Dense government legal language prevents uneducated and rural citizens from understanding eligibility.
3. **Application Barrier**: Confusing government portals cause citizens to pay exploitative middlemen or get rejected due to basic errors.

---

## 👥 The Two Core User Personas

| Feature | **"Jo Jaante Hain" (Educated / Tech-Savvy)** | **"Jo Nahi Jaante Hain" (Uneducated / Rural)** |
|:---|:---|:---|
| **User Example** | College graduate, student, urban job-seeker | Small farmer, daily wage earner, senior citizen |
| **Interface** | Modern web dashboard, English/Hindi text | **Voice-first (MITTRA speaks), big visual cards, icons** |
| **Benefit** | Like Unstop/Internshala for welfare: fast, zero paperwork | A digital companion that protects them from touts and guides them |
| **Matching** | 100% Deterministic match score (0–100) | Plain Hindi explanation: *"Yeh yojana aapke liye kyun hai"* |

---

## 🖥️ The 3 Working Surfaces (Dashboards)

1. **The Public Showcase (`/`)**:
   - For anyone in India without logging in.
   - Explains the project, builds trust, and allows public searching of all schemes across states and sectors.
2. **The Citizen Dashboard (`/dashboard`)**:
   - Logged-in citizen hub: Benefit Passport (profile), Personal Document Vault, Matched Schemes, SchemeCoach, ⚡ Quick Apply, Pre-Filled PDF Download, and Application Tracker.
3. **The Single Admin Panel (`/admin`)**:
   - Single super-admin control room: Ingestion Queue from Government APIs (`data.gov.in`, PIB), Incoming Quick Apply Packets Desk, Scheme Catalog, and Subsystem Health.

---

## 🚪 The 3-Door Application System

When a citizen is ready to apply for a scheme, they have **3 clear choices**:

1. 🧭 **Door 1: SchemeCoach (Live Manual Form Companion)**
   - For citizens who want or need to apply directly on the official government website.
   - Provides a pre-flight checklist, side-by-side copy-paste cheat sheet, voice reading in Hindi, and trap warnings (date format, image sizes).
2. ⚡ **Door 2: 1-Click Quick Apply (Digital Dossier to Admin Desk)**
   - For citizens who don't want to touch the government form.
   - Bundles their Benefit Passport + verified DigiLocker documents + eligibility proof into an official application dossier (with tracking code `HAQ/2026/...`) and sends it directly to the Admin Desk to hold for official dispatch.
3. 📄 **Door 3: Pre-Filled Physical Form (PDF Download)**
   - For offline schemes at the Tehsil or Panchayat office.
   - Generates a ready-to-print official bilingual form with the citizen's photo, pre-filled details, and a verification QR/barcode.

---

## ⚙️ Core Technical Rules & Architecture

- **Stack**: React 18 (Vite) + Tailwind CSS + Node.js (Express ESM) + MongoDB (Mongoose).
- **Matching Engine**: **100% Deterministic mathematical rules**. No Large Language Models evaluate eligibility.
- **Benefit Firewall**: Protects citizens from AI hallucinations, ensures all application links point to legitimate `.gov.in` domains, and neutralizes prompt injections.
- **Government API Ingestion**: Daily cron worker (`schemeSyncJob.js`) fetches schemes from `data.gov.in` and PIB feeds, parsed into the database schema via Gemini Flash, and placed in the Admin Queue for **1-Click Approval**.

---

*HAQ DWAAR AI — Scheme se Application Tak, Har Bharatiya Ke Saath 🇮🇳*
