import { useEffect, useMemo, useState } from "react";

import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import {
  BRAND,
  IMAGES,
  CATEGORIES,
  TREATMENTS,
  DENTISTS,
  TIME_SLOTS,
  FAQS,
  formatPeso,
  formatTime,
  formatDate,
} from "./data/clinicData.js";

// BATCH 2 PAGES
import TreatmentDetailsPage from "./pages/TreatmentDetailsPage.jsx";
import DentistProfilePage from "./pages/DentistProfilePage.jsx";
import AppointmentCalendarPage from "./pages/AppointmentCalendarPage.jsx";
import AppointmentManagementPage from "./pages/AppointmentManagementPage.jsx";
// BATCH 3 — CLINIC OPERATIONS
import StaffLayout from "./components/StaffLayout.jsx";

import StaffDashboardPage from "./pages/staff/DashboardPage.jsx";

import AppointmentDeskPage from "./pages/staff/AppointmentDeskPage.jsx";

import DentistSchedulesPage from "./pages/staff/DentistSchedulesPage.jsx";

import TreatmentManagementPage from "./pages/staff/TreatmentManagementPage.jsx";

// BATCH 4 — REPORTS, INSIGHTS, SETTINGS, BACKUPS
import ReportsPage from "./pages/staff/ReportsPage.jsx";

import TreatmentInsightsPage from "./pages/staff/TreatmentInsightsPage.jsx";

import ClinicSettingsPage from "./pages/staff/ClinicSettingsPage.jsx";

import DataCenterPage from "./pages/staff/DataCenterPage.jsx";

const STORAGE_KEY = "your-smile-demo-requests-v1";

// BATCH 5 — PREMIUM WEBSITE ENHANCEMENTS
import SiteEnhancements from "./components/SiteEnhancements.jsx";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Treatments", to: "/treatments" },
  { label: "Our Dentists", to: "/dentists" },
  { label: "Calendar", to: "/calendar" },
  { label: "My Requests", to: "/manage" },
];

function localDateKey(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateAfter(days) {
  const date = new Date();

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return localDateKey(date);
}

function readRequests() {
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        typeof item.time === "string"
    );
  } catch {
    return [];
  }
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const titles = {
      "/": "Home",
      "/treatments": "Treatments",
      "/dentists": "Our Dentists",
      "/appointments": "Appointments",
      "/calendar": "Appointment Calendar",
      "/manage": "Demo Request Manager",
      "/staff": "Clinic Dashboard",
      "/staff/appointments": "Appointment Desk",
      "/staff/schedules": "Dentist Schedules",
      "/staff/treatments": "Treatment Management",
      "/staff/reports": "Reports & Analytics",
      "/staff/insights": "Treatment Insights",
      "/staff/settings": "Clinic Settings",
      "/staff/data": "Data & Backups",
    };

    const pageTitle = location.pathname.startsWith(
      "/treatments/"
    )
      ? "Treatment Details"
      : location.pathname.startsWith("/dentists/")
        ? "Dentist Profile"
        : titles[location.pathname] || "Page Not Found";

    document.title = `${pageTitle} | YOUR SMILE.`;
  }, [location.pathname]);

  return null;
}

function BrandMark() {
  return (
    <span className="ys-brand">
      <span className="ys-brand-symbol">
        <Smile size={23} strokeWidth={1.65} />
      </span>

      <span className="ys-brand-word">
        YOUR SMILE<span>.</span>
      </span>
    </span>
  );
}

function Header() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [menuOpen]);

  return (
    <>
      <div className="ys-announcement">
        <span>
          YOUR SMILE — A PREMIUM DENTAL WEBSITE CONCEPT
        </span>

        <Link to="/calendar">
          Explore demo scheduling
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <header className="ys-header">
        <div className="ys-container ys-header-inner">
          <Link
            to="/"
            aria-label="YOUR SMILE homepage"
          >
            <BrandMark />
          </Link>

          <nav
            id="primary-navigation"
            className={`ys-navigation ${
              menuOpen ? "is-open" : ""
            }`}
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
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

            <Link
              className="ys-mobile-appointment"
              to="/appointments"
              onClick={() => setMenuOpen(false)}
            >
              Request Appointment
              <ArrowRight size={17} />
            </Link>
          </nav>

          <div className="ys-header-actions">
            <Link
              className="ys-header-cta"
              to="/appointments"
            >
              Book a Visit
              <ArrowUpRight size={17} />
            </Link>

            <button
              type="button"
              className="ys-menu-button"
              aria-label={
                menuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() =>
                setMenuOpen((value) => !value)
              }
            >
              {menuOpen
                ? <X size={23} />
                : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="ys-footer">
      <div className="ys-container">
        <div className="ys-footer-main">
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

          <div className="ys-footer-links">
            <span>EXPLORE</span>
            <Link to="/">Homepage</Link>
            <Link to="/treatments">Treatments</Link>
            <Link to="/dentists">Our Dentists</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/manage">My Demo Requests</Link>
          </div>

          <div className="ys-footer-links">
            <span>THE CONCEPT</span>

            <p>
              Philippines-inspired dental clinic website.
            </p>

            <p>
              Names, portraits, treatment prices, and
              appointment slots are illustrative.
            </p>

            <p>
              No actual dental service or booking
              is provided.
            </p>
          </div>
        </div>

        <div className="ys-footer-bottom">
          <span>
            © {new Date().getFullYear()} YOUR SMILE.
          </span>

          <span>{BRAND.developer}</span>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  italic,
  description,
}) {
  return (
    <div className="ys-section-heading">
      <div>
        <span className="ys-eyebrow">
          {eyebrow}
        </span>

        <h2>
          {title} <em>{italic}</em>
        </h2>
      </div>

      {description && (
        <p>{description}</p>
      )}
    </div>
  );
}

function TreatmentCard({ treatment }) {
  return (
    <article className="ys-treatment-card">
      <Link
        to={`/treatments/${treatment.id}`}
        className="ys-treatment-card-image"
        aria-label={`View ${treatment.name} details`}
      >
        <img
          src={treatment.image}
          alt={`Illustrative ${treatment.name} treatment`}
          loading="lazy"
        />

        <span>
          {treatment.number} / 06
        </span>
      </Link>

      <div className="ys-treatment-card-body">
        <span className="ys-eyebrow">
          {treatment.category}
        </span>

        <h3>{treatment.name}</h3>

        <p>{treatment.short}</p>

        <div className="ys-treatment-card-meta">
          <span>
            <Clock3 size={15} />
            {treatment.duration} min
          </span>

          <span>
            From {formatPeso(treatment.priceFrom)}*
          </span>
        </div>

        <div className="ys2-card-actions">
          <Link
            to={`/treatments/${treatment.id}`}
            className="ys-text-link"
          >
            View Details
            <ArrowRight size={17} />
          </Link>

          <Link
            to={`/calendar?service=${treatment.id}`}
            className="ys2-card-book-link"
          >
            Book
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function DentistCard({ dentist }) {
  return (
    <article className="ys-dentist-card">
      <Link
        to={`/dentists/${dentist.id}`}
        className="ys-dentist-photo"
        aria-label={`View sample profile of ${dentist.name}`}
      >
        <img
          src={dentist.image}
          alt={`Illustrative portrait for ${dentist.name}`}
          loading="lazy"
        />

        <span>SAMPLE PROFILE</span>
      </Link>

      <div className="ys-dentist-content">
        <span className="ys-eyebrow">
          {dentist.tag}
        </span>

        <h3>{dentist.name}</h3>

        <strong>{dentist.role}</strong>

        <p>{dentist.bio}</p>

        <div className="ys2-card-actions">
          <Link
            to={`/dentists/${dentist.id}`}
            className="ys-text-link"
          >
            View Profile
            <ArrowRight size={17} />
          </Link>

          <Link
            to={`/calendar?doctor=${dentist.id}`}
            className="ys2-card-book-link"
          >
            Calendar
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function HomePage() {
  const featured = TREATMENTS.filter(
    (item) => item.featured
  );

  return (
    <>
      <section className="ys-hero">
        <div className="ys-container ys-hero-grid">
          <div className="ys-hero-copy">
            <span className="ys-eyebrow">
              A MORE THOUGHTFUL WAY TO SMILE
            </span>

            <h1>
              Good care.
              <br />
              Great smiles.
              <br />
              <em>A little more you.</em>
            </h1>

            <p>
              A modern dental experience built around
              clarity, comfort and care that feels personal.
            </p>

            <div className="ys-hero-actions">
              <Link
                className="ys-button"
                to="/calendar"
              >
                Explore the Calendar
                <ArrowUpRight size={18} />
              </Link>

              <Link
                className="ys-link-arrow"
                to="/treatments"
              >
                Explore treatments
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="ys-hero-proof">
              <span className="ys-hero-proof-icon">
                <ShieldCheck size={20} />
              </span>

              <span>
                <strong>
                  Designed with care in mind
                </strong>

                <small>
                  A modern dental website experience
                </small>
              </span>
            </div>
          </div>

          <div className="ys-hero-visual">
            <div className="ys-hero-image-shape">
              <img
                src={IMAGES.hero}
                alt="Illustrative modern dental care setting"
                fetchPriority="high"
              />
            </div>

            <div className="ys-hero-orbit ys-hero-orbit-one" />
            <div className="ys-hero-orbit ys-hero-orbit-two" />

            <div className="ys-floating-card">
              <span>
                <Heart size={20} />
              </span>

              <div>
                <strong>Smiles first.</strong>

                <small>
                  Thoughtful care, thoughtfully designed.
                </small>
              </div>
            </div>

            <div className="ys-hero-image-label">
              YOUR SMILE / THE NEW EXPERIENCE
            </div>
          </div>
        </div>
      </section>

      <section className="ys-benefits">
        <div className="ys-container ys-benefits-grid">
          <div>
            <Smile size={25} strokeWidth={1.4} />

            <span>
              <strong>Personalized care</strong>
              <small>Consultation-led experiences</small>
            </span>
          </div>

          <div>
            <CalendarDays size={25} strokeWidth={1.4} />

            <span>
              <strong>Simple scheduling</strong>
              <small>Explore sample appointment slots</small>
            </span>
          </div>

          <div>
            <Sparkles size={25} strokeWidth={1.4} />

            <span>
              <strong>Modern atmosphere</strong>
              <small>Comfortable and approachable</small>
            </span>
          </div>
        </div>
      </section>

      <section className="ys-section ys-container">
        <SectionHeading
          eyebrow="DISCOVER YOUR CARE"
          title="Every smile has"
          italic="its own story."
          description="Explore preventive, cosmetic, restorative and orthodontic treatments."
        />

        <div className="ys-treatment-grid">
          {featured.map((treatment) => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
            />
          ))}
        </div>

        <div className="ys-centered-action">
          <Link
            className="ys-button ys-button-outline"
            to="/treatments"
          >
            Explore All Treatments
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <section className="ys-story-section">
        <div className="ys-story-visual">
          <img
            src={IMAGES.clinic}
            alt="Illustrative modern dental clinic interior"
            loading="lazy"
          />

          <div className="ys-story-badge">
            <Sparkles size={20} />
            <span>CARE, REIMAGINED</span>
          </div>
        </div>

        <div className="ys-story-copy">
          <span className="ys-eyebrow">
            A SPACE TO FEEL AT EASE
          </span>

          <h2>
            The little details
            <br />
            make a <em>big difference.</em>
          </h2>

          <p>
            YOUR SMILE is more than a treatment catalog.
            It's a digital experience that makes browsing
            services and planning visits feel welcoming
            and simple.
          </p>

          <div className="ys-story-points">
            <div>
              <CheckCircle2 size={21} />
              Clear treatment information
            </div>

            <div>
              <CheckCircle2 size={21} />
              Convenient appointment previews
            </div>

            <div>
              <CheckCircle2 size={21} />
              Accessible, mobile-friendly navigation
            </div>
          </div>

          <Link
            to="/dentists"
            className="ys-text-link"
          >
            Meet the Concept Team
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="ys-section ys-container">
        <SectionHeading
          eyebrow="THE PEOPLE BEHIND THE EXPERIENCE"
          title="A familiar face."
          italic="A gentler feeling."
          description="Sample team profiles that can later be customized with verified dentist credentials and consented photography."
        />

        <div className="ys-dentist-grid">
          {DENTISTS.map((dentist) => (
            <DentistCard
              key={dentist.id}
              dentist={dentist}
            />
          ))}
        </div>
      </section>

      <section className="ys-faq-section">
        <div className="ys-container ys-faq-grid">
          <div>
            <span className="ys-eyebrow">
              GOOD TO KNOW
            </span>

            <h2>
              A little clarity
              <br />
              goes a <em>long way.</em>
            </h2>

            <p>
              Useful information about this dental
              website concept and appointment preview.
            </p>
          </div>

          <div className="ys-faq-list">
            {FAQS.map((item, index) => (
              <details key={item.question}>
                <summary>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {item.question}

                  <span className="ys-faq-plus">
                    +
                  </span>
                </summary>

                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ys-last-cta">
        <div className="ys-container">
          <span className="ys-eyebrow ys-eyebrow-light">
            YOUR NEXT SMILE STARTS HERE
          </span>

          <h2>
            Ready for a more
            <br />
            <em>comfortable experience?</em>
          </h2>

          <Link
            className="ys-button ys-button-light"
            to="/calendar"
          >
            Preview Appointment Calendar
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function TreatmentsPage() {
  const [category, setCategory] = useState(
    "All Treatments"
  );

  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return TREATMENTS.filter((item) => {
      const matchesCategory =
        category === "All Treatments" ||
        item.category === category;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        `${item.name} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="ys-inner-page">
      <section className="ys-page-hero">
        <div className="ys-container ys-page-hero-grid">
          <div>
            <span className="ys-eyebrow">
              YOUR SMILE / THE TREATMENTS
            </span>

            <h1>
              Care that feels
              <br />
              <em>just right.</em>
            </h1>

            <p>
              Clear information, thoughtful options,
              and a more comfortable way to explore
              your dental care journey.
            </p>
          </div>

          <div className="ys-page-hero-photo">
            <img
              src={IMAGES.treatment}
              alt="Illustrative dental treatment setting"
            />
          </div>
        </div>
      </section>

      <section className="ys-section ys-container">
        <div className="ys-section-heading">
          <div>
            <span className="ys-eyebrow">
              EXPLORE THE COLLECTION
            </span>

            <h2>
              Find your <em>treatment.</em>
            </h2>
          </div>

          <div className="ys-search">
            <Search size={18} />

            <input
              type="search"
              aria-label="Search treatments"
              placeholder="Search treatment..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <div
          className="ys-category-tabs"
          role="group"
          aria-label="Treatment categories"
        >
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? "is-active"
                  : ""
              }
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="ys-treatment-grid">
          {visible.map((treatment) => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
            />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="ys-empty-state">
            <Search size={30} />

            <h3>No treatments found.</h3>

            <p>
              Try another category or search term.
            </p>

            <button
              type="button"
              className="ys-button"
              onClick={() => {
                setCategory("All Treatments");
                setSearch("");
              }}
            >
              Clear Filters
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <p className="ys-disclaimer">
          *All rates and service descriptions are
          illustrative. Actual dental care requires
          professional assessment.
        </p>
      </section>
    </div>
  );
}

function DentistsPage() {
  return (
    <div className="ys-inner-page">
      <section className="ys-page-hero ys-page-hero-soft">
        <div className="ys-container">
          <span className="ys-eyebrow">
            YOUR SMILE / THE CONCEPT TEAM
          </span>

          <h1>
            People who make
            <br />
            <em>care feel personal.</em>
          </h1>

          <p>
            An illustrative team section showing how
            a clinic could introduce its dental professionals.
          </p>
        </div>
      </section>

      <section className="ys-section ys-container">
        <SectionHeading
          eyebrow="GET TO KNOW THE TEAM"
          title="Meet your"
          italic="smile guides."
          description="Explore sample individual dentist profiles, areas of care and appointment previews."
        />

        <div className="ys-dentist-grid">
          {DENTISTS.map((dentist) => (
            <DentistCard
              key={dentist.id}
              dentist={dentist}
            />
          ))}
        </div>

        <div className="ys-team-notice">
          <ShieldCheck size={23} />

          <p>
            <strong>Portfolio demonstration:</strong>{" "}
            All dentist names, roles and photographs
            are fictional or illustrative. This is
            not an operating dental practice.
          </p>
        </div>
      </section>
    </div>
  );
}

function AppointmentsPage({
  requests,
  onCreateRequest,
  onCancelRequest,
}) {
  const [params] = useSearchParams();

  const requestedService = params.get("service");
  const requestedDoctor = params.get("doctor");

  const [form, setForm] = useState(() => ({
    alias: "",
    serviceId: TREATMENTS.some(
      (item) => item.id === requestedService
    )
      ? requestedService
      : TREATMENTS[0].id,

    doctorId: DENTISTS.some(
      (item) => item.id === requestedDoctor
    )
      ? requestedDoctor
      : DENTISTS[0].id,

    date: dateAfter(1),
    time: TIME_SLOTS[0],
  }));

  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (
      requestedService &&
      TREATMENTS.some(
        (item) => item.id === requestedService
      )
    ) {
      setForm((current) => ({
        ...current,
        serviceId: requestedService,
      }));
    }
  }, [requestedService]);

  useEffect(() => {
    if (
      requestedDoctor &&
      DENTISTS.some(
        (item) => item.id === requestedDoctor
      )
    ) {
      setForm((current) => ({
        ...current,
        doctorId: requestedDoctor,
      }));
    }
  }, [requestedDoctor]);

  const treatment = TREATMENTS.find(
    (item) => item.id === form.serviceId
  );

  const dentist = DENTISTS.find(
    (item) => item.id === form.doctorId
  );

  const chosenDate = new Date(
    `${form.date}T12:00:00`
  );

  const sunday =
    !Number.isNaN(chosenDate.getTime()) &&
    chosenDate.getDay() === 0;

  const occupiedSlots = requests
    .filter(
      (request) =>
        request.doctorId === form.doctorId &&
        request.date === form.date &&
        request.status === "requested"
    )
    .map((request) => request.time);

  const slotTaken = occupiedSlots.includes(
    form.time
  );

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setFeedback("");
    setSuccess(null);
  }

  function submit(event) {
    event.preventDefault();

    const result = onCreateRequest(form);

    if (result.ok) {
      setSuccess(result);
      setFeedback("");

      setForm((current) => ({
        ...current,
        alias: "",
      }));
    } else {
      setSuccess(null);
      setFeedback(result.error);
    }
  }

  return (
    <div className="ys-inner-page">
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
            Select your treatment, sample dentist,
            preferred date and demo appointment time.
          </p>
        </div>
      </section>

      <section className="ys-section ys-container">
        <div className="ys-booking-grid">
          <form
            className="ys-booking-form"
            onSubmit={submit}
          >
            <span className="ys-eyebrow">
              01 / PLAN YOUR VISIT
            </span>

            <h2>
              It starts with <em>a hello.</em>
            </h2>

            <label className="ys-field">
              <span>SELECT TREATMENT</span>

              <select
                value={form.serviceId}
                onChange={(event) =>
                  update("serviceId", event.target.value)
                }
              >
                {TREATMENTS.map((item) => (
                  <option
                    value={item.id}
                    key={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="ys-field">
              <span>PREFERRED SAMPLE DENTIST</span>

              <select
                value={form.doctorId}
                onChange={(event) =>
                  update("doctorId", event.target.value)
                }
              >
                {DENTISTS.map((item) => (
                  <option
                    value={item.id}
                    key={item.id}
                  >
                    {item.name} — {item.role}
                  </option>
                ))}
              </select>
            </label>

            <label className="ys-field">
              <span>SAMPLE NAME OR ALIAS</span>

              <input
                type="text"
                placeholder="e.g. Demo Visitor"
                required
                minLength={2}
                maxLength={50}
                value={form.alias}
                onChange={(event) =>
                  update("alias", event.target.value)
                }
              />
            </label>

            <label className="ys-field">
              <span>PREFERRED DATE</span>

              <input
                type="date"
                min={dateAfter(1)}
                max={dateAfter(180)}
                required
                value={form.date}
                onChange={(event) =>
                  update("date", event.target.value)
                }
              />
            </label>

            {sunday ? (
              <div
                className="ys-field-notice"
                role="status"
              >
                Sundays are disabled in our demo
                schedule. Select another date.
              </div>
            ) : (
              <>
                <span className="ys-field-title">
                  AVAILABLE DEMO TIMES
                </span>

                <div
                  className="ys-time-slots"
                  role="group"
                  aria-label="Select appointment time"
                >
                  {TIME_SLOTS.map((time) => {
                    const taken = occupiedSlots.includes(time);

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={taken}
                        aria-pressed={form.time === time}
                        className={
                          form.time === time
                            ? "is-selected"
                            : ""
                        }
                        onClick={() =>
                          update("time", time)
                        }
                      >
                        {formatTime(time)}

                        {taken && <small>Taken</small>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {feedback && (
              <div
                className="ys-form-error"
                role="alert"
              >
                {feedback}
              </div>
            )}

            <button
              className="ys-button ys-submit"
              type="submit"
              disabled={sunday || slotTaken}
            >
              Save Demo Request
              <ArrowUpRight size={18} />
            </button>

            <p className="ys-disclaimer">
              Portfolio demonstration only.
              Use a fictional alias and do not
              enter medical information.
            </p>
          </form>

          <aside className="ys-booking-aside">
            <div className="ys-booking-summary">
              <span className="ys-eyebrow">
                YOUR VISIT AT A GLANCE
              </span>

              <h3>
                Your appointment <em>preview.</em>
              </h3>

              <div className="ys-summary-photo">
                <img
                  src={IMAGES.clinic}
                  alt="Illustrative dental clinic interior"
                  loading="lazy"
                />
              </div>

              <div className="ys-summary-rows">
                <div>
                  <Stethoscope size={18} />

                  <span>
                    <small>Treatment</small>
                    <strong>{treatment?.name}</strong>
                  </span>
                </div>

                <div>
                  <Users size={18} />

                  <span>
                    <small>Sample dentist</small>
                    <strong>{dentist?.name}</strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={18} />

                  <span>
                    <small>Preferred date</small>
                    <strong>
                      {formatDate(form.date)}
                    </strong>
                  </span>
                </div>

                <div>
                  <Clock3 size={18} />

                  <span>
                    <small>Preferred time</small>
                    <strong>
                      {formatTime(form.time)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="ys-summary-price">
                <span>
                  Illustrative rate from
                </span>

                <strong>
                  {formatPeso(treatment?.priceFrom)}
                </strong>
              </div>

              <p className="ys-summary-note">
                No actual clinic booking is made.
                This browser saves a demo record only.
              </p>
            </div>
          </aside>
        </div>

        {success && (
          <section
            className="ys-success"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={35} />

            <span className="ys-eyebrow">
              DEMO REQUEST SAVED
            </span>

            <h2>
              Your preview is <em>on the list.</em>
            </h2>

            <p>
              Sample reference:
              {" "}
              <strong>{success.id}</strong>
            </p>

            <Link
              to="/manage"
              className="ys-text-link"
            >
              Open Request Manager
              <ArrowRight size={17} />
            </Link>
          </section>
        )}

        <section className="ys-request-history">
          <div className="ys-section-heading">
            <div>
              <span className="ys-eyebrow">
                SAVED IN THIS BROWSER
              </span>

              <h2>
                Demo appointment <em>history.</em>
              </h2>
            </div>

            <Link
              className="ys-text-link"
              to="/manage"
            >
              Full Appointment Manager
              <ArrowRight size={17} />
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="ys-empty-state">
              <CalendarCheck2 size={31} />

              <h3>No demo requests yet.</h3>

              <p>
                Use the form above to create
                your first sample appointment.
              </p>
            </div>
          ) : (
            <div className="ys-request-grid">
              {[...requests].reverse().map(
                (request) => {
                  const service = TREATMENTS.find(
                    (item) =>
                      item.id === request.serviceId
                  );

                  return (
                    <article
                      className="ys-request-card"
                      key={request.id}
                    >
                      <div className="ys-request-top">
                        <span className="ys-eyebrow">
                          {request.id}
                        </span>

                        <span
                          className={`ys-request-status ${
                            request.status === "cancelled"
                              ? "is-cancelled"
                              : ""
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <h3>
                        {service?.name || "Dental visit"}
                      </h3>

                      <p>
                        {formatDate(request.date)}
                        {" · "}
                        {formatTime(request.time)}
                      </p>

                      <p>
                        Demo alias: {request.alias}
                      </p>

                      {request.status === "requested" && (
                        <button
                          type="button"
                          className="ys-cancel-btn"
                          onClick={() =>
                            onCancelRequest(request.id)
                          }
                        >
                          Cancel Demo Request
                          <X size={15} />
                        </button>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className="ys-container ys-section ys-not-found">
      <span className="ys-eyebrow">
        PAGE NOT FOUND
      </span>

      <h1>
        Let's find your <em>way back.</em>
      </h1>

      <p>
        This page isn't included in
        the YOUR SMILE concept.
      </p>

      <Link
        className="ys-button"
        to="/"
      >
        Return Home
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}

export default function App() {
  const location = useLocation();

  const isStaffRoute =
    location.pathname === "/staff" ||
    location.pathname.startsWith("/staff/");

  const [requests, setRequests] = useState(
    readRequests
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(requests)
      );
    } catch (error) {
      console.warn(
        "Demo appointment storage unavailable:",
        error
      );
    }
  }, [requests]);

  function createRequest(input) {
    const alias =
      typeof input.alias === "string"
        ? input.alias.trim()
        : "";

    if (alias.length < 2 || alias.length > 50) {
      return {
        ok: false,
        error:
          "Please enter a fictional alias between 2 and 50 characters.",
      };
    }

    const validTreatment = TREATMENTS.some(
      (item) => item.id === input.serviceId
    );

    const validDoctor = DENTISTS.some(
      (item) => item.id === input.doctorId
    );

    if (!validTreatment || !validDoctor) {
      return {
        ok: false,
        error:
          "Please select a valid treatment and dentist.",
      };
    }

    const date = new Date(
      `${input.date}T12:00:00`
    );

    const validDate =
      typeof input.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(input.date) &&
      !Number.isNaN(date.getTime()) &&
      localDateKey(date) === input.date &&
      input.date >= dateAfter(1) &&
      input.date <= dateAfter(180) &&
      date.getDay() !== 0;

    if (!validDate) {
      return {
        ok: false,
        error:
          "Select a valid Monday–Saturday date within the next 180 days.",
      };
    }

    if (!TIME_SLOTS.includes(input.time)) {
      return {
        ok: false,
        error:
          "Please select a valid appointment time.",
      };
    }

    const occupied = requests.some(
      (item) =>
        item.doctorId === input.doctorId &&
        item.date === input.date &&
        item.time === input.time &&
        item.status === "requested"
    );

    if (occupied) {
      return {
        ok: false,
        error:
          "That demo slot is already taken for the selected dentist. Choose another.",
      };
    }

    const id =
      "YSM-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase();

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

    if (
      !window.confirm(
        "Cancel this browser-local demo appointment request?"
      )
    ) {
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

  return (
    <div className="ys-app">
      <ScrollToTop />

      <a
        className="ys2-skip-link"
        href="#main-content"
      >
        Skip to main content
      </a>

      {!isStaffRoute && <Header />}

      <main id="main-content">
        <Routes>
          {/* BATCH 1 — ORIGINAL PAGES */}

          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="treatments"
            element={<TreatmentsPage />}
          />

          <Route
            path="dentists"
            element={<DentistsPage />}
          />

          <Route
            path="appointments"
            element={
              <AppointmentsPage
                requests={requests}
                onCreateRequest={createRequest}
                onCancelRequest={cancelRequest}
              />
            }
          />

          {/* BATCH 2 — NEW PAGES */}

          <Route
            path="treatments/:treatmentId"
            element={<TreatmentDetailsPage />}
          />

          <Route
            path="dentists/:dentistId"
            element={<DentistProfilePage />}
          />

          <Route
            path="calendar"
            element={
              <AppointmentCalendarPage
                requests={requests}
                onCreateRequest={createRequest}
              />
            }
          />

          <Route
            path="manage"
            element={
              <AppointmentManagementPage
                requests={requests}
                onCancelRequest={cancelRequest}
              />
            }
          />

          {/* UNKNOWN URL */}

          {/* BATCH 3 — CLINIC OPERATIONS STUDIO */}

<Route
  path="staff"
  element={
    <StaffLayout
      requests={requests}
      onCancelRequest={cancelRequest}
      onReplaceRequests={setRequests}
    />
  }
>
  <Route
    index
    element={<StaffDashboardPage />}
  />

  <Route
    path="appointments"
    element={<AppointmentDeskPage />}
  />

  <Route
    path="schedules"
    element={<DentistSchedulesPage />}
  />

  <Route
    path="treatments"
    element={<TreatmentManagementPage />}
  />

  {/* BATCH 4 — CLINIC INTELLIGENCE */}

<Route
  path="reports"
  element={<ReportsPage />}
/>

<Route
  path="insights"
  element={<TreatmentInsightsPage />}
/>

<Route
  path="settings"
  element={<ClinicSettingsPage />}
/>

<Route
  path="data"
  element={<DataCenterPage />}
/>
</Route>

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </main>

      {!isStaffRoute && <Footer />}
      {!isStaffRoute && <SiteEnhancements />}
    </div>
  );
}