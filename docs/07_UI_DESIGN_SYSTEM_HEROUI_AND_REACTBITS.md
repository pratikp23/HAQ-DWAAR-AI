# 🏛️ HAQ DWAAR AI — Volume 7: UI Design System & Animations
*HeroUI Component Architecture + React Bits Micro-Interactions*

---

## 1. Design System Overview

To deliver an interface that is both **ultra-modern for educated youth** (Unstop-like sleekness) and **visually obvious for uneducated/first-time users**, the frontend combines two visual design standards:

1. **HeroUI (formerly NextUI)**: Provides the component structure, accessible semantic design tokens, glassmorphism, floating label inputs, badges, and circular progress meters.
2. **React Bits (reactbits.dev)**: Provides high-impact animations, interactive spotlight cards, fluid voice pulse orbs, and step-by-step transition physics.

---

## 2. Component Mapping (HeroUI Reference)

| Component Area | HeroUI Pattern | Implementation in HAQ DWAAR AI |
|:---|:---|:---|
| **Scheme Cards** | `Card` with `isBlurred`, `backdrop-blur-md` | Glassmorphic cards with crisp borders (`border-slate-200/60`), elevation on hover, and clear Rupee benefit headers. |
| **Readiness Score** | `CircularProgress` | Circular SVG progress ring (0–100) with gradient stroke transitioning from Amber (0–50%) to Emerald (80–100%). |
| **Status Indicators** | `Chip` & `Badge` with `variant="flat"` | - 🟢 `Aapke Liye (100% Matched)` (Emerald Chip)<br>- 🟡 `Document Missing` (Amber Chip)<br>- 🛡️ `Benefit Firewall: Verified` (Ashoka Blue Pill) |
| **Voice Assistant** | `Drawer` / Bottom Sheet (`placement="bottom"`) | On mobile devices, tapping the microphone slides up a smooth bottom sheet with safe-area padding for hands-free Hindi conversation. |
| **Passport Inputs** | `Input` with floating labels & `variant="bordered"` | Clean, touch-friendly inputs with large tap targets (min 48px height) and bilingual placeholder cues. |
| **Application Tabs** | `Tabs` with `variant="solid"` | Clean segmented controls switching between "All Schemes", "Matched (Aapke Liye)", and "Application Tracker". |

---

## 3. Micro-Interactions & Animations (React Bits Reference)

| Animation Pattern | React Bits Reference | Civic Purpose in HAQ DWAAR AI |
|:---|:---|:---|
| **Spotlight Card** | `SpotlightCard` (`reactbits.dev/components/spotlight-card`) | Dynamic mouse/touch radial gradient spotlight that follows user movement across scheme cards, highlighting monetary benefits. |
| **Voice Waveform & Pulse Orb** | Custom Audio Visualizer + Liquid Orb | For the MITTRA voice assistant: A fluid liquid orb that expands when listening and creates wave ripples when speaking in Hindi. |
| **Stepper Wizard** | `Stepper` with Framer Motion spring physics | Smooth slide transitions for the 6 steps of SchemeCoach: `Checklist → Vault Upload → Form Guide → Handoff`. |
| **Infinite Marquee** | `InfiniteScroll` / `Marquee` | On the Public Showcase landing page: Ticker showing real-time updates from `data.gov.in` and PIB ministry circulars. |
| **Shiny Heading Text** | `ShinyText` | Subtle light reflection across the hero title *"Scheme se Application Tak"* to create a prestigious, modern GovTech aesthetic. |

---

## 4. Technical Rule: Performance on Budget Android Devices

- **No Heavy Three.js or WebGL Bloat**: All animations strictly utilize **Tailwind CSS GPU hardware acceleration (`transform-gpu`)** and **Framer Motion spring transitions**.
- **60 FPS Guarantee**: Runs smoothly on low-end ₹6,000 Android phones and 3G rural cellular connections.
- **Dark/Light GovTech Contrast**: High contrast compliance (WCAG AAA) ensuring readable text in direct Indian sunlight.

---

*HAQ DWAAR AI — Volume 7: UI Design System & Animations 🇮🇳*
