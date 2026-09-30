import React from "react";
import { Link } from "react-router-dom";
import { 
  Compass, 
  BookOpen, 
  FolderCheck, 
  Sparkles, 
  Send, 
  Briefcase,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

/**
 * HAQ DWAAR AI — Benefit Journey Visual ("Scheme se Application Tak")
 * 
 * Deep plum container matching the reference design:
 * - 6-stage pipeline: Discover → Understand → Prepare → Check → Apply → Track
 * - Highlights current active stage in vibrant saffron orange
 * - Every stage card is fully clickable and routes to its deterministic destination
 */
export default function BenefitJourney({
  completeness = 0,
  vaultDocCount = 0,
  trackedApps = [],
}) {
  // Determine active stage deterministically:
  let currentStageIndex = 2; // Default to Stage 3: Prepare

  const hasApplied = trackedApps.some((a) => a.status === "APPLIED" || a.status === "FOLLOW_UP" || a.status === "COMPLETED");
  const hasReadyToApply = trackedApps.some((a) => a.status === "READY_TO_APPLY");
  const hasPreparing = trackedApps.some((a) => a.status === "PREPARING" || a.status === "INTERESTED");

  if (hasApplied) {
    currentStageIndex = 5; // Stage 6: Track
  } else if (hasReadyToApply) {
    currentStageIndex = 4; // Stage 5: Apply
  } else if (hasPreparing || completeness >= 80) {
    currentStageIndex = 3; // Stage 4: Check
  } else if (vaultDocCount > 0 || completeness >= 30) {
    currentStageIndex = 2; // Stage 3: Prepare
  } else if (completeness > 0) {
    currentStageIndex = 1; // Stage 2: Understand
  } else {
    currentStageIndex = 0; // Stage 1: Discover
  }

  const stages = [
    {
      step: "01",
      name: "Discover",
      title: "Scheme Discovery",
      desc: "Explore verified welfare programs",
      icon: Compass,
      to: "/dashboard/schemes",
    },
    {
      step: "02",
      name: "Understand",
      title: "Eligibility Rules",
      desc: "Deterministic criteria matching",
      icon: BookOpen,
      to: "/dashboard/recommendations",
    },
    {
      step: "03",
      name: "Prepare",
      title: "Passport & Docs",
      desc: "Assemble required certificates",
      icon: FolderCheck,
      to: "/dashboard/benefit-passport",
    },
    {
      step: "04",
      name: "Check",
      title: "Readiness Plan",
      desc: "Identify blockers before applying",
      icon: Sparkles,
      to: "/dashboard/readiness/scheme-post-matric-scholarship",
    },
    {
      step: "05",
      name: "Apply",
      title: "Official Portal",
      desc: "Submit on authorized government gateway",
      icon: Send,
      to: "/dashboard/applications",
    },
    {
      step: "06",
      name: "Track",
      title: "Milestone Tracker",
      desc: "Monitor status & deadline alerts",
      icon: Briefcase,
      to: "/dashboard/applications",
    },
  ];

  return (
    <section 
      aria-label="Civic Journey: Scheme se Application Tak"
      className="rounded-3xl bg-gradient-to-br from-[#faf6fd] via-[#f3eafb] to-[#ede2f8] p-6 sm:p-7 border border-[#e2d4f3] shadow-xs hover:shadow-sm transition-all space-y-5"
    >
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2d4f3]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-md bg-[#ea580c] text-white tracking-wide shadow-2xs">
              CITIZEN WORKFLOW
            </span>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#2b0f4c] tracking-normal">
              Scheme se Application Tak (योजना से आवेदन तक)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-900/80 font-normal mt-1">
            A transparent 6-stage navigation pipeline from discovery to official DBT disbursement
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-orange-200 text-xs sm:text-sm font-semibold text-orange-950 shadow-2xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>Active Stage: {stages[currentStageIndex]?.name} ({stages[currentStageIndex]?.title})</span>
        </div>
      </div>

      {/* 2. Responsive 6-Stage Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {stages.map((stage, idx) => {
          const IconComp = stage.icon;
          const isCurrent = idx === currentStageIndex;
          const isCompleted = idx < currentStageIndex;

          if (isCurrent) {
            return (
              <Link
                key={idx}
                to={stage.to}
                className="group p-4 rounded-2xl bg-gradient-to-b from-[#ea580c] to-[#c2410c] text-white shadow-md ring-4 ring-orange-300/60 flex flex-col justify-between space-y-3 relative transform sm:-translate-y-0.5 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-100 uppercase tracking-wider">
                    STAGE {stage.step}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    {stage.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-semibold text-orange-100 leading-snug">
                    {stage.title}
                  </p>
                  <p className="text-xs text-orange-100/90 font-normal leading-relaxed pt-0.5">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/20 text-xs font-bold text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>● Active Focus</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          }

          if (isCompleted) {
            return (
              <Link
                key={idx}
                to={stage.to}
                className="group p-4 rounded-2xl bg-white/95 hover:bg-white border border-[#e2d4f3] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 shadow-2xs cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2b0f4c] uppercase tracking-wider">
                    STAGE {stage.step}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {stage.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-semibold text-slate-700 leading-snug">
                    {stage.title}
                  </p>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed pt-0.5">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-100 text-xs font-semibold text-emerald-700 flex items-center justify-between">
                  <span>✓ Completed</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                </div>
              </Link>
            );
          }

          // Upcoming stages
          return (
            <Link
              key={idx}
              to={stage.to}
              className="group p-4 rounded-2xl bg-white/60 hover:bg-white border border-[#e8dcf7]/80 hover:border-purple-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3 shadow-2xs cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-900/60 uppercase tracking-wider">
                  STAGE {stage.step}
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50/70 text-purple-400 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 leading-tight">
                  {stage.name}
                </h3>
                <p className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug">
                  {stage.title}
                </p>
                <p className="text-xs text-slate-500 font-normal leading-relaxed pt-0.5">
                  {stage.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-purple-100 text-xs font-medium text-purple-700/70 flex items-center justify-between">
                <span>Upcoming</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-400" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
