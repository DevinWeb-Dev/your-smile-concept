import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Plus,
  ShieldCheck,
  Smile,
  Sparkles,
} from "lucide-react";

import {
  BRAND,
  IMAGES,
  TREATMENTS,
  DENTISTS,
  FAQS,
  formatPeso,
} from "../data/clinicData.js";

import "../styles/smile-atelier.css";

const chapters = [
  {
    num: "01",
    heading: "Explore",
    sub: "Understand your options",
    note: "Browse illustrated procedures, indicative rates and consultation time.",
  },
  {
    num: "02",
    heading: "Connect",
    sub: "Choose a concept provider",
    note: "See clearly labeled sample professional profiles and treatment interests.",
  },
  {
    num: "03",
    heading: "Consider",
    sub: "Find your preferred moment",
    note: "View browser-local demo time slots and explore scheduling possibilities.",
  },
  {
    num: "04",
    heading: "Begin",
    sub: "Save a sample request",
    note: "Create a fictional appointment request without sharing real patient information.",
  },
];

function InView({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      element.classList.add("is-shown");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.classList.add("is-shown");
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`sa1-reveal ${className}`}
      style={{ "--sa1-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function SmileGeometry({ className = "" }) {
  return (
    <svg
      className={`sa1-geometry ${className}`}
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="210"
        cy="210"
        r="165"
        stroke="currentColor"
        strokeOpacity=".4"
        strokeWidth=".8"
      />

      <circle
        cx="210"
        cy="210"
        r="130"
        stroke="currentColor"
        strokeOpacity=".45"
        strokeWidth=".8"
        strokeDasharray="2 9"
      />

      <circle
        cx="210"
        cy="210"
        r="92"
        stroke="currentColor"
        strokeOpacity=".38"
      />

      <path
        d="M100 180Q210 292 320 180"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="sa1-smile-path"
      />

      <circle cx="100" cy="180" r="5" fill="currentColor" />
      <circle cx="320" cy="180" r="5" fill="currentColor" />

      <path
        d="M210 22v44M210 354v44M22 210h44M354 210h44"
        stroke="currentColor"
        strokeOpacity=".4"
      />

      <text
        x="210"
        y="102"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="3"
        fill="currentColor"
      >
        THE SMILE STANDARD
      </text>

      <text
        x="210"
        y="347"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="3"
        fill="currentColor"
      >
        CONCEPT / 2026
      </text>
    </svg>
  );
}

function SectionMarker({ no, label }) {
  return (
    <span className="sa1-marker">
      <b>{no}</b>
      <i />
      {label}
    </span>
  );
}

export default function SmileAtelierHome() {
  const [active, setActive] = useState(TREATMENTS[0].id);

  const [appointmentService, setAppointmentService] =
    useState(TREATMENTS[0].id);

  const [appointmentDentist, setAppointmentDentist] =
    useState(DENTISTS[0].id);

  const featured =
    TREATMENTS.find((item) => item.id === active) ||
    TREATMENTS[0];

  const calendarQuery = new URLSearchParams({
    service: appointmentService,
    doctor: appointmentDentist,
  }).toString();

  useEffect(() => {
    document.documentElement.classList.add("sa1-theme");

    return () =>
      document.documentElement.classList.remove(
        "sa1-theme"
      );
  }, []);

  return (
    <div className="sa1-home">
      {/* 01 — IMMERSIVE EDITORIAL HERO */}

      <section
        className="sa1-hero"
        aria-labelledby="sa1-hero-title"
      >
        <div className="sa1-hero-copy">
          <div className="sa1-top-rule">
            <span>
              YOUR SMILE. / A PRACTICE IN FEELING GOOD
            </span>

            <span>01 — THE ARRIVAL</span>
          </div>

          <div className="sa1-hero-content">
            <p className="sa1-overline">
              <span className="sa1-sun" />
              NOT JUST DENTAL CARE. A BETTER EXPERIENCE.
            </p>

            <h1 id="sa1-hero-title">
              Come as
              <br />
              you <em>are.</em>
              <span>Leave a little brighter.</span>
            </h1>

            <p className="sa1-hero-lede">
              Care feels different when the details feel
              right. Discover a calmer, clearer way to
              explore dentistry—built around people,
              not procedures.
            </p>

            <div className="sa1-hero-actions">
              <Link
                to="/calendar"
                className="sa1-btn sa1-btn-ink"
              >
                EXPLORE THE APPOINTMENT CALENDAR
                <ArrowUpRight size={18} />
              </Link>

              <a
                href="#sa1-treatment-lab"
                className="sa1-text-cta"
              >
                DISCOVER TREATMENTS
                <ArrowDown size={18} />
              </a>
            </div>
          </div>

          <div className="sa1-hero-foot">
            <span>
              <i />
              THOUGHTFUL BY DESIGN
            </span>

            <span>
              DEMO CLINIC EXPERIENCE — NOT A REAL
              PROVIDER
            </span>
          </div>
        </div>

        <div className="sa1-hero-photo">
          <img
            src={IMAGES.clinic}
            alt="Illustrative modern dental clinic interior"
            fetchPriority="high"
          />

          <div className="sa1-hero-photo-wash" />

          <SmileGeometry className="sa1-hero-geometry" />

          <span className="sa1-hero-vertical">
            ARCHITECTURE OF COMFORT / STUDY 001
          </span>

          <div className="sa1-hero-photo-caption">
            <span>THE SPACE / REIMAGINED</span>

            <strong>
              01 <i>/</i> 06
            </strong>
          </div>
        </div>
      </section>

      {/* 02 — CARE SIGNATURES */}

      <div
        className="sa1-signatures"
        aria-label="Website concept features"
      >
        <div>
          <Smile size={23} />
          <span>
            <strong>People before procedures</strong>
            <small>
              Thoughtful, readable information
            </small>
          </span>
        </div>

        <div>
          <ShieldCheck size={23} />
          <span>
            <strong>Clear, careful choices</strong>
            <small>
              Consultation-led service previews
            </small>
          </span>
        </div>

        <div>
          <CalendarDays size={23} />
          <span>
            <strong>A simpler first step</strong>
            <small>
              Browser-only appointment simulation
            </small>
          </span>
        </div>

        <p>
          THE SMILE STANDARD / EDITION NO. 01
        </p>
      </div>

      {/* 03 — INTERACTIVE TREATMENT LAB */}

      <section
        className="sa1-care-section sa1-container"
        id="sa1-treatment-lab"
      >
        <InView className="sa1-editorial-heading">
          <div>
            <SectionMarker
              no="02"
              label="THE CARE LIBRARY"
            />

            <h2>
              Good things start
              <br />
              with <em>understanding.</em>
            </h2>
          </div>

          <p>
            Not a one-size-fits-all smile. Explore an
            illustrated collection of care pathways
            and the questions worth asking before
            you start.
          </p>
        </InView>

        <div className="sa1-care-explorer">
          <nav
            className="sa1-care-tabs"
            aria-label="Explore treatment categories"
          >
            {TREATMENTS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={active === item.id}
                className={
                  active === item.id ? "is-active" : ""
                }
                onClick={() => setActive(item.id)}
              >
                <small>
                  {String(index + 1).padStart(2, "0")}
                </small>

                <span>{item.name}</span>
                <ArrowUpRight size={19} />
              </button>
            ))}
          </nav>

          <div
            className="sa1-care-spotlight"
            key={featured.id}
            aria-live="polite"
          >
            <div className="sa1-care-spotlight-image">
              <img
                src={featured.image}
                alt={`Illustrative visual for ${featured.name}`}
                loading="lazy"
              />

              <span>
                CARE STUDY / {featured.number} OF 06
              </span>
            </div>

            <div className="sa1-care-spotlight-description">
              <div className="sa1-spotlight-top">
                <span>
                  {featured.category.toUpperCase()}
                </span>

                <Sparkles size={20} />
              </div>

              <h3>{featured.name}</h3>
              <p>{featured.description}</p>

              <div className="sa1-care-meta">
                <span>
                  <Clock3 size={16} />
                  {featured.duration} MINUTE PREVIEW
                </span>

                <span>
                  ILLUSTRATIVE FROM{" "}
                  <b>{formatPeso(featured.priceFrom)}</b>
                </span>
              </div>

              <Link
                to={`/treatments/${featured.id}`}
                className="sa1-arrow-action"
              >
                READ THE TREATMENT JOURNAL
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <Link
          to="/treatments"
          className="sa1-all-care"
        >
          EXPLORE ALL SIX TREATMENT JOURNALS
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* 04 — SPACE, LIGHT & PRACTICE PHILOSOPHY */}

      <section className="sa1-architecture">
        <div className="sa1-architecture-image">
          <img
            src={IMAGES.hero}
            alt="Illustrative dental environment and care equipment"
            loading="lazy"
          />

          <span>
            FIELD STUDY — 002 / A CALMER KIND OF CARE
          </span>
        </div>

        <div className="sa1-architecture-copy">
          <InView>
            <SectionMarker
              no="03"
              label="THE PHILOSOPHY"
            />

            <h2>
              Less rush.
              <br />
              More <em>room to breathe.</em>
            </h2>

            <p>
              Thoughtful design makes space for the
              things that matter: asking questions,
              understanding options, and feeling
              prepared for what comes next.
            </p>
          </InView>

          <div className="sa1-principles">
            <div>
              <span>01</span>
              <strong>Feel informed.</strong>
              <small>
                Clear descriptions and illustrative prices.
              </small>
            </div>

            <div>
              <span>02</span>
              <strong>Feel included.</strong>
              <small>
                A care conversation, not a sales pitch.
              </small>
            </div>

            <div>
              <span>03</span>
              <strong>Feel at ease.</strong>
              <small>
                A calm journey from discovery to inquiry.
              </small>
            </div>
          </div>

          <SmileGeometry className="sa1-architecture-glyph" />
        </div>
      </section>

      {/* 05 — EXPERIENCE PATHWAY */}

      <section className="sa1-pathway sa1-container">
        <InView className="sa1-pathway-head">
          <SectionMarker
            no="04"
            label="A BETTER WAY TO BEGIN"
          />

          <h2>
            A first step,
            <br />
            <em>at your pace.</em>
          </h2>

          <p>
            Four carefully considered stages in
            this demo experience. Clinical decisions
            and real bookings would always require
            a licensed practice.
          </p>
        </InView>

        <div className="sa1-pathway-grid">
          {chapters.map((item, index) => (
            <InView
              as="article"
              className="sa1-pathway-item"
              delay={index * 85}
              key={item.num}
            >
              <span className="sa1-pathway-index">
                {item.num}
                <i />
              </span>

              <h3>{item.heading}</h3>
              <strong>{item.sub}</strong>
              <p>{item.note}</p>
              <ChevronRight size={22} />
            </InView>
          ))}
        </div>
      </section>

      {/* 06 — CONCEPT CLINICAL TEAM */}

      <section className="sa1-team">
        <div className="sa1-container">
          <InView className="sa1-team-head">
            <div>
              <SectionMarker
                no="05"
                label="THE PEOPLE STUDY"
              />

              <h2>
                Care should
                <br />
                feel <em>human.</em>
              </h2>
            </div>

            <p>
              Explore fictional dentist profiles
              that demonstrate how credentials,
              service interests and approach might
              be presented on a real clinic website.
            </p>
          </InView>

          <div className="sa1-team-grid">
            {DENTISTS.map((dentist, index) => (
              <InView
                as="article"
                className={`sa1-person sa1-person-${index}`}
                delay={index * 90}
                key={dentist.id}
              >
                <Link
                  to={`/dentists/${dentist.id}`}
                  className="sa1-person-photo"
                  aria-label={`Explore sample profile of ${dentist.name}`}
                >
                  <img
                    src={dentist.image}
                    alt={`Illustrative portrait for ${dentist.name}`}
                    loading="lazy"
                  />

                  <span>
                    FICTIONAL PROFILE /{" "}
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className="sa1-person-bottom">
                  <div>
                    <small>{dentist.role}</small>
                    <h3>{dentist.name}</h3>
                  </div>

                  <Link
                    to={`/dentists/${dentist.id}`}
                    aria-label={`Read sample profile of ${dentist.name}`}
                  >
                    <ArrowUpRight size={21} />
                  </Link>
                </div>
              </InView>
            ))}
          </div>

          <p className="sa1-team-disclaimer">
            <ShieldCheck size={15} />
            Fictional names and illustrative portraits.
            Actual practitioner credentials and photographs
            must be independently verified before publication.
          </p>
        </div>
      </section>

      {/* 07 — DEMO APPOINTMENT ATELIER */}

      <section
        className="sa1-appointment"
        id="sa1-appointment"
      >
        <div className="sa1-appointment-copy">
          <SectionMarker
            no="06"
            label="THE FIRST CONVERSATION"
          />

          <h2>
            Make room for
            <br />
            <em>a better smile.</em>
          </h2>

          <p>
            Choose what you’d like to explore.
            The calendar opens with your selections—
            ready for a fictional appointment request
            in this browser.
          </p>

          <div className="sa1-book-graphic">
            <SmileGeometry />
            <span>
              THE ART OF
              <br />
              FEELING AT EASE
            </span>
          </div>
        </div>

        <div className="sa1-appointment-form">
          <div className="sa1-appointment-heading">
            <span>
              THE APPOINTMENT ATELIER / 01
            </span>

            <CalendarDays size={23} />
          </div>

          <h3>
            Start with
            <br />
            <em>what matters.</em>
          </h3>

          <label>
            01 / TREATMENT INTEREST
            <select
              value={appointmentService}
              onChange={(e) =>
                setAppointmentService(e.target.value)
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

          <label>
            02 / SAMPLE PROVIDER
            <select
              value={appointmentDentist}
              onChange={(e) =>
                setAppointmentDentist(e.target.value)
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

          <Link
            to={`/calendar?${calendarQuery}`}
            className="sa1-btn sa1-btn-ink"
          >
            CONTINUE TO DEMO CALENDAR
            <ArrowUpRight size={18} />
          </Link>

          <p>
            <ShieldCheck size={15} />
            No real availability is checked here.
            No real appointment is confirmed, and
            please do not enter patient medical
            information.
          </p>
        </div>
      </section>

      {/* 08 — FAQ */}

      <section className="sa1-faq sa1-container">
        <InView className="sa1-faq-intro">
          <SectionMarker
            no="07"
            label="GOOD TO KNOW"
          />

          <h2>
            A little clarity
            <br />
            goes <em>a long way.</em>
          </h2>

          <p>
            The essentials about treatments,
            scheduling, and this portfolio concept.
          </p>

          <Link
            to="/appointments"
            className="sa1-text-cta"
          >
            ABOUT APPOINTMENT REQUESTS
            <ArrowUpRight size={17} />
          </Link>
        </InView>

        <div className="sa1-faq-items">
          {FAQS.slice(0, 5).map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{item.question}</strong>
                <Plus size={19} />
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL EDITORIAL FOLIO */}

      <section className="sa1-outro">
        <div>
          <span>
            THE SMILE ATELIER / A DIGITAL PRACTICE
            IN CARE
          </span>

          <h2>
            Here's to
            <br />
            <em>what's next.</em>
          </h2>

          <Link to="/calendar">
            EXPLORE DEMO SCHEDULING
            <ArrowUpRight size={18} />
          </Link>

          <p>{BRAND.developer}</p>
        </div>

        <div className="sa1-outro-image">
          <img
            src={IMAGES.treatment}
            alt="Illustrative contemporary dental care"
            loading="lazy"
          />

          <span>
            YOUR SMILE. / CONCEPT 2026
          </span>
        </div>
      </section>
    </div>
  );
}