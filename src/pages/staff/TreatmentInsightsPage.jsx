import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  ChartPie,
  ChartNoAxesCombined,
  ClipboardList,
  Filter,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  CATEGORIES,
  TREATMENTS,
  formatPeso,
} from "../../data/clinicData.js";

import {
  REPORT_PERIODS,
  filterByPeriod,
  getServiceDemand,
  getDentistDemand,
} from "../../utils/clinicReports.js";

const STATUS_OPTIONS = [
  { id: "requested", label: "Active Requests" },
  { id: "all", label: "All Requests" },
  { id: "cancelled", label: "Cancelled" },
];

export default function TreatmentInsightsPage() {
  const { requests } = useOutletContext();

  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("requested");

  const scoped = useMemo(() => {
    const periodRequests = filterByPeriod(
      requests,
      period
    );

    if (status === "all") {
      return periodRequests;
    }

    return periodRequests.filter(
      (item) => item.status === status
    );
  }, [requests, period, status]);

  const services = useMemo(() => {
    return getServiceDemand(scoped).sort(
      (a, b) => b.total - a.total
    );
  }, [scoped]);

  const doctors = useMemo(() => {
    return getDentistDemand(scoped).sort(
      (a, b) => b.total - a.total
    );
  }, [scoped]);

  const categories = useMemo(() => {
    return CATEGORIES
      .filter((item) => item !== "All Treatments")
      .map((category) => ({
        name: category,
        count: scoped.filter((request) => {
          const service = TREATMENTS.find(
            (item) =>
              item.id === request.serviceId
          );

          return service?.category === category;
        }).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [scoped]);

  const mostRequested =
    services.find((item) => item.total > 0);

  const highestService = Math.max(
    1,
    ...services.map((item) => item.total)
  );

  const highestCategory = Math.max(
    1,
    ...categories.map((item) => item.count)
  );

  const highestDoctor = Math.max(
    1,
    ...doctors.map((item) => item.total)
  );

  return (
    <div className="ysm3-page ysm4-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            SERVICE INTELLIGENCE / BATCH 4
          </span>

          <h1>
            Discover what
            <br />
            <em>visitors explore.</em>
          </h1>

          <p>
            Understand treatment interest through
            sample appointment request patterns.
          </p>
        </div>

        <Link
          to="/staff/reports"
          className="ysm3-primary-button"
        >
          <ChartNoAxesCombined size={18} />
          Full Reports
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="ysm4-insight-filters">
        <label>
          <span>APPOINTMENT PERIOD</span>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
          >
            {REPORT_PERIODS.map((item) => (
              <option
                value={item.id}
                key={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>REQUEST STATUS</span>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            {STATUS_OPTIONS.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <span className="ysm4-filter-count">
          <Filter size={16} />
          {scoped.length} matching requests
        </span>
      </div>

      <div className="ysm4-insight-summary">
        <div className="ysm4-insight-feature">
          <span className="ysm3-eyebrow">
            MOST REQUESTED TREATMENT
          </span>

          <h2>
            {mostRequested
              ? mostRequested.name
              : "Waiting for requests"}
            <span>.</span>
          </h2>

          <p>
            {mostRequested
              ? `${mostRequested.total} matching demo requests under the current filters.`
              : "Create a sample appointment to begin exploring service demand."}
          </p>

          <div className="ysm4-insight-feature-footer">
            <Sparkles size={20} />
            <span>
              Concept insights, not clinical performance
            </span>
          </div>
        </div>

        <div className="ysm4-insight-counts">
          <div>
            <Stethoscope size={22} />
            <strong>{TREATMENTS.length}</strong>
            <small>Sample treatment types</small>
          </div>

          <div>
            <ClipboardList size={22} />
            <strong>{scoped.length}</strong>
            <small>Matching demo requests</small>
          </div>

          <div>
            <Users size={22} />
            <strong>
              {
                new Set(
                  scoped.map((item) => item.doctorId)
                ).size
              }
            </strong>
            <small>Sample dentists requested</small>
          </div>
        </div>
      </div>

      <section className="ysm3-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              TREATMENT COMPARISON
            </span>

            <h2>
              Most explored <em>services.</em>
            </h2>
          </div>

          <span className="ysm3-panel-tag">
            REQUEST COUNTS
          </span>
        </div>

        <div className="ysm4-service-grid">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="ysm4-service-card"
            >
              <div className="ysm4-service-photo">
                <img
                  src={service.image}
                  alt={`Illustrative ${service.name} treatment`}
                  loading="lazy"
                />

                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="ysm4-service-body">
                <span className="ysm3-eyebrow">
                  {service.category}
                </span>

                <h3>{service.name}</h3>

                <div className="ysm4-service-figure">
                  <strong>{service.total}</strong>

                  <span>
                    matching
                    <br />
                    requests
                  </span>
                </div>

                <div className="ysm4-demand-track">
                  <span
                    style={{
                      width: `${
                        (service.total /
                          highestService) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="ysm4-service-footer">
                  <span>Illustrative fee from</span>
                  <strong>
                    {formatPeso(service.rate)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="ysm4-report-two">
        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                SERVICE CATEGORIES
              </span>

              <h2>
                Areas of <em>interest.</em>
              </h2>
            </div>

            <ChartPie
              size={25}
              color="#6C9985"
            />
          </div>

          <div className="ysm4-demand-list">
            {categories.map((item) => (
              <div
                className="ysm4-demand-item"
                key={item.name}
              >
                <div className="ysm4-demand-head">
                  <div>
                    <strong>{item.name}</strong>
                    <small>Request category</small>
                  </div>

                  <b>{item.count}</b>
                </div>

                <div className="ysm4-demand-track">
                  <span
                    style={{
                      width: `${
                        (item.count /
                          highestCategory) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                DENTIST DISTRIBUTION
              </span>

              <h2>
                Requested <em>providers.</em>
              </h2>
            </div>
          </div>

          <div className="ysm4-demand-list">
            {doctors.map((doctor) => (
              <div
                className="ysm4-demand-item"
                key={doctor.id}
              >
                <div className="ysm4-demand-head">
                  <div>
                    <strong>{doctor.name}</strong>
                    <small>{doctor.role}</small>
                  </div>

                  <b>{doctor.total}</b>
                </div>

                <div className="ysm4-demand-track">
                  <span
                    style={{
                      width: `${
                        (doctor.total /
                          highestDoctor) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="ysm3-dashboard-note">
        <ChartNoAxesCombined size={23} />

        <div>
          <strong>
            These are request trends, not real
            patient or clinical statistics.
          </strong>

          <p>
            Treatment names, pricing and staff profiles
            are fictional concept data. The charts
            do not measure actual treatment outcomes,
            patient satisfaction or clinic earnings.
          </p>
        </div>
      </div>
    </div>
  );
}