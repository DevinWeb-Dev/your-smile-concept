import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  BRAND,
  DENTISTS,
  IMAGES,
} from "../data/clinicData.js";

import {
  dentistStory,
} from "../data/dentistEditorial.js";

import "../styles/smile-people-architectural.css";

const areas = [
  ["all", "ALL PERSPECTIVES"],
  ["everyday", "EVERYDAY CARE"],
  ["aesthetic", "AESTHETICS"],
  ["alignment", "ALIGNMENT"],
];

const areaMap = {
  everyday: "dr-reyes",
  aesthetic: "dr-cruz",
  alignment: "dr-santos",
};

function SmileLines() {
  return (
    <svg
      className="sp3-lines"
      viewBox="0 0 460 380"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="230"
        cy="190"
        r="150"
        stroke="currentColor"
        strokeOpacity=".42"
      />

      <circle
        cx="230"
        cy="190"
        r="113"
        stroke="currentColor"
        strokeDasharray="3 10"
        strokeOpacity=".6"
      />

      <path
        d="M125 154 Q230 280 335 154"
        stroke="currentColor"
        strokeWidth="2.4"
        className="sp3-draw"
      />

      <circle cx="125" cy="154" r="5" fill="currentColor" />
      <circle cx="335" cy="154" r="5" fill="currentColor" />

      <path
        d="M230 18v32M230 330v32M52 190h32M376 190h32"
        stroke="currentColor"
        opacity=".5"
      />

      <text
        x="230"
        y="91"
        textAnchor="middle"
        fill="currentColor"
        fontSize="11"
        letterSpacing="4"
      >
        YOUR SMILE.
      </text>
    </svg>
  );
}

export default function DentistCollectionPage() {
  const [area, setArea] = useState("all");
  const [query, setQuery] = useState("");

  const people = useMemo(
    () =>
      DENTISTS.filter(
        (dentist) =>
          (area === "all" ||
            areaMap[area] === dentist.id) &&
          `${
            dentist.name
          } ${
            dentist.role
          } ${
            dentist.specialty
          } ${
            dentistStory(dentist.id).focus.join(" ")
          }`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
      ),
    [area, query]
  );

  return (
    <div className="sp3 sp3-people">
      {/* EDITORIAL HERO */}

      <section className="sp3-people-hero">
        <div className="sp3-people-hero__copy">
          <div className="sp3-overline">
            THE PEOPLE JOURNAL
            <span>VOL. 03 / 2026</span>
          </div>

          <h1>
            Behind every smile,{" "}
            <em>a conversation.</em>
          </h1>

          <p>
            A thoughtfully imagined introduction to the
            people behind a dental practice. Three
            fictional perspectives, one common idea:
            clarity matters.
          </p>

          <a
            href="#sp3-people-index"
            className="sp3-underline"
          >
            MEET THE CONCEPT TEAM
            <ArrowDownRight size={18} />
          </a>

          <span className="sp3-people-hero__foot">
            ILLUSTRATIVE PEOPLE · NOT VERIFIED
            PRACTITIONERS
          </span>
        </div>

        <div className="sp3-people-hero__art">
          <img
            src={IMAGES.clinic}
            alt="Illustrative light-filled modern dental clinic"
          />

          <SmileLines />

          <span>
            THE HUMAN SIDE OF CARE / 001
          </span>
        </div>
      </section>

      {/* INTRODUCTION */}

      <section
        className="sp3-people-intro sp3-container"
        id="sp3-people-index"
      >
        <div>
          <span className="sp3-overline">
            01 / THE PEOPLE INDEX
          </span>

          <h2>
            More than a <em>job title.</em>
          </h2>
        </div>

        <p>
          Explore a fictional care philosophy,
          conversation topics and example appointment
          interests. These profiles do not establish
          professional qualifications.
        </p>
      </section>

      {/* SEARCH AND FILTERS */}

      <section
        className="sp3-container sp3-people-filters"
        aria-label="Dentist profile discovery"
      >
        <div className="sp3-people-filterbar">
          <div
            role="group"
            aria-label="Filter by area of interest"
          >
            {areas.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={area === id}
                className={
                  area === id ? "is-on" : ""
                }
                onClick={() => setArea(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="sp3-person-search">
            <Search size={17} />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search profiles and interests"
              aria-label="Search fictional dentists"
            />
          </label>
        </div>

        <div className="sp3-result-counter">
          {String(people.length).padStart(2, "0")}{" "}
          PROFILES / FICTIONAL DEMONSTRATION
        </div>

        {/* ARCHITECTURAL PORTRAIT COLLECTION */}

        <div className="sp3-people-grid">
          {people.map((person, index) => {
            const story = dentistStory(person.id);

            return (
              <article
                key={person.id}
                className={`sp3-person sp3-tone-${story.color}`}
              >
                <div className="sp3-person__photo">
                  <Link
                    to={`/dentists/${person.id}`}
                    aria-label={`View ${person.name} sample profile`}
                  >
                    <img
                      src={person.image}
                      alt={`Illustrative portrait for fictional ${person.name}`}
                      loading="lazy"
                    />
                  </Link>

                  <span>
                    CONCEPT PROFILE / {story.number}
                  </span>

                  <div
                    className="sp3-person__ring"
                    aria-hidden="true"
                  />
                </div>

                <div className="sp3-person__content">
                  <div className="sp3-person__meta">
                    <span>{story.chapter}</span>
                    <b>
                      0{index + 1} / 03
                    </b>
                  </div>

                  <h3>{person.name}</h3>

                  <p className="sp3-person__role">
                    {person.role} · {person.specialty}
                  </p>

                  <p>{story.statement}</p>

                  <div className="sp3-person__topics">
                    {story.focus
                      .slice(0, 2)
                      .map((topic) => (
                        <span key={topic}>
                          {topic}
                        </span>
                      ))}
                  </div>

                  <div className="sp3-person__links">
                    <Link
                      to={`/dentists/${person.id}`}
                    >
                      READ THE PROFILE
                      <ArrowUpRight size={16} />
                    </Link>

                    <Link
                      to={`/calendar?doctor=${person.id}`}
                    >
                      DEMO CALENDAR
                      <CalendarDays size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!people.length && (
          <div className="sp3-empty">
            <Users size={31} />

            <h3>No profiles in this view.</h3>

            <button
              type="button"
              onClick={() => {
                setArea("all");
                setQuery("");
              }}
            >
              SHOW ALL PROFILES
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* CARE PHILOSOPHY */}

      <section className="sp3-person-philosophy">
        <div>
          <span className="sp3-overline">
            02 / A PERSON-CENTERED APPROACH
          </span>

          <h2>
            Care that gives{" "}
            <em>questions space.</em>
          </h2>

          <p>
            Thoughtfully presented practitioners help
            visitors understand why professional
            assessment matters more than choosing a
            procedure from a menu.
          </p>

          <Link to="/treatments">
            EXPLORE THE CARE LIBRARY
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="sp3-person-philosophy__lines">
          <SmileLines />

          <div>
            <Check size={18} />
            ASSESS BEFORE SUGGESTING
          </div>

          <div>
            <Check size={18} />
            EXPLAIN LIMITATIONS CLEARLY
          </div>

          <div>
            <Check size={18} />
            INVITE INFORMED QUESTIONS
          </div>
        </div>
      </section>

      {/* CLOSING FOLIO */}

      <section className="sp3-people-bottom sp3-container">
        <div>
          <span className="sp3-overline">
            03 / AN INVITATION TO EXPLORE
          </span>

          <h2>
            Time to <em>begin.</em>
          </h2>

          <p>
            Choose a fictional practitioner and
            explore a browser-only scheduling preview.
            No real appointments or verified
            availability.
          </p>

          <Link to="/calendar">
            EXPLORE DEMO SCHEDULING
            <ChevronRight size={17} />
          </Link>
        </div>

        <img
          src={IMAGES.treatment}
          alt="Illustrative dental care workspace"
          loading="lazy"
        />
      </section>

      <p className="sp3-site-disclosure sp3-container">
        <ShieldCheck size={17} />

        All three practitioner names, roles,
        biographies and portraits are illustrative
        only. {BRAND.developer}
      </p>
    </div>
  );
}