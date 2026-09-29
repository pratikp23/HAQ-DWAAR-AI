import React from "react";

/**
 * HAQ DWAAR AI — PageContainer Component
 * 
 * Standard civic container:
 * - max-w-7xl (1280px)
 * - centered
 * - responsive padding (mobile: 16px, tablet: 24px, desktop: 32px)
 */
export default function PageContainer({
  children,
  className = "",
  size = "standard", // "standard" (1280px) | "narrow" (1024px) | "full"
  ...props
}) {
  const sizeMap = {
    standard: "max-w-7xl",
    narrow: "max-w-5xl",
    full: "max-w-full",
  };

  const selectedSize = sizeMap[size] || sizeMap.standard;

  return (
    <div
      className={`w-full ${selectedSize} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
