import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  ArrowUp,
  ShieldCheck,
  Smile,
  Sparkles,
} from "lucide-react";

import "../styles/polish.css";

const PAGE_DESCRIPTIONS = {
  "/":
    "YOUR SMILE. — A premium dental clinic website concept with modern treatments, sample dentist profiles and interactive demo appointments.",

  "/treatments":
    "Explore preventive, cosmetic, orthodontic and restorative dental treatment concepts at YOUR SMILE.",

  "/dentists":
    "Discover illustrative dental professional profiles and a premium clinic team experience.",

  "/appointments":
    "Explore YOUR SMILE's frontend-only dental appointment request experience.",

  "/calendar":
    "View an interactive demonstration of dental appointment scheduling and sample available time slots.",

  "/manage":
    "Manage fictional appointment requests stored locally in your browser.",
};

export default function SiteEnhancements() {
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(() => {
    return !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Short branded introduction, shown only on
  // initial public-site mount.
  useEffect(() => {
    if (!showIntro) return;

    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 650);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showIntro]);

  // Lightweight scroll UI using requestAnimationFrame.
  useEffect(() => {
    let frame = null;

    function updateScroll() {
      frame = null;

      const root = document.documentElement;

      const scrollableHeight = Math.max(
        0,
        root.scrollHeight - window.innerHeight
      );

      const value =
        scrollableHeight > 0
          ? Math.min(
              100,
              (window.scrollY / scrollableHeight) * 100
            )
          : 0;

      setScrollProgress(value);
      setShowBackToTop(window.scrollY > 550);
    }

    function onScroll() {
      if (frame !== null) return;

      frame = window.requestAnimationFrame(updateScroll);
    }

    updateScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  // Update the browser description for public routes.
  useEffect(() => {
    const tag = document.querySelector(
      'meta[name="description"]'
    );

    if (!tag) return;

    let description =
      PAGE_DESCRIPTIONS[location.pathname];

    if (location.pathname.startsWith("/treatments/")) {
      description =
        "Discover dental treatment details, illustrative rates and sample appointment options at YOUR SMILE.";
    }

    if (location.pathname.startsWith("/dentists/")) {
      description =
        "Meet an illustrative YOUR SMILE dentist profile and explore sample appointment availability.";
    }

    tag.setAttribute(
      "content",
      description ||
        "YOUR SMILE. — A premium dental clinic website concept."
    );
  }, [location.pathname]);

  function scrollToTop() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  return (
    <>
      <div
        className="ysm5-scroll-progress"
        aria-hidden="true"
      >
        <span
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>

      {showIntro && (
        <div
          className="ysm5-intro"
          aria-hidden="true"
        >
          <div className="ysm5-intro-inner">
            <div className="ysm5-intro-icon">
              <Smile size={38} strokeWidth={1.25} />
            </div>

            <span className="ysm5-intro-label">
              AN EXPERIENCE DESIGNED WITH CARE
            </span>

            <h2>
              YOUR SMILE<span>.</span>
            </h2>

            <p>
              A brighter smile. A gentler experience.
            </p>

            <div className="ysm5-intro-line" />
          </div>
        </div>
      )}

      <div className="ysm5-concept-note">
        <ShieldCheck size={15} />

        <span>
          PORTFOLIO DEMO · NO LIVE BOOKINGS
        </span>
      </div>

      <button
        type="button"
        className={`ysm5-back-to-top ${
          showBackToTop ? "is-visible" : ""
        }`}
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
        onClick={scrollToTop}
      >
        <ArrowUp size={20} strokeWidth={1.8} />
      </button>
    </>
  );
}