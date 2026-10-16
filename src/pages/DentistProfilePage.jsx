import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  ShieldCheck,
} from "lucide-react";

import {
  BRAND,
  DENTISTS,
  IMAGES,
  TREATMENTS,
} from "../data/clinicData.js";

import {
  dentistStory,
} from "../data/dentistEditorial.js";

import "../styles/smile-people-architectural.css";

function ProfileArc() {
  return (
    <svg
      viewBox="0 0 330 330"
      className="sp3-profile-arc"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="165"
        cy="165"
        r="142"
        stroke="currentColor"
        opacity=".5"
      />

      <circle
        cx="165"
        cy="165"
        r="106"
        stroke="currentColor"
        strokeDasharray="3 9"
        opacity=".45"
      />

      <path
        d="M65 135 Q165 262 265 135"
        stroke="currentColor"
        strokeWidth="2.5"
        className="sp3-draw"
      />

      <circle cx="65" cy="135" r="4" fill="currentColor" />
      <circle cx="265" cy="135" r="4" fill="currentColor" />
    </svg>
  );
}

export default function DentistProfilePage() {
  const { dentistId } = useParams();

  const [serviceId, setServiceId] = useState(
    "consultation"
  );

  const [copyState, setCopyState] = useState("");

  const person = DENTISTS.find(
    (item) => item.id === dentistId
  );

  const story = person
    ? dentistStory(person.id)
    : null;

  const services = story
    ? TREATMENTS.filter((item) =>
        story.serviceIds.includes(item.id)
      )
    : [];

  useEffect(() => {
    document.title = `${
      person?.name || "Dentist Profile"
    } | YOUR SMILE.`;

    return () => {
      document.title = "YOUR SMILE.";
    };
  }, [person]);

  if (!person) {
    return (
      <div className="sp3 sp3-profile-missing">
        <span className="sp3-overline">
          THE PEOPLE ATLAS
        </span>

        <h1>
          Page <em>not found.</em>
        </h1>

        <Link to="/dentists">
          <ArrowLeft size={18} />
          RETURN TO THE TEAM
        </Link>
      </div>
    );
  }

  const effectiveService = services.some(
    (item) => item.id === serviceId
  )
    ? serviceId
    : services[0]?.id || "consultation";

  const calendarQuery = new URLSearchParams({
    doctor: person.id,
    service: effectiveService,
  }).toString();

  const next =
    DENTISTS[
      (DENTISTS.findIndex(
        (item) => item.id === person.id
      ) +
        1) %
        DENTISTS.length
    ];

  async function copyQuestions() {
    try {
      await navigator.clipboard.writeText(
        story.questions
          .map(
            (question, index) =>
              `${index + 1}. ${question}`
          )
          .join("\n")
      );

      setCopyState("Questions copied");
    } catch {
      setCopyState(
        "Clipboard unavailable — select and copy the questions above."
      );
    }
  }

  return (
    <div
      className={`sp3 sp3-profile sp3-tone-${story.color}`}
    >
      {/* BREADCRUMB */}

      <div className="sp3-container sp3-crumb">
        <Link to="/dentists">
          <ArrowLeft size={15} />
          PEOPLE JOURNAL
        </Link>

        <span>
          PROFILE / {story.number} OF 03
        </span>
      </div>

      {/* EDITORIAL PORTRAIT HERO */}

      <section className="sp3-profile-hero">
        <div className="sp3-profile-hero__photo">
          <img
            src={person.image}
            alt={`Illustrative portrait representing ${person.name}; fictional professional`}
          />

          <ProfileArc />

          <span>
            FICTIONAL PROFESSIONAL PROFILE /{" "}
            {story.number}
          </span>
        </div>

        <div className="sp3-profile-hero__copy">
          <span className="sp3-overline">
            {story.chapter} / YOUR SMILE.
          </span>

          <h1>
            {person.name}
            <i>.</i>
          </h1>

          <span className="sp3-profile-hero__role">
            {person.role} <b>·</b> {person.specialty}
          </span>

          <p>{story.statement}</p>

          <div className="sp3-profile-hero__links">
            <a href="#sp3-philosophy">
              EXPLORE THE PHILOSOPHY
              <ArrowRight size={18} />
            </a>

            <Link
              to={`/calendar?doctor=${person.id}`}
            >
              SAMPLE SCHEDULE
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="sp3-profile-hero__alert">
            <ShieldCheck size={17} />

            Fictional name, biography and
            illustrative portrait. Not a licensed
            dentist profile or statement of verified
            credentials.
          </div>
        </div>
      </section>

      {/* CARE PHILOSOPHY */}

      <div className="sp3-profile-ribbon sp3-container">
        <span>01 / PERSON-CENTERED CARE</span>
        <span>02 / INFORMED DISCUSSIONS</span>
        <span>03 / FICTIONAL PROVIDER</span>
      </div>

      <div
        className="sp3-container sp3-profile-columns"
        id="sp3-philosophy"
      >
        <div className="sp3-profile-content">
          <section className="sp3-profile-story">
            <span className="sp3-overline">
              01 / THE PERSONAL PHILOSOPHY
            </span>

            <h2>
              {story.heading}{" "}
              <em>{story.italic}</em>
            </h2>

            <p className="sp3-profile-story__lead">
              {story.philosophy}
            </p>

            <blockquote>
              “{story.quote}”
            </blockquote>
          </section>

          {/* UNIQUE JOURNEY */}

          <section className="sp3-profile-path">
            <span className="sp3-overline">
              02 / CARE CONVERSATIONS
            </span>

            <h2>
              Thoughtfulness{" "}
              <em>in practice.</em>
            </h2>

            <div>
              {story.journey.map(
                (step, index) => (
                  <article key={step[0]}>
                    <span>
                      0{index + 1}
                    </span>

                    <div>
                      <h3>{step[0]}</h3>
                      <p>{step[1]}</p>
                    </div>

                    <ChevronRight size={18} />
                  </article>
                )
              )}
            </div>
          </section>

          {/* SPECIALTY INTERESTS */}

          <section className="sp3-profile-interests">
            <span className="sp3-overline">
              03 / AREAS OF CONVERSATION
            </span>

            <h2>
              Room to <em>explore.</em>
            </h2>

            <div>
              {story.focus.map(
                (item, index) => (
                  <div key={item}>
                    <span>
                      0{index + 1}
                    </span>

                    <strong>{item}</strong>

                    <Check size={17} />
                  </div>
                )
              )}
            </div>
          </section>

          {/* QUESTION NOTEBOOK */}

          <section className="sp3-profile-questions">
            <div>
              <span className="sp3-overline">
                04 / PREPARE FOR A REAL CONVERSATION
              </span>

              <h2>
                Bring the <em>questions.</em>
              </h2>

              <p>
                These are generic prompts for
                discussion with a qualified
                practitioner—not an assessment
                or recommendation.
              </p>
            </div>

            {story.questions.map(
              (question, index) => (
                <p key={question}>
                  <span>
                    0{index + 1}
                  </span>

                  {question}
                </p>
              )
            )}

            <button
              type="button"
              onClick={copyQuestions}
            >
              <Copy size={16} />
              COPY QUESTIONS
            </button>

            {copyState && (
              <span
                role="status"
                className="sp3-copy-status"
              >
                {copyState}
              </span>
            )}
          </section>

          {/* RELATED TREATMENTS */}

          <section className="sp3-profile-related">
            <span className="sp3-overline">
              05 / EXPLORE THE CARE LIBRARY
            </span>

            <h2>
              Topics worth{" "}
              <em>understanding.</em>
            </h2>

            <div>
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/treatments/${service.id}`}
                >
                  <img
                    src={service.image}
                    alt=""
                    loading="lazy"
                  />

                  <span>
                    <small>
                      {service.category.toUpperCase()}
                    </small>

                    <strong>
                      {service.name}
                    </strong>
                  </span>

                  <ArrowUpRight size={19} />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* STICKY CONSULTATION PLANNER */}

        <aside className="sp3-profile-planner">
          <div className="sp3-profile-planner__art">
            <img
              src={IMAGES.clinic}
              alt="Illustrative clinic architecture"
            />

            <span>
              THE APPOINTMENT STUDY
            </span>
          </div>

          <div className="sp3-profile-planner__content">
            <span className="sp3-overline">
              CONSIDER YOUR NEXT STEP
            </span>

            <h2>
              A time to <em>talk.</em>
            </h2>

            <p>
              Explore the local demo calendar
              with this fictional provider and
              your selected area of interest.
            </p>

            <label htmlFor="sp3-profile-service">
              TREATMENT INTEREST
            </label>

            <select
              id="sp3-profile-service"
              value={effectiveService}
              onChange={(event) =>
                setServiceId(event.target.value)
              }
            >
              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.name}
                </option>
              ))}
            </select>

            <div className="sp3-profile-planner__doctor">
              <img
                src={person.image}
                alt=""
              />

              <span>
                <b>{person.name}</b>

                <small>
                  SAMPLE PROVIDER / UNVERIFIED
                </small>
              </span>
            </div>

            <Link to={`/calendar?${calendarQuery}`}>
              OPEN DEMO CALENDAR
              <CalendarDays size={18} />
            </Link>

            <p className="sp3-profile-planner__fine">
              <ShieldCheck size={16} />

              Browser-local requests only.
              No verified availability,
              medical advice, confirmation
              or payment.
            </p>
          </div>
        </aside>
      </div>

      {/* NEXT PROFILE */}

      <section className="sp3-profile-next">
        <div>
          <span className="sp3-overline">
            CONTINUE THE PEOPLE JOURNAL
          </span>

          <h2>
            Another <em>perspective.</em>
          </h2>

          <Link to={`/dentists/${next.id}`}>
            {next.name}
            <ArrowUpRight size={18} />
          </Link>

          <small>{BRAND.developer}</small>
        </div>

        <img
          src={next.image}
          alt={`Illustrative fictional profile for ${next.name}`}
          loading="lazy"
        />
      </section>
    </div>
  );
}