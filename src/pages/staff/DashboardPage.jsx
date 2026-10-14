import { useMemo } from "react";

import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  CalendarPlus2,
  CheckCircle2,
  Clock3,
  ClipboardList,
  HeartPulse,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";

import {
  DENTISTS,
  TREATMENTS,
  formatDate,
  formatTime,
} from "../../data/clinicData.js";

function dateKey(date) {
  const y = date.getFullYear();

  const m = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const d = String(
    date.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function getToday() {
  return dateKey(new Date());
}

function buildChart(requests) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today);

      date.setDate(
        date.getDate() + index
      );

      const day = dateKey(date);

      return {
        day,
        label: date.toLocaleDateString(
          "en-PH",
          { weekday: "short" }
        ),
        count: requests.filter(
          (item) =>
            item.date === day &&
            item.status === "requested"
        ).length,
      };
    }
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  accent,
}) {
  return (
    <article className="ysm3-stat-card">
      <div className="ysm3-stat-top">
        <span className={`ysm3-stat-icon ${accent || ""}`}>
          <Icon size={22} strokeWidth={1.6} />
        </span>

        <span className="ysm3-stat-decoration">
          / YOUR SMILE
        </span>
      </div>

      <strong>{value}</strong>
      <h3>{label}</h3>
      <p>{note}</p>
    </article>
  );
}

export default function DashboardPage() {
  const { requests } = useOutletContext();

  const today = getToday();

  const active = requests.filter(
    (item) => item.status === "requested"
  );

  const cancelled = requests.filter(
    (item) => item.status === "cancelled"
  );

  const todayVisits = active.filter(
    (item) => item.date === today
  );

  const upcoming = useMemo(() => {
    return requests
      .filter(
        (item) =>
          item.status === "requested" &&
          item.date >= today
      )
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(
          `${b.date} ${b.time}`
        )
      )
      .slice(0, 6);
  }, [requests, today]);

  const chart = useMemo(
    () => buildChart(requests),
    [requests]
  );

  const highestCount = Math.max(
    1,
    ...chart.map((item) => item.count)
  );

  const dentistLoad = useMemo(() => {
    return DENTISTS.map((doctor) => ({
      ...doctor,
      total: active.filter(
        (item) =>
          item.doctorId === doctor.id &&
          item.date >= today
      ).length,
    }));
  }, [active, today]);

  const maximumLoad = Math.max(
    1,
    ...dentistLoad.map((item) => item.total)
  );

  const todayLabel = new Date().toLocaleDateString(
    "en-PH",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="ysm3-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            CLINIC OVERVIEW / BATCH 3
          </span>

          <h1>
            A clearer view
            <br />
            of <em>every visit.</em>
          </h1>

          <p>
            {todayLabel} — Your appointment
            activity, all in one place.
          </p>
        </div>

        <Link
          to="/calendar"
          className="ysm3-primary-button"
        >
          <CalendarPlus2 size={18} />
          New Demo Request
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="ysm3-stat-grid">
        <StatCard
          icon={ClipboardList}
          label="Total Requests"
          value={requests.length}
          note="All saved browser-local requests"
        />

        <StatCard
          icon={CalendarCheck2}
          label="Active Requests"
          value={active.length}
          note="Not real confirmed appointments"
          accent="sage"
        />

        <StatCard
          icon={CalendarDays}
          label="Scheduled Today"
          value={todayVisits.length}
          note="Sample time slots for today"
          accent="blue"
        />

        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={cancelled.length}
          note="Retained in demo history"
          accent="clay"
        />
      </div>

      <div className="ysm3-dashboard-grid">
        <section className="ysm3-panel ysm3-chart-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                SEVEN-DAY LOOKAHEAD
              </span>

              <h2>
                Appointment <em>activity.</em>
              </h2>
            </div>

            <span className="ysm3-panel-tag">
              NEXT 7 DAYS
            </span>
          </div>

          <div
            className="ysm3-chart"
            role="img"
            aria-label={`Next seven days of active demo requests: ${chart.map(
              (item) =>
                `${item.label} ${item.count}`
            ).join(", ")}`}
          >
            {chart.map((item) => (
              <div
                className="ysm3-chart-col"
                key={item.day}
              >
                <div className="ysm3-chart-value">
                  {item.count}
                </div>

                <div className="ysm3-chart-track">
                  <div
                    className="ysm3-chart-bar"
                    style={{
                      height: `${
                        item.count
                          ? Math.max(
                              12,
                              (item.count / highestCount) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <p className="ysm3-chart-caption">
            Counts reflect currently active
            browser-local appointment requests,
            grouped by requested visit date.
          </p>
        </section>

        <section className="ysm3-panel">
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                SAMPLE TEAM CAPACITY
              </span>

              <h2>
                Dentist <em>workload.</em>
              </h2>
            </div>
          </div>

          <div className="ysm3-workload-list">
            {dentistLoad.map((doctor) => (
              <div
                className="ysm3-workload-item"
                key={doctor.id}
              >
                <div className="ysm3-workload-info">
                  <img
                    src={doctor.image}
                    alt={`Illustrative portrait for ${doctor.name}`}
                  />

                  <div>
                    <strong>{doctor.name}</strong>
                    <small>{doctor.role}</small>
                  </div>

                  <span>{doctor.total}</span>
                </div>

                <div className="ysm3-workload-track">
                  <span
                    style={{
                      width: `${
                        (doctor.total / maximumLoad) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            className="ysm3-panel-link"
            to="/staff/schedules"
          >
            Open Dentist Schedules
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>

      <section className="ysm3-panel ysm3-upcoming-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              NEXT APPOINTMENT REQUESTS
            </span>

            <h2>
              What's <em>coming up.</em>
            </h2>
          </div>

          <Link
            className="ysm3-panel-link"
            to="/staff/appointments"
          >
            View All Requests
            <ArrowRight size={18} />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="ysm3-empty-state">
            <CalendarCheck2 size={32} />

            <h3>No upcoming demo visits.</h3>

            <p>
              Create a fictional appointment request
              from the public calendar to populate
              this dashboard.
            </p>

            <Link
              to="/calendar"
              className="ysm3-secondary-button"
            >
              Open Calendar
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="ysm3-appointment-list">
            {upcoming.map((item) => {
              const service = TREATMENTS.find(
                (t) => t.id === item.serviceId
              );

              const doctor = DENTISTS.find(
                (d) => d.id === item.doctorId
              );

              return (
                <div
                  className="ysm3-appointment-row"
                  key={item.id}
                >
                  <div className="ysm3-date-avatar">
                    <CalendarDays size={20} />
                  </div>

                  <div className="ysm3-appointment-main">
                    <strong>
                      {service?.name ||
                        "Dental consultation"}
                    </strong>

                    <small>
                      {item.alias || "Demo visitor"} ·{" "}
                      {doctor?.name || "Sample dentist"}
                    </small>
                  </div>

                  <div className="ysm3-appointment-time">
                    <strong>
                      {formatDate(item.date)}
                    </strong>

                    <small>
                      {formatTime(item.time)}
                    </small>
                  </div>

                  <span className="ysm3-status-pill">
                    Requested
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="ysm3-dashboard-note">
        <HeartPulse size={23} />

        <div>
          <strong>
            Designed for clarity, not clinical operation.
          </strong>

          <p>
            These statistics represent fictional
            appointment requests. No medical records,
            clinical outcomes, staff authentication,
            or real payments are involved.
          </p>
        </div>
      </div>
    </div>
  );
}