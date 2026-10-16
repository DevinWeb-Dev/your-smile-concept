import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
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
  csvCell,
  downloadFile,
} from "../../utils/clinicReports.js";

import {
  formatDate,
  formatTime,
} from "../../data/clinicData.js";

import "../../styles/smile-staff-batch5.css";

const today = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

export default function ReportsPage() {
  const { requests = [] } = useOutletContext();

  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("all");
  const [withAliases, setWithAliases] =
    useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () =>
      filterByPeriod(requests, period).filter(
        (request) =>
          status === "all" ||
          request.status === status
      ),
    [requests, period, status]
  );

  const stats = useMemo(
    () => getReportStats(filtered),
    [filtered]
  );

  const demand = useMemo(
    () => getServiceDemand(filtered),
    [filtered]
  );

  const dentistDemand = useMemo(
    () => getDentistDemand(filtered),
    [filtered]
  );

  const pulse = useMemo(
    () => getNext14Days(requests),
    [requests]
  );

  const maxPulse = Math.max(
    1,
    ...pulse.map((item) => item.count)
  );

  const maxDemand = Math.max(
    1,
    ...demand.map((item) => item.total)
  );

  const upcoming = filtered
    .filter(
      (request) =>
        request.status === "requested" &&
        request.date >= today()
    )
    .sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(
        `${b.date} ${b.time}`
      )
    )
    .slice(0, 5);

  function exportReport() {
    if (!filtered.length) return;

    const headers = [
      "Reference",
      ...(withAliases ? ["Demo Alias"] : []),
      "Treatment",
      "Dentist",
      "Date",
      "Time",
      "Status",
    ];

    const rows = filtered.map((request) => [
      request.id,
      ...(withAliases ? [request.alias] : []),
      getTreatment(request.serviceId)?.name ||
        "Unknown",
      getDentist(request.doctorId)?.name ||
        "Unknown",
      request.date,
      request.time,
      request.status,
    ]);

    const content =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) =>
          row.map(csvCell).join(",")
        )
        .join("\r\n");

    downloadFile(
      content,
      `your-smile-operations-${period}-${status}.csv`,
      "text/csv;charset=utf-8"
    );

    setMessage(
      withAliases
        ? "CSV export started with fictional visitor aliases."
        : "CSV export started without visitor aliases."
    );
  }

  return (
    <div className="sm5-page">
      <section className="sm5-intro sm5-intro--ink">
        <div>
          <span className="sm5-eyebrow">
            05 / OPERATIONS INTELLIGENCE
          </span>

          <h1>
            Clarity behind{" "}
            <em>every request.</em>
          </h1>

          <p>
            Read the rhythm of fictional
            appointments—not revenue, clinical
            outcomes, or patient activity.
          </p>

          <Link to="/staff">
            RETURN TO COMMAND CENTER
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="sm5-intro-art"
          aria-hidden="true"
        >
          <span className="sm5-orbit" />
          <strong>05</strong>
          <small>
            THE INSIGHT LEDGER / YOUR SMILE.
          </small>
        </div>
      </section>

      <section
        className="sm5-filterbar"
        aria-label="Analytics filters"
      >
        <label>
          APPOINTMENT DATE WINDOW

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
          REQUEST STATUS

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="all">
              All statuses
            </option>
            <option value="requested">
              Requested
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </label>

        <label className="sm5-check">
          <input
            type="checkbox"
            checked={withAliases}
            onChange={(event) =>
              setWithAliases(
                event.target.checked
              )
            }
          />
          INCLUDE DEMO ALIASES IN CSV
        </label>

        <button
          type="button"
          className="sm5-button"
          disabled={!filtered.length}
          onClick={exportReport}
        >
          <Download size={17} />
          EXPORT FILTERED CSV
        </button>
      </section>

      {message && (
        <p
          className="sm5-feedback"
          role="status"
        >
          {message}
        </p>
      )}

      <section
        className="sm5-metrics"
        aria-label="Overview metrics"
      >
        {[
          [
            "01 / REQUEST RECORDS",
            stats.total,
            "Selected date and status filters",
          ],
          [
            "02 / REQUESTED",
            stats.active,
            "Pending local demonstrations",
          ],
          [
            "03 / UPCOMING",
            stats.upcoming,
            "Active requests from today",
          ],
          [
            "04 / CANCELLED",
            stats.cancelled,
            "Retained for audit context",
          ],
        ].map(([label, value, note]) => (
          <article key={label}>
            <span>{label}</span>

            <strong>
              {String(value).padStart(2, "0")}
            </strong>

            <small>{note}</small>
          </article>
        ))}
      </section>

      <div className="sm5-report-grid">
        <section className="sm5-panel sm5-pulse-panel">
          <header className="sm5-panel-head">
            <div>
              <span className="sm5-eyebrow">
                01 / FUTURE APPOINTMENT PULSE
              </span>

              <h2>
                Fourteen days <em>ahead.</em>
              </h2>
            </div>

            <TrendingUp size={23} />
          </header>

          <div
            className="sm5-pulse"
            role="img"
            aria-label={pulse
              .map(
                (item) =>
                  `${item.label}: ${item.count} active requests`
              )
              .join(", ")}
          >
            {pulse.map((item) => (
              <div key={item.date}>
                <b>{item.count}</b>

                <span className="sm5-pulse-track">
                  <i
                    style={{
                      height: `${
                        Math.max(
                          item.count ? 5 : 1,
                          (item.count /
                            maxPulse) *
                            100
                        )
                      }%`,
                    }}
                  />
                </span>

                <small>{item.label}</small>
              </div>
            ))}
          </div>

          <p className="sm5-note">
            Upcoming calendar pulse always
            shows current active requests
            for the next 14 days,
            independently of the report
            filters above.
          </p>
        </section>

        <section className="sm5-panel">
          <header className="sm5-panel-head">
            <div>
              <span className="sm5-eyebrow">
                02 / SERVICE INTEREST
              </span>

              <h2>
                What visitors <em>explore.</em>
              </h2>
            </div>

            <FileSpreadsheet size={23} />
          </header>

          <div className="sm5-demand-list">
            {demand.map((item, index) => (
              <div key={item.id}>
                <span>0{index + 1}</span>

                <div>
                  <strong>{item.name}</strong>

                  <div className="sm5-track">
                    <i
                      style={{
                        width: `${
                          (item.total /
                            maxDemand) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <b>{item.total}</b>
              </div>
            ))}
          </div>

          <Link
            className="sm5-inline"
            to="/staff/insights"
          >
            EXPLORE TREATMENT INSIGHTS
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>

      <div className="sm5-report-grid">
        <section className="sm5-panel">
          <header className="sm5-panel-head">
            <div>
              <span className="sm5-eyebrow">
                03 / APPOINTMENT JOURNAL
              </span>

              <h2>
                On the <em>horizon.</em>
              </h2>
            </div>

            <CalendarDays size={23} />
          </header>

          {upcoming.length ? (
            <div className="sm5-journal">
              {upcoming.map((request) => (
                <article key={request.id}>
                  <time>
                    {formatDate(request.date)}

                    <small>
                      {formatTime(request.time)}
                    </small>
                  </time>

                  <div>
                    <strong>
                      {getTreatment(
                        request.serviceId
                      )?.name ||
                        "Unknown treatment"}
                    </strong>

                    <small>
                      {getDentist(
                        request.doctorId
                      )?.name ||
                        "Unknown provider"}
                      {" · DEMO REQUEST"}
                    </small>
                  </div>

                  <ArrowUpRight size={17} />
                </article>
              ))}
            </div>
          ) : (
            <p className="sm5-empty">
              No upcoming active requests
              in the selected reporting view.
            </p>
          )}

          <Link
            className="sm5-inline"
            to="/staff/appointments"
          >
            OPEN APPOINTMENT DESK
            <ArrowRight size={16} />
          </Link>
        </section>

        <section className="sm5-panel">
          <header className="sm5-panel-head">
            <div>
              <span className="sm5-eyebrow">
                04 / FICTIONAL PROVIDER LOAD
              </span>

              <h2>
                A balanced <em>view.</em>
              </h2>
            </div>

            <XCircle size={22} />
          </header>

          <div className="sm5-provider-ledger">
            {dentistDemand.map((doctor) => (
              <div key={doctor.id}>
                <img
                  src={doctor.image}
                  alt=""
                />

                <span>
                  <strong>{doctor.name}</strong>
                  <small>
                    {doctor.active} REQUESTED ·{" "}
                    {doctor.total} TOTAL
                  </small>
                </span>

                <b>{doctor.total}</b>
              </div>
            ))}
          </div>

          <p className="sm5-note">
            Counts describe browser-local
            sample appointment interest,
            not hours worked or real
            clinician productivity.
          </p>
        </section>
      </div>

      <p className="sm5-privacy">
        <ShieldCheck size={18} />
        This is a design prototype using
        fictional appointment requests.
        No payment processor, real revenue
        or patient database is connected.
      </p>
    </div>
  );
}