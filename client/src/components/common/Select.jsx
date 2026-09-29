import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

/**
 * HAQ DWAAR AI — Accessible Form Select
 */
const Select = forwardRef(function Select(
  {
    label,
    id,
    name,
    options = [],
    helperText,
    error,
    required = false,
    disabled = false,
    className = "",
    children,
    ...props
  },
  ref
) {
  const selectId = id || name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        <select
          ref={ref}
          id={selectId}
          name={name}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={`w-full text-sm rounded-xl border bg-white text-[#0f172a] appearance-none pl-3.5 pr-10 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-[#591d8f] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? "border-rose-400 text-rose-900 focus:ring-rose-500 focus:border-rose-500"
              : "border-[#e9e1f5] hover:border-purple-200"
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))
            : children}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs font-semibold text-rose-600 mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="text-xs text-[#4b5563] mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
