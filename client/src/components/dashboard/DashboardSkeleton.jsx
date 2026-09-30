import React from "react";

/**
 * HAQ DWAAR AI — Dashboard Skeleton Loader
 * 
 * Accessible skeleton placeholders while dashboard data loads from backend APIs.
 */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading citizen dashboard">
      
      {/* Hero Skeleton */}
      <div className="rounded-3xl bg-slate-200 h-64 w-full" />

      {/* Readiness & MITTRA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 rounded-3xl bg-slate-200 h-72 w-full" />
        <div className="lg:col-span-6 rounded-3xl bg-slate-200 h-72 w-full" />
      </div>

      {/* Quick Action Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-200 h-32 w-full" />
        ))}
      </div>

      {/* For You Recommendations Grid */}
      <div className="space-y-3">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-slate-200 h-64 w-full" />
          <div className="rounded-3xl bg-slate-200 h-64 w-full" />
        </div>
      </div>

      {/* Vault & Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-slate-200 h-72 w-full" />
        <div className="rounded-3xl bg-slate-200 h-72 w-full" />
      </div>

      {/* Journey Skeleton */}
      <div className="rounded-3xl bg-slate-200 h-44 w-full" />

    </div>
  );
}
