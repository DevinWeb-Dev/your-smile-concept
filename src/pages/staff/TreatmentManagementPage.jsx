import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardEdit,
  Eye,
  EyeOff,
  Pencil,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";

import {
  CATEGORIES,
  TREATMENTS,
  formatPeso,
} from "../../data/clinicData.js";

const DRAFTS_KEY =
  "your-smile-treatment-drafts-v1";

function loadDrafts() {
  try {
    const data = JSON.parse(
      window.localStorage.getItem(
        DRAFTS_KEY
      ) || "{}"
    );

    return data &&
      typeof data === "object" &&
      !Array.isArray(data)
      ? data
      : {};
  } catch {
    return {};
  }
}

export default function TreatmentManagementPage() {
  const [drafts, setDrafts] = useState(
    loadDrafts
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    "All Treatments"
  );

  const [visibilityFilter, setVisibilityFilter] =
    useState("all");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DRAFTS_KEY,
        JSON.stringify(drafts)
      );
    } catch (error) {
      console.warn(
        "Treatment drafts could not be saved:",
        error
      );
    }
  }, [drafts]);

  function effectiveTreatment(item) {
    const draft = drafts[item.id] || {};

    const price = Number(draft.priceFrom);

    return {
      ...item,

      priceFrom:
        Number.isFinite(price) &&
        price >= 0 &&
        draft.priceFrom !== undefined
          ? price
          : item.priceFrom,

      short:
        typeof draft.short === "string"
          ? draft.short
          : item.short,

      visible:
        typeof draft.visible === "boolean"
          ? draft.visible
          : true,
    };
  }

  const treatments = useMemo(
    () =>
      TREATMENTS.map((item) => {
        const draft = drafts[item.id] || {};
        const price = Number(draft.priceFrom);

        return {
          ...item,

          priceFrom:
            Number.isFinite(price) &&
            price >= 0 &&
            draft.priceFrom !== undefined
              ? price
              : item.priceFrom,

          short:
            typeof draft.short === "string"
              ? draft.short
              : item.short,

          visible:
            typeof draft.visible === "boolean"
              ? draft.visible
              : true,

          edited: Object.keys(draft).length > 0,
        };
      }),
    [drafts]
  );

  const visible = useMemo(
    () =>
      treatments.filter((item) => {
        const matchesCategory =
          category === "All Treatments" ||
          item.category === category;

        const matchesVisibility =
          visibilityFilter === "all" ||
          (visibilityFilter === "visible"
            ? item.visible
            : !item.visible);

        const q = query.toLowerCase().trim();

        const matchesQuery =
          !q ||
          `${item.name} ${item.category} ${item.short}`
            .toLowerCase()
            .includes(q);

        return (
          matchesCategory &&
          matchesVisibility &&
          matchesQuery
        );
      }),
    [treatments, category, visibilityFilter, query]
  );

  const draftCount = treatments.filter(
    (item) => item.edited
  ).length;

  const hiddenCount = treatments.filter(
    (item) => !item.visible
  ).length;

  function updateDraft(id, changes) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        ...changes,
      },
    }));
  }

  function resetOne(id) {
    if (
      !window.confirm(
        "Reset the staff-only draft for this treatment?"
      )
    ) {
      return;
    }

    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    setEditingId(null);
  }

  function resetAll() {
    if (
      !window.confirm(
        "Reset all staff-only treatment drafts?"
      )
    ) {
      return;
    }

    setDrafts({});
    setEditingId(null);
  }

  return (
    <div className="ysm3-page">
      <div className="ysm3-page-heading">
        <div>
          <span className="ysm3-eyebrow">
            SERVICE CATALOG / STAFF DRAFTS
          </span>

          <h1>
            Thoughtful services.
            <br />
            <em>Beautifully presented.</em>
          </h1>

          <p>
            Preview and organize sample treatment
            catalog content for a future clinic website.
          </p>
        </div>

        <Link
          className="ysm3-primary-button"
          to="/treatments"
        >
          <Eye size={18} />
          Public Treatment Catalog
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="ysm3-desk-overview">
        <div>
          <Stethoscope size={22} />

          <span>
            <strong>{TREATMENTS.length}</strong>
            <small>Catalog treatments</small>
          </span>
        </div>

        <div>
          <ClipboardEdit size={22} />

          <span>
            <strong>{draftCount}</strong>
            <small>Edited local drafts</small>
          </span>
        </div>

        <div>
          <EyeOff size={22} />

          <span>
            <strong>{hiddenCount}</strong>
            <small>Planned hidden items</small>
          </span>
        </div>
      </div>

      <section className="ysm3-panel">
        <div className="ysm3-panel-heading">
          <div>
            <span className="ysm3-eyebrow">
              MANAGE CATALOG DRAFTS
            </span>

            <h2>
              Treatment <em>collection.</em>
            </h2>
          </div>

          <button
            type="button"
            className="ysm3-secondary-button"
            onClick={resetAll}
            disabled={draftCount === 0}
          >
            <RotateCcw size={17} />
            Reset All Drafts
          </button>
        </div>

        <div className="ysm3-catalog-filters">
          <label className="ysm3-filter-search">
            <Search size={18} />

            <input
              type="search"
              aria-label="Search treatment drafts"
              placeholder="Search treatments..."
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />
          </label>

          <label>
            <span>CATEGORY</span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {CATEGORIES.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>PLANNED VISIBILITY</span>

            <select
              value={visibilityFilter}
              onChange={(event) =>
                setVisibilityFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Draft Items
              </option>

              <option value="visible">
                Planned Visible
              </option>

              <option value="hidden">
                Planned Hidden
              </option>
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="ysm3-empty-state">
            <Search size={31} />

            <h3>No treatments match.</h3>

            <p>
              Try different filters or clear
              the search field.
            </p>

            <button
              type="button"
              className="ysm3-secondary-button"
              onClick={() => {
                setQuery("");
                setCategory("All Treatments");
                setVisibilityFilter("all");
              }}
            >
              Clear Filters
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="ysm3-catalog-grid">
            {visible.map((item) => {
              const isEditing =
                editingId === item.id;

              const preview = effectiveTreatment(
                item
              );

              return (
                <article
                  className="ysm3-catalog-card"
                  key={item.id}
                >
                  <div className="ysm3-catalog-photo">
                    <img
                      src={item.image}
                      alt={`Illustrative ${item.name}`}
                      loading="lazy"
                    />

                    <span>
                      {item.category}
                    </span>
                  </div>

                  <div className="ysm3-catalog-body">
                    <div className="ysm3-catalog-card-top">
                      <span className="ysm3-reference">
                        {item.number} / 06
                      </span>

                      <span
                        className={`ysm3-catalog-status ${
                          !item.visible
                            ? "is-hidden"
                            : ""
                        }`}
                      >
                        {item.visible
                          ? "Planned Visible"
                          : "Planned Hidden"}
                      </span>
                    </div>

                    <h3>{item.name}</h3>

                    <p>{item.short}</p>

                    <div className="ysm3-catalog-meta">
                      <span>
                        Sample fee from
                      </span>

                      <strong>
                        {formatPeso(item.priceFrom)}
                      </strong>
                    </div>

                    <div className="ysm3-catalog-actions">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(
                            isEditing
                              ? null
                              : item.id
                          )
                        }
                      >
                        {isEditing ? (
                          <X size={17} />
                        ) : (
                          <Pencil size={17} />
                        )}

                        {isEditing
                          ? "Close Editor"
                          : "Edit Draft"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateDraft(
                            item.id,
                            {
                              visible: !item.visible,
                            }
                          )
                        }
                      >
                        {item.visible ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                        {item.visible
                          ? "Plan Hide"
                          : "Plan Show"}
                      </button>
                    </div>

                    {isEditing && (
                      <div className="ysm3-catalog-editor">
                        <span className="ysm3-eyebrow">
                          STAFF-ONLY DRAFT
                        </span>

                        <label>
                          <span>
                            SAMPLE STARTING FEE (PHP)
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={preview.priceFrom}
                            onChange={(event) =>
                              updateDraft(
                                item.id,
                                {
                                  priceFrom:
                                    event.target.value === ""
                                      ? ""
                                      : Number(
                                          event.target.value
                                        ),
                                }
                              )
                            }
                          />
                        </label>

                        <label>
                          <span>
                            SHORT TREATMENT DESCRIPTION
                          </span>

                          <textarea
                            rows="4"
                            maxLength="180"
                            value={preview.short}
                            onChange={(event) =>
                              updateDraft(
                                item.id,
                                {
                                  short:
                                    event.target.value,
                                }
                              )
                            }
                          />
                        </label>

                        <div className="ysm3-catalog-editor-bottom">
                          <span>
                            <Check size={16} />
                            Auto-saved locally
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              resetOne(item.id)
                            }
                          >
                            <RotateCcw size={15} />
                            Reset Item
                          </button>
                        </div>
                      </div>
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
          <strong>
            Draft changes do not publish to the public website.
          </strong>

          <p>
            These edits are saved only in this
            browser for portfolio demonstration.
            The original public treatment catalog
            continues to use the sample data
            from clinicData.js until a real
            content management system is implemented.
          </p>
        </div>
      </div>
    </div>
  );
}