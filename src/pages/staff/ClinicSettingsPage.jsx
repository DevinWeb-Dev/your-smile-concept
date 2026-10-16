import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  Clock3,
  RotateCcw,
  Save,
  ShieldCheck,
  Smile,
  SlidersHorizontal,
} from "lucide-react";

import {
  BRAND,
  TIME_SLOTS,
  DENTISTS,
  formatTime,
} from "../../data/clinicData.js";

import "../../styles/smile-staff-batch5.css";

export const CLINIC_PROFILE_KEY =
  "your-smile-clinic-profile-draft-v1";

const INITIAL = {
  clinicName: "YOUR SMILE.",
  tagline: BRAND.tagline,
  locationNote: "",
  email: "",
  phone: "",
  about:
    "A modern dental clinic website concept focused on thoughtful care, clarity, and a comfortable appointment experience.",
  internalNotes: "",
};

const LIMITS = {
  clinicName: 90,
  tagline: 150,
  locationNote: 150,
  email: 160,
  phone: 30,
  about: 700,
  internalNotes: 700,
};

function readDraft() {
  try {
    const data = JSON.parse(
      localStorage.getItem(
        CLINIC_PROFILE_KEY
      ) || "null"
    );

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      return { ...INITIAL };
    }

    const safe = { ...INITIAL };

    for (const key of Object.keys(INITIAL)) {
      if (typeof data[key] === "string") {
        safe[key] = data[key].slice(
          0,
          LIMITS[key]
        );
      }
    }

    return safe;
  } catch {
    return { ...INITIAL };
  }
}

export default function ClinicSettingsPage() {
  const [saved, setSaved] =
    useState(readDraft);

  const [draft, setDraft] =
    useState(readDraft);

  const [notice, setNotice] =
    useState("");

  const changed =
    JSON.stringify(draft) !==
    JSON.stringify(saved);

  function update(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setNotice("");
  }

  function save(event) {
    event.preventDefault();

    if (!draft.clinicName.trim()) {
      setNotice(
        "Please enter a draft clinic name."
      );
      return;
    }

    const next = Object.fromEntries(
      Object.keys(INITIAL).map((key) => [
        key,
        draft[key].trim(),
      ])
    );

    try {
      localStorage.setItem(
        CLINIC_PROFILE_KEY,
        JSON.stringify(next)
      );

      setSaved(next);
      setDraft(next);

      setNotice(
        "Business profile draft saved locally. Public website data is unchanged."
      );
    } catch {
      setNotice(
        "Local storage is unavailable. Draft could not be saved."
      );
    }
  }

  function reset() {
    if (
      !window.confirm(
        "Reset the clinic profile DRAFT to the original concept values?"
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem(
        CLINIC_PROFILE_KEY
      );

      setSaved({ ...INITIAL });
      setDraft({ ...INITIAL });

      setNotice(
        "The local profile draft has been reset."
      );
    } catch {
      setNotice(
        "Unable to reset the draft in this browser."
      );
    }
  }

  const fields = [
    [
      "clinicName",
      "CLINIC DISPLAY NAME",
      "text",
      "YOUR SMILE.",
    ],
    [
      "tagline",
      "BRAND TAGLINE",
      "text",
      "Your clinic tagline",
    ],
    [
      "email",
      "BUSINESS CONTACT EMAIL",
      "email",
      "sample@example.com",
    ],
    [
      "phone",
      "BUSINESS CONTACT NUMBER",
      "tel",
      "+63 ...",
    ],
    [
      "locationNote",
      "LOCATION / NOT VERIFIED",
      "text",
      "Proposed city or address",
    ],
  ];

  return (
    <div className="sm5-page">
      <section className="sm5-intro sm5-intro--peach">
        <div>
          <span className="sm5-eyebrow">
            07 / THE CONFIGURATION ATELIER
          </span>

          <h1>
            Every detail <em>considered.</em>
          </h1>

          <p>
            Prepare a fictional clinic identity
            and inspect the system's actual
            appointment rules. Profile edits
            are saved only in this browser.
          </p>

          <Link to="/staff/data">
            OPEN THE DATA VAULT
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="sm5-intro-art"
          aria-hidden="true"
        >
          <span className="sm5-orbit" />
          <strong>07</strong>

          <small>
            THE PROFILE ATELIER / YOUR SMILE.
          </small>
        </div>
      </section>

      <div className="sm5-settings-grid">
        <section className="sm5-panel">
          <header className="sm5-panel-head">
            <div>
              <span className="sm5-eyebrow">
                01 / THE BUSINESS IDENTITY DRAFT
              </span>

              <h2>
                The clinic <em>profile.</em>
              </h2>
            </div>

            <SlidersHorizontal size={23} />
          </header>

          <p className="sm5-body-copy">
            These values are saved as a staff
            concept draft. They do not update
            the public header, contact page,
            appointment hours or treatment prices.
          </p>

          <form
            className="sm5-settings-form"
            onSubmit={save}
          >
            {fields.map(
              ([key, label, type, hint]) => (
                <label key={key}>
                  {label}

                  <input
                    type={type}
                    maxLength={LIMITS[key]}
                    required={
                      key === "clinicName"
                    }
                    value={draft[key]}
                    placeholder={hint}
                    onChange={(event) =>
                      update(
                        key,
                        event.target.value
                      )
                    }
                  />
                </label>
              )
            )}

            <label className="sm5-wide">
              ABOUT THE CONCEPT

              <textarea
                rows={4}
                maxLength={LIMITS.about}
                value={draft.about}
                onChange={(event) =>
                  update(
                    "about",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="sm5-wide">
              PRIVATE DEMO NOTES

              <textarea
                rows={3}
                maxLength={
                  LIMITS.internalNotes
                }
                value={draft.internalNotes}
                placeholder="Internal draft notes — avoid real patient details"
                onChange={(event) =>
                  update(
                    "internalNotes",
                    event.target.value
                  )
                }
              />
            </label>

            <div className="sm5-form-actions sm5-wide">
              <button
                type="submit"
                className="sm5-button"
              >
                <Save size={17} />
                SAVE BROWSER DRAFT
              </button>

              <button
                type="button"
                className="sm5-quiet-button"
                disabled={!changed}
                onClick={() => {
                  setDraft({ ...saved });
                  setNotice(
                    "Unsaved edits discarded."
                  );
                }}
              >
                <RotateCcw size={16} />
                DISCARD EDITS
              </button>

              <small>
                {changed
                  ? "UNSAVED CHANGES"
                  : "DRAFT UP TO DATE"}
              </small>
            </div>
          </form>

          {notice && (
            <p
              className="sm5-feedback"
              role="status"
            >
              {notice}
            </p>
          )}
        </section>

        <aside className="sm5-settings-aside">
          <section className="sm5-preview">
            <span className="sm5-eyebrow">
              02 / LIVE LOCAL PREVIEW
            </span>

            <Smile
              size={32}
              strokeWidth={1.3}
            />

            <h2>
              {draft.clinicName ||
                "YOUR SMILE."}
            </h2>

            <p>
              {draft.tagline ||
                "A thoughtful dental experience."}
            </p>

            <small>
              {[
                draft.email,
                draft.phone,
                draft.locationNote,
              ]
                .filter(Boolean)
                .join(" · ") ||
                "BUSINESS CONTACTS NOT SET"}
            </small>

            <b>
              UNPUBLISHED DEMO PROFILE
            </b>
          </section>

          <section className="sm5-panel">
            <header className="sm5-panel-head">
              <div>
                <span className="sm5-eyebrow">
                  03 / REQUEST ENGINE POLICIES
                </span>

                <h2>
                  The actual <em>rules.</em>
                </h2>
              </div>

              <Clock3 size={22} />
            </header>

            <div className="sm5-rules">
              <div>
                <span>
                  SAMPLE PROVIDERS
                </span>
                <strong>
                  {DENTISTS.length}
                </strong>
              </div>

              <div>
                <span>
                  REQUEST STATUS OPTIONS
                </span>
                <strong>
                  Requested / Cancelled
                </strong>
              </div>

              <div>
                <span>
                  DEMO OPERATING DAYS
                </span>
                <strong>
                  Monday – Saturday
                </strong>
              </div>

              <div>
                <span>
                  VISIBLE TIME OPTIONS
                </span>

                <strong>
                  {TIME_SLOTS.map(
                    formatTime
                  ).join(" · ")}
                </strong>
              </div>

              <div>
                <span>
                  ADVANCE WINDOW
                </span>
                <strong>
                  Next 180 days
                </strong>
              </div>

              <div>
                <span>
                  PAYMENT GATEWAY
                </span>
                <strong>
                  NOT CONNECTED
                </strong>
              </div>
            </div>

            <p className="sm5-note">
              This panel documents the
              existing App.jsx booking rules.
              They cannot be changed by
              editing the profile draft.
            </p>
          </section>

          <section className="sm5-panel sm5-settings-reset">
            <span className="sm5-eyebrow">
              04 / LOCAL DRAFT CONTROL
            </span>

            <h2>
              Return to the <em>original.</em>
            </h2>

            <p className="sm5-body-copy">
              Reset only the locally saved
              profile draft. Appointments
              and treatment drafts
              are preserved.
            </p>

            <button
              type="button"
              className="sm5-quiet-button"
              onClick={reset}
            >
              <RotateCcw size={17} />
              RESET PROFILE DRAFT
            </button>
          </section>
        </aside>
      </div>

      <p className="sm5-privacy">
        <ShieldCheck size={18} />
        No authentication, verified clinic
        credentials, live address, patient
        records, or cross-device synchronization.
        {" "}{BRAND.developer}
      </p>
    </div>
  );
}