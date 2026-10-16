import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/*
  YOUR SMILE. / BATCH 6
  Announces client-side route changes to screen-reader users
  and places keyboard focus in the new page's main heading.
  No appointment or staff data is changed.
*/

const LABELS = {
  "/": "Homepage",
  "/treatments": "Treatment Collection",
  "/dentists": "Dentist Collection",
  "/calendar": "Appointment Calendar",
  "/appointments": "Appointment Preview",
  "/manage": "Demo Request Manager",
  "/staff": "Staff Dashboard",
  "/staff/appointments": "Staff Appointment Desk",
  "/staff/schedules": "Dentist Schedules",
  "/staff/treatments": "Treatment Management",
  "/staff/reports": "Operations Reports",
  "/staff/insights": "Treatment Insights",
  "/staff/settings": "Clinic Settings",
  "/staff/data": "Data Vault",
};

function routeName(pathname) {
  if (pathname.startsWith("/treatments/")) {
    return "Treatment Journal";
  }

  if (pathname.startsWith("/dentists/")) {
    return "Dentist Profile";
  }

  return LABELS[pathname] || "Page";
}

export default function SmileRouteQuality() {
  const location = useLocation();
  const liveRef = useRef(null);

  const previousRoute = useRef(
    `${location.pathname}${location.search}`
  );

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`;

    // Do not unexpectedly move focus on the initial page load.
    if (routeKey === previousRoute.current) return;

    previousRoute.current = routeKey;

    const frame = window.requestAnimationFrame(() => {
      if (liveRef.current) {
        liveRef.current.textContent =
          `${routeName(location.pathname)} loaded`;
      }

      const selector = location.pathname.startsWith("/staff")
        ? "#sm4-staff-main h1, #sm4-staff-main h2"
        : "#main-content h1, #main-content h2";

      const heading = document.querySelector(selector);

      if (!heading) return;

      // React client navigation does not focus a new document automatically.
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  return (
    <span
      ref={liveRef}
      className="ys6-screen-reader-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />
  );
}