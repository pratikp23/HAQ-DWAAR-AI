import React from "react";

/**
 * HAQ DWAAR AI — Skeleton Component (HeroUI Compatible)
 * 
 * Provides smooth placeholder animations for loading states.
 * 
 * Reference: https://heroui.com/docs/react/components/skeleton
 * 
 * Usage:
 * <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
 * <Skeleton className="h-3 w-36 rounded-lg" />
 */
export function Skeleton({
  children,
  className = "",
  isLoaded = false,
  ...props
}) {
  if (isLoaded) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-200/80 animate-pulse ${className}`}
      {...props}
    >
      {/* Optional shimmer highlight */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      {children && <span className="opacity-0">{children}</span>}
    </div>
  );
}

/**
 * HeroUI UserProfile Skeleton reference implementation
 * Exact component structure requested from HeroUI docs:
 * 
 * export function UserProfile() {
 *   return (
 *     <div className="flex items-center gap-3">
 *       <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
 *       <div className="flex-1 space-y-2">
 *         <Skeleton className="h-3 w-36 rounded-lg" />
 *         <Skeleton className="h-3 w-24 rounded-lg" />
 *       </div>
 *     </div>
 *   );
 * }
 */
export function UserProfile({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-36 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export const UserProfileSkeleton = UserProfile;

export default Skeleton;
