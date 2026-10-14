import { useMemo, useState } from "react";

import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Filter,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

import {
  DENTISTS,
  TREATMENTS,
  formatDate,
  formatTime,
} from "../../data/clinicData.js";

function csvCell(value) {
  let text = String(value ?? "");

  // Prevent spreadsheet applications from
  // executing user-provided values as formulas.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCSV(rows) {
  const header = [
    "Reference",
    "Demo Alias",
    "Treatment",
    "Dentist",
    "Date",
    "Time",
    "Status",
  ];

  const lines = [
    header.map(csvCell).join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.alias,
        TREATMENTS.find(
          (t) => t.id === row.serviceId
        )?.name || "",
        DENTISTS.find(
          (d) => d.id === row.doctorId
        )?.name || "",
        row.date,
        row.time,
        row.status,
      ]
        .map(csvCell)
        .join(",")
    ),
  ];

  const blob = new Blob(
    [lines.join("\r\n")],
    {
      type: "text/csv;charset=utf-8",
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "your-smile-demo-appointments.csv";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function AppointmentDeskPage() {
  const {
    requests,
    onCancelRequest,
  } = useOutletContext();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [doctorId, setDoctorId] = useState("all");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return requests
      .filter((item) => {
        if (
          status !== "all" &&
          item.status !== status
        ) {
          return false;
        }

        if (
          doctorId !== "all" &&
          item.doctorId !== doctorId
        ) {
          return false;
        }

        if (date && item.date !== date) {
          return false;
        }

        const treatment = TREATMENTS.find(
          (t) => t.id === item.serviceId
        );

        const dentist = DENTISTS.find(
          (d) => d.id === item.doctorId
        );

        const content = [
          item.id,
          item.alias,
          item.date,
          item.time,
          treatment?.name,
          dentist?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return content.includes(q);
      })
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(
          `${b.date} ${b.time}`
        )
      );
  }, [requests, query, status, doctorId, date]);

  const requestedCount = requests.filter(
    (item) => item.status === "requested"
  ).length;

  const cancelledCount = requests.filter(
    (item) => item.status === "cancelled"
  ).length;

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setDoctorId("all");
    setDate("");
  }

  return (
    <div className="ysm3-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            APPOINTMENT MANAGEMENT
          </span>

          <h1>
            Every request,
            <br />
            <em>beautifully in order.</em>
          </h1>

          <p>
            Review, filter and manage the fictional
            appointment requests made in this browser.
          </p>
        </div>

        <Link
          className="ysm3-primary-button"
          to="/calendar"
        >
          <CalendarDays size={18} />
          New Demo Request
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="ysm3-desk-overview">
        <div>
          <ClipboardList size={22} />

          <span>
            <strong>{requests.length}</strong>
            <small>Total requests</small>
          </span>
        </div>

        <div>
          <CheckCircle2 size={22} />

          <span>
            <strong>{requestedCount}</strong>
            <small>Active requests</small>
          </span>
        </div>

        <div>
          <XCircle size={22} />

          <span>
            <strong>{cancelledCount}</strong>
            <small>Cancelled requests</small>
          </span>
        </div>
      </div>

      <section className="ysm3-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              THE REQUEST DESK
            </span>

            <h2>
              Appointment <em>records.</em>
            </h2>
          </div>

          <button
            className="ysm3-secondary-button"
            type="button"
            onClick={() => downloadCSV(filtered)}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        <div className="ysm3-filter-grid">
          <label className="ysm3-filter-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search alias, ID, treatment..."
              aria-label="Search requests"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />
          </label>

          <label>
            <span>STATUS</span>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="all">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label>
            <span>SAMPLE DENTIST</span>

            <select
              value={doctorId}
              onChange={(event) =>
                setDoctorId(event.target.value)
              }
            >
              <option value="all">All Dentists</option>

              {DENTISTS.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {doctor.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>APPOINTMENT DATE</span>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>
        </div>

        <div className="ysm3-filter-summary">
          <span>
            <Filter size={15} />
            Showing {filtered.length} of{" "}
            {requests.length} demo records
          </span>

          <button
            type="button"
            onClick={clearFilters}
          >
            Clear all filters
            <ArrowRight size={15} />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="ysm3-empty-state">
            <ClipboardList size={33} />

            <h3>No matching demo requests.</h3>

            <p>
              Try clearing the filters or create a
              sample appointment from the public calendar.
            </p>

            <button
              type="button"
              className="ysm3-secondary-button"
              onClick={clearFilters}
            >
              Clear Filters
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="ysm3-desk-list">
            {filtered.map((item) => {
              const treatment = TREATMENTS.find(
                (t) => t.id === item.serviceId
              );

              const doctor = DENTISTS.find(
                (d) => d.id === item.doctorId
              );

              const isCancelled =
                item.status === "cancelled";

              return (
                <article
                  key={item.id}
                  className="ysm3-desk-card"
                >
                  <div className="ysm3-desk-card-top">
                    <span className="ysm3-reference">
                      {item.id}
                    </span>

                    <span
                      className={`ysm3-status-pill ${
                        isCancelled
                          ? "is-cancelled"
                          : ""
                      }`}
                    >
                      {isCancelled
                        ? "Cancelled"
                        : "Demo Requested"}
                    </span>
                  </div>

                  <div className="ysm3-desk-card-body">
                    <div className="ysm3-desk-card-icon">
                      <ClipboardList size={24} />
                    </div>

                    <div className="ysm3-desk-card-copy">
                      <h3>
                        {treatment?.name ||
                          "Dental Consultation"}
                      </h3>

                      <strong>
                        Demo alias:{" "}
                        {item.alias || "Visitor"}
                      </strong>

                      <div className="ysm3-desk-card-meta">
                        <span>
                          <Users size={16} />
                          {doctor?.name ||
                            "Sample Dentist"}
                        </span>

                        <span>
                          <CalendarDays size={16} />
                          {formatDate(item.date)}
                        </span>

                        <span>
                          <Clock3 size={16} />
                          {formatTime(item.time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ysm3-desk-card-bottom">
                    <small>
                      No real patient information
                      or clinical status
                    </small>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() =>
                          onCancelRequest(item.id)
                        }
                      >
                        <Trash2 size={17} />
                        Cancel Demo Request
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="ysm3-dashboard-note">
        <ShieldCheck size={23} />

        <div>
          <strong>Privacy-first demonstration</strong>

          <p>
            The CSV contains only browser-local
            fictional appointment data. Do not
            use this prototype to process real
            patient records or health details.
          </p>
        </div>
      </div>
    </div>
  );
}