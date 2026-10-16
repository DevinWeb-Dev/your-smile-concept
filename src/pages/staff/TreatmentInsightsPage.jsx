import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesColumnIncreasing,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  CATEGORIES,
  TREATMENTS,
  DENTISTS,
  formatPeso,
} from "../../data/clinicData.js";

import {
  REPORT_PERIODS,
  filterByPeriod,
  getServiceDemand,
  getDentistDemand,
} from "../../utils/clinicReports.js";

import "../../styles/smile-staff-batch5.css";

export default function TreatmentInsightsPage() {
  const { requests = [] } = useOutletContext();

  const [period, setPeriod] = useState("all");
  const [status, setStatus] =
    useState("requested");
  const [category, setCategory] =
    useState("All Treatments");
  const [query, setQuery] = useState("");

  const [selected, setSelected] = useState(
    TREATMENTS[0]?.id
  );

  const scoped = useMemo(
    () =>
      filterByPeriod(requests, period).filter(
        (request) =>
          status === "all" ||
          request.status === status
      ),
    [requests, period, status]
  );

  const services = useMemo(
    () =>
      getServiceDemand(scoped).filter(
        (service) =>
          (category === "All Treatments" ||
            service.category === category) &&
          `${service.name} ${service.category}`
            .toLowerCase()
            .includes(
              query.trim().toLowerCase()
            )
      ),
    [scoped, category, query]
  );

  const doctorStats = useMemo(
    () => getDentistDemand(scoped),
    [scoped]
  );

  const max = Math.max(
    1,
    ...services.map((service) => service.total)
  );

  const maxDoctor = Math.max(
    1,
    ...doctorStats.map(
      (doctor) => doctor.total
    )
  );

  const chosen =
    TREATMENTS.find(
      (service) => service.id === selected
    ) || TREATMENTS[0];

  const requestsFor = scoped.filter(
    (request) =>
      request.serviceId === chosen.id
  );

  const total = requestsFor.length;

  const uniqueDoctors = new Set(
    requestsFor.map(
      (request) => request.doctorId
    )
  ).size;

  return (
    <div className="sm5-page">
      <section className="sm5-intro sm5-intro--lavender">
        <div>
          <span className="sm5-eyebrow">
            06 / TREATMENT DISCOVERY INTELLIGENCE
          </span>

          <h1>
            Curiosity,{" "}
            <em>measured gently.</em>
          </h1>

          <p>
            Understand which illustrative
            treatments visitors select in
            this browser's request flow—without
            implying clinical demand or
            treatment success.
          </p>

          <Link to="/staff/reports">
            OPEN OPERATIONS REPORTS
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="sm5-intro-art"
          aria-hidden="true"
        >
          <span className="sm5-orbit" />

          <strong>06</strong>

          <small>
            THE TREATMENT INDEX / YOUR SMILE.
          </small>
        </div>
      </section>

      <section
        className="sm5-filterbar"
        aria-label="Treatment insight filters"
      >
        <label>
          DATE WINDOW

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
          >
            {REPORT_PERIODS.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          STATUS

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="requested">
              Requested
            </option>
            <option value="cancelled">
              Cancelled
            </option>
            <option value="all">
              All statuses
            </option>
          </select>
        </label>

        <label>
          CATEGORY

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {CATEGORIES.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="sm5-search">
          <Search size={17} />

          <input
            aria-label="Search treatment interests"
            type="search"
            value={query}
            placeholder="Search a treatment"
            onChange={(event) =>
              setQuery(event.target.value)
            }
          />
        </label>
      </section>

      <div className="sm5-report-grid sm5-insight-grid">
        <section className="sm5-panel">
          <header className="sm5-panel-head">
            <div>
              <span className="sm5-eyebrow">
                01 / INTERACTIVE SERVICE ATLAS
              </span>

              <h2>
                The care <em>index.</em>
              </h2>
            </div>

            <ChartNoAxesColumnIncreasing size={23} />
          </header>

          <div className="sm5-insight-list">
            {services.map((service, index) => (
              <button
                type="button"
                key={service.id}
                className={
                  selected === service.id
                    ? "is-selected"
                    : ""
                }
                aria-pressed={
                  selected === service.id
                }
                onClick={() =>
                  setSelected(service.id)
                }
              >
                <img
                  src={service.image}
                  alt=""
                />

                <div>
                  <small>
                    0{index + 1} /{" "}
                    {service.category.toUpperCase()}
                  </small>

                  <strong>
                    {service.name}
                  </strong>

                  <div className="sm5-track">
                    <i
                      style={{
                        width: `${
                          (service.total /
                            max) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <b>{service.total}</b>
              </button>
            ))}
          </div>

          {!services.length && (
            <p className="sm5-empty">
              No treatments match these filters.
              Adjust the search or category.
            </p>
          )}
        </section>

        <aside className="sm5-insight-aside">
          <section className="sm5-panel sm5-feature-folio">
            <span className="sm5-eyebrow">
              02 / SELECTED TREATMENT FOLIO
            </span>

            <div className="sm5-feature-photo">
              <img
                src={chosen.image}
                alt={`Illustrative ${chosen.name}`}
              />

              <span>
                FIELD JOURNAL / {chosen.number}
              </span>
            </div>

            <h2>
              {chosen.name}<em>.</em>
            </h2>

            <p>{chosen.short}</p>

            <div className="sm5-mini-facts">
              <div>
                <span>
                  MATCHING REQUESTS
                </span>
                <strong>{total}</strong>
              </div>

              <div>
                <span>
                  SELECTED PROVIDERS
                </span>
                <strong>
                  {uniqueDoctors}
                </strong>
              </div>

              <div>
                <span>
                  SAMPLE FEE FROM
                </span>
                <strong>
                  {formatPeso(
                    chosen.priceFrom
                  )}
                </strong>
              </div>
            </div>

            <Link
              className="sm5-button"
              to={`/treatments/${chosen.id}`}
            >
              PUBLIC INFORMATION JOURNAL
              <ArrowUpRight size={16} />
            </Link>
          </section>

          <section className="sm5-panel">
            <span className="sm5-eyebrow">
              03 / REQUEST STATUS EXPLANATION
            </span>

            <h2>
              What the data <em>means.</em>
            </h2>

            <p className="sm5-body-copy">
              This ledger reflects selections
              from fictional appointment forms.
              Multiple requests, cancellations,
              and visitor preferences are not
              evidence of medical suitability,
              clinical results, or completed
              procedures.
            </p>

            <Link
              className="sm5-inline"
              to="/staff/treatments"
            >
              OPEN TREATMENT DRAFT STUDIO
              <ArrowRight size={16} />
            </Link>
          </section>
        </aside>
      </div>

      <section className="sm5-panel">
        <header className="sm5-panel-head">
          <div>
            <span className="sm5-eyebrow">
              04 / PROVIDER INTEREST DISTRIBUTION
            </span>

            <h2>
              Three fictional{" "}
              <em>perspectives.</em>
            </h2>
          </div>

          <Sparkles size={22} />
        </header>

        <div className="sm5-doctor-grid">
          {doctorStats.map((doctor) => (
            <article key={doctor.id}>
              <img
                src={doctor.image}
                alt=""
              />

              <div>
                <strong>
                  {doctor.name}
                </strong>

                <small>
                  {DENTISTS.find(
                    (person) =>
                      person.id === doctor.id
                  )?.role}
                </small>

                <div className="sm5-track">
                  <i
                    style={{
                      width: `${
                        (doctor.total /
                          maxDoctor) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <span>
                  {doctor.total} matching
                  request(s)
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="sm5-privacy">
        <ShieldCheck size={18} />
        Reporting is based on fictional,
        browser-local request counts only.
        Sample fees are not booked revenue.
      </p>
    </div>
  );
}