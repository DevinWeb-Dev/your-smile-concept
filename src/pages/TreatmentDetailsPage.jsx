import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  BRAND,
  TREATMENTS,
  formatPeso,
} from "../data/clinicData.js";

export default function TreatmentDetailsPage() {
  const { treatmentId } = useParams();

  const treatment = TREATMENTS.find(
    (item) => item.id === treatmentId
  );

  if (!treatment) {
    return (
      <section className="ys2-not-found ys-container">
        <span className="ys-eyebrow">
          TREATMENT NOT FOUND
        </span>

        <h1>
          Let's find the <em>right care.</em>
        </h1>

        <p>
          This treatment isn't included in our concept catalog.
        </p>

        <Link
          to="/treatments"
          className="ys-button"
        >
          <ArrowLeft size={18} />
          All Treatments
        </Link>
      </section>
    );
  }

  const related = TREATMENTS.filter(
    (item) => item.id !== treatment.id
  )
    .sort((a, b) => {
      const aMatch =
        a.category === treatment.category ? 0 : 1;

      const bMatch =
        b.category === treatment.category ? 0 : 1;

      return aMatch - bMatch;
    })
    .slice(0, 3);

  return (
    <div className="ys2-detail-page">
      <section className="ys2-detail-hero">
        <div className="ys-container">
          <div className="ys2-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/treatments">Treatments</Link>
            <span>/</span>
            <strong>{treatment.name}</strong>
          </div>

          <div className="ys2-detail-hero-grid">
            <div className="ys2-detail-heading">
              <span className="ys-eyebrow">
                YOUR SMILE / {treatment.category}
              </span>

              <h1>{treatment.name}<span>.</span></h1>

              <p>{treatment.description}</p>

              <div className="ys2-detail-stats">
                <div>
                  <Clock3 size={20} />
                  <span>
                    <small>Sample duration</small>
                    <strong>
                      {treatment.duration} minutes
                    </strong>
                  </span>
                </div>

                <div>
                  <Sparkles size={20} />
                  <span>
                    <small>Illustrative fee from</small>
                    <strong>
                      {formatPeso(treatment.priceFrom)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="ys2-detail-actions">
                <Link
                  className="ys-button"
                  to={`/appointments?service=${treatment.id}`}
                >
                  Request This Treatment
                  <ArrowUpRight size={18} />
                </Link>

                <Link
                  className="ys-button ys-button-outline"
                  to={`/calendar?service=${treatment.id}`}
                >
                  View Demo Calendar
                  <CalendarDays size={17} />
                </Link>
              </div>
            </div>

            <div className="ys2-detail-image-wrap">
              <div className="ys2-detail-image">
                <img
                  src={treatment.image}
                  alt={`Illustrative dental care for ${treatment.name}`}
                />
              </div>

              <div className="ys2-detail-image-caption">
                <Heart size={17} />
                YOUR COMFORT, OUR INSPIRATION
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ys2-section ys-container">
        <div className="ys2-treatment-info">
          <div>
            <span className="ys-eyebrow">
              ABOUT THE EXPERIENCE
            </span>

            <h2>
              A thoughtful approach
              <br />
              to <em>your smile.</em>
            </h2>

            <p>
              {treatment.description}
            </p>

            <p>
              This page demonstrates how a real dental
              clinic could explain its services before
              a patient requests a consultation.
              A licensed dentist must determine the
              appropriate examination, procedure,
              potential risks and treatment plan.
            </p>

            <div className="ys2-care-note">
              <ShieldCheck size={23} />

              <div>
                <strong>
                  Consultation comes first
                </strong>

                <p>
                  The right treatment depends on
                  an individual clinical assessment.
                  Listed prices are examples only.
                </p>
              </div>
            </div>
          </div>

          <aside className="ys2-included-card">
            <span className="ys-eyebrow">
              WHAT THIS CONCEPT SHOWS
            </span>

            <h3>
              The care <em>overview.</em>
            </h3>

            <div className="ys2-included-list">
              {treatment.features.map((feature) => (
                <div key={feature}>
                  <span>
                    <Check size={16} />
                  </span>

                  <p>{feature}</p>
                </div>
              ))}
            </div>

            <div className="ys2-included-bottom">
              <span>
                <Clock3 size={17} />
                {treatment.duration} min preview
              </span>

              <Link
                to={`/appointments?service=${treatment.id}`}
              >
                Book a demo slot
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="ys2-care-journey">
        <div className="ys-container">
          <div className="ys2-section-intro">
            <span className="ys-eyebrow">
              THE PATIENT JOURNEY
            </span>

            <h2>
              Simple steps.
              <br />
              <em>A calmer experience.</em>
            </h2>
          </div>

          <div className="ys2-journey-grid">
            {[
              {
                number: "01",
                title: "Explore",
                description:
                  "Browse sample treatments, descriptions and estimated appointment durations.",
              },
              {
                number: "02",
                title: "Choose",
                description:
                  "Select a sample dentist, date and time using our interactive calendar.",
              },
              {
                number: "03",
                title: "Review",
                description:
                  "Save a fictional request locally and review it in the appointment manager.",
              },
            ].map((step) => (
              <article
                className="ys2-journey-step"
                key={step.number}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ys2-section ys-container">
        <div className="ys-section-heading">
          <div>
            <span className="ys-eyebrow">
              EXPLORE MORE
            </span>

            <h2>
              More ways to <em>smile.</em>
            </h2>
          </div>

          <Link
            className="ys-text-link"
            to="/treatments"
          >
            All Treatments
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="ys2-related-grid">
          {related.map((item) => (
            <Link
              key={item.id}
              className="ys2-related-card"
              to={`/treatments/${item.id}`}
            >
              <div className="ys2-related-image">
                <img
                  src={item.image}
                  alt={`Illustrative ${item.name} service`}
                  loading="lazy"
                />
              </div>

              <div className="ys2-related-content">
                <span className="ys-eyebrow">
                  {item.category}
                </span>

                <h3>{item.name}</h3>

                <p>{item.short}</p>

                <span className="ys2-related-link">
                  Explore details
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="ys2-bottom-cta">
        <div className="ys-container">
          <span className="ys-eyebrow ys-eyebrow-light">
            {BRAND.descriptor}
          </span>

          <h2>
            Every smile deserves
            <br />
            <em>thoughtful care.</em>
          </h2>

          <Link
            to={`/calendar?service=${treatment.id}`}
            className="ys-button ys-button-light"
          >
            Explore Available Demo Times
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}