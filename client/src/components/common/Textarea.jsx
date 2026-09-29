import React, { forwardRef } from "react";

/**
 * HAQ DWAAR AI — Accessible Form Textarea
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    name,
    rows = 4,
    placeholder,
    helperText,
    error,
    required = false,
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const textareaId = id || name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        className={`w-full text-sm rounded-xl border bg-white text-[#0f172a] placeholder-slate-400 p-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-[#591d8f] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? "border-rose-400 text-rose-900 focus:ring-rose-500 focus:border-rose-500"
            : "border-[#e9e1f5] hover:border-purple-200"
        } ${className}`}
        {...props}
      />

      {error ? (
        <p id={`${textareaId}-error`} className="text-xs font-semibold text-rose-600 mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${textareaId}-helper`} className="text-xs text-[#4b5563] mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Textarea;
