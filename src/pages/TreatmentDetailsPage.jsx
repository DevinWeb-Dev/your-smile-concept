import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  BRAND,
  DENTISTS,
  IMAGES,
  TREATMENTS,
  formatPeso,
} from "../data/clinicData.js";

import {
  getTreatmentEditorial,
} from "../data/treatmentEditorial.js";

import "../styles/smile-treatments-architectural.css";

/* ===============================================
   ABSTRACT CLINICAL GEOMETRY
=============================================== */

function CareOrbit() {
  return (
    <svg
      viewBox="0 0 450 450"
      fill="none"
      className="st2-care-orbit"
      aria-hidden="true"
    >
      <circle
        cx="225"
        cy="225"
        r="174"
        stroke="currentColor"
        strokeOpacity=".55"
      />

      <circle
        cx="225"
        cy="225"
        r="132"
        stroke="currentColor"
        strokeOpacity=".6"
        strokeDasharray="3 10"
      />

      <circle
        cx="225"
        cy="225"
        r="85"
        stroke="currentColor"
        strokeOpacity=".35"
      />

      <path
        d="M97 197Q225 348 353 197"
        stroke="currentColor"
        strokeWidth="2"
        className="st2-orbit-smile"
      />

      <path
        d="M225 20v60M225 371v60M20 225h60M371 225h60"
        stroke="currentColor"
        strokeOpacity=".4"
      />

      <circle
        cx="97"
        cy="197"
        r="5"
        fill="currentColor"
      />

      <circle
        cx="353"
        cy="197"
        r="5"
        fill="currentColor"
      />

      <text
        fill="currentColor"
        fontSize="12"
        textAnchor="middle"
        letterSpacing="4"
        x="225"
        y="120"
      >
        Y / S · 02
      </text>

      <text
        fill="currentColor"
        fontSize="10"
        textAnchor="middle"
        letterSpacing="3"
        x="225"
        y="372"
      >
        CARE / IN CONTEXT
      </text>
    </svg>
  );
}

/* ===============================================
   INDIVIDUAL TREATMENT JOURNAL
=============================================== */

export default function TreatmentDetailsPage() {
  const { treatmentId } = useParams();

  const [dentistId, setDentistId] = useState(
    DENTISTS[0]?.id || ""
  );

  const [copyFeedback, setCopyFeedback] = useState({
    id: "",
    text: "",
  });

  const treatment = TREATMENTS.find(
    (item) => item.id === treatmentId
  );

  const editorial = treatment
    ? getTreatmentEditorial(treatment.id)
    : null;

  const related = treatment
    ? TREATMENTS.filter(
        (item) => item.id !== treatment.id
      )
        .sort(
          (a, b) =>
            Number(
              b.category === treatment.category
            ) -
            Number(
              a.category === treatment.category
            )
        )
        .slice(0, 2)
    : [];

  const dentist =
    DENTISTS.find(
      (person) => person.id === dentistId
    ) || DENTISTS[0];

  useEffect(() => {
    document.title = treatment
      ? `${treatment.name} | YOUR SMILE.`
      : "Care Journal | YOUR SMILE.";

    return () => {
      document.title = "YOUR SMILE.";
    };
  }, [treatment]);

  if (!treatment) {
    return (
      <div className="st2 st2-missing">
        <span className="st2-eyebrow">
          THE CARE INDEX / MISSING STUDY
        </span>

        <h1>
          This chapter is <em>elsewhere.</em>
        </h1>

        <p>
          That treatment is not part of
          the current concept collection.
        </p>

        <Link to="/treatments">
          BACK TO THE TREATMENT INDEX
          <ArrowLeft size={18} />
        </Link>
      </div>
    );
  }

  const calendarLink = `/calendar?${new URLSearchParams({
    service: treatment.id,
    doctor: dentist?.id || "",
  })}`;

  async function copyQuestions() {
    try {
      await navigator.clipboard.writeText(
        [
          treatment.name,
          ...editorial.questions.map(
            (question, index) =>
              `${index + 1}. ${question}`
          ),
        ].join("\n")
      );

      setCopyFeedback({
        id: treatmentId,
        text: "QUESTIONS COPIED",
      });
    } catch {
      setCopyFeedback({
        id: treatmentId,
        text: "COPY UNAVAILABLE IN THIS BROWSER",
      });
    }
  }

  return (
    <div
      className={`st2 st2-detail st2-theme-${editorial.theme}`}
    >
      {/* BREADCRUMB */}

      <div className="st2-breadcrumb st2-wrap">
        <Link to="/treatments">
          <ArrowLeft size={16} />
          THE TREATMENT INDEX
        </Link>

        <span>
          YOUR SMILE / CARE JOURNAL{" "}
          {treatment.number} OF 06
        </span>
      </div>

      {/* CINEMATIC TREATMENT COVER */}

      <section className="st2-detail-cover st2-wrap">
        <div className="st2-detail-title">
          <span className="st2-eyebrow">
            {editorial.eyebrow}
          </span>

          <span className="st2-detail-chapter">
            {treatment.number} / THE CARE JOURNAL
          </span>

          <h1>
            {treatment.name}
            <i>.</i>
          </h1>

          <p>{treatment.short}</p>

          <div className="st2-detail-hero-actions">
            <a href="#st2-care-story">
              EXPLORE THE JOURNAL
              <ArrowRight size={17} />
            </a>

            <Link to={calendarLink}>
              PREVIEW A CONSULTATION
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <div className="st2-detail-visual">
          <img
            src={treatment.image}
            alt={`Illustrative dental care image for ${treatment.name}`}
          />

          <CareOrbit />

          <span>
            PHOTOGRAPHIC STUDY / NOT A REAL CLINIC
          </span>
        </div>
      </section>

      {/* SERVICE SPECIFICATIONS */}

      <section className="st2-detail-spec-strip st2-wrap">
        <div>
          <span>01 / CARE DISCIPLINE</span>
          <strong>{treatment.category}</strong>
        </div>

        <div>
          <span>02 / SAMPLE DURATION</span>
          <strong>
            {treatment.duration} minutes
          </strong>
        </div>

        <div>
          <span>03 / EXAMPLE FEE FROM</span>
          <strong>
            {formatPeso(treatment.priceFrom)}
          </strong>
        </div>

        <div>
          <span>04 / SERVICE RECORD</span>
          <strong>
            {treatment.number} OF 06
          </strong>
        </div>
      </section>

      {/* CARE JOURNAL / CONSULTATION STUDIO */}

      <div
        className="st2-detail-layout st2-wrap"
        id="st2-care-story"
      >
        <div className="st2-detail-body">
          {/* INTRODUCTORY STORY */}

          <section className="st2-detail-prologue">
            <span className="st2-eyebrow">
              01 / THE THINKING BEHIND THE CARE
            </span>

            <h2>
              {editorial.display}
              <br />
              <em>{editorial.italic}</em>
            </h2>

            <p className="st2-large-copy">
              {editorial.introduction}
            </p>

            <p>{treatment.description}</p>
          </section>

          {/* ARCHITECTURAL DIAGRAM */}

          <section className="st2-detail-architecture">
            <div className="st2-detail-architecture-art">
              <CareOrbit />

              <span>
                THE CARE FRAMEWORK / ABSTRACT VISUAL
              </span>
            </div>

            <div>
              <span className="st2-eyebrow">
                02 / THE PERSPECTIVE
              </span>

              <h3>{editorial.lens}</h3>

              <p>
                Every real treatment begins with an
                individual assessment, informed
                discussion, and a clear explanation
                of possible benefits, limits,
                costs and risks. The diagrams on
                this page are visual metaphors—not
                clinical illustrations.
              </p>
            </div>
          </section>

          {/* TREATMENT-SPECIFIC PATHWAY */}

          <section className="st2-steps">
            <span className="st2-eyebrow">
              03 / HOW A REAL CONVERSATION
              MIGHT UNFOLD
            </span>

            <h2>
              Care in <em>three moments.</em>
            </h2>

            <div className="st2-steps-list">
              {editorial.approach.map(
                (step, index) => (
                  <article key={step.title}>
                    <div className="st2-steps-index">
                      <span>
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <i />
                    </div>

                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>

                    <ChevronRight size={21} />
                  </article>
                )
              )}
            </div>
          </section>

          {/* WHAT THE SERVICE INCLUDES */}

          <section className="st2-detail-features">
            <span className="st2-eyebrow">
              04 / DISCUSSION AREAS
            </span>

            <h2>
              The <em>small details.</em>
            </h2>

            <div>
              {treatment.features.map(
                (feature, index) => (
                  <div key={feature}>
                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <strong>{feature}</strong>

                    <Check size={17} />
                  </div>
                )
              )}
            </div>
          </section>

          {/* SAFETY AND SUITABILITY */}

          <section className="st2-caution">
            <Info size={24} />

            <div>
              <span>
                THE INFORMED-CARE NOTE
              </span>

              <h3>
                There is no one-size-fits-all
                recommendation.
              </h3>

              <p>{editorial.considerations}</p>

              <p>
                This portfolio concept cannot
                assess symptoms, diagnose conditions,
                book actual care, or provide a
                personalized quote. Consult a
                licensed dental professional.
              </p>
            </div>
          </section>

          {/* INTERACTIVE QUESTION NOTEBOOK */}

          <section className="st2-questions">
            <div className="st2-questions-head">
              <span className="st2-eyebrow">
                05 / QUESTIONS TO BRING ALONG
              </span>

              <h2>
                Curiosity is <em>welcome.</em>
              </h2>

              <p>
                These sample questions can help you
                prepare for a conversation with a
                qualified dentist. You do not need
                to enter private clinical
                information here.
              </p>
            </div>

            <div className="st2-question-list">
              {editorial.questions.map(
                (question, index) => (
                  <div key={question}>
                    <span>
                      0{index + 1}
                    </span>

                    <strong>{question}</strong>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={copyQuestions}
            >
              <Copy size={16} />
              COPY THESE QUESTIONS
            </button>

            {copyFeedback.id === treatmentId && (
              <p
                className="st2-copy-feedback"
                role="status"
              >
                {copyFeedback.text}
              </p>
            )}
          </section>

          {/* UNIQUE SERVICE FAQs */}

          <section className="st2-detail-faq">
            <span className="st2-eyebrow">
              06 / THE GOOD-TO-KNOW NOTES
            </span>

            <h2>
              A little more <em>clarity.</em>
            </h2>

            <div>
              {editorial.faqs.map(
                (item, index) => (
                  <details key={item.q}>
                    <summary>
                      <span>
                        0{index + 1}
                      </span>

                      <strong>{item.q}</strong>

                      <Sparkles size={17} />
                    </summary>

                    <p>{item.a}</p>
                  </details>
                )
              )}
            </div>
          </section>
        </div>

        {/* STICKY APPOINTMENT PREVIEW */}

        <aside
          className="st2-consultation"
          aria-label="Demo consultation planner"
        >
          <div className="st2-consultation-image">
            <img
              src={IMAGES.clinic}
              alt="Illustrative dental clinic interior"
            />

            <span>
              THE CONSULTATION CARD / 02
            </span>
          </div>

          <div className="st2-consultation-panel">
            <span className="st2-eyebrow">
              A SMALL STEP, THOUGHTFULLY PLANNED
            </span>

            <h2>
              Your next <em>conversation.</em>
            </h2>

            <p>
              Select a fictional provider to
              explore the local demo calendar
              with this care interest already
              selected.
            </p>

            <div className="st2-consultation-facts">
              <div>
                <Clock3 size={18} />

                <span>
                  ILLUSTRATIVE VISIT
                </span>

                <strong>
                  {treatment.duration} MIN
                </strong>
              </div>

              <div>
                <Sparkles size={18} />

                <span>
                  EXAMPLE FEE FROM
                </span>

                <strong>
                  {formatPeso(
                    treatment.priceFrom
                  )}
                </strong>
              </div>
            </div>

            <label htmlFor="st2-care-dentist">
              SAMPLE PROVIDER / NOT VERIFIED
            </label>

            <select
              id="st2-care-dentist"
              value={dentistId}
              onChange={(event) =>
                setDentistId(event.target.value)
              }
            >
              {DENTISTS.map((person) => (
                <option
                  key={person.id}
                  value={person.id}
                >
                  {person.name} — {person.role}
                </option>
              ))}
            </select>

            <div className="st2-consultation-provider">
              <img
                src={dentist?.image}
                alt="Illustrative fictional provider portrait"
              />

              <div>
                <strong>{dentist?.name}</strong>

                <span>
                  {dentist?.specialty}
                </span>
              </div>
            </div>

            <Link to={calendarLink}>
              OPEN DEMO CALENDAR
              <ArrowUpRight size={18} />
            </Link>

            <p className="st2-consultation-disclaimer">
              <ShieldCheck size={17} />

              No real appointment is confirmed,
              no live availability is checked,
              and no payment is taken. Use
              fictional visitor details.
            </p>
          </div>
        </aside>
      </div>

      {/* RELATED CARE JOURNALS */}

      <section className="st2-related st2-wrap">
        <div className="st2-related-head">
          <div>
            <span className="st2-eyebrow">
              07 / CONTINUE EXPLORING
            </span>

            <h2>
              More room for <em>discovery.</em>
            </h2>
          </div>

          <Link to="/treatments">
            THE COMPLETE COLLECTION
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="st2-related-grid">
          {related.map((item) => (
            <Link
              to={`/treatments/${item.id}`}
              key={item.id}
            >
              <div>
                <img
                  src={item.image}
                  alt={`Illustrative ${item.name} treatment study`}
                  loading="lazy"
                />

                <span>
                  CARE JOURNAL / {item.number}
                </span>
              </div>

              <section>
                <span>
                  {item.category.toUpperCase()}
                </span>

                <h3>{item.name}</h3>

                <p>{item.short}</p>

                <ArrowUpRight size={22} />
              </section>
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL EDITORIAL CHAPTER */}

      <section className="st2-detail-finale">
        <div>
          <span className="st2-eyebrow">
            YOUR SMILE / AN OPEN-ENDED INVITATION
          </span>

          <h2>
            A little <em>confidence</em> begins
            with clarity.
          </h2>

          <Link to={calendarLink}>
            EXPLORE A DEMO REQUEST
            <ArrowUpRight size={18} />
          </Link>

          <small>{BRAND.developer}</small>
        </div>

        <img
          src={IMAGES.hero}
          alt="Illustrative dental care space"
          loading="lazy"
        />
      </section>
    </div>
  );
}