import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Sparkles, 
  FileCheck2, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Search, 
  FileText, 
  BrainCircuit, 
  Eye, 
  Layers, 
  Database,
  ArrowRight
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Features() {
  const featuresList = [
    {
      icon: Database,
      title: "1. Verified Government Scheme Database",
      description:
        "Every welfare scheme in HAQ DWAAR AI is curated from official government gazettes, ministry notifications, or verified portals. Each scheme features structured rules (income caps, age limits, caste, occupation) and authenticated application URLs. Zero fabricated data.",
      tag: "Source Truth",
    },
    {
      icon: Lock,
      title: "2. Citizen Benefit Passport",
      description:
        "A private, reusable citizen profile storing demographic, occupational, and economic attributes. Citizens fill out their passport once, and HAQ DWAAR AI evaluates it across every published government welfare scheme automatically.",
      tag: "Citizen Privacy",
    },
    {
      icon: ShieldCheck,
      title: "3. Deterministic Matching Engine & 'Why This Match?'",
      description:
        "Eligibility is never left to LLM guesswork. Our deterministic rule engine mathematically tests your Benefit Passport against verified scheme conditions. It outputs a transparent breakdown: passed rules, failed conditions, missing fields, and a transparent profile-match score.",
      tag: "0% Hallucination",
    },
    {
      icon: BrainCircuit,
      title: "4. Life Situation NLU Engine (Gemini 1.5 Flash)",
      description:
        "Allows citizens to describe their life circumstances in natural conversational language. The NLU layer extracts structured tags with strict Zod schema validation and rule-based fallback. Gemini is strictly an NLU parser and never decides eligibility or alters database records.",
      tag: "Safe AI NLU",
    },
    {
      icon: FileText,
      title: "5. Personal Document Vault & OCR Health Analysis",
      description:
        "Store your certificates in one encrypted personal vault. Supports manual scans and PDFs with automated text extraction. The health analyzer inspects certificates for expiration dates, readability, and masks sensitive identification numbers.",
      tag: "Document Health",
    },
    {
      icon: Layers,
      title: "6. DigiLocker Integration (Demo Simulation)",
      description:
        "Seamlessly import issued certificates from DigiLocker. In development, operates as a simulated DigiLocker Demo. If a document is unavailable in DigiLocker, you can simply upload it manually into your vault. Built for real OAuth integration with authorized credentials.",
      tag: "Vault Flexibility",
    },
    {
      icon: FileCheck2,
      title: "7. Application Readiness Checklist",
      description:
        "Before visiting the government portal, HAQ DWAAR AI cross-references the scheme's mandatory document requirements against the contents of your Personal Document Vault, highlighting missing or expired paperwork in advance.",
      tag: "Readiness Check",
    },
    {
      icon: ExternalLink,
      title: "8. Direct Official Application Gateways",
      description:
        "No middleman markups and no shady intermediary services. HAQ DWAAR AI links you directly to the verified official government application portal (National Scholarship Portal, State Portals, PM Schemes).",
      tag: "Authentic Gateways",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-950 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Platform Capabilities & Technical Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Platform Features
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Engineered with strict civic safeguards: deterministic rule engines, encrypted vaults, verified official notifications, and zero AI eligibility hallucinations.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wide">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 rounded-2xl text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">
            Experience Transparent Citizen Assistance
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Browse verified welfare schemes anonymously or build your personal Benefit Passport to explore all features.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/browse-schemes"
              className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-slate-100 transition shadow"
            >
              Browse Schemes
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow"
            >
              Create Benefit Passport
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
