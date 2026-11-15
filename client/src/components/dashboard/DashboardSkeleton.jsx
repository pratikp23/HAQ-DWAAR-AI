import React from "react";
import { Skeleton, UserProfile } from "../common/Skeleton";

/**
 * HAQ DWAAR AI — Dashboard Skeleton Loader (HeroUI Compatible)
 * 
 * Provides smooth, realistic HeroUI placeholder animations while citizen dashboard loads.
 */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto" aria-busy="true" aria-label="Loading citizen dashboard">
      
      {/* 1. Hero Skeleton (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>

        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <UserProfile />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* 2. 4 Fast Entitlement Metrics Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-3.5 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 3. The 3 Application Doors Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-36 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* 4. Top Matched Schemes Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-8 w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. 12-col Split: Tracker & Vault Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* 6. AI MITTRA HeroUI Skeleton */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden space-y-4">
        <Skeleton className="h-32 sm:h-36 w-full rounded-none" />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-5 w-44 rounded-lg" />
              <Skeleton className="h-3.5 w-64 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Skeleton className="lg:col-span-5 h-44 rounded-2xl" />
            <Skeleton className="lg:col-span-7 h-44 rounded-2xl" />
          </div>
        </div>
      </div>

    </div>
  );
}
