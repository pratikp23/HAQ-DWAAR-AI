import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileCheck2, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Search, 
  Layers, 
  AlertTriangle,
  Info,
  HelpCircle,
  FileText
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-950 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Workflow & Architectural Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How HAQ DWAAR AI Works
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From discovering welfare programs to organizing paperwork and reaching the official government portal — understand the exact steps and safeguards powering our citizen assistance engine.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-16">
        
        {/* ======================================================== */}
        {/* ARCHITECTURAL DUAL JOURNEY COMPARISON                    */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
              Flexible Citizen Choice
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Two Complementary User Journeys
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              You choose how you want to interact with the platform. Instant public lookup or comprehensive personalized preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Journey A Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Journey A: Public Discovery
                </span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Anonymous
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct route for citizens who want quick access to official scheme rules, documents, and application portals without creating an account.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs font-medium text-slate-700 border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Browse Scheme Directory (`/browse-schemes`)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Inspect Official Rules & Documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Click <strong>[ Apply on Official Portal ]</strong></span>
                </div>
              </div>
              <Link
                to="/browse-schemes"
                className="block text-center px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Browse Schemes Anonymously
              </Link>
            </div>

            {/* Journey B Box */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Journey B: Personalized Assistance
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  With Account
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-featured preparation layer: build a Benefit Passport, store certificates in your vault, and deterministically evaluate your match score.
              </p>
              <div className="p-3.5 bg-blue-50/70 rounded-xl space-y-2 text-xs font-medium text-blue-950 border border-blue-100">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Create Benefit Passport (Demographics, Income, etc.)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Document Vault (Manual Upload + DigiLocker Demo)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Deterministic Matching Engine & "Why This Match?"</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>Document Health & Readiness Checklist</span>
                </div>
              </div>
              <Link
                to="/register"
                className="block text-center px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition"
              >
                Create Benefit Passport
              </Link>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* DETAILED 5-STEP WALKTHROUGH                              */}
        {/* ======================================================== */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
              Step-by-Step Breakdown
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              The 5 Pillars of HAQ DWAAR AI
            </h2>
          </div>

          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg flex-shrink-0">
                1
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Curated & Verified Government Scheme Database
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every scheme record is curated from published central or state government notifications. We do not invent rules or URLs. Each scheme defines structured criteria (age thresholds, income limits, education qualifications, occupation types) and mandatory required documents.
                </p>
                <div className="inline-flex items-center text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified against official government gazettes & authorized portals
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg flex-shrink-0">
                2
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Citizen Benefit Passport (Privacy First)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Citizens maintain a structured personal profile covering demographic information (age, gender, state, social category), financial data (family income, ration card category), and occupational details (student status, farmer holding, employment). Your data is private, encrypted, and never sold or shared.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg flex-shrink-0">
                3
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Personal Document Vault (Manual Upload + DigiLocker Demo)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Organize your certificates in one private vault. HAQ DWAAR AI supports two document sources:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                  <li><strong>Manual File Upload:</strong> Upload scanned PDFs or images of certificates directly.</li>
                  <li><strong>DigiLocker Integration (Demo Mode):</strong> Retrieve certificates available in the integration. If a specific document is unavailable in DigiLocker, you can simply upload it manually.</li>
                </ul>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated OCR text extraction inspects document health: verifying readability, detecting expiration dates, and masking sensitive IDs.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg flex-shrink-0">
                4
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Deterministic Profile Matching & "Why This Match?"
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We <strong>never use LLMs to guess or fabricate government eligibility</strong>. Instead, our deterministic rule engine compares your Benefit Passport directly against the scheme's mathematical rule conditions.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Transparent Results:</span>
                  <p>• <strong>MATCHED:</strong> All mandatory criteria satisfied by your profile.</p>
                  <p>• <strong>POTENTIAL MATCH:</strong> Core criteria met, but missing profile fields need completion.</p>
                  <p>• <strong>NOT MATCHED:</strong> One or more mandatory conditions are not met.</p>
                  <p>• <strong>Why This Match?:</strong> Transparent list of passed rules, failed conditions, and missing fields.</p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg flex-shrink-0">
                5
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Application Readiness Checklist & Direct Official Portal
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before applying, cross-reference required scheme documents against your vault to see which certificates are ready and which are missing. When ready, click <strong>[ Apply on Official Portal ]</strong> to open the verified government portal directly.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* CIVIC BOUNDARY MATRIX                                   */}
        {/* ======================================================== */}
        <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Clear Responsibilities
            </span>
            <h3 className="text-xl font-bold">
              What HAQ DWAAR AI Does vs What Government Portals Do
            </h3>
            <p className="text-xs text-slate-400">
              Clear boundaries ensure transparency and citizen trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
              <span className="font-bold text-emerald-400 block text-sm">
                What HAQ DWAAR AI Does:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                <li>✓ Curates and verifies scheme criteria and document lists</li>
                <li>✓ Provides transparent deterministic profile matching</li>
                <li>✓ Explains passed, failed, and missing conditions</li>
                <li>✓ Stores certificates locally in your personal vault</li>
                <li>✓ Checks document readability and expiry before submission</li>
                <li>✓ Provides authentic, verified government portal links</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
              <span className="font-bold text-blue-400 block text-sm">
                What Government Portals Do:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                <li>• Accept formal government application forms</li>
                <li>• Conduct official legal document verification</li>
                <li>• Make the final official eligibility decision</li>
                <li>• Issue application tracking numbers and acknowledgments</li>
                <li>• Disburse funds, scholarships, or subsidies directly</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
