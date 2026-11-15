import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X, 
  Loader2 
} from "lucide-react";
import { formatUserError } from "../../utils/formatUserError";

/**
 * LOK SAMARTH — HeroUI Toast System (@heroui/react pattern)
 * 
 * Exact Reference: https://heroui.com/en/docs/react/components/toast
 * 
 * Features:
 * - toast(title, { description, variant, isLoading, timeout })
 * - toast.success(title, options)
 * - toast.error(title, options)
 * - toast.promise(promise, { loading, success, error })
 * - toast.update(id, title, options)
 * - toast.dismiss(id)
 * - User-Centric: Automatically sanitizes errors through formatUserError
 */

// Subscribers for global toast state
let listeners = [];
let toastState = [];
let idCounter = 1;

function notify() {
  listeners.forEach((listener) => listener([...toastState]));
}

/**
 * Core Toast Generator
 */
export function toast(title, options = {}) {
  const id = options.id || `toast-${idCounter++}`;
  const newToast = {
    id,
    title,
    description: options.description || "",
    variant: options.variant || (options.isLoading ? "loading" : "default"),
    isLoading: !!options.isLoading,
    timeout: options.timeout !== undefined ? options.timeout : (options.isLoading ? 0 : 4000),
    createdAt: Date.now(),
  };

  const existingIdx = toastState.findIndex((t) => t.id === id);
  if (existingIdx !== -1) {
    toastState[existingIdx] = { ...toastState[existingIdx], ...newToast };
  } else {
    // Keep max 5 active toasts
    toastState = [newToast, ...toastState.slice(0, 4)];
  }

  notify();

  if (newToast.timeout > 0) {
    setTimeout(() => {
      toast.dismiss(id);
    }, newToast.timeout);
  }

  return id;
}

/**
 * HeroUI toast.success
 */
toast.success = (title, options = {}) => {
  return toast(title, { ...options, variant: "success", isLoading: false });
};

/**
 * HeroUI toast.error (Sanitizes developer errors into citizen guidance)
 */
toast.error = (titleOrErr, options = {}) => {
  let title = titleOrErr;
  let description = options.description || "";

  if (typeof titleOrErr === "object") {
    const sanitized = formatUserError(titleOrErr);
    title = sanitized.title;
    description = description || sanitized.message;
  } else if (typeof titleOrErr === "string" && !options.description) {
    // Check if string contains technical jargon
    const sanitized = formatUserError(titleOrErr);
    if (sanitized.title !== "Request Could Not Be Completed") {
      title = sanitized.title;
      description = sanitized.message;
    }
  }

  return toast(title, {
    ...options,
    description,
    variant: "danger",
    isLoading: false,
  });
};

/**
 * HeroUI toast.warning
 */
toast.warning = (title, options = {}) => {
  return toast(title, { ...options, variant: "warning", isLoading: false });
};

/**
 * HeroUI toast.info
 */
toast.info = (title, options = {}) => {
  return toast(title, { ...options, variant: "info", isLoading: false });
};

/**
 * HeroUI toast.update
 */
toast.update = (id, title, options = {}) => {
  const existingIdx = toastState.findIndex((t) => t.id === id);
  if (existingIdx !== -1) {
    const updated = {
      ...toastState[existingIdx],
      title,
      description: options.description !== undefined ? options.description : toastState[existingIdx].description,
      variant: options.variant || "default",
      isLoading: !!options.isLoading,
      timeout: options.timeout !== undefined ? options.timeout : 4000,
    };
    toastState[existingIdx] = updated;
    notify();

    if (updated.timeout > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, updated.timeout);
    }
  }
};

/**
 * HeroUI toast.dismiss
 */
toast.dismiss = (id) => {
  if (id) {
    toastState = toastState.filter((t) => t.id !== id);
  } else {
    toastState = [];
  }
  notify();
};

/**
 * HeroUI toast.promise(promise, { loading, success, error })
 * Reference: https://heroui.com/en/docs/react/components/toast
 */
toast.promise = (promise, { loading, success, error }, options = {}) => {
  const id = toast(loading || "Processing request...", {
    ...options,
    isLoading: true,
    variant: "loading",
    timeout: 0,
  });

  return promise
    .then((data) => {
      const successTitle = typeof success === "function" ? success(data) : success;
      toast.update(id, successTitle || "Action completed successfully", {
        variant: "success",
        isLoading: false,
        timeout: 4000,
      });
      return data;
    })
    .catch((err) => {
      const sanitized = formatUserError(err);
      let errorTitle = typeof error === "function" ? error(err) : error;
      
      // If error string contains technical exception, sanitize it
      if (!errorTitle || errorTitle.includes("Error") || errorTitle.includes("status")) {
        errorTitle = sanitized.title;
      }

      toast.update(id, errorTitle, {
        description: sanitized.message,
        variant: "danger",
        isLoading: false,
        timeout: 5000,
      });
      throw err;
    });
};

/**
 * HeroUI Global Toast Container Component
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((item) => {
        // HeroUI visual styles by variant
        let borderClass = "border-[#c6decb] bg-white";
        let icon = <Info className="w-5 h-5 text-emerald-600 shrink-0" />;

        if (item.isLoading || item.variant === "loading") {
          borderClass = "border-[#c6decb] bg-[#fbfdfb]";
          icon = <Loader2 className="w-5 h-5 text-[#ea580c] animate-spin shrink-0" />;
        } else if (item.variant === "success") {
          borderClass = "border-emerald-300 bg-white";
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (item.variant === "danger") {
          borderClass = "border-rose-200 bg-white";
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (item.variant === "warning") {
          borderClass = "border-amber-200 bg-white";
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        }

        return (
          <div
            key={item.id}
            className={`pointer-events-auto rounded-2xl border ${borderClass} p-4 shadow-lg shadow-black/5 transition-all duration-300 flex items-start gap-3 relative overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="flex-1 space-y-0.5 pr-2">
              <h5 className="text-xs sm:text-sm font-bold text-[#112318] tracking-tight leading-snug">
                {item.title}
              </h5>
              {item.description && (
                <p className="text-[11px] sm:text-xs text-[#385a42] leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            {!item.isLoading && (
              <button
                type="button"
                onClick={() => toast.dismiss(item.id)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition shrink-0 cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default toast;
