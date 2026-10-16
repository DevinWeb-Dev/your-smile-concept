import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  GitCompareArrows,
  Heart,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import {
  BRAND,
  CATEGORIES,
  IMAGES,
  TREATMENTS,
  formatPeso,
} from "../data/clinicData.js";

import {
  getTreatmentEditorial,
} from "../data/treatmentEditorial.js";

import "../styles/smile-treatments-architectural.css";

/* ===============================================
   ANIMATED SMILE INSTRUMENT
=============================================== */

function SmileInstrument({ className = "" }) {
  return (
    <svg
      className={`st2-instrument ${className}`}
      viewBox="0 0 380 380"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="190"
        cy="190"
        r="147"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".5"
      />

      <circle
        cx="190"
        cy="190"
        r="111"
        stroke="currentColor"
        strokeDasharray="3 9"
        opacity=".55"
      />

      <circle
        cx="190"
        cy="190"
        r="71"
        stroke="currentColor"
        opacity=".35"
      />

      <path
        d="M82 160Q190 279 298 160"
        stroke="currentColor"
        strokeWidth="2"
        className="st2-instrument-arc"
      />

      <circle cx="82" cy="160" r="5" fill="currentColor" />
      <circle cx="298" cy="160" r="5" fill="currentColor" />

      <path
        d="M190 20v32M190 328v32M20 190h32M328 190h32"
        stroke="currentColor"
        opacity=".5"
      />

      <text
        x="190"
        y="84"
        fill="currentColor"
        fontSize="10"
        textAnchor="middle"
        letterSpacing="3"
      >
        Y / S
      </text>

      <text
        x="190"
        y="320"
        fill="currentColor"
        fontSize="9"
        textAnchor="middle"
        letterSpacing="2"
      >
        A STUDY IN CARE
      </text>
    </svg>
  );
}

/* ===============================================
   SCROLL REVEAL
=============================================== */

function Reveal({
  children,
  className = "",
  as: Tag = "div",
}) {
  const element = useRef(null);

  useEffect(() => {
    const target = element.current;
    if (!target) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      target.classList.add("st2-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some((entry) => entry.isIntersecting)
        ) {
          target.classList.add("st2-visible");
          observer.unobserve(target);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={element}
      className={`st2-reveal ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ===============================================
   COMPARISON STUDIO
=============================================== */

function CompareModal({
  items,
  onClose,
  onRemove,
}) {
  const dialog = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    dialog.current
      ?.querySelector("button")
      ?.focus();

    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (
        event.key !== "Tab" ||
        !dialog.current
      ) {
        return;
      }

      const focusable = [
        ...dialog.current.querySelectorAll(
          'button:not([disabled]),a[href]'
        ),
      ];

      if (!focusable.length) return;

      if (
        event.shiftKey &&
        document.activeElement === focusable[0]
      ) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === focusable.at(-1)
      ) {
        event.preventDefault();
        focusable[0].focus();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener(
        "keydown",
        handleKey
      );

      if (previous?.isConnected) {
        previous.focus();
      }
    };
  }, [onClose]);

  const fields = [
    [
      "Care area",
      (item) => item.category,
    ],
    [
      "Sample appointment",
      (item) => `${item.duration} min`,
    ],
    [
      "Illustrative fee from",
      (item) => formatPeso(item.priceFrom),
    ],
    [
      "Discussion topics",
      (item) => item.features.join(" · "),
    ],
  ];

  return createPortal(
    <div
      className="st2-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="st2-modal"
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="st2-modal-title"
      >
        <header className="st2-modal-header">
          <div>
            <span className="st2-eyebrow">
              THE CARE COMPARISON / 01
            </span>

            <h2 id="st2-modal-title">
              A clearer <em>side by side.</em>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
          >
            <X size={21} />
          </button>
        </header>

        <p className="st2-modal-note">
          This compares catalog descriptions,
          not clinical suitability or medical
          outcomes. A licensed practitioner
          must assess appropriate treatment.
        </p>

        <div className="st2-compare-grid">
          <div className="st2-compare-label">
            SELECTED STUDIES
          </div>

          {items.map((item) => (
            <div
              className="st2-compare-intro"
              key={item.id}
            >
              <img src={item.image} alt="" />

              <span>
                {item.number} /{" "}
                {item.category.toUpperCase()}
              </span>

              <h3>{item.name}</h3>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
              >
                REMOVE
                <X size={14} />
              </button>
            </div>
          ))}

          {fields.map(([label, get]) => (
            <div
              key={label}
              className="st2-compare-row"
            >
              <span>{label}</span>

              {items.map((item) => (
                <strong key={item.id}>
                  {get(item)}
                </strong>
              ))}
            </div>
          ))}

          <div className="st2-compare-row st2-compare-actions">
            <span>EXPLORE NEXT</span>

            {items.map((item) => (
              <Link
                onClick={onClose}
                key={item.id}
                to={`/treatments/${item.id}`}
              >
                OPEN JOURNAL
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}

/* ===============================================
   PREMIUM TREATMENT COLLECTION
=============================================== */

export default function TreatmentCollectionPage() {
  const [category, setCategory] = useState(
    "All Treatments"
  );

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("curated");
  const [priceCap, setPriceCap] = useState(5000);
  const [shortOnly, setShortOnly] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [selected, setSelected] = useState([]);
  const [comparing, setComparing] = useState(false);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = TREATMENTS.filter(
      (item) =>
        (category === "All Treatments" ||
          item.category === category) &&
        (!query ||
          `${item.name} ${item.short} ${item.description} ${item.features.join(
            " "
          )}`
            .toLowerCase()
            .includes(query)) &&
        item.priceFrom <= priceCap &&
        (!shortOnly || item.duration <= 45)
    );

    if (order === "price-asc") {
      filtered.sort(
        (a, b) => a.priceFrom - b.priceFrom
      );
    }

    if (order === "price-desc") {
      filtered.sort(
        (a, b) => b.priceFrom - a.priceFrom
      );
    }

    if (order === "shortest") {
      filtered.sort(
        (a, b) => a.duration - b.duration
      );
    }

    return filtered;
  }, [category, search, order, priceCap, shortOnly]);

  const selectedItems = TREATMENTS.filter(
    (item) => selected.includes(item.id)
  );

  function toggleCompare(id) {
    setSelected((old) =>
      old.includes(id)
        ? old.filter((x) => x !== id)
        : old.length < 2
        ? [...old, id]
        : old
    );
  }

  function reset() {
    setCategory("All Treatments");
    setSearch("");
    setOrder("curated");
    setPriceCap(5000);
    setShortOnly(false);
  }

  return (
    <div className="st2 st2-collection">
      {/* ARCHITECTURAL OPENING */}

      <section className="st2-collection-cover">
        <div className="st2-cover-copy">
          <div className="st2-cover-top">
            <span>
              YOUR SMILE. / THE CARE LIBRARY
            </span>

            <span>VOL. 02 / 06 STUDIES</span>
          </div>

          <div className="st2-cover-heading">
            <span className="st2-eyebrow">
              WHERE CLARITY MEETS CARE
            </span>

            <h1>
              Get to know
              <br />
              your <em>options.</em>
            </h1>

            <p>
              Six ways to start a better conversation
              about your smile. Considered information,
              thoughtful imagery, and room for questions.
            </p>

            <a href="#st2-discovery">
              DISCOVER THE COLLECTION
              <ArrowDownRight size={18} />
            </a>
          </div>

          <div className="st2-cover-bottom">
            <span>AN EDITORIAL DENTAL STUDY</span>
            <span>NOT AN OPERATING CLINIC</span>
          </div>
        </div>

        <div className="st2-cover-art">
          <img
            src={IMAGES.treatment}
            alt="Illustrative dental treatment setting"
          />

          <SmileInstrument />

          <div className="st2-cover-seal">
            THE ART OF
            <br />
            FEELING AT EASE
          </div>

          <span>
            IMAGE STUDY / 002 — CARE IN DETAIL
          </span>
        </div>
      </section>

      {/* CARE SIGNATURES */}

      <div className="st2-quiet-ribbon">
        <span>
          <Heart size={18} />
          INFORMED CHOICES
        </span>

        <span>
          <Sparkles size={18} />
          CLEAR EXPLANATIONS
        </span>

        <span>
          <Clock3 size={18} />
          ILLUSTRATIVE VISIT TIMES
        </span>
      </div>

      {/* FILTERS AND DISCOVERY */}

      <section
        className="st2-discovery st2-wrap"
        id="st2-discovery"
      >
        <Reveal className="st2-section-opening">
          <div>
            <span className="st2-eyebrow">
              01 / THE TREATMENT INDEX
            </span>

            <h2>
              Every smile has <em>a story.</em>
            </h2>
          </div>

          <p>
            Explore by care category, example fee
            and appointment length. These filters
            describe sample services—not what
            treatment someone should receive.
          </p>
        </Reveal>

        <div className="st2-filters">
          <div className="st2-filter-top">
            <span>
              <SlidersHorizontal size={17} />
              THE DISCOVERY STUDIO
            </span>

            <button
              type="button"
              onClick={() =>
                setAdvanced((old) => !old)
              }
              aria-expanded={advanced}
            >
              REFINE RESULTS
              <ChevronDown
                size={16}
                className={
                  advanced ? "rotated" : ""
                }
              />
            </button>
          </div>

          <div className="st2-filter-main">
            <label className="st2-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search a concern or service..."
                aria-label="Search dental treatments"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </label>

            <label className="st2-sort">
              ARRANGE BY

              <select
                value={order}
                onChange={(event) =>
                  setOrder(event.target.value)
                }
              >
                <option value="curated">
                  The curated order
                </option>

                <option value="price-asc">
                  Sample fee: low to high
                </option>

                <option value="price-desc">
                  Sample fee: high to low
                </option>

                <option value="shortest">
                  Shortest sample visit
                </option>
              </select>
            </label>
          </div>

          <div
            className="st2-filter-chips"
            role="group"
            aria-label="Filter treatment categories"
          >
            {CATEGORIES.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={
                  category === item
                    ? "is-active"
                    : ""
                }
                aria-pressed={category === item}
              >
                {item}

                <span>
                  {item === "All Treatments"
                    ? TREATMENTS.length
                    : TREATMENTS.filter(
                        (s) => s.category === item
                      ).length}
                </span>
              </button>
            ))}
          </div>

          {advanced && (
            <div className="st2-filter-extra">
              <label>
                MAXIMUM ILLUSTRATIVE STARTING FEE

                <strong>
                  {formatPeso(priceCap)}
                </strong>

                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={100}
                  value={priceCap}
                  onChange={(event) =>
                    setPriceCap(
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label className="st2-switch">
                <input
                  type="checkbox"
                  checked={shortOnly}
                  onChange={(event) =>
                    setShortOnly(event.target.checked)
                  }
                />

                <span>
                  SHOW SAMPLE VISITS OF
                  45 MINUTES OR LESS
                </span>
              </label>
            </div>
          )}

          <div className="st2-filter-bottom">
            <span>
              <b>
                {String(
                  visible.length
                ).padStart(2, "0")}
              </b>

              TREATMENT STUDIES FOUND
            </span>

            <button
              type="button"
              onClick={reset}
            >
              RESET FILTERS
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* ASYMMETRICAL TREATMENT CARDS */}

        {visible.length ? (
          <div className="st2-collection-grid">
            {visible.map((item, index) => {
              const detail =
                getTreatmentEditorial(item.id);

              const chosen = selected.includes(
                item.id
              );

              return (
                <Reveal
                  as="article"
                  key={item.id}
                  className={`st2-study-card st2-theme-${detail.theme}`}
                >
                  <div className="st2-study-photo">
                    <Link
                      to={`/treatments/${item.id}`}
                      aria-label={`Explore ${item.name}`}
                    >
                      <img
                        src={item.image}
                        alt={`Illustrative photograph for ${item.name}`}
                        loading="lazy"
                      />
                    </Link>

                    <span className="st2-study-picture-id">
                      FIELD STUDY / {item.number}
                    </span>

                    <span
                      className="st2-study-geometry"
                      aria-hidden="true"
                    />

                    {index === 0 && (
                      <span className="st2-study-featured">
                        THE FIRST CONVERSATION
                      </span>
                    )}
                  </div>

                  <div className="st2-study-body">
                    <div className="st2-study-overline">
                      <span>{detail.eyebrow}</span>
                      <span>
                        {item.number} / 06
                      </span>
                    </div>

                    <h3>
                      <Link
                        to={`/treatments/${item.id}`}
                      >
                        {item.name}
                        <span>.</span>
                      </Link>
                    </h3>

                    <p>{item.short}</p>

                    <div className="st2-study-features">
                      {item.features
                        .slice(0, 2)
                        .map((feature) => (
                          <span key={feature}>
                            {feature}
                          </span>
                        ))}
                    </div>

                    <div className="st2-study-specs">
                      <span>
                        <Clock3 size={15} />
                        {item.duration} MIN SAMPLE VISIT
                      </span>

                      <strong>
                        {formatPeso(item.priceFrom)}

                        <small>
                          FROM / EXAMPLE ONLY
                        </small>
                      </strong>
                    </div>

                    <div className="st2-study-actions">
                      <Link
                        to={`/treatments/${item.id}`}
                      >
                        READ THE CARE JOURNAL
                        <ArrowUpRight size={17} />
                      </Link>

                      <button
                        type="button"
                        aria-pressed={chosen}
                        onClick={() =>
                          toggleCompare(item.id)
                        }
                        disabled={
                          !chosen &&
                          selected.length >= 2
                        }
                        title={
                          !chosen &&
                          selected.length >= 2
                            ? "Remove one study before adding another"
                            : "Compare treatment details"
                        }
                      >
                        {chosen ? (
                          <Check size={17} />
                        ) : (
                          <GitCompareArrows size={17} />
                        )}

                        {chosen ? "ADDED" : "COMPARE"}
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="st2-no-results">
            <Search size={29} />

            <h3>
              No matching <em>studies.</em>
            </h3>

            <p>
              Try another category, fee limit
              or search phrase.
            </p>

            <button
              type="button"
              onClick={reset}
            >
              CLEAR FILTERS
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        <p className="st2-disclaimer">
          <ShieldCheck size={17} />

          Treatment prices, durations, provider
          images and descriptions are illustrative.
          A licensed professional must determine
          clinical suitability, actual timing,
          risks and final cost.
        </p>
      </section>

      {/* CLOSING EDITORIAL SECTION */}

      <section className="st2-collection-outro">
        <div>
          <span className="st2-eyebrow">
            02 / AN OPEN INVITATION
          </span>

          <h2>
            The first step is <em>a question.</em>
          </h2>

          <p>
            Explore the scheduling experience
            and see how a clinic could make
            the first conversation feel effortless.
            Demo records stay in this browser.
          </p>

          <Link to="/calendar">
            EXPLORE THE DEMO CALENDAR
            <ArrowUpRight size={18} />
          </Link>

          <small>{BRAND.developer}</small>
        </div>

        <div>
          <img
            src={IMAGES.clinic}
            alt="Illustrative contemporary dental clinic space"
            loading="lazy"
          />

          <SmileInstrument />
        </div>
      </section>

      {/* FLOATING COMPARISON DOCK */}

      {selected.length > 0 && (
        <div
          className="st2-compare-dock"
          role="region"
          aria-label="Selected treatments for comparison"
        >
          <div>
            <span>
              THE COMPARISON NOTEBOOK /{" "}
              {selected.length} OF 02
            </span>

            <strong>
              {selectedItems
                .map((item) => item.name)
                .join("  +  ")}
            </strong>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSelected([])}
            >
              CLEAR
              <X size={15} />
            </button>

            <button
              type="button"
              disabled={selected.length < 2}
              onClick={() => setComparing(true)}
            >
              COMPARE TWO
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {comparing &&
        selectedItems.length === 2 && (
          <CompareModal
            items={selectedItems}
            onClose={() => setComparing(false)}
            onRemove={(id) => {
              toggleCompare(id);
              setComparing(false);
            }}
          />
        )}
    </div>
  );
}