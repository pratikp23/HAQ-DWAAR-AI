import React from "react";
import { AlertTriangle, RefreshCw, Home, LayoutDashboard } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log privately for diagnostics; never render to citizen
    console.error("ErrorBoundary caught an unhandled interface error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoDashboard = () => {
    window.location.href = "/dashboard";
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900"
        >
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                An unexpected error occurred while loading this section. Your profile data and uploaded documents remain safe and protected.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 text-left">
              <p className="font-semibold text-slate-700">What should I do?</p>
              <p>You can refresh the page or navigate to your citizen dashboard to continue reviewing schemes.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoDashboard}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#240b49] hover:bg-[#1e0a3c] text-white text-xs font-bold shadow-xs transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <Home className="w-3.5 h-3.5 mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
