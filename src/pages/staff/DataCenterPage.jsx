import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";

import {
  DENTISTS,
  TIME_SLOTS,
  TREATMENTS,
} from "../../data/clinicData.js";

import {
  downloadFile,
  exportAppointmentCSV,
} from "../../utils/clinicReports.js";

const REQUESTS_KEY =
  "your-smile-demo-requests-v1";

const PROFILE_KEY =
  "your-smile-clinic-profile-draft-v1";

const TREATMENTS_KEY =
  "your-smile-treatment-drafts-v1";

const BACKUP_FORMAT =
  "your-smile-demo-backup-v1";

const MAX_FILE_BYTES = 1024 * 1024;

const PROFILE_FIELDS = [
  "clinicName",
  "tagline",
  "locationNote",
  "email",
  "phone",
  "about",
  "internalNotes",
];

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function readObject(key) {
  try {
    const result = JSON.parse(
      localStorage.getItem(key) || "{}"
    );

    return isObject(result) ? result : {};
  } catch {
    return {};
  }
}

function validateBackup(input) {
  if (
    !isObject(input) ||
    input.format !== BACKUP_FORMAT
  ) {
    throw new Error(
      "This file is not a YOUR SMILE demo backup."
    );
  }

  if (!Array.isArray(input.appointments)) {
    throw new Error(
      "The backup does not contain a valid appointment list."
    );
  }

  if (input.appointments.length > 500) {
    throw new Error(
      "The backup contains too many demo appointments."
    );
  }

  if (
    !isObject(input.clinicProfile) ||
    !isObject(input.treatmentDrafts)
  ) {
    throw new Error(
      "The clinic profile or treatment drafts are invalid."
    );
  }

  const ids = new Set();
  const activeSlots = new Set();

  const validServices = new Set(
    TREATMENTS.map((item) => item.id)
  );

  const validDentists = new Set(
    DENTISTS.map((item) => item.id)
  );

  const appointments = input.appointments.map(
    (item, index) => {
      if (!isObject(item)) {
        throw new Error(
          `Appointment ${index + 1} has invalid data.`
        );
      }

      const {
        id,
        alias,
        serviceId,
        doctorId,
        date,
        time,
        status,
        createdAt,
      } = item;

      if (
        typeof id !== "string" ||
        id.length < 1 ||
        id.length > 120 ||
        ids.has(id)
      ) {
        throw new Error(
          "The backup contains an invalid or duplicate reference."
        );
      }

      if (
        typeof alias !== "string" ||
        alias.trim().length < 2 ||
        alias.length > 50
      ) {
        throw new Error(
          "A demo appointment has an invalid alias."
        );
      }

      if (
        !validServices.has(serviceId) ||
        !validDentists.has(doctorId)
      ) {
        throw new Error(
          "A demo appointment refers to an unknown service or dentist."
        );
      }

      if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(
          new Date(`${date}T12:00:00`).getTime()
        )
      ) {
        throw new Error(
          "A demo appointment has an invalid date."
        );
      }

      if (!TIME_SLOTS.includes(time)) {
        throw new Error(
          "A demo appointment has an unknown time slot."
        );
      }

      if (
        status !== "requested" &&
        status !== "cancelled"
      ) {
        throw new Error(
          "A demo appointment has an unknown status."
        );
      }

      ids.add(id);

      if (status === "requested") {
        const slot = `${doctorId}|${date}|${time}`;

        if (activeSlots.has(slot)) {
          throw new Error(
            "The backup contains overlapping active demo appointments."
          );
        }

        activeSlots.add(slot);
      }

      return {
        id,
        alias: alias.trim(),
        serviceId,
        doctorId,
        date,
        time,
        status,
        createdAt:
          typeof createdAt === "string"
            ? createdAt.slice(0, 60)
            : "",
      };
    }
  );

  const clinicProfile = {};

  for (const key of PROFILE_FIELDS) {
    const value = input.clinicProfile[key];

    if (value === undefined) continue;

    if (
      typeof value !== "string" ||
      value.length > 700
    ) {
      throw new Error(
        `The clinic profile field "${key}" is invalid.`
      );
    }

    clinicProfile[key] = value;
  }

  const treatmentDrafts = {};

  for (
    const [id, draft]
    of Object.entries(input.treatmentDrafts)
  ) {
    if (
      !validServices.has(id) ||
      !isObject(draft)
    ) {
      throw new Error(
        "The backup contains an unknown treatment draft."
      );
    }

    const normalized = {};

    if (draft.priceFrom !== undefined) {
  const isEmptyDraft = draft.priceFrom === "";

  const isValidNumber =
    typeof draft.priceFrom === "number" &&
    Number.isFinite(draft.priceFrom) &&
    draft.priceFrom >= 0 &&
    draft.priceFrom <= 1000000;

  if (!isEmptyDraft && !isValidNumber) {
    throw new Error(
      "A treatment draft contains an invalid sample price."
    );
  }

  normalized.priceFrom = draft.priceFrom;
}

    if (draft.short !== undefined) {
      if (
        typeof draft.short !== "string" ||
        draft.short.length > 180
      ) {
        throw new Error(
          "A treatment description draft is invalid."
        );
      }

      normalized.short = draft.short;
    }

    if (draft.visible !== undefined) {
      if (typeof draft.visible !== "boolean") {
        throw new Error(
          "A treatment visibility draft is invalid."
        );
      }

      normalized.visible = draft.visible;
    }

    treatmentDrafts[id] = normalized;
  }

  return {
    appointments,
    clinicProfile,
    treatmentDrafts,
  };
}

export default function DataCenterPage() {
  const {
    requests,
    onReplaceRequests,
  } = useOutletContext();

  const [pending, setPending] = useState(null);
  const [restoreText, setRestoreText] = useState("");
  const [resetText, setResetText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeCount = requests.filter(
    (item) => item.status === "requested"
  ).length;

  function exportJSON() {
    const backup = {
      format: BACKUP_FORMAT,
      version: 1,
      exportedAt: new Date().toISOString(),

      appointments: requests.map((item) => ({
        id: item.id,
        alias: item.alias,
        serviceId: item.serviceId,
        doctorId: item.doctorId,
        date: item.date,
        time: item.time,
        status: item.status,
        createdAt: item.createdAt || "",
      })),

      clinicProfile: readObject(PROFILE_KEY),

      treatmentDrafts: readObject(
        TREATMENTS_KEY
      ),
    };

    downloadFile(
      JSON.stringify(backup, null, 2),
      "your-smile-demo-backup.json",
      "application/json;charset=utf-8"
    );

    setMessage("JSON backup download started.");
    setError("");
  }

  function exportCSV() {
    exportAppointmentCSV(
      requests,
      "your-smile-all-demo-requests.csv"
    );

    setMessage("CSV export download started.");
    setError("");
  }

  async function selectBackup(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    setPending(null);
    setRestoreText("");
    setMessage("");
    setError("");

    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError(
        "Backup file exceeds the 1 MB demo import limit."
      );
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const normalized = validateBackup(parsed);

      setPending(normalized);

      setMessage(
        "Backup validated. Review the summary before restoring."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to read the backup file."
      );
    }
  }

  function restoreBackup() {
    if (
      !pending ||
      restoreText !== "RESTORE"
    ) {
      return;
    }

    if (
      !window.confirm(
        "Restore this backup? It will replace the current demo appointments and saved concept drafts."
      )
    ) {
      return;
    }

    const previousProfile =
      localStorage.getItem(PROFILE_KEY);

    const previousTreatments =
      localStorage.getItem(TREATMENTS_KEY);

    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(pending.clinicProfile)
      );

      localStorage.setItem(
        TREATMENTS_KEY,
        JSON.stringify(pending.treatmentDrafts)
      );

      // Update App's shared appointment state.
      // App will persist this to its existing key.
      onReplaceRequests(pending.appointments);

      setMessage(
        "Demo backup restored. Open the other staff pages to see the restored data."
      );

      setPending(null);
      setRestoreText("");
      setError("");
    } catch {
      // Restore the previous drafts if a write fails.
      try {
        if (previousProfile === null) {
          localStorage.removeItem(PROFILE_KEY);
        } else {
          localStorage.setItem(
            PROFILE_KEY,
            previousProfile
          );
        }

        if (previousTreatments === null) {
          localStorage.removeItem(TREATMENTS_KEY);
        } else {
          localStorage.setItem(
            TREATMENTS_KEY,
            previousTreatments
          );
        }
      } catch {
        // Storage may be unavailable.
      }

      setError(
        "Unable to restore the demo backup."
      );
    }
  }

  function resetAppointments() {
    if (resetText !== "RESET") return;

    if (
      !window.confirm(
        "Delete all browser-local demo appointment requests? This action cannot be undone unless you have a backup."
      )
    ) {
      return;
    }

    onReplaceRequests([]);

    setResetText("");
    setPending(null);
    setRestoreText("");

    setMessage(
      "Demo appointments cleared. Clinic profile and treatment drafts were preserved."
    );
    setError("");
  }

  return (
    <div className="ysm3-page ysm4-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            LOCAL DATA MANAGEMENT / BATCH 4
          </span>

          <h1>
            Every detail,
            <br />
            <em>within your control.</em>
          </h1>

          <p>
            Export, restore and manage
            fictional clinic demonstration data.
          </p>
        </div>

        <span className="ysm4-data-label">
          <Database size={17} />
          BROWSER-LOCAL ONLY
        </span>
      </div>

      <div className="ysm4-data-stats">
        <div>
          <CalendarDays size={23} />
          <strong>{requests.length}</strong>
          <span>Stored demo requests</span>
        </div>

        <div>
          <CheckCircle2 size={23} />
          <strong>{activeCount}</strong>
          <span>Active demo requests</span>
        </div>

        <div>
          <FileJson size={23} />
          <strong>3</strong>
          <span>Demo data categories</span>
        </div>
      </div>

      <div className="ysm4-data-grid">
        <section className="ysm3-panel ysm4-data-card">
          <span className="ysm4-data-card-icon">
            <Download size={25} />
          </span>

          <span className="ysm3-eyebrow">
            01 / EXPORT
          </span>

          <h2>
            Keep a <em>local copy.</em>
          </h2>

          <p>
            Download a JSON backup containing
            demo appointment requests, saved
            profile drafts and treatment drafts.
          </p>

          <button
            type="button"
            className="ysm3-primary-button"
            onClick={exportJSON}
          >
            <FileJson size={17} />
            Export JSON Backup
          </button>

          <button
            type="button"
            className="ysm3-secondary-button"
            onClick={exportCSV}
          >
            <FileSpreadsheet size={17} />
            Export Appointments CSV
          </button>
        </section>

        <section className="ysm3-panel ysm4-data-card">
          <span className="ysm4-data-card-icon">
            <Upload size={25} />
          </span>

          <span className="ysm3-eyebrow">
            02 / RESTORE
          </span>

          <h2>
            Bring back <em>your demo.</em>
          </h2>

          <p>
            Choose a previously exported YOUR SMILE
            JSON backup. The file will be checked
            before you can restore it.
          </p>

          <label className="ysm4-file-input">
            <span>SELECT A JSON BACKUP</span>

            <input
              type="file"
              accept=".json,application/json"
              onChange={selectBackup}
            />
          </label>

          {pending && (
            <div className="ysm4-restore-preview">
              <strong>
                Backup ready for review
              </strong>

              <p>
                {pending.appointments.length} appointment
                records and{" "}
                {
                  Object.keys(
                    pending.treatmentDrafts
                  ).length
                }{" "}
                treatment drafts.
              </p>

              <label className="ysm4-confirm-field">
                <span>
                  Type RESTORE to confirm
                </span>

                <input
                  type="text"
                  autoComplete="off"
                  value={restoreText}
                  onChange={(event) =>
                    setRestoreText(event.target.value)
                  }
                  placeholder="RESTORE"
                />
              </label>

              <button
                type="button"
                className="ysm3-primary-button"
                disabled={restoreText !== "RESTORE"}
                onClick={restoreBackup}
              >
                <RotateCcw size={17} />
                Restore Demo Backup
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="ysm3-panel ysm4-reset-panel">
        <div>
          <span className="ysm3-eyebrow">
            03 / RESET DEMO APPOINTMENTS
          </span>

          <h2>
            Start with a <em>clean calendar.</em>
          </h2>

          <p>
            Clear all sample appointment requests
            from the shared booking state. The
            clinic profile and treatment draft
            settings will remain untouched.
          </p>
        </div>

        <div className="ysm4-reset-controls">
          <label className="ysm4-confirm-field">
            <span>TYPE RESET</span>

            <input
              type="text"
              autoComplete="off"
              value={resetText}
              onChange={(event) =>
                setResetText(event.target.value)
              }
              placeholder="RESET"
            />
          </label>

          <button
            type="button"
            className="ysm4-danger-button"
            disabled={
              resetText !== "RESET" ||
              requests.length === 0
            }
            onClick={resetAppointments}
          >
            <XCircle size={18} />
            Clear Demo Appointments
          </button>
        </div>
      </section>

      {message && (
        <div
          className="ysm4-data-feedback"
          role="status"
        >
          <CheckCircle2 size={20} />
          {message}
        </div>
      )}

      {error && (
        <div
          className="ysm4-data-feedback is-error"
          role="alert"
        >
          <XCircle size={20} />
          {error}
        </div>
      )}

      <div className="ysm3-dashboard-note">
        <ShieldCheck size={23} />

        <div>
          <strong>
            Demo backups are not medical-record backups.
          </strong>

          <p>
            All data remains on the current device unless
            you manually export it. JSON backups are not
            encrypted. Use fictional names only, and never
            put real patient information into this prototype.
          </p>
        </div>
      </div>

      <Link
        to="/staff"
        className="ysm3-panel-link ysm4-back-link"
      >
        Return to Clinic Overview
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}