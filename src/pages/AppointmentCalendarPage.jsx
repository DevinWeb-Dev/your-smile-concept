import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import {
  DENTISTS,
  TREATMENTS,
  TIME_SLOTS,
  formatDate,
  formatPeso,
  formatTime,
} from "../data/clinicData.js";

import "../styles/smile-people-architectural.css";

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function offset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return date;
}

function nextOpenDay() {
  const date = offset(1);

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return dateKey(date);
}

function monthCells(year, month) {
  const padding = new Date(
    year,
    month,
    1,
    12
  ).getDay();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      year,
      month,
      index - padding + 1,
      12
    );

    return {
      key: dateKey(date),
      num: date.getDate(),
      day: date.getDay(),
      isMonth: date.getMonth() === month,
    };
  });
}

function validated(items, id) {
  return items.some((item) => item.id === id)
    ? id
    : items[0].id;
}

export default function AppointmentCalendarPage({
  requests = [],
  onCreateRequest,
}) {
  const [params] = useSearchParams();

  const [serviceId, setServiceId] = useState(() =>
    validated(TREATMENTS, params.get("service"))
  );

  const [doctorId, setDoctorId] = useState(() =>
    validated(DENTISTS, params.get("doctor"))
  );

  const [chosenDate, setChosenDate] = useState(
    nextOpenDay
  );

  const [slot, setSlot] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const [calendarMonth, setCalendarMonth] = useState(
    () => {
      const date = new Date(
        `${nextOpenDay()}T12:00:00`
      );

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
      };
    }
  );

  const today = dateKey(offset(1));
  const last = dateKey(offset(180));

  const treatment =
    TREATMENTS.find(
      (item) => item.id === serviceId
    ) || TREATMENTS[0];

  const doctor =
    DENTISTS.find(
      (item) => item.id === doctorId
    ) || DENTISTS[0];

  const cells = useMemo(
    () =>
      monthCells(
        calendarMonth.year,
        calendarMonth.month
      ),
    [calendarMonth]
  );

  const reservations = useMemo(
    () =>
      requests.filter(
        (item) =>
          item.status === "requested" &&
          item.doctorId === doctorId
      ),
    [requests, doctorId]
  );

  const timesUsed = new Set(
    reservations
      .filter(
        (item) =>
          item.date === chosenDate
      )
      .map((item) => item.time)
  );

  const countByDay = useMemo(() => {
    const records = new Map();

    for (const request of reservations) {
      if (!records.has(request.date)) {
        records.set(request.date, new Set());
      }

      records.get(request.date).add(request.time);
    }

    return records;
  }, [reservations]);

  const startMonth = new Date(
    `${today}T12:00:00`
  );

  const endMonth = new Date(
    `${last}T12:00:00`
  );

  const currentNumber =
    calendarMonth.year * 12 +
    calendarMonth.month;

  const minNumber =
    startMonth.getFullYear() * 12 +
    startMonth.getMonth();

  const maxNumber =
    endMonth.getFullYear() * 12 +
    endMonth.getMonth();

  const monthLabel = new Date(
    calendarMonth.year,
    calendarMonth.month,
    1
  ).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const chosenIsValid =
    chosenDate >= today &&
    chosenDate <= last &&
    new Date(
      `${chosenDate}T12:00:00`
    ).getDay() !== 0;

  function changeDate(next) {
    setChosenDate(next);
    setSlot("");
    setError("");
    setSaved("");
  }

  function changeDoctor(id) {
    setDoctorId(id);
    setSlot("");
    setError("");
    setSaved("");
  }

  function shiftMonth(amount) {
    const date = new Date(
      calendarMonth.year,
      calendarMonth.month + amount,
      1
    );

    const number =
      date.getFullYear() * 12 +
      date.getMonth();

    if (
      number < minNumber ||
      number > maxNumber
    ) {
      return;
    }

    setCalendarMonth({
      year: date.getFullYear(),
      month: date.getMonth(),
    });
  }

  function submit(event) {
    event.preventDefault();

    setError("");
    setSaved("");

    if (
      !chosenIsValid ||
      !slot ||
      timesUsed.has(slot)
    ) {
      setError(
        "Select a valid date and available demo time."
      );
      return;
    }

    const result = onCreateRequest({
      alias: alias.trim(),
      serviceId,
      doctorId,
      date: chosenDate,
      time: slot,
    });

    if (!result?.ok) {
      setError(
        result?.error ||
          "Could not save this demo request."
      );
      return;
    }

    setSaved(result.id);
    setAlias("");
    setSlot("");
  }

  return (
    <div className="sp3 sp3-calendar">
      {/* ARCHITECTURAL CALENDAR HERO */}

      <section className="sp3-calendar-hero">
        <div>
          <span className="sp3-overline">
            THE APPOINTMENT ATELIER / CHAPTER 03
          </span>

          <h1>
            Find a moment <em>for you.</em>
          </h1>

          <p>
            A quieter way to explore scheduling.
            Choose a fictional provider, treatment
            interest and sample time—then save a
            browser-only request.
          </p>

          <a href="#sp3-booking-board">
            CHOOSE YOUR MOMENT
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="sp3-calendar-hero__art">
          <div className="sp3-calendar-hero__orbit">
            <CalendarDays
              size={67}
              strokeWidth={1}
            />
          </div>

          <span>
            TIME / CARE / CONVERSATION
          </span>
        </div>
      </section>

      {/* JOURNEY INDICATOR */}

      <div className="sp3-calendar-progress sp3-container">
        <span>
          <b>01</b> CHOOSE YOUR INTEREST
        </span>

        <span>
          <b>02</b> SELECT A DATE
        </span>

        <span>
          <b>03</b> CHOOSE A TIME
        </span>

        <span>
          <b>04</b> SAVE A DEMO REQUEST
        </span>
      </div>

      <section
        className="sp3-container sp3-calendar-grid"
        id="sp3-booking-board"
      >
        <div className="sp3-calendar-work">
          {/* SERVICE AND DENTIST */}

          <div className="sp3-calendar-heading">
            <span className="sp3-overline">
              01 / THE PEOPLE & CARE
            </span>

            <h2>
              First, the <em>details.</em>
            </h2>

            <p>
              Your choices are illustrative;
              they are not linked to a real
              dental practice.
            </p>
          </div>

          <div className="sp3-calendar-choices">
            <label>
              TREATMENT INTEREST

              <select
                value={serviceId}
                onChange={(event) => {
                  setServiceId(event.target.value);
                  setSaved("");
                  setError("");
                }}
              >
                {TREATMENTS.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              FICTIONAL PROFESSIONAL

              <select
                value={doctorId}
                onChange={(event) =>
                  changeDoctor(event.target.value)
                }
              >
                {DENTISTS.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* INTERACTIVE MONTH */}

          <div className="sp3-month">
            <div className="sp3-month__head">
              <div>
                <span className="sp3-overline">
                  02 / SELECT A DATE
                </span>

                <h2>{monthLabel}</h2>
              </div>

              <div>
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={
                    currentNumber <= minNumber
                  }
                  onClick={() => shiftMonth(-1)}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  aria-label="Next month"
                  disabled={
                    currentNumber >= maxNumber
                  }
                  onClick={() => shiftMonth(1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="sp3-month__weekdays">
              {[
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT",
              ].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="sp3-month__days">
              {cells.map((cell) => {
                const valid =
                  cell.isMonth &&
                  cell.key >= today &&
                  cell.key <= last &&
                  cell.day !== 0;

                const full =
                  (countByDay.get(cell.key)?.size ||
                    0) >= TIME_SLOTS.length;

                return (
                  <button
                    type="button"
                    key={cell.key}
                    disabled={!valid || full}
                    aria-pressed={
                      cell.key === chosenDate
                    }
                    aria-label={`${
                      formatDate(cell.key)
                    }${
                      full
                        ? ", all demo times occupied"
                        : ""
                    }`}
                    className={[
                      cell.isMonth
                        ? ""
                        : "is-outside",
                      cell.key === chosenDate
                        ? "is-picked"
                        : "",
                      full && valid
                        ? "is-full"
                        : "",
                    ].join(" ")}
                    onClick={() =>
                      changeDate(cell.key)
                    }
                  >
                    <strong>{cell.num}</strong>

                    {valid && (
                      <i aria-hidden="true" />
                    )}

                    {full && valid && (
                      <small>FULL</small>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="sp3-month__legend">
              <span>
                <i />
                SELECTABLE DEMO DAY
              </span>

              <span>
                <i />
                SELECTED
              </span>

              <span>
                <i />
                SUNDAY / OUT OF WINDOW UNAVAILABLE
              </span>
            </div>
          </div>

          {/* TIME SELECTION */}

          <div className="sp3-time-atelier">
            <div>
              <span className="sp3-overline">
                03 / SELECT A SAMPLE TIME
              </span>

              <h2>
                {formatDate(chosenDate)}
              </h2>

              <p>
                {TIME_SLOTS.length - timesUsed.size} /{" "}
                {TIME_SLOTS.length} sample slots
                remaining for this provider
                on this date
              </p>
            </div>

            <div className="sp3-time-list">
              {TIME_SLOTS.map((time) => (
                <button
                  type="button"
                  key={time}
                  disabled={
                    timesUsed.has(time) ||
                    !chosenIsValid
                  }
                  aria-pressed={slot === time}
                  className={
                    slot === time
                      ? "is-picked"
                      : ""
                  }
                  onClick={() => {
                    setSlot(time);
                    setError("");
                    setSaved("");
                  }}
                >
                  <Clock3 size={17} />

                  <span>
                    {formatTime(time)}
                  </span>

                  {timesUsed.has(time) ? (
                    <small>OCCUPIED</small>
                  ) : slot === time ? (
                    <Check size={17} />
                  ) : (
                    <ArrowUpRight size={17} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STICKY LIVE REQUEST FOLIO */}

        <aside className="sp3-calendar-ticket">
          <div className="sp3-calendar-ticket__art">
            <img
              src={doctor.image}
              alt={`Illustrative portrait for fictional ${doctor.name}`}
            />

            <span>
              THE DEMO APPOINTMENT FOLIO
            </span>
          </div>

          <div className="sp3-calendar-ticket__body">
            <span className="sp3-overline">
              04 / YOUR REQUEST PREVIEW
            </span>

            <h2>
              Make it <em>yours.</em>
            </h2>

            <div className="sp3-ticket-doctor">
              <b>{doctor.name}</b>
              <span>
                {doctor.role} / FICTIONAL
              </span>
            </div>

            <div className="sp3-ticket-lines">
              <div>
                <span>CARE INTEREST</span>
                <strong>
                  {treatment.name}
                </strong>
              </div>

              <div>
                <span>YOUR DATE</span>
                <strong>
                  {formatDate(chosenDate)}
                </strong>
              </div>

              <div>
                <span>YOUR TIME</span>

                <strong>
                  {slot
                    ? formatTime(slot)
                    : "Select a time"}
                </strong>
              </div>

              <div>
                <span>ILLUSTRATIVE FROM</span>

                <strong>
                  {formatPeso(
                    treatment.priceFrom
                  )}
                </strong>
              </div>
            </div>

            <form onSubmit={submit}>
              <label htmlFor="sp3-alias">
                FICTIONAL VISITOR ALIAS
              </label>

              <input
                id="sp3-alias"
                type="text"
                required
                minLength={2}
                maxLength={50}
                value={alias}
                onChange={(event) =>
                  setAlias(event.target.value)
                }
                placeholder="e.g. Demo Visitor"
              />

              <button
                type="submit"
                disabled={
                  !slot ||
                  !chosenIsValid
                }
              >
                SAVE DEMO REQUEST
                <ArrowUpRight size={18} />
              </button>
            </form>

            {error && (
              <p
                className="sp3-ticket-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {saved && (
              <div
                className="sp3-ticket-success"
                role="status"
              >
                <CalendarCheck2 size={22} />

                <strong>
                  Demo request saved.
                </strong>

                <small>
                  Reference: {saved}
                </small>

                <Link to="/manage">
                  VIEW SAVED REQUEST
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}

            <p className="sp3-calendar-fine">
              <ShieldCheck size={16} />

              No live availability, actual
              appointment, treatment recommendation,
              payment or patient record. Use a
              fictional alias only.
            </p>
          </div>
        </aside>
      </section>

      {/* FINAL CHAPTER */}

      <section className="sp3-calendar-bottom">
        <div>
          <span className="sp3-overline">
            AN INVITATION TO EXPLORE
          </span>

          <h2>
            Have more <em>questions?</em>
          </h2>

          <p>
            Explore the dentist journals and care
            library before choosing any sample slot.
          </p>

          <div>
            <Link to="/dentists">
              THE PEOPLE JOURNAL
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/treatments">
              THE CARE LIBRARY
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}