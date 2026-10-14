import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
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
} from "../data/clinicData.js";

const FILTERS = [
  { value: "all", label: "All Requests" },
  { value: "requested", label: "Active Requests" },
  { value: "cancelled", label: "Cancelled" },
];

function getTreatment(id) {
  return TREATMENTS.find(
    (item) => item.id === id
  );
}

function getDentist(id) {
  return DENTISTS.find(
    (item) => item.id === id
  );
}

export default function AppointmentManagementPage({
  requests,
  onCancelRequest,
}) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const active = requests.filter(
      (item) => item.status === "requested"
    );

    const cancelled = requests.filter(
      (item) => item.status === "cancelled"
    );

    return {
      total: requests.length,
      active: active.length,
      cancelled: cancelled.length,
    };
  }, [requests]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return requests
      .filter((request) => {
        if (
          status !== "all" &&
          request.status !== status
        ) {
          return false;
        }

        const service = getTreatment(
          request.serviceId
        );

        const dentist = getDentist(
          request.doctorId
        );

        const combined = [
          request.id,
          request.alias,
          request.date,
          request.time,
          service?.name,
          dentist?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return combined.includes(query);
      })
      .sort((a, b) => {
        const first = `${a.date} ${a.time}`;
        const second = `${b.date} ${b.time}`;

        return first.localeCompare(second);
      });
  }, [requests, search, status]);

  return (
    <div className="ys2-manage-page">
      <section className="ys2-simple-hero">
        <div className="ys-container">
          <span className="ys-eyebrow">
            YOUR SMILE / DEMO APPOINTMENT MANAGER
          </span>

          <h1>
            Keep the details
            <br />
            <em>beautifully organized.</em>
          </h1>

          <p>
            Browse and manage your fictional appointment
            requests, all within one local experience.
          </p>
        </div>
      </section>

      <section className="ys2-section ys-container">
        <div className="ys2-manage-heading">
          <div>
            <span className="ys-eyebrow">
              THE APPOINTMENT DESK
            </span>

            <h2>
              Your visit <em>overview.</em>
            </h2>
          </div>

          <Link
            className="ys-button"
            to="/calendar"
          >
            <CalendarDays size={17} />
            New Demo Request
          </Link>
        </div>

        <div className="ys2-metric-grid">
          <div className="ys2-metric-card">
            <span>
              <ClipboardList size={22} />
            </span>

            <small>TOTAL REQUESTS</small>
            <strong>{counts.total}</strong>
            <p>Browser-local records</p>
          </div>

          <div className="ys2-metric-card">
            <span>
              <CheckCircle2 size={22} />
            </span>

            <small>ACTIVE DEMO REQUESTS</small>
            <strong>{counts.active}</strong>
            <p>Not confirmed by a real clinic</p>
          </div>

          <div className="ys2-metric-card">
            <span>
              <XCircle size={22} />
            </span>

            <small>CANCELLED</small>
            <strong>{counts.cancelled}</strong>
            <p>Kept for demo history</p>
          </div>
        </div>

        <div className="ys2-manage-toolbar">
          <div
            className="ys2-manage-filters"
            role="group"
            aria-label="Filter appointment requests"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={
                  status === filter.value
                    ? "is-active"
                    : ""
                }
                aria-pressed={status === filter.value}
                onClick={() =>
                  setStatus(filter.value)
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className="ys2-manage-search">
            <Search size={18} />

            <input
              type="search"
              aria-label="Search demo appointments"
              placeholder="Search requests..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="ys2-manage-empty">
            <ClipboardList size={35} />

            <h3>
              Nothing here <em>just yet.</em>
            </h3>

            <p>
              {requests.length === 0
                ? "Create a demo request using our interactive calendar to see it here."
                : "No appointment requests match your selected filters."}
            </p>

            {requests.length === 0 ? (
              <Link
                className="ys-button"
                to="/calendar"
              >
                Open Appointment Calendar
                <ArrowUpRight size={17} />
              </Link>
            ) : (
              <button
                type="button"
                className="ys-button ys-button-outline"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                }}
              >
                Clear Filters
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        ) : (
          <div className="ys2-manage-list">
            {filtered.map((request) => {
              const treatment = getTreatment(
                request.serviceId
              );

              const dentist = getDentist(
                request.doctorId
              );

              const cancelled =
                request.status === "cancelled";

              return (
                <article
                  key={request.id}
                  className="ys2-manage-item"
                >
                  <div className="ys2-manage-item-main">
                    <div className="ys2-manage-date">
                      <CalendarDays size={22} />

                      <span>
                        <small>REQUESTED DATE</small>
                        <strong>
                          {formatDate(request.date)}
                        </strong>
                      </span>
                    </div>

                    <span
                      className={`ys2-manage-status ${
                        cancelled ? "is-cancelled" : ""
                      }`}
                    >
                      {cancelled
                        ? "Cancelled"
                        : "Demo Requested"}
                    </span>
                  </div>

                  <h3>
                    {treatment?.name ||
                      "Dental consultation"}
                  </h3>

                  <div className="ys2-manage-item-details">
                    <div>
                      <Clock3 size={17} />
                      {formatTime(request.time)}
                    </div>

                    <div>
                      <Users size={17} />
                      {dentist?.name || "Sample dentist"}
                    </div>

                    <div>
                      <ShieldCheck size={17} />
                      Alias: {request.alias || "Demo"}
                    </div>
                  </div>

                  <div className="ys2-manage-item-footer">
                    <span>
                      REFERENCE: {request.id}
                    </span>

                    {!cancelled && (
                      <button
                        type="button"
                        onClick={() =>
                          onCancelRequest(request.id)
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

        <div className="ys2-manage-privacy">
          <ShieldCheck size={25} />

          <div>
            <strong>
              Portfolio demonstration, not a patient portal.
            </strong>

            <p>
              Appointment requests are stored only in this
              browser using localStorage. They are not
              synchronized across devices, sent to a
              clinic, or protected by patient-account
              authentication. Please use fictional
              information only.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}