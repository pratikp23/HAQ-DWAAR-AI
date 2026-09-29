import React, { forwardRef } from "react";

/**
 * HAQ DWAAR AI — Accessible Form Input
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    type = "text",
    placeholder,
    helperText,
    error,
    required = false,
    disabled = false,
    className = "",
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full text-sm rounded-xl border bg-white text-[#0f172a] placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-[#591d8f] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            LeftIcon ? "pl-9" : "pl-3.5"
          } ${RightIcon ? "pr-9" : "pr-3.5"} py-2.5 ${
            error
              ? "border-rose-400 text-rose-900 focus:ring-rose-500 focus:border-rose-500"
              : "border-[#e9e1f5] hover:border-purple-200"
          } ${className}`}
          {...props}
        />

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs font-semibold text-rose-600 mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-[#4b5563] mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
