import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * 
 * Ensures every newly opened page or route transition starts from the top (top: 0),
 * preventing the browser from retaining previous scroll positions that place
 * the user at the bottom (seeing the footer).
 * 
 * Handles:
 * 1. Automatic scroll-to-top on route change (pathname / search changes).
 * 2. Instant scroll reset to prevent smooth-scroll lag across page transitions.
 * 3. Browser scrollRestoration = "manual" to prevent browser fighting route changes.
 * 4. In-page anchor hash support (e.g., #faq, #how-it-works).
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration on SPA navigation
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        // Ignore if restricted
      }
    }
  }, []);

  useEffect(() => {
    // If the URL has an anchor hash, scroll to that specific section
    if (hash) {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 60);
        return () => clearTimeout(timer);
      }
    }

    // Temporarily bypass global html { scroll-behavior: smooth }
    // to make page-to-page navigation instantaneous rather than sliding from footer
    const root = document.documentElement;
    const prevScrollBehavior = root?.style?.scrollBehavior;
    if (root) {
      root.style.scrollBehavior = "auto";
    }

    // 1. Instant window scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // 2. Direct DOM root scroll reset (cross-browser safeguard)
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Restore smooth scroll behavior for in-page anchors on the next frame
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (root) {
        root.style.scrollBehavior = prevScrollBehavior || "";
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, search, hash]);

  return null;
}
