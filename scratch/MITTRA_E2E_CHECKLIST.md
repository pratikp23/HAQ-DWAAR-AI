# MITTRA E2E Citizen Journey Checklist

- [ ] **Milestone 1 — Foundation**:
  - [ ] `HaqAIContext.jsx` created and mounted in `CitizenLayout.jsx`
  - [ ] State Machine: `IDLE`, `LISTENING`, `TRANSCRIBING`, `THINKING`, `CONFIRMING`, `ACTING`, `SPEAKING`, `ERROR`
  - [ ] Floating Orb & Panel on bottom-right (Desktop: 380px panel; Mobile: Bottom sheet)
  - [ ] Welcome Hindi greeting on first visit
  - [ ] Speech-to-text and Text-to-speech with text fallback
  - [ ] Action allowlist validator with Zod

- [ ] **Milestone 2 — Conversational Form Filling & Visual Spotlight**:
  - [ ] Form metadata registry with `data-haq-field` and `data-haq-target`
  - [ ] Sequential profile field prompt and `FILL_FIELD` execution
  - [ ] Fixed viewport `HaqAISpotlight` and `HaqAIArrow`
  - [ ] Task progress tracker

- [ ] **Milestone 3 — Natural Language Matching & Why-Match**:
  - [ ] Life situation intent recognition (Education, Farming, Business, Employment, Housing)
  - [ ] Calls existing `/api/matching/recommendations` and `/api/matching/evaluate`
  - [ ] Explains real matching factors using uncertainty language ("potential match", "appears relevant")
  - [ ] Never claims legal eligibility

- [ ] **Milestone 4 — Documents, Health & Action Plan**:
  - [ ] Checks document health via `/api/documents`
  - [ ] Explains readiness percentage from `/api/readiness/:schemeId`
  - [ ] Clear synthetic/demo label for DigiLocker

- [ ] **Milestone 5 — Application Preparation & Official Handoff**:
  - [ ] Prepares structured application review summary
  - [ ] Explicit confirmation dialog before external handoff
  - [ ] Uses ONLY `scheme.officialApplicationUrl` from backend
  - [ ] Citizen-reported application tracker update

- [ ] **Milestone 6 — Responsive & Accessibility Polish**:
  - [ ] Touch targets >= 44px
  - [ ] Keyboard Esc dismiss & ARIA live region
  - [ ] Mobile 320px–414px verification
  - [ ] Client build passes with 0 errors
