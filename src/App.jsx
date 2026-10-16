import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Smile,
  X,
} from "lucide-react";

import {
  BRAND,
  DENTISTS,
  IMAGES,
  TIME_SLOTS,
  TREATMENTS,
  formatDate,
  formatPeso,
  formatTime,
} from "./data/clinicData.js";

import SmileAtelierHome from "./pages/SmileAtelierHome.jsx";

import TreatmentCollectionPage from "./pages/TreatmentCollectionPage.jsx";
import TreatmentDetailsPage from "./pages/TreatmentDetailsPage.jsx";

import DentistCollectionPage from "./pages/DentistCollectionPage.jsx";
import DentistProfilePage from "./pages/DentistProfilePage.jsx";

import AppointmentCalendarPage from "./pages/AppointmentCalendarPage.jsx";
import AppointmentManagementPage from "./pages/AppointmentManagementPage.jsx";

import StaffLayout from "./components/StaffLayout.jsx";

import StaffDashboardPage from "./pages/staff/DashboardPage.jsx";
import AppointmentDeskPage from "./pages/staff/AppointmentDeskPage.jsx";
import DentistSchedulesPage from "./pages/staff/DentistSchedulesPage.jsx";
import TreatmentManagementPage from "./pages/staff/TreatmentManagementPage.jsx";

import ReportsPage from "./pages/staff/ReportsPage.jsx";
import TreatmentInsightsPage from "./pages/staff/TreatmentInsightsPage.jsx";
import ClinicSettingsPage from "./pages/staff/ClinicSettingsPage.jsx";
import DataVaultPage from "./pages/staff/DataVaultPage.jsx";

import SiteEnhancements from "./components/SiteEnhancements.jsx";

import "./styles/smile-staff-batch4.css";
import "./styles/smile-staff-batch5.css";

/* ==========================================
   YOUR SMILE.
   ARCHITECTURAL REBUILD BATCHES 1–5

   Public Website + Staff Management
   Frontend demonstration only
========================================== */

const STORAGE_KEY = "your-smile-demo-requests-v1";

const MENU_ITEMS = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Treatments",
    to: "/treatments",
  },
  {
    label: "Our Dentists",
    to: "/dentists",
  },
  {
    label: "Calendar",
    to: "/calendar",
  },
  {
    label: "My Requests",
    to: "/manage",
  },
];

/* ==========================================
   DATE UTILITIES
========================================== */

function localDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function dateAfter(days = 0) {
  const date = new Date();

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return localDateKey(date);
}

function firstBookableDay() {
  const date = new Date(
    `${dateAfter(1)}T12:00:00`
  );

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return localDateKey(date);
}

/* ==========================================
   READ LOCAL REQUESTS
========================================== */

function readRequests() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.alias === "string" &&
        typeof item.serviceId === "string" &&
        typeof item.doctorId === "string" &&
        typeof item.date === "string" &&
        typeof item.time === "string" &&
        ["requested", "cancelled"].includes(
          item.status
        )
    );
  } catch {
    return [];
  }
}

/* ==========================================
   SCROLL TO TOP + PAGE TITLES
========================================== */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const titles = {
      "/": "Home",
      "/treatments": "Treatment Collection",
      "/dentists": "People Journal",
      "/appointments": "Appointment Preview",
      "/calendar": "Appointment Atelier",
      "/manage": "My Demo Requests",

      "/staff": "Staff Dashboard",
      "/staff/appointments": "Appointment Desk",
      "/staff/schedules": "Dentist Schedules",
      "/staff/treatments": "Treatment Studio",
      "/staff/reports": "Clinical Operations Reports",
      "/staff/insights": "Treatment Insights",
      "/staff/settings": "Clinic Settings",
      "/staff/data": "Data Vault",
    };

    const section = pathname.startsWith(
      "/treatments/"
    )
      ? "Treatment Journal"
      : pathname.startsWith("/dentists/")
        ? "Dentist Journal"
        : titles[pathname] || "Page Not Found";

    document.title = `${section} | YOUR SMILE.`;
  }, [pathname]);

  return null;
}

/* ==========================================
   BRAND MARK
========================================== */

function BrandMark() {
  return (
    <span className="ys-brand">
      <span className="ys-brand-symbol">
        <Smile
          size={23}
          strokeWidth={1.65}
        />
      </span>

      <span className="ys-brand-word">
        YOUR SMILE<span>.</span>
      </span>
    </span>
  );
}

/* ==========================================
   PUBLIC HEADER

   STAFF DEMO BUTTON INCLUDED
   DIRECT ROUTE: /staff
========================================== */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKey
      );
  }, [menuOpen]);

  return (
    <>
      {/* ANNOUNCEMENT BAR */}

      <div className="ys-announcement">
        <span>
          YOUR SMILE — A PREMIUM DENTAL WEBSITE CONCEPT
        </span>

        <Link to="/calendar">
          Explore demo scheduling
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* MAIN HEADER */}

      <header className="ys-header">
        <div className="ys-container ys-header-inner">

          {/* BRAND */}

          <Link
            to="/"
            aria-label="YOUR SMILE homepage"
            onClick={() => setMenuOpen(false)}
          >
            <BrandMark />
          </Link>

          {/* MAIN NAVIGATION */}

          <nav
            id="primary-navigation"
            className={`ys-navigation ${
              menuOpen ? "is-open" : ""
            }`}
            aria-label="Main navigation"
          >
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  isActive ? "is-active" : ""
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {/* STAFF DEMO IN MOBILE MENU */}

            <Link
              className="ys3-staff-mobile"
              to="/staff"
              onClick={() => setMenuOpen(false)}
            >
              Staff Demo Dashboard
              <LayoutDashboard size={17} />
            </Link>

            <Link
              className="ys-mobile-appointment"
              to="/appointments"
              onClick={() => setMenuOpen(false)}
            >
              Request Appointment
              <ArrowRight size={17} />
            </Link>
          </nav>

          {/* HEADER BUTTONS */}

          <div className="ys-header-actions">

            {/* STAFF DEMO BUTTON */}

            <Link
              to="/staff"
              className="sm4-staff-access"
              aria-label="Open Staff Demo Dashboard"
              title="Open Staff Demo Dashboard"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard
                size={17}
                strokeWidth={1.8}
              />

              <span>
                STAFF DEMO
              </span>

              <ArrowUpRight
                size={14}
                className="sm4-staff-access-arrow"
              />
            </Link>

            {/* APPOINTMENT BUTTON */}

            <Link
              className="ys-header-cta"
              to="/appointments"
            >
              Book a Visit
              <ArrowUpRight size={17} />
            </Link>

            {/* MOBILE MENU */}

            <button
              type="button"
              className="ys-menu-button"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
            >
              {menuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

          </div>
        </div>
      </header>
    </>
  );
}

/* ==========================================
   PUBLIC FOOTER
========================================== */

function Footer() {
  return (
    <footer className="ys-footer">
      <div className="ys-container">
        <div className="ys-footer-main">

          {/* INTRODUCTION */}

          <div className="ys-footer-intro">
            <div className="ys-footer-brand">
              <BrandMark />
            </div>

            <h2>
              Leave with a little
              <br />
              more <em>confidence.</em>
            </h2>

            <p>
              A thoughtful dental website experience
              imagined for modern clinics.
            </p>

            <Link
              className="ys-button ys-button-light"
              to="/calendar"
            >
              Explore Appointment Calendar
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* LINKS */}

          <div className="ys-footer-links">
            <span>EXPLORE</span>

            <Link to="/">
              Homepage
            </Link>

            <Link to="/treatments">
              Treatments
            </Link>

            <Link to="/dentists">
              Our Dentists
            </Link>

            <Link to="/appointments">
              Appointments
            </Link>

            <Link to="/calendar">
              Calendar
            </Link>

            <Link to="/manage">
              My Demo Requests
            </Link>

            <Link to="/staff">
              Staff Demo Dashboard
            </Link>
          </div>

          {/* CONCEPT INFORMATION */}

          <div className="ys-footer-links">
            <span>THE CONCEPT</span>

            <p>
              Dental website prototype with
              fictional service and provider
              information.
            </p>

            <p>
              Illustrative fees, times, photos
              and local-only request records.
            </p>

            <p>
              No actual dental care,
              patient database or real
              booking is provided.
            </p>
          </div>
        </div>

        <div className="ys-footer-bottom">
          <span>
            © {new Date().getFullYear()} YOUR SMILE.
          </span>

          <span>
            {BRAND.developer}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================
   APPOINTMENTS PAGE

   ORIGINAL REQUEST ENGINE PRESERVED
========================================== */

function AppointmentsPage({
  requests,
  onCreateRequest,
  onCancelRequest,
}) {
  const [params] = useSearchParams();

  const requestedService = params.get(
    "service"
  );

  const requestedDoctor = params.get(
    "doctor"
  );

  const [form, setForm] = useState(() => ({
    alias: "",

    serviceId: TREATMENTS.some(
      (t) => t.id === requestedService
    )
      ? requestedService
      : TREATMENTS[0].id,

    doctorId: DENTISTS.some(
      (d) => d.id === requestedDoctor
    )
      ? requestedDoctor
      : DENTISTS[0].id,

    date: firstBookableDay(),

    time: TIME_SLOTS[0],
  }));

  const [feedback, setFeedback] = useState("");

  const [successId, setSuccessId] = useState("");

  const service = TREATMENTS.find(
    (item) => item.id === form.serviceId
  );

  const doctor = DENTISTS.find(
    (item) => item.id === form.doctorId
  );

  const day = new Date(
    `${form.date}T12:00:00`
  );

  const sunday =
    !Number.isNaN(day.getTime()) &&
    day.getDay() === 0;

  const occupied = requests
    .filter(
      (item) =>
        item.doctorId === form.doctorId &&
        item.date === form.date &&
        item.status === "requested"
    )
    .map((item) => item.time);

  function change(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setFeedback("");
    setSuccessId("");
  }

  function submit(event) {
    event.preventDefault();

    const result = onCreateRequest(form);

    if (result.ok) {
      setSuccessId(result.id);
      setFeedback("");

      setForm((current) => ({
        ...current,
        alias: "",
      }));
    } else {
      setSuccessId("");

      setFeedback(
        result.error ||
          "Unable to save demo request."
      );
    }
  }

  return (
    <div className="ys-inner-page">

      {/* APPOINTMENT HERO */}

      <section className="ys-page-hero ys-page-hero-booking">
        <div className="ys-container">
          <span className="ys-eyebrow">
            YOUR SMILE / APPOINTMENT PREVIEW
          </span>

          <h1>
            Your visit.
            <br />
            <em>Your pace.</em>
          </h1>

          <p>
            Choose a fictional dentist,
            treatment interest, day and
            demonstration time.
          </p>
        </div>
      </section>

      {/* APPOINTMENT FORM */}

      <section className="ys-section ys-container">
        <div className="ys-booking-grid">
          <form
            className="ys-booking-form"
            onSubmit={submit}
          >
            <span className="ys-eyebrow">
              01 / PLAN A DEMO VISIT
            </span>

            <h2>
              It starts with{" "}
              <em>a hello.</em>
            </h2>

            {/* TREATMENT */}

            <label className="ys-field">
              <span>
                SELECT TREATMENT
              </span>

              <select
                value={form.serviceId}
                onChange={(e) =>
                  change(
                    "serviceId",
                    e.target.value
                  )
                }
              >
                {TREATMENTS.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            {/* DENTIST */}

            <label className="ys-field">
              <span>
                PREFERRED FICTIONAL DENTIST
              </span>

              <select
                value={form.doctorId}
                onChange={(e) =>
                  change(
                    "doctorId",
                    e.target.value
                  )
                }
              >
                {DENTISTS.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            {/* VISITOR ALIAS */}

            <label className="ys-field">
              <span>
                FICTIONAL NAME / ALIAS
              </span>

              <input
                type="text"
                required
                minLength={2}
                maxLength={50}
                placeholder="e.g. Demo Visitor"
                value={form.alias}
                onChange={(e) =>
                  change(
                    "alias",
                    e.target.value
                  )
                }
              />
            </label>

            {/* DATE */}

            <label className="ys-field">
              <span>
                PREFERRED DEMO DATE
              </span>

              <input
                type="date"
                required
                min={dateAfter(1)}
                max={dateAfter(180)}
                value={form.date}
                onChange={(e) => {
                  change(
                    "date",
                    e.target.value
                  );

                  setForm((current) => ({
                    ...current,
                    date: e.target.value,
                    time: TIME_SLOTS[0],
                  }));
                }}
              />
            </label>

            {sunday && (
              <div
                className="ys-field-notice"
                role="status"
              >
                Sundays are unavailable in
                the sample calendar. Please
                choose Monday–Saturday.
              </div>
            )}

            {/* TIME SLOTS */}

            <span className="ys-field-title">
              SAMPLE TIME OPTIONS
            </span>

            <div
              className="ys-time-slots"
              role="group"
              aria-label="Appointment time"
            >
              {TIME_SLOTS.map((time) => {
                const taken = occupied.includes(
                  time
                );

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={
                      taken || sunday
                    }
                    aria-pressed={
                      form.time === time
                    }
                    className={
                      form.time === time
                        ? "is-selected"
                        : ""
                    }
                    onClick={() =>
                      change("time", time)
                    }
                  >
                    {formatTime(time)}

                    {taken && (
                      <small>
                        Occupied
                      </small>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ERROR MESSAGE */}

            {feedback && (
              <p
                className="ys-form-error"
                role="alert"
              >
                {feedback}
              </p>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="ys-button ys-submit"
              disabled={
                sunday ||
                occupied.includes(form.time)
              }
            >
              Save Demo Request
              <ArrowUpRight size={18} />
            </button>

            <p className="ys-disclaimer">
              Browser-only demonstration.
              Use a fictional alias; do not
              submit medical information.
            </p>
          </form>

          {/* BOOKING SUMMARY */}

          <aside className="ys-booking-aside">
            <div className="ys-booking-summary">
              <span className="ys-eyebrow">
                YOUR DEMO VISIT AT A GLANCE
              </span>

              <h3>
                Your appointment{" "}
                <em>preview.</em>
              </h3>

              <div className="ys-summary-photo">
                <img
                  src={IMAGES.clinic}
                  alt="Illustrative clinic environment"
                  loading="lazy"
                />
              </div>

              <div className="ys-summary-rows">

                {/* SERVICE */}

                <div>
                  <ShieldCheck size={18} />

                  <span>
                    <small>
                      Treatment interest
                    </small>

                    <strong>
                      {service?.name}
                    </strong>
                  </span>
                </div>

                {/* DENTIST */}

                <div>
                  <Smile size={18} />

                  <span>
                    <small>
                      Sample provider
                    </small>

                    <strong>
                      {doctor?.name}
                    </strong>
                  </span>
                </div>

                {/* DATE */}

                <div>
                  <CalendarDays size={18} />

                  <span>
                    <small>Date</small>

                    <strong>
                      {formatDate(form.date)}
                    </strong>
                  </span>
                </div>

                {/* TIME */}

                <div>
                  <Clock3 size={18} />

                  <span>
                    <small>Time</small>

                    <strong>
                      {formatTime(form.time)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="ys-summary-price">
                <span>
                  Illustrative starting figure
                </span>

                <strong>
                  {formatPeso(
                    service?.priceFrom || 0
                  )}
                </strong>
              </div>

              <p className="ys-summary-note">
                No real appointment or payment
                is made.
              </p>
            </div>
          </aside>
        </div>

        {/* SUCCESS MESSAGE */}

        {successId && (
          <section
            className="ys-success"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={34} />

            <span className="ys-eyebrow">
              DEMO REQUEST SAVED
            </span>

            <h2>
              Your sample request{" "}
              <em>is on the list.</em>
            </h2>

            <p>
              Local reference:{" "}
              <strong>
                {successId}
              </strong>
            </p>

            <Link
              to="/manage"
              className="ys-text-link"
            >
              View My Demo Requests
              <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {/* RECENT REQUEST HISTORY */}

        <section className="ys-request-history">
          <div className="ys-section-heading">
            <div>
              <span className="ys-eyebrow">
                SAVED IN THIS BROWSER
              </span>

              <h2>
                Recent demo{" "}
                <em>requests.</em>
              </h2>
            </div>

            <Link
              to="/manage"
              className="ys-text-link"
            >
              Full Request Manager
              <ArrowRight size={17} />
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="ys-empty-state">
              <CalendarDays size={30} />

              <h3>
                No requests yet.
              </h3>

              <p>
                Use the form above to create
                a fictional appointment.
              </p>
            </div>
          ) : (
            <div className="ys-request-grid">
              {[...requests]
                .reverse()
                .slice(0, 6)
                .map((record) => (
                  <article
                    className="ys-request-card"
                    key={record.id}
                  >
                    <div className="ys-request-top">
                      <span className="ys-eyebrow">
                        {record.id}
                      </span>

                      <span
                        className={`ys-request-status ${
                          record.status ===
                          "cancelled"
                            ? "is-cancelled"
                            : ""
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <h3>
                      {TREATMENTS.find(
                        (t) =>
                          t.id ===
                          record.serviceId
                      )?.name || "Demo visit"}
                    </h3>

                    <p>
                      {formatDate(record.date)}
                      {" · "}
                      {formatTime(record.time)}
                    </p>

                    <p>
                      Demo alias: {record.alias}
                    </p>

                    {record.status ===
                      "requested" && (
                      <button
                        type="button"
                        className="ys-cancel-btn"
                        onClick={() =>
                          onCancelRequest(
                            record.id
                          )
                        }
                      >
                        Cancel Demo Request
                        <X size={15} />
                      </button>
                    )}
                  </article>
                ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

/* ==========================================
   NOT FOUND PAGE
========================================== */

function NotFoundPage() {
  return (
    <section className="ys-container ys-section ys-not-found">
      <span className="ys-eyebrow">
        PAGE NOT FOUND
      </span>

      <h1>
        Let's find your{" "}
        <em>way back.</em>
      </h1>

      <p>
        This page isn't part of the
        YOUR SMILE demo.
      </p>

      <Link
        className="ys-button"
        to="/"
      >
        <ArrowLeft size={18} />
        Return Home
      </Link>
    </section>
  );
}

/* ==========================================
   MAIN APP

   ALL PUBLIC + STAFF ROUTES
========================================== */

export default function App() {
  const {
    pathname,
    search,
  } = useLocation();

  const isStaffRoute =
    pathname === "/staff" ||
    pathname.startsWith("/staff/");

  const [requests, setRequests] = useState(
    readRequests
  );

  /* ========================================
     SAVE APPOINTMENT REQUESTS LOCALLY
  ======================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(requests)
      );
    } catch (error) {
      console.warn(
        "Unable to save local demo requests:",
        error
      );
    }
  }, [requests]);

  /* ========================================
     CREATE DEMO APPOINTMENT
  ======================================== */

  function createRequest(input) {
    const alias =
      typeof input.alias === "string"
        ? input.alias.trim()
        : "";

    if (
      alias.length < 2 ||
      alias.length > 50
    ) {
      return {
        ok: false,
        error:
          "Use a fictional alias between 2 and 50 characters.",
      };
    }

    const validTreatment = TREATMENTS.some(
      (item) => item.id === input.serviceId
    );

    const validDoctor = DENTISTS.some(
      (item) => item.id === input.doctorId
    );

    if (
      !validTreatment ||
      !validDoctor
    ) {
      return {
        ok: false,
        error:
          "Choose a valid treatment and fictional dentist.",
      };
    }

    /* DATE VALIDATION */

    if (
      typeof input.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.date)
    ) {
      return {
        ok: false,
        error: "Choose a valid date.",
      };
    }

    const date = new Date(
      `${input.date}T12:00:00`
    );

    const validDate =
      !Number.isNaN(date.getTime()) &&
      localDateKey(date) === input.date &&
      input.date >= dateAfter(1) &&
      input.date <= dateAfter(180) &&
      date.getDay() !== 0;

    if (!validDate) {
      return {
        ok: false,
        error:
          "Choose a Monday–Saturday within the next 180 days.",
      };
    }

    /* TIME VALIDATION */

    if (
      !TIME_SLOTS.includes(input.time)
    ) {
      return {
        ok: false,
        error:
          "Choose one of the available sample times.",
      };
    }

    /* PREVENT OVERLAPPING APPOINTMENTS */

    const occupied = requests.some(
      (item) =>
        item.status === "requested" &&
        item.date === input.date &&
        item.time === input.time &&
        item.doctorId === input.doctorId
    );

    if (occupied) {
      return {
        ok: false,
        error:
          "This sample time is already occupied for that provider.",
      };
    }

    /* CREATE REFERENCE */

    const id = `YSM-${Date.now()
      .toString(36)
      .toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    /* CREATE RECORD */

    const record = {
      id,
      alias,
      serviceId: input.serviceId,
      doctorId: input.doctorId,
      date: input.date,
      time: input.time,
      status: "requested",
      createdAt: new Date().toISOString(),
    };

    setRequests((current) => [
      ...current,
      record,
    ]);

    return {
      ok: true,
      id,
    };
  }

  /* ========================================
     CANCEL DEMO APPOINTMENT
  ======================================== */

  function cancelRequest(id) {
    const target = requests.find(
      (item) => item.id === id
    );

    if (
      !target ||
      target.status !== "requested"
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Cancel this browser-local demo appointment request?"
    );

    if (!confirmed) {
      return;
    }

    setRequests((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "cancelled",
            }
          : item
      )
    );
  }

  /* ========================================
     APP RENDER
  ======================================== */

  return (
    <div className="ys-app">
      <ScrollToTop />

      <a
        className="ys2-skip-link"
        href="#main-content"
      >
        Skip to main content
      </a>

      {/* PUBLIC HEADER */}

      {!isStaffRoute && <Header />}

      <div id="main-content">
        <Routes>

          {/* ==================================
              BATCH 1 — HOMEPAGE
          ================================== */}

          <Route
            index
            element={
              <SmileAtelierHome />
            }
          />

          {/* ==================================
              BATCH 2 — TREATMENTS
          ================================== */}

          <Route
            path="treatments"
            element={
              <TreatmentCollectionPage />
            }
          />

          <Route
            path="treatments/:treatmentId"
            element={
              <TreatmentDetailsPage />
            }
          />

          {/* ==================================
              BATCH 3 — DENTISTS
          ================================== */}

          <Route
            path="dentists"
            element={
              <DentistCollectionPage />
            }
          />

          <Route
            path="dentists/:dentistId"
            element={
              <DentistProfilePage />
            }
          />

          {/* ==================================
              APPOINTMENT PREVIEW
          ================================== */}

          <Route
            path="appointments"
            element={
              <AppointmentsPage
                key={search}
                requests={requests}
                onCreateRequest={
                  createRequest
                }
                onCancelRequest={
                  cancelRequest
                }
              />
            }
          />

          {/* ==================================
              INTERACTIVE CALENDAR
          ================================== */}

          <Route
            path="calendar"
            element={
              <AppointmentCalendarPage
                key={search}
                requests={requests}
                onCreateRequest={
                  createRequest
                }
              />
            }
          />

          {/* ==================================
              DEMO REQUEST MANAGER
          ================================== */}

          <Route
            path="manage"
            element={
              <AppointmentManagementPage
                requests={requests}
                onCancelRequest={
                  cancelRequest
                }
              />
            }
          />

          {/* ==================================
              BATCH 4 — STAFF MANAGEMENT

              STAFF DEMO DESTINATION
          ================================== */}

          <Route
            path="staff"
            element={
              <StaffLayout
                requests={requests}
                onCancelRequest={
                  cancelRequest
                }
                onReplaceRequests={
                  setRequests
                }
              />
            }
          >

            {/* EXECUTIVE DASHBOARD */}

            <Route
              index
              element={
                <StaffDashboardPage />
              }
            />

            {/* APPOINTMENT DESK */}

            <Route
              path="appointments"
              element={
                <AppointmentDeskPage />
              }
            />

            {/* DENTIST SCHEDULES */}

            <Route
              path="schedules"
              element={
                <DentistSchedulesPage />
              }
            />

            {/* TREATMENT MANAGEMENT */}

            <Route
              path="treatments"
              element={
                <TreatmentManagementPage />
              }
            />

            {/* ==================================
                BATCH 5 — REPORTS
            ================================== */}

            <Route
              path="reports"
              element={
                <ReportsPage />
              }
            />

            {/* TREATMENT INSIGHTS */}

            <Route
              path="insights"
              element={
                <TreatmentInsightsPage />
              }
            />

            {/* CLINIC SETTINGS */}

            <Route
              path="settings"
              element={
                <ClinicSettingsPage />
              }
            />

            {/* DATA VAULT */}

            <Route
              path="data"
              element={
                <DataVaultPage />
              }
            />

          </Route>

          {/* ==================================
              404 PAGE
          ================================== */}

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />

        </Routes>
      </div>

      {/* PUBLIC FOOTER */}

      {!isStaffRoute && <Footer />}

      {/* WEBSITE ENHANCEMENTS */}

      {!isStaffRoute && (
        <SiteEnhancements />
      )}

    </div>
  );
}