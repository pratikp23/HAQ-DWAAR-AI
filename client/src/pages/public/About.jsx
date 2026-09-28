import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Heart, 
  Target, 
  Lock, 
  CheckCircle2, 
  Users, 
  AlertCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-950 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic Purpose & Principles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            About HAQ DWAAR AI
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            "Scheme se Application Tak" — Bridging the last-mile chasm between government welfare policies and the citizens who need them most.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        
        {/* Mission Statement */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Our Mission
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every year, the Central and State Governments of India allocate hundreds of thousands of crores to welfare programs designed for students, farmers, daily wage workers, women entrepreneurs, and low-income families.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Yet, a massive percentage of eligible beneficiaries never receive their entitlements due to fragmented portals, opaque criteria, missing certificates, or predatory middlemen who charge exorbitant fees for free public services.
          </p>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 text-xs sm:text-sm font-medium leading-relaxed">
            <strong>HAQ DWAAR AI</strong> exists to solve this problem by providing a free, transparent, citizen-centric assistance layer that guides citizens from discovering a scheme to preparing their paperwork and reaching the official application channel with confidence.
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Our Core Principles
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic Rules, Zero Guesswork</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never use large language models to guess eligibility. Government rules are exact, and our engine evaluates profiles using transparent mathematical logic.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Citizen Data Sovereignty</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your data belongs entirely to you. We do not sell user profiles, share personal information with commercial entities, or monetize citizen searches.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Official Truth & Curated Records</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every scheme on our platform references published government notifications. We do not invent benefits, deadlines, or official URLs.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-sky-700 font-bold text-sm">
                <Heart className="w-4 h-4" />
                <span>100% Free Civic Utility</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public services should remain free. We charge no fees, eliminate middlemen, and direct citizens directly to authentic official application gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Independence Disclaimer */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Important Civic Positioning</span>
          </div>
          <p className="text-slate-300">
            <strong>HAQ DWAAR AI</strong> is an independent civic-tech project. It is <strong>NOT</strong> an official government agency, portal, or representative of the Government of India or any State Government.
          </p>
          <p className="text-slate-300">
            We do not accept formal government applications, conduct statutory legal document verifications, or disburse benefits. Our mission is to prepare citizens so they can apply seamlessly through authorized official portals.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
