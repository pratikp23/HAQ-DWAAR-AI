import React from "react";
import { AlertTriangle, RefreshCw, Home, LayoutDashboard, PhoneCall } from "lucide-react";

/**
 * LOK SAMARTH — HeroUI Root Error Boundary
 * Prevents raw developer exceptions or stack traces from reaching citizens.
 */
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
          className="min-h-screen bg-[#eef5f0] flex items-center justify-center p-4 text-[#112318]"
        >
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#c6decb] shadow-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#ea580c]/10 border border-[#ea580c]/20 flex items-center justify-center mx-auto text-[#ea580c] shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-[#112318] tracking-tight">
                Temporarily Unavailable
              </h2>
              <p className="text-sm text-[#385a42] leading-relaxed">
                An unexpected issue occurred while loading this section. Your citizen profile data and documents remain secure.
              </p>
            </div>

            <div className="p-4 bg-[#eef5f0]/70 rounded-2xl border border-[#c6decb] text-xs text-[#2b4c34] text-left space-y-1">
              <p className="font-bold text-[#112318]">What should I do?</p>
              <p>You can refresh the page or return to your citizen dashboard to continue browsing schemes.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoDashboard}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#112318] hover:bg-[#1a3824] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                Citizen Dashboard
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 mr-2" />
                Home
              </button>
            </div>

            <div className="pt-3 border-t border-[#c6decb]/60 flex items-center justify-center gap-1.5 text-xs text-[#385a42]">
              <PhoneCall className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>National Consumer Helpline: <a href="tel:1915" className="font-bold text-[#ea580c] hover:underline">1915</a></span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
