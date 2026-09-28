import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  ExternalLink
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const FAQS = [
  {
    q: "What is HAQ DWAAR AI?",
    a: "HAQ DWAAR AI is an independent citizen-side assistance platform with the mission 'Scheme se Application Tak'. It helps citizens discover relevant government welfare schemes, understand eligibility criteria through deterministic rule matching, organize required certificates in a personal vault, and reach authorized official application portals."
  },
  {
    q: "Is HAQ DWAAR AI an official government website or agency?",
    a: "No. HAQ DWAAR AI is an independent civic-tech platform. It is not owned, operated, or endorsed by the Government of India or any state government. All scheme specifications, criteria, and document requirements are curated from published official government gazettes and notifications."
  },
  {
    q: "Is the platform free to use?",
    a: "Yes, 100% free. We never charge citizens any fees, subscriptions, or commissions. Our goal is to eliminate predatory middlemen who exploit citizens by charging for free public welfare programs."
  },
  {
    q: "Can I use HAQ DWAAR AI without creating an account?",
    a: "Yes! Through our Public Scheme Discovery journey, you can browse all verified government schemes, search by category and state, review criteria and required documents, and click 'Apply on Official Portal' completely anonymously without signing up."
  },
  {
    q: "What is the Benefit Passport?",
    a: "The Benefit Passport is a private profile where you enter your demographic, educational, occupational, and income details once. HAQ DWAAR AI uses this passport to automatically evaluate your eligibility across all published schemes simultaneously."
  },
  {
    q: "Does AI or a machine learning model decide if I am eligible for a scheme?",
    a: "No, never. Eligibility is evaluated deterministically using strict mathematical rules based on official scheme guidelines. We never let an AI model guess your eligibility. Our engine gives you a transparent 'Why This Match?' breakdown showing exactly which rules passed, which failed, and what information is missing."
  },
  {
    q: "How does the Personal Document Vault work?",
    a: "The Personal Document Vault lets you store digital copies of your certificates (Aadhaar, income certificates, marksheets, caste certificates) in one place. It supports two document sources: manual file upload and simulated DigiLocker demo import. Our built-in document health analyzer checks if files are readable, flags expired certificates, and masks sensitive identification numbers."
  },
  {
    q: "Does DigiLocker Demo Mode connect to my real government DigiLocker account?",
    a: "No. In the current development environment, DigiLocker operates strictly in simulated Demo Mode (DIGILOCKER_MODE=demo). It simulates the authorization and import experience using synthetic sample documents. Real DigiLocker integration requires authorized government credentials and will be supported through the same architecture."
  },
  {
    q: "What if a document I need is not available in DigiLocker?",
    a: "You can simply upload it manually! The Document Vault treats Manual Upload and DigiLocker as complementary sources. If DigiLocker does not provide a particular certificate (such as an updated income certificate), you can upload a scanned PDF or image directly into your vault."
  },
  {
    q: "Does HAQ DWAAR AI submit my government application for me?",
    a: "No. HAQ DWAAR AI is an informational application-readiness assistant. We do not submit applications on your behalf, nor do we issue government registration numbers. When you are ready, we provide a verified direct link to the authorized government portal (e.g., National Scholarship Portal, state portals) where you submit your application officially."
  },
  {
    q: "Where do the official application links come from?",
    a: "Every application link on HAQ DWAAR AI is manually verified by administrators against official government portals and gazette notifications. We never use AI to fabricate, invent, or guess URLs. If an official link is not currently available, we explicitly state that rather than providing an unverified link."
  },
  {
    q: "Is my personal data secure and private?",
    a: "Yes. Your Benefit Passport and uploaded documents are stored securely with strict user isolation. User A can never view User B's documents or profile. We do not sell data to advertisers, lenders, or brokers."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-950 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Clear Answers & Civic Clarity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about HAQ DWAAR AI, deterministic matching, document vaults, DigiLocker demo simulation, and applying on official portals.
          </p>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-4">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
              >
                <span>{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-700 flex-shrink-0 ml-3" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}

        {/* Still Have Questions Box */}
        <div className="mt-10 p-6 bg-blue-50/80 rounded-2xl border border-blue-200 text-center space-y-3">
          <h3 className="font-bold text-sm text-blue-950">
            Still Have Questions?
          </h3>
          <p className="text-xs text-blue-900 max-w-md mx-auto leading-relaxed">
            Explore our curated welfare database directly or test the Benefit Passport to experience deterministic matching firsthand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              to="/browse-schemes"
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition"
            >
              Browse Schemes
            </Link>
            <Link
              to="/how-it-works"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs shadow-xs transition"
            >
              How It Works
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
