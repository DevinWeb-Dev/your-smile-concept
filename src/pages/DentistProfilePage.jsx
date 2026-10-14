import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import {
  DENTISTS,
  TREATMENTS,
} from "../data/clinicData.js";

const PROFILE_DETAILS = {
  "dr-reyes": {
    philosophy:
      "A welcoming experience starts with listening. This sample profile highlights a gentle approach to preventive care and clear communication.",
    interests: [
      "Preventive dental care",
      "Patient education",
      "General consultation",
      "Long-term oral wellness",
    ],
    serviceIds: [
      "consultation",
      "cleaning",
      "restorations",
    ],
    quote:
      "Comfort begins when every question has room to be heard.",
  },

  "dr-cruz": {
    philosophy:
      "A natural-looking smile is personal. This concept profile emphasizes individualized discussions about cosmetic and restorative options.",
    interests: [
      "Cosmetic consultation",
      "Smile aesthetics",
      "Restorative options",
      "Treatment planning",
    ],
    serviceIds: [
      "whitening",
      "restorations",
      "consultation",
    ],
    quote:
      "Thoughtful care considers the person behind every smile.",
  },

  "dr-santos": {
    philosophy:
      "A confident journey begins with understanding your options. This profile demonstrates how orthodontic services can be presented clearly.",
    interests: [
      "Orthodontic consultation",
      "Alignment planning",
      "Patient communication",
      "Long-term treatment guidance",
    ],
    serviceIds: [
      "aligners",
      "consultation",
      "cleaning",
    ],
    quote:
      "The best journeys are built with patience and clarity.",
  },
};

export default function DentistProfilePage() {
  const { dentistId } = useParams();

  const dentist = DENTISTS.find(
    (item) => item.id === dentistId
  );

  if (!dentist) {
    return (
      <section className="ys2-not-found ys-container">
        <span className="ys-eyebrow">
          PROFILE NOT FOUND
        </span>

        <h1>
          Meet the <em>concept team.</em>
        </h1>

        <Link
          className="ys-button"
          to="/dentists"
        >
          <ArrowLeft size={17} />
          Back to Dentists
        </Link>
      </section>
    );
  }

  const profile = PROFILE_DETAILS[dentist.id];

  const services = TREATMENTS.filter(
    (item) => profile.serviceIds.includes(item.id)
  );

  return (
    <div className="ys2-profile-page">
      <section className="ys2-profile-hero">
        <div className="ys-container">
          <div className="ys2-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/dentists">Our Dentists</Link>
            <span>/</span>
            <strong>{dentist.name}</strong>
          </div>

          <div className="ys2-profile-grid">
            <div className="ys2-profile-photo">
              <img
                src={dentist.image}
                alt={`Illustrative portrait for sample dentist ${dentist.name}`}
              />

              <span>
                <ShieldCheck size={16} />
                FICTIONAL TEAM PROFILE
              </span>
            </div>

            <div className="ys2-profile-copy">
              <span className="ys-eyebrow">
                {dentist.tag}
              </span>

              <h1>{dentist.name}<span>.</span></h1>

              <strong className="ys2-profile-role">
                {dentist.role}
              </strong>

              <p className="ys2-profile-specialty">
                {dentist.specialty}
              </p>

              <p className="ys2-profile-philosophy">
                {profile.philosophy}
              </p>

              <div className="ys2-profile-actions">
                <Link
                  className="ys-button"
                  to={`/calendar?doctor=${dentist.id}`}
                >
                  Preview Calendar
                  <CalendarDays size={17} />
                </Link>

                <Link
                  className="ys-button ys-button-outline"
                  to={`/appointments?doctor=${dentist.id}`}
                >
                  Request Appointment
                  <ArrowUpRight size={17} />
                </Link>
              </div>

              <div className="ys2-profile-disclaimer">
                <ShieldCheck size={19} />

                <span>
                  This is an illustrative professional
                  profile—not a verified licensed practitioner.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ys2-section ys-container">
        <div className="ys2-profile-content-grid">
          <div className="ys2-profile-about">
            <span className="ys-eyebrow">
              AN APPROACH TO CARE
            </span>

            <h2>
              Rooted in comfort.
              <br />
              <em>Guided by clarity.</em>
            </h2>

            <p>
              {dentist.bio}
            </p>

            <p>
              On a real clinic website, this section can
              contain the dentist's verified qualifications,
              registration details, clinical experience,
              professional interests and actual availability.
            </p>

            <div className="ys2-profile-quote">
              <Heart size={26} strokeWidth={1.4} />
              <blockquote>
                “{profile.quote}”
              </blockquote>
              <span>
                ILLUSTRATIVE CARE PHILOSOPHY
              </span>
            </div>
          </div>

          <aside className="ys2-profile-expertise">
            <span className="ys-eyebrow">
              SAMPLE AREAS OF INTEREST
            </span>

            <h3>
              Care with <em>purpose.</em>
            </h3>

            {profile.interests.map((interest) => (
              <div key={interest}>
                <CheckCircle2 size={20} />
                <span>{interest}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="ys2-profile-services">
        <div className="ys-container">
          <div className="ys-section-heading">
            <div>
              <span className="ys-eyebrow">
                TREATMENT EXPLORATION
              </span>

              <h2>
                Discover your <em>options.</em>
              </h2>
            </div>

            <p>
              A selection of services to demonstrate
              the connection between team profiles
              and treatment inquiries.
            </p>
          </div>

          <div className="ys2-profile-service-grid">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/treatments/${service.id}`}
                className="ys2-profile-service"
              >
                <span>
                  <Stethoscope size={21} />
                </span>

                <div>
                  <small>{service.category}</small>
                  <h3>{service.name}</h3>
                  <p>{service.short}</p>
                </div>

                <ArrowUpRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ys2-bottom-cta">
        <div className="ys-container">
          <Sparkles size={30} color="#BDD7CB" />

          <h2>
            Let's make room
            <br />
            for <em>your smile.</em>
          </h2>

          <Link
            to={`/calendar?doctor=${dentist.id}`}
            className="ys-button ys-button-light"
          >
            Explore Demo Availability
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}