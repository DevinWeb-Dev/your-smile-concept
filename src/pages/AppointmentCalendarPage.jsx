import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  DENTISTS,
  TREATMENTS,
  TIME_SLOTS,
  formatDate,
  formatPeso,
  formatTime,
} from "../data/clinicData.js";

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(days) {
  const result = new Date();
  result.setHours(12, 0, 0, 0);
  result.setDate(result.getDate() + days);
  return result;
}

function firstAvailableDate() {
  const result = addDays(1);

  while (result.getDay() === 0) {
    result.setDate(result.getDate() + 1);
  }

  return dateKey(result);
}

function makeCalendar(year, month) {
  const first = new Date(year, month, 1, 12);
  const offset = first.getDay();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      year,
      month,
      index - offset + 1,
      12
    );

    return {
      key: dateKey(date),
      day: date.getDate(),
      weekday: date.getDay(),
      currentMonth: date.getMonth() === month,
    };
  });
}

export default function AppointmentCalendarPage({
  requests,
  onCreateRequest,
}) {
  const [params] = useSearchParams();

  const defaultService = TREATMENTS.some(
    (item) => item.id === params.get("service")
  )
    ? params.get("service")
    : TREATMENTS[0].id;

  const defaultDoctor = DENTISTS.some(
    (item) => item.id === params.get("doctor")
  )
    ? params.get("doctor")
    : DENTISTS[0].id;

  const [serviceId, setServiceId] = useState(defaultService);
  const [doctorId, setDoctorId] = useState(defaultDoctor);
  const [selectedDate, setSelectedDate] = useState(
    firstAvailableDate
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = new Date(`${firstAvailableDate()}T12:00:00`);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  });

  const minimumDate = dateKey(addDays(1));
  const maximumDate = dateKey(addDays(180));

  const treatment = TREATMENTS.find(
    (item) => item.id === serviceId
  );

  const doctor = DENTISTS.find(
    (item) => item.id === doctorId
  );

  useEffect(() => {
    const serviceParam = params.get("service");
    const doctorParam = params.get("doctor");

    if (
      TREATMENTS.some(
        (item) => item.id === serviceParam
      )
    ) {
      setServiceId(serviceParam);
    }

    if (
      DENTISTS.some(
        (item) => item.id === doctorParam
      )
    ) {
      setDoctorId(doctorParam);
    }
  }, [params]);

  const cells = useMemo(
    () => makeCalendar(
      visibleMonth.year,
      visibleMonth.month
    ),
    [visibleMonth.year, visibleMonth.month]
  );

  const occupied = useMemo(() => {
    return requests
      .filter(
        (item) =>
          item.status === "requested" &&
          item.doctorId === doctorId &&
          item.date === selectedDate
      )
      .map((item) => item.time);
  }, [requests, doctorId, selectedDate]);

  const takenDates = useMemo(() => {
    const bookings = new Map();

    requests.forEach((item) => {
      if (
        item.status !== "requested" ||
        item.doctorId !== doctorId
      ) {
        return;
      }

      if (!bookings.has(item.date)) {
        bookings.set(item.date, new Set());
      }

      bookings.get(item.date).add(item.time);
    });

    return bookings;
  }, [requests, doctorId]);

  const monthTitle = new Date(
    visibleMonth.year,
    visibleMonth.month,
    1
  ).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const currentMonthNumber =
    visibleMonth.year * 12 + visibleMonth.month;

  const minDateObject = new Date(
    `${minimumDate}T12:00:00`
  );

  const maxDateObject = new Date(
    `${maximumDate}T12:00:00`
  );

  const minimumMonth =
    minDateObject.getFullYear() * 12 +
    minDateObject.getMonth();

  const maximumMonth =
    maxDateObject.getFullYear() * 12 +
    maxDateObject.getMonth();

  function shiftMonth(amount) {
    const next = new Date(
      visibleMonth.year,
      visibleMonth.month + amount,
      1
    );

    const nextValue =
      next.getFullYear() * 12 + next.getMonth();

    if (
      nextValue < minimumMonth ||
      nextValue > maximumMonth
    ) {
      return;
    }

    setVisibleMonth({
      year: next.getFullYear(),
      month: next.getMonth(),
    });
  }

  function changeDate(day) {
    setSelectedDate(day);
    setSelectedTime("");
    setError("");
    setSavedId("");
  }

  function changeDoctor(id) {
    setDoctorId(id);
    setSelectedTime("");
    setError("");
    setSavedId("");
  }

  function submit(event) {
    event.preventDefault();

    if (!selectedTime) {
      setError(
        "Please select an available demo time slot."
      );
      return;
    }

    const result = onCreateRequest({
      alias,
      serviceId,
      doctorId,
      date: selectedDate,
      time: selectedTime,
    });

    if (!result.ok) {
      setError(result.error);
      setSavedId("");
      return;
    }

    setSavedId(result.id);
    setAlias("");
    setSelectedTime("");
    setError("");
  }

  return (
    <div className="ys2-calendar-page">
      <section className="ys2-simple-hero">
        <div className="ys-container">
          <span className="ys-eyebrow">
            YOUR SMILE / INTERACTIVE CALENDAR
          </span>

          <h1>
            Find a moment
            <br />
            <em>for your smile.</em>
          </h1>

          <p>
            Explore a sample clinic schedule,
            choose your preferred treatment and dentist,
            then save a fictional appointment request.
          </p>
        </div>
      </section>

      <section className="ys2-section ys-container">
        <div className="ys2-calendar-layout">
          <div className="ys2-calendar-main">
            <div className="ys2-calendar-form-row">
              <label>
                <span>01 / TREATMENT</span>

                <select
                  value={serviceId}
                  onChange={(event) => {
                    setServiceId(event.target.value);
                    setSavedId("");
                    setError("");
                  }}
                >
                  {TREATMENTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>02 / SAMPLE DENTIST</span>

                <select
                  value={doctorId}
                  onChange={(event) =>
                    changeDoctor(event.target.value)
                  }
                >
                  {DENTISTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="ys2-calendar-panel">
              <div className="ys2-calendar-header">
                <div>
                  <span className="ys-eyebrow">
                    03 / SELECT A DATE
                  </span>

                  <h2>{monthTitle}</h2>
                </div>

                <div className="ys2-calendar-arrows">
                  <button
                    type="button"
                    aria-label="Previous month"
                    disabled={
                      currentMonthNumber <= minimumMonth
                    }
                    onClick={() => shiftMonth(-1)}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next month"
                    disabled={
                      currentMonthNumber >= maximumMonth
                    }
                    onClick={() => shiftMonth(1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="ys2-calendar-weekdays">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="ys2-calendar-days">
                {cells.map((cell) => {
                  const valid =
                    cell.currentMonth &&
                    cell.key >= minimumDate &&
                    cell.key <= maximumDate &&
                    cell.weekday !== 0;

                  const selected =
                    cell.key === selectedDate;

                  const fullyBooked =
                    (takenDates.get(cell.key)?.size || 0) >=
                    TIME_SLOTS.length;

                  return (
                    <button
                      type="button"
                      key={cell.key}
                      disabled={!valid || fullyBooked}
                      className={[
                        "ys2-calendar-day",
                        selected ? "is-selected" : "",
                        !cell.currentMonth ? "is-other" : "",
                        fullyBooked && valid
                          ? "is-full"
                          : "",
                      ].join(" ")}
                      aria-label={`${formatDate(
                        cell.key
                      )}${fullyBooked ? ", fully booked" : ""}`}
                      aria-pressed={selected}
                      onClick={() => changeDate(cell.key)}
                    >
                      <span>{cell.day}</span>

                      {valid && !fullyBooked && (
                        <i aria-hidden="true" />
                      )}

                      {valid && fullyBooked && (
                        <small>Full</small>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="ys2-calendar-legend">
                <span>
                  <i className="ys2-legend-available" />
                  Available demo date
                </span>

                <span>
                  <i className="ys2-legend-selected" />
                  Selected
                </span>

                <span>
                  <i className="ys2-legend-full" />
                  Fully booked
                </span>
              </div>
            </div>

            <div className="ys2-calendar-times">
              <div className="ys2-calendar-times-title">
                <div>
                  <span className="ys-eyebrow">
                    04 / CHOOSE A TIME
                  </span>

                  <h3>
                    {formatDate(selectedDate)}
                  </h3>
                </div>

                <span className="ys2-time-count">
                  {TIME_SLOTS.length - occupied.length} of{" "}
                  {TIME_SLOTS.length} available
                </span>
              </div>

              <div className="ys2-time-grid">
                {TIME_SLOTS.map((slot) => {
                  const isTaken = occupied.includes(slot);
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isTaken}
                      aria-pressed={isSelected}
                      className={
                        isSelected ? "is-selected" : ""
                      }
                      onClick={() => {
                        setSelectedTime(slot);
                        setError("");
                        setSavedId("");
                      }}
                    >
                      <Clock3 size={17} />

                      <span>{formatTime(slot)}</span>

                      {isTaken && <small>Taken</small>}

                      {isSelected && (
                        <CheckCircle2 size={17} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="ys2-calendar-side">
            <div className="ys2-appointment-summary">
              <span className="ys-eyebrow">
                YOUR VISIT PREVIEW
              </span>

              <h3>
                A little time
                <br />
                <em>for you.</em>
              </h3>

              <div className="ys2-summary-doctor">
                <img
                  src={doctor.image}
                  alt={`Illustrative portrait of ${doctor.name}`}
                />

                <div>
                  <small>SAMPLE PROVIDER</small>
                  <strong>{doctor.name}</strong>
                  <span>{doctor.role}</span>
                </div>
              </div>

              <div className="ys2-summary-list">
                <div>
                  <span>
                    <Sparkles size={16} />
                    Treatment
                  </span>

                  <strong>{treatment.name}</strong>
                </div>

                <div>
                  <span>
                    <CalendarDays size={16} />
                    Date
                  </span>

                  <strong>{formatDate(selectedDate)}</strong>
                </div>

                <div>
                  <span>
                    <Clock3 size={16} />
                    Time
                  </span>

                  <strong>
                    {selectedTime
                      ? formatTime(selectedTime)
                      : "Select a time"}
                  </strong>
                </div>

                <div>
                  <span>Illustrative fee from</span>
                  <strong>
                    {formatPeso(treatment.priceFrom)}
                  </strong>
                </div>
              </div>

              <form
                className="ys2-calendar-submit"
                onSubmit={submit}
              >
                <label htmlFor="ys2-visitor-alias">
                  SAMPLE NAME / ALIAS
                </label>

                <input
                  id="ys2-visitor-alias"
                  type="text"
                  value={alias}
                  onChange={(event) =>
                    setAlias(event.target.value)
                  }
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="e.g. Demo Visitor"
                />

                {error && (
                  <div
                    className="ys2-calendar-error"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="ys-button"
                  disabled={!selectedTime}
                >
                  Save Demo Request
                  <ArrowUpRight size={17} />
                </button>
              </form>

              <div className="ys2-calendar-safety">
                <ShieldCheck size={18} />

                <p>
                  Portfolio prototype only. No real
                  appointment is created. Use a fictional
                  alias, not personal medical information.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {savedId && (
          <div
            className="ys2-calendar-success"
            role="status"
            aria-live="polite"
          >
            <CalendarCheck2 size={34} />

            <div>
              <span className="ys-eyebrow">
                DEMO REQUEST SAVED
              </span>

              <h3>
                Your date is on the <em>demo calendar.</em>
              </h3>

              <p>
                Reference: <strong>{savedId}</strong>
              </p>

              <Link to="/manage">
                View My Demo Requests
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}