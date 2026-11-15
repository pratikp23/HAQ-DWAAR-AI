import React from "react";

/**
 * LOK SAMARTH — HeroUI Skeleton Component
 * 
 * Exact Reference: https://heroui.com/en/docs/react/components/skeleton
 * 
 * Supports:
 * - animationType: "shimmer" | "pulse" | "none" (default: "shimmer")
 * - isLoaded: boolean (renders children when true)
 * - className: custom Tailwind classes (supports bone styling)
 */
export function Skeleton({
  children,
  className = "",
  isLoaded = false,
  animationType = "shimmer",
  ...props
}) {
  if (isLoaded) {
    return <>{children}</>;
  }

  // Animation classes matching HeroUI spec
  let animClass = "";
  if (animationType === "shimmer") {
    animClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";
  } else if (animationType === "pulse") {
    animClass = "animate-pulse";
  } else if (animationType === "none") {
    animClass = "";
  }

  return (
    <div
      className={`rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90 select-none ${animClass} ${className}`}
      {...props}
    >
      {children && <span className="opacity-0">{children}</span>}
    </div>
  );
}

/**
 * Standard HeroUI Bone Styling Helper
 */
export const bone = "animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90";

/**
 * HeroUI UserProfile Skeleton Reference
 */
export function UserProfile({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Skeleton animationType="shimmer" className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton animationType="shimmer" className="h-3 w-36 rounded-lg" />
        <Skeleton animationType="shimmer" className="h-3 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * HeroUI CustomStyles Card Skeleton
 * Reference: https://heroui.com/en/docs/react/components/skeleton
 */
export function CustomStyles({ className = "" }) {
  return (
    <div className={`w-[250px] space-y-5 rounded-xl border border-border/80 bg-surface p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/10 ${className}`}>
      <Skeleton className={`h-32 ${bone}`} />
      <div className="space-y-3">
        <Skeleton className={`h-3 w-3/5 ${bone}`} />
        <Skeleton className={`h-3 w-4/5 ${bone}`} />
        <Skeleton className={`h-3 w-2/5 ${bone}`} />
      </div>
    </div>
  );
}

/**
 * HeroUI AnimationTypes Showcase
 * Reference: https://heroui.com/en/docs/react/components/skeleton
 */
export function AnimationTypes() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <p className="truncate text-xs text-muted font-medium">Shimmer</p>
        <div className="shadow-panel space-y-3 rounded-lg bg-transparent p-4">
          <Skeleton animationType="shimmer" className="h-20 rounded-lg" />
          <Skeleton animationType="shimmer" className="h-3 w-3/5 rounded-lg" />
          <Skeleton animationType="shimmer" className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="truncate text-xs text-muted font-medium">Pulse</p>
        <div className="shadow-panel space-y-3 rounded-lg bg-transparent p-4">
          <Skeleton animationType="pulse" className="h-20 rounded-lg" />
          <Skeleton animationType="pulse" className="h-3 w-3/5 rounded-lg" />
          <Skeleton animationType="pulse" className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="truncate text-xs text-muted font-medium">None</p>
        <div className="shadow-panel space-y-3 rounded-lg bg-transparent p-4">
          <Skeleton animationType="none" className="h-20 rounded-lg" />
          <Skeleton animationType="none" className="h-3 w-3/5 rounded-lg" />
          <Skeleton animationType="none" className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * HeroUI Scheme Card Skeleton (Lok Samarth Welfare Directory)
 */
export function SchemeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#c6decb] bg-white p-6 shadow-sm space-y-4">
      {/* Category Tag & Icon */}
      <div className="flex items-center justify-between">
        <Skeleton animationType="shimmer" className="h-6 w-24 rounded-full bg-[#e2ede5]" />
        <Skeleton animationType="shimmer" className="h-8 w-8 rounded-full bg-[#e2ede5]" />
      </div>

      {/* Scheme Title & Ministry */}
      <div className="space-y-2">
        <Skeleton animationType="shimmer" className="h-5 w-4/5 rounded-lg bg-[#e2ede5]" />
        <Skeleton animationType="shimmer" className="h-3 w-1/2 rounded-md bg-[#e2ede5]" />
      </div>

      {/* Benefit Box */}
      <div className="p-3.5 rounded-xl bg-[#eef5f0]/60 space-y-2">
        <Skeleton animationType="shimmer" className="h-3 w-1/3 rounded-md bg-[#e2ede5]" />
        <Skeleton animationType="shimmer" className="h-6 w-2/3 rounded-lg bg-[#e2ede5]" />
      </div>

      {/* Footer Buttons */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <Skeleton animationType="shimmer" className="h-9 w-28 rounded-xl bg-[#e2ede5]" />
        <Skeleton animationType="shimmer" className="h-9 w-24 rounded-xl bg-[#ea580c]/20" />
      </div>
    </div>
  );
}

/**
 * HeroUI Document Vault Item Skeleton
 */
export function DocumentCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-[#c6decb] bg-white shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1">
        <Skeleton animationType="shimmer" className="h-12 w-12 rounded-xl bg-[#e2ede5] shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton animationType="shimmer" className="h-4 w-48 rounded-md bg-[#e2ede5]" />
          <Skeleton animationType="shimmer" className="h-3 w-32 rounded-md bg-[#e2ede5]" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton animationType="shimmer" className="h-8 w-20 rounded-lg bg-[#e2ede5]" />
        <Skeleton animationType="shimmer" className="h-8 w-8 rounded-lg bg-[#e2ede5]" />
      </div>
    </div>
  );
}

/**
 * HeroUI Table Skeleton
 */
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full rounded-2xl border border-[#c6decb] bg-white overflow-hidden shadow-xs divide-y divide-[#c6decb]">
      {/* Header */}
      <div className="bg-[#eef5f0] p-4 flex items-center justify-between gap-4">
        <Skeleton animationType="shimmer" className="h-4 w-32 rounded-md bg-[#d8ebd9]" />
        <Skeleton animationType="shimmer" className="h-4 w-24 rounded-md bg-[#d8ebd9]" />
        <Skeleton animationType="shimmer" className="h-4 w-28 rounded-md bg-[#d8ebd9]" />
      </div>
      {/* Body Rows */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center justify-between gap-4">
          <Skeleton animationType="shimmer" className="h-4 w-44 rounded-md bg-[#e2ede5]" />
          <Skeleton animationType="shimmer" className="h-4 w-28 rounded-md bg-[#e2ede5]" />
          <Skeleton animationType="shimmer" className="h-8 w-20 rounded-lg bg-[#e2ede5]" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
