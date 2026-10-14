import { useMemo, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { BRAND, TIME_SLOTS, formatTime } from "../../data/clinicData.js";

export const CLINIC_PROFILE_KEY =
  "your-smile-clinic-profile-draft-v1";

const DEFAULT_PROFILE = {
  clinicName: "YOUR SMILE.",
  tagline: BRAND.tagline,
  locationNote: "",
  email: "",
  phone: "",
  about:
    "A modern dental clinic website concept focused on thoughtful care, clarity, and a comfortable appointment experience.",
  internalNotes: "",
};

function readProfile() {
  try {
    const raw = JSON.parse(
      localStorage.getItem(CLINIC_PROFILE_KEY) || "{}"
    );

    const valid =
      raw &&
      typeof raw === "object" &&
      !Array.isArray(raw)
        ? raw
        : {};

    const result = { ...DEFAULT_PROFILE };

    for (const key of Object.keys(DEFAULT_PROFILE)) {
      if (typeof valid[key] === "string") {
        result[key] = valid[key];
      }
    }

    return result;
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function SettingsField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength = 150,
}) {
  return (
    <label className="ysm4-setting-field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

export default function ClinicSettingsPage() {
  const [savedProfile, setSavedProfile] = useState(readProfile);

  const [draft, setDraft] = useState(
    () => ({ ...savedProfile })
  );

  const [message, setMessage] = useState("");

  const dirty = useMemo(
    () =>
      JSON.stringify(draft) !==
      JSON.stringify(savedProfile),
    [draft, savedProfile]
  );

  function update(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  }

  function save(event) {
    event.preventDefault();

    if (!draft.clinicName.trim()) {
      setMessage("Clinic concept name cannot be empty.");
      return;
    }

    const next = Object.fromEntries(
      Object.keys(DEFAULT_PROFILE).map((key) => [
        key,
        draft[key].trim(),
      ])
    );

    try {
      localStorage.setItem(
        CLINIC_PROFILE_KEY,
        JSON.stringify(next)
      );

      setSavedProfile(next);
      setDraft(next);
      setMessage("Draft saved in this browser.");
    } catch {
      setMessage(
        "Browser storage is unavailable. The draft was not saved."
      );
    }
  }

  function discard() {
    setDraft({ ...savedProfile });
    setMessage("Unsaved edits discarded.");
  }

  function resetProfile() {
    if (
      !window.confirm(
        "Reset the clinic profile draft to the original sample values?"
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem(CLINIC_PROFILE_KEY);

      setSavedProfile({ ...DEFAULT_PROFILE });
      setDraft({ ...DEFAULT_PROFILE });

      setMessage("Clinic profile draft reset.");
    } catch {
      setMessage(
        "Unable to reset browser-local settings."
      );
    }
  }

  return (
    <div className="ysm3-page ysm4-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            WORKSPACE CONFIGURATION / BATCH 4
          </span>

          <h1>
            The details that
            <br />
            make it <em>your own.</em>
          </h1>

          <p>
            Customize a sample clinic profile
            without changing the public website.
          </p>
        </div>

        <button
          type="button"
          className="ysm3-secondary-button"
          onClick={resetProfile}
        >
          <RotateCcw size={17} />
          Reset Profile
        </button>
      </div>

      <div className="ysm4-settings-layout">
        <form
          className="ysm3-panel ysm4-settings-form"
          onSubmit={save}
        >
          <div className="ysm3-panel-heading">
            <div>
              <span className="ysm3-eyebrow">
                CLINIC CONCEPT IDENTITY
              </span>

              <h2>
                Profile <em>settings.</em>
              </h2>
            </div>

            <Settings2
              size={25}
              color="#6B9985"
            />
          </div>

          <div className="ysm4-settings-field-grid">
            <SettingsField
              label="CLINIC CONCEPT NAME"
              value={draft.clinicName}
              onChange={(value) =>
                update("clinicName", value)
              }
              placeholder="Your clinic name"
              maxLength={90}
            />

            <SettingsField
              label="TAGLINE"
              value={draft.tagline}
              onChange={(value) =>
                update("tagline", value)
              }
              placeholder="A welcoming tagline"
              maxLength={150}
            />

            <SettingsField
              label="LOCATION NOTE"
              value={draft.locationNote}
              onChange={(value) =>
                update("locationNote", value)
              }
              placeholder="e.g. Proposed Metro Manila branch"
              maxLength={150}
            />

            <SettingsField
              label="SAMPLE CONTACT NUMBER"
              value={draft.phone}
              onChange={(value) =>
                update("phone", value)
              }
              placeholder="Leave blank for the concept"
              maxLength={40}
            />

            <SettingsField
              label="SAMPLE EMAIL"
              type="email"
              value={draft.email}
              onChange={(value) =>
                update("email", value)
              }
              placeholder="Leave blank for the concept"
              maxLength={150}
            />
          </div>

          <label className="ysm4-setting-field">
            <span>ABOUT THE CLINIC CONCEPT</span>

            <textarea
              rows="5"
              maxLength={700}
              value={draft.about}
              onChange={(event) =>
                update("about", event.target.value)
              }
            />
          </label>

          <label className="ysm4-setting-field">
            <span>INTERNAL CONCEPT NOTES</span>

            <textarea
              rows="4"
              maxLength={700}
              placeholder="Design improvements, launch ideas, content notes..."
              value={draft.internalNotes}
              onChange={(event) =>
                update(
                  "internalNotes",
                  event.target.value
                )
              }
            />
          </label>

          {message && (
            <div
              className="ysm4-settings-message"
              role="status"
            >
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          <div className="ysm4-settings-actions">
            <button
              type="submit"
              className="ysm3-primary-button"
              disabled={!dirty}
            >
              <Save size={18} />
              Save Profile Draft
            </button>

            <button
              type="button"
              className="ysm3-secondary-button"
              disabled={!dirty}
              onClick={discard}
            >
              Discard Changes
            </button>
          </div>
        </form>

        <aside className="ysm4-settings-side">
          <div className="ysm4-brand-preview">
            <span className="ysm3-eyebrow">
              PREVIEW / INTERNAL ONLY
            </span>

            <span className="ysm4-preview-symbol">
              <Sparkles size={27} />
            </span>

            <h2>
              {draft.clinicName || "YOUR SMILE."}
            </h2>

            <p>
              {draft.tagline ||
                "A brighter smile. A gentler experience."}
            </p>

            <div className="ysm4-preview-location">
              <MapPin size={17} />
              {draft.locationNote ||
                "No physical location configured"}
            </div>

            <small>
              This preview is not published
              to the customer-facing website.
            </small>
          </div>

          <div className="ysm3-panel ysm4-policy-panel">
            <span className="ysm3-eyebrow">
              DEMO APPOINTMENT POLICY
            </span>

            <h3>
              The scheduling <em>rules.</em>
            </h3>

            <div className="ysm4-policy-row">
              <span>Open sample days</span>
              <strong>Monday–Saturday</strong>
            </div>

            <div className="ysm4-policy-row">
              <span>Closed sample day</span>
              <strong>Sunday</strong>
            </div>

            <div className="ysm4-policy-row">
              <span>Advance request window</span>
              <strong>1–180 days</strong>
            </div>

            <div className="ysm4-policy-row">
              <span>Daily demo slots</span>
              <strong>{TIME_SLOTS.length}</strong>
            </div>

            <p>
              Sample appointment times:{" "}
              {TIME_SLOTS.map(formatTime).join(", ")}.
            </p>

            <div className="ysm4-policy-note">
              <Clock3 size={18} />

              <span>
                These rules come from the existing
                frontend booking engine. They are
                read-only in Batch 4.
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="ysm3-dashboard-note">
        <ShieldCheck size={23} />

        <div>
          <strong>
            Settings are drafts, not real clinic configuration.
          </strong>

          <p>
            No public page, verified business address,
            contact endpoint, appointment policy or
            booking engine setting is changed by
            this editor.
          </p>
        </div>
      </div>
    </div>
  );
}