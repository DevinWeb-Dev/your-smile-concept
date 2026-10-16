import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Database,
  Download,
  LockKeyhole,
  ShieldCheck,
  Upload,
} from "lucide-react";

import DataCenterPage from "./DataCenterPage.jsx";

import "../../styles/smile-staff-batch5.css";

export default function DataVaultPage() {
  const { requests = [] } =
    useOutletContext();

  const active = requests.filter(
    (request) =>
      request.status === "requested"
  ).length;

  const cancelled = requests.filter(
    (request) =>
      request.status === "cancelled"
  ).length;

  return (
    <div className="sm5-page sm5-vault-page">
      <section className="sm5-intro sm5-intro--ink">
        <div>
          <span className="sm5-eyebrow">
            08 / THE LOCAL DATA VAULT
          </span>

          <h1>
            Everything in{" "}
            <em>your hands.</em>
          </h1>

          <p>
            Export, validate and restore fictional
            clinic demonstrations with clear
            boundaries. The original data
            validator and explicit destructive-action
            confirmations remain in use.
          </p>

          <Link to="/staff/settings">
            CLINIC CONFIGURATION
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="sm5-intro-art"
          aria-hidden="true"
        >
          <span className="sm5-orbit" />

          <strong>08</strong>

          <small>
            THE DATA VAULT / YOUR SMILE.
          </small>
        </div>
      </section>

      <div className="sm5-vault-intro">
        <article>
          <Database size={24} />
          <span>
            STORED DEMO RECORDS
          </span>
          <strong>
            {requests.length}
          </strong>
        </article>

        <article>
          <ShieldCheck size={24} />
          <span>
            REQUESTED RECORDS
          </span>
          <strong>{active}</strong>
        </article>

        <article>
          <LockKeyhole size={24} />
          <span>
            CANCELLED RECORDS
          </span>
          <strong>{cancelled}</strong>
        </article>
      </div>

      <section
        className="sm5-vault-primer"
        aria-label="Local archive workflow"
      >
        <div>
          <Download size={22} />
          <strong>
            01 / EXPORT
          </strong>

          <p>
            Download your browser-only
            snapshot or appointment CSV.
          </p>
        </div>

        <div>
          <Upload size={22} />
          <strong>
            02 / VALIDATE
          </strong>

          <p>
            Review a JSON archive before
            any replacement is allowed.
          </p>
        </div>

        <div>
          <ShieldCheck size={22} />
          <strong>
            03 / CONFIRM
          </strong>

          <p>
            Restore or reset only after
            deliberate confirmation.
          </p>
        </div>
      </section>

      <div className="sm5-vault-original">
        <DataCenterPage />
      </div>

      <div className="sm5-vault-warning">
        <LockKeyhole size={21} />

        <div>
          <strong>
            Privacy by design starts
            with fictional data.
          </strong>

          <p>
            JSON exports are not encrypted.
            Imported content is validated,
            but this remains a frontend
            prototype with no authentication
            or secure patient-record service.
            Do not enter actual patient
            information.
          </p>
        </div>

        <Link to="/staff">
          BACK TO DASHBOARD
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}