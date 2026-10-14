import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  ChartColumn,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  Users,
  XCircle,
} from "lucide-react";

import {
  REPORT_PERIODS,
  filterByPeriod,
  getReportStats,
  getNext14Days,
  getServiceDemand,
  getDentistDemand,
  getTreatment,
  getDentist,
  exportAppointmentCSV,
} from "../../utils/clinicReports.js";

import {
  formatDate,
  formatTime,
} from "../../data/clinicData.js";

function ReportMetric({
  label,
  value,
  icon: Icon,
  description,
}) {
  return (
    <article className="ysm4-metric">
      <span className="ysm4-metric-icon">
        <Icon size={22} strokeWidth={1.65} />
      </span>

      <strong>{value}</strong>
      <h3>{label}</h3>
      <p>{description}</p>
    </article>
  );
}

export default function ReportsPage() {
  const { requests } = useOutletContext();

  const [period, setPeriod] = useState("all");

  const filtered = useMemo(
    () => filterByPeriod(requests, period),
    [requests, period]
  );

  const stats = useMemo(
    () => getReportStats(filtered),
    [filtered]
  );

  const upcomingChart = useMemo(
    () => getNext14Days(requests),
    [requests]
  );

  const topServices = useMemo(
    () => getServiceDemand(filtered).slice(0, 4),
    [filtered]
  );

  const dentistDemand = useMemo(
    () => getDentistDemand(filtered),
    [filtered]
  );

  const activeTotal = Math.max(1, stats.active);

  const highestBar = Math.max(
    1,
    ...upcomingChart.map((item) => item.count)
  );

  const upcoming = filtered
    .filter(
      (item) =>
        item.status === "requested"
    )
    .sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(
        `${b.date} ${b.time}`
      )
    )
    .slice(0, 6);

  const completion =
    stats.total === 0
      ? 0
      : Math.round(
          (stats.active / stats.total) * 100
        );

  function exportReport() {
    exportAppointmentCSV(
      filtered,
      `your-smile-report-${period}.csv`
    );
  }

  return (
    <div className="ysm3-page ysm4-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            CLINIC INTELLIGENCE / BATCH 4
          </span>

          <h1>
            A clearer picture
            <br />
            of <em>every request.</em>
          </h1>

          <p>
            Explore trends from fictional appointments
            saved in this browser.
          </p>
        </div>

        <button
          type="button"
          className="ysm3-primary-button"
          onClick={exportReport}
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="ysm4-report-toolbar">
        <label>
          <span>REPORTING PERIOD</span>

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

        <p>
          Filters apply to appointment dates, not
          payment or completed treatment dates.
        </p>
      </div>

      <div className="ysm4-metric-grid">
        <ReportMetric
          label="Total Requests"
          value={stats.total}
          icon={FileSpreadsheet}
          description="Within selected period"
        />

        <ReportMetric
          label="Active Requests"
          value={stats.active}
          icon={CheckCircle2}
          description="Pending fictional appointments"
        />

        <ReportMetric
          label="Upcoming"
          value={stats.upcoming}
          icon={CalendarDays}
          description="Active requests dated today or later"
        />

        <ReportMetric
          label="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          description="Retained in local demo history"
        />
      </div>

      <div className="ysm4-report-two">
        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                SHORT-TERM DEMAND
              </span>

              <h2>
                Upcoming <em>activity.</em>
              </h2>
            </div>

            <span className="ysm3-panel-tag">
              NEXT 14 DAYS
            </span>
          </div>

          <div className="ysm4-chart-scroll">
            <div
              className="ysm4-chart"
              role="img"
              aria-label={
                "Active demo requests in the next 14 days: " +
                upcomingChart
                  .map(
                    (item) =>
                      `${item.label}, ${item.count}`
                  )
                  .join("; ")
              }
            >
              {upcomingChart.map((item) => (
                <div
                  key={item.date}
                  className="ysm4-chart-column"
                  title={`${item.label}: ${item.count} requests`}
                >
                  <strong>{item.count}</strong>

                  <div className="ysm4-chart-track">
                    <span
                      style={{
                        height: `${
                          (item.count / highestBar) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </div>

          <p className="ysm4-chart-note">
            This chart always shows the next 14 days
            using all active demo requests, independently
            of the reporting-period filter.
          </p>
        </section>

        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                REQUEST STATUS
              </span>

              <h2>
                Booking <em>breakdown.</em>
              </h2>
            </div>
          </div>

          <div className="ysm4-status-total">
            <strong>{completion}%</strong>
            <span>
              of requests are currently active
              in this reporting period
            </span>
          </div>

          <div className="ysm4-status-bar">
            <span
              style={{
                width: `${completion}%`,
              }}
            />
          </div>

          <div className="ysm4-status-legend">
            <div>
              <CheckCircle2 size={18} />
              <span>Active demo requests</span>
              <strong>{stats.active}</strong>
            </div>

            <div>
              <XCircle size={18} />
              <span>Cancelled demo requests</span>
              <strong>{stats.cancelled}</strong>
            </div>
          </div>

          <div className="ysm4-status-notice">
            <Clock3 size={19} />
            <p>
              Active means requested, not confirmed
              or completed by a real dental clinic.
            </p>
          </div>
        </section>
      </div>

      <div className="ysm4-report-two">
        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                TREATMENT REQUESTS
              </span>

              <h2>
                Popular <em>services.</em>
              </h2>
            </div>

            <Link
              to="/staff/insights"
              className="ysm3-panel-link"
            >
              Detailed Insights
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="ysm4-demand-list">
            {topServices.map((item, index) => (
              <div
                className="ysm4-demand-item"
                key={item.id}
              >
                <div className="ysm4-demand-head">
                  <span className="ysm4-demand-rank">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.category}</small>
                  </div>

                  <b>{item.active}</b>
                </div>

                <div className="ysm4-demand-track">
                  <span
                    style={{
                      width: `${
                        (item.active / activeTotal) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="ysm4-chart-note">
            Active request counts only. These are
            not completed treatment figures.
          </p>
        </section>

        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                SAMPLE TEAM
              </span>

              <h2>
                Dentist <em>demand.</em>
              </h2>
            </div>
          </div>

          <div className="ysm4-dentist-list">
            {dentistDemand.map((item) => (
              <div
                className="ysm4-dentist-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={`Illustrative portrait for ${item.name}`}
                  loading="lazy"
                />

                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>

                <span>{item.active}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ysm3-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              REQUEST DETAILS
            </span>

            <h2>
              Selected-period <em>records.</em>
            </h2>
          </div>

          <Link
            to="/staff/appointments"
            className="ysm3-panel-link"
          >
            Appointment Desk
            <ArrowRight size={17} />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="ysm3-empty-state">
            <CalendarDays size={33} />

            <h3>No active requests for this period.</h3>

            <p>
              Try a different reporting period
              or create a fictional appointment.
            </p>
          </div>
        ) : (
          <div className="ysm4-record-list">
            {upcoming.map((request) => (
              <div
                className="ysm4-record-row"
                key={request.id}
              >
                <span className="ysm4-record-icon">
                  <CalendarDays size={20} />
                </span>

                <div>
                  <strong>
                    {getTreatment(
                      request.serviceId
                    )?.name || "Dental visit"}
                  </strong>

                  <small>
                    {request.alias} ·{" "}
                    {getDentist(
                      request.doctorId
                    )?.name || "Sample dentist"}
                  </small>
                </div>

                <span className="ysm4-record-time">
                  {formatDate(request.date)}
                  <small>
                    {formatTime(request.time)}
                  </small>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="ysm3-dashboard-note">
        <ChartColumn size={24} />

        <div>
          <strong>
            Analytics represent fictional booking activity.
          </strong>

          <p>
            No clinic revenue, payment collection,
            actual procedures, clinical outcomes
            or verified staff performance is reported.
          </p>
        </div>
      </div>
    </div>
  );
}