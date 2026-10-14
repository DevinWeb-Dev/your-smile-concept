import { useMemo, useState } from "react";

import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  DENTISTS,
  TREATMENTS,
  TIME_SLOTS,
  formatDate,
  formatTime,
} from "../../data/clinicData.js";

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getToday() {
  return dateKey(new Date());
}

function addDate(day, offset) {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() + offset);

  return dateKey(date);
}

function getWeekday(day) {
  return new Date(
    `${day}T12:00:00`
  ).getDay();
}

export default function DentistSchedulesPage() {
  const { requests } = useOutletContext();

  const [selectedDate, setSelectedDate] = useState(
    getToday
  );

  const [selectedDoctor, setSelectedDoctor] = useState(
    "all"
  );

  const sunday = getWeekday(selectedDate) === 0;

  const doctors = DENTISTS.filter(
    (doctor) =>
      selectedDoctor === "all" ||
      doctor.id === selectedDoctor
  );

  const activeForDate = useMemo(() => {
    return requests.filter(
      (item) =>
        item.date === selectedDate &&
        item.status === "requested"
    );
  }, [requests, selectedDate]);

  const visibleAppointments = activeForDate.filter(
    (item) =>
      selectedDoctor === "all" ||
      item.doctorId === selectedDoctor
  );

  const bookedCells = new Set(
    activeForDate.map(
      (item) => `${item.doctorId}|${item.time}`
    )
  );

  const totalSlots =
    sunday
      ? 0
      : doctors.length * TIME_SLOTS.length;

  const bookedSlotCount = sunday
    ? 0
    : activeForDate.filter(
        (item) =>
          doctors.some(
            (doctor) => doctor.id === item.doctorId
          )
      ).length;

  const availableSlots = Math.max(
    0,
    totalSlots - bookedSlotCount
  );

  const dateHeading = new Date(
    `${selectedDate}T12:00:00`
  ).toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="ysm3-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            CLINIC TEAM / SAMPLE SCHEDULE
          </span>

          <h1>
            A more organized
            <br />
            <em>day of care.</em>
          </h1>

          <p>
            See which demo appointment times have
            been requested across the sample dental team.
          </p>
        </div>

        <Link
          className="ysm3-primary-button"
          to="/calendar"
        >
          <CalendarDays size={18} />
          Public Calendar
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <section className="ysm3-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              DAILY AVAILABILITY OVERVIEW
            </span>

            <h2>
              Dentist <em>schedules.</em>
            </h2>
          </div>

          <span className="ysm3-panel-tag">
            READ-ONLY DEMO BOARD
          </span>
        </div>

        <div className="ysm3-schedule-controls">
          <div className="ysm3-schedule-date-nav">
            <button
              type="button"
              aria-label="Previous day"
              onClick={() =>
                setSelectedDate(
                  (current) => addDate(current, -1)
                )
              }
            >
              <ChevronLeft size={21} />
            </button>

            <div>
              <small>SELECTED DATE</small>
              <strong>{dateHeading}</strong>
            </div>

            <button
              type="button"
              aria-label="Next day"
              onClick={() =>
                setSelectedDate(
                  (current) => addDate(current, 1)
                )
              }
            >
              <ChevronRight size={21} />
            </button>
          </div>

          <label className="ysm3-schedule-filter">
            <span>SHOW DENTISTS</span>

            <select
              value={selectedDoctor}
              onChange={(event) =>
                setSelectedDoctor(event.target.value)
              }
            >
              <option value="all">
                All Sample Dentists
              </option>

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
        </div>

        <div className="ysm3-schedule-stats">
          <span>
            <CalendarClock size={18} />
            {totalSlots} sample slots
          </span>

          <span>
            <Users size={18} />
            {bookedSlotCount} requested
          </span>

          <span>
            <Clock3 size={18} />
            {availableSlots} open
          </span>
        </div>

        {sunday ? (
          <div className="ysm3-schedule-closed">
            <CalendarClock size={32} />

            <h3>Sample clinic closed on Sundays.</h3>

            <p>
              Select Monday through Saturday
              to preview scheduled demo slots.
            </p>
          </div>
        ) : (
          <div className="ysm3-schedule-scroll">
            <div
              className="ysm3-schedule-board"
              style={{
                "--ysm3-doctors": doctors.length,
              }}
            >
              <div className="ysm3-schedule-corner">
                TIME SLOT
              </div>

              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="ysm3-schedule-doctor"
                >
                  <img
                    src={doctor.image}
                    alt={`Sample portrait for ${doctor.name}`}
                  />

                  <span>
                    <strong>{doctor.name}</strong>
                    <small>{doctor.role}</small>
                  </span>
                </div>
              ))}

              {TIME_SLOTS.map((time) => (
                <div
                  className="ysm3-schedule-row"
                  key={time}
                >
                  <div className="ysm3-schedule-time">
                    {formatTime(time)}
                  </div>

                  {doctors.map((doctor) => {
                    const occupied = bookedCells.has(
                      `${doctor.id}|${time}`
                    );

                    const request =
                      activeForDate.find(
                        (item) =>
                          item.doctorId === doctor.id &&
                          item.time === time
                      );

                    return (
                      <div
                        key={`${doctor.id}-${time}`}
                        className={`ysm3-schedule-slot ${
                          occupied ? "is-booked" : ""
                        }`}
                      >
                        {occupied ? (
                          <>
                            <strong>
                              Demo Requested
                            </strong>

                            <small>
                              {request?.alias ||
                                "Sample visitor"}
                            </small>
                          </>
                        ) : (
                          <>
                            <span className="ysm3-slot-dot" />

                            <strong>Available</strong>

                            <small>
                              Demo time slot
                            </small>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="ysm3-schedule-footnote">
          This read-only timetable is based on
          active browser-local requests. It does not
          represent actual dentist availability,
          staffing decisions or clinical schedules.
        </p>
      </section>

      <section className="ysm3-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              REQUESTS FOR THE SELECTED DAY
            </span>

            <h2>
              Daily <em>appointments.</em>
            </h2>
          </div>

          <span className="ysm3-panel-tag">
            {visibleAppointments.length} REQUESTS
          </span>
        </div>

        {visibleAppointments.length === 0 ? (
          <div className="ysm3-empty-state">
            <CalendarClock size={34} />

            <h3>No requests for this date.</h3>

            <p>
              Use the public calendar to create
              a fictional appointment request.
            </p>
          </div>
        ) : (
          <div className="ysm3-appointment-list">
            {[...visibleAppointments]
              .sort((a, b) =>
                a.time.localeCompare(b.time)
              )
              .map((request) => {
                const doctor = DENTISTS.find(
                  (item) =>
                    item.id === request.doctorId
                );

                const treatment = TREATMENTS.find(
                  (item) =>
                    item.id === request.serviceId
                );

                return (
                  <div
                    key={request.id}
                    className="ysm3-appointment-row"
                  >
                    <div className="ysm3-date-avatar">
                      <CalendarClock size={20} />
                    </div>

                    <div className="ysm3-appointment-main">
                      <strong>
                        {treatment?.name ||
                          "Dental visit"}
                      </strong>

                      <small>
                        {request.alias} ·{" "}
                        {doctor?.name}
                      </small>
                    </div>

                    <div className="ysm3-appointment-time">
                      <strong>
                        {formatTime(request.time)}
                      </strong>

                      <small>
                        {formatDate(request.date)}
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
        <ShieldCheck size={22} />

        <div>
          <strong>
            This is an availability viewer,
            not a real scheduling authority.
          </strong>

          <p>
            The calendar intentionally does not
            create real staff shifts or clinical
            work schedules. It visualizes demo
            appointments from the same browser data.
          </p>
        </div>
      </div>
    </div>
  );
}