import React, { useRef, useState, useEffect } from "react";

/**
 * HAQ DWAAR AI — React Bits & HeroUI Component Micro-Interactions
 */

/**
 * 1. SpotlightCard (React Bits)
 * Adds an interactive radial gradient that follows the cursor across the card surface.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(234, 88, 12, 0.08)",
  onClick,
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const defaultBg = className.includes("bg-") ? "" : "bg-white";
  const defaultBorder = className.includes("border") ? "" : "border border-slate-200/90";
  const defaultRadius = className.includes("rounded-") ? "" : "rounded-3xl";

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden ${defaultRadius} ${defaultBg} ${defaultBorder} shadow-xs transition-all duration-300 ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      } ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * 2. ShineBorder (React Bits)
 * Border with a moving gradient shimmer for high-priority cards (100% readiness, quick apply).
 */
export function ShineBorder({
  children,
  className = "",
  borderWidth = 2,
  duration = 8,
  color = ["#591d8f", "#ea580c", "#10b981"],
}) {
  return (
    <div
      className={`relative rounded-3xl p-[2px] overflow-hidden ${className}`}
      style={{
        background: `conic-gradient(from 0deg, ${color.join(", ")}, ${color[0]})`,
      }}
    >
      <div className="w-full h-full bg-white rounded-[calc(1.5rem-2px)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/**
 * 3. NumberTicker (React Bits)
 * Smoothly interpolates an integer from 0 to value on mount.
 */
export function NumberTicker({
  value = 0,
  direction = "up",
  delay = 0,
  className = "",
  prefix = "",
  suffix = "",
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 1200; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={`inline-block font-mono tracking-tight ${className}`}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/**
 * 4. PillTabs (HeroUI Inspired)
 * Animated pill-segmented control with accessible keyboard navigation.
 */
export function PillTabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
  size = "md",
}) {
  const sizeClasses = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-xs sm:text-sm",
    lg: "p-1.5 text-sm",
  };

  const itemSizeClasses = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1.5",
    lg: "px-4 py-2",
  };

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-slate-100/90 rounded-2xl border border-slate-200/80 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              itemSizeClasses[size] || itemSizeClasses.md
            } ${
              isActive
                ? "bg-white text-slate-900 shadow-xs scale-100"
                : "text-slate-600 hover:text-slate-900 scale-95"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive
                    ? "bg-[#591d8f]/10 text-[#591d8f]"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 5. ScrollStack & ScrollStackItem (Official React Bits)
 * Reference: https://reactbits.dev/components/scroll-stack
 */
export { default as ScrollStack, ScrollStackItem } from "./ScrollStack";
