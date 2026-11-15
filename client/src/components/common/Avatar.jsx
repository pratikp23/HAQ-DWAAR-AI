import React from "react";

/**
 * HAQ DWAAR AI — Avatar Component (HeroUI Compatible)
 * Supports both compound component (<Avatar.Image>, <Avatar.Fallback>)
 * and direct props (src, alt, fallback, size).
 */
export function Avatar({
  children,
  src,
  alt = "",
  fallback = "",
  className = "",
  size = "md",
  ...props
}) {
  const sizeMap = {
    xs: "w-5 h-5 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  };

  // If size is defined via tailwind (e.g. size-5 or w-5), don't conflict
  const hasCustomSize = className.includes("size-") || className.includes("w-") || className.includes("h-");
  const sizeClass = hasCustomSize ? "" : (sizeMap[size] || sizeMap.md);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-100 border border-slate-200 select-none ${sizeClass} ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : children ? (
        children
      ) : (
        <span className="font-bold text-slate-600">
          {fallback || alt?.slice(0, 2)?.toUpperCase() || "HD"}
        </span>
      )}
    </div>
  );
}

Avatar.Image = function AvatarImage({ src, alt = "", className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

Avatar.Fallback = function AvatarFallback({ children, className = "" }) {
  return (
    <span className={`font-bold text-slate-600 uppercase flex items-center justify-center ${className}`}>
      {children}
    </span>
  );
};

export default Avatar;
