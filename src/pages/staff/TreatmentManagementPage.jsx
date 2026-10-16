import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Eye, EyeOff,
  Pencil, RotateCcw, Save, Search, ShieldCheck, SlidersHorizontal,
} from "lucide-react";
import { CATEGORIES, TREATMENTS, formatPeso } from "../../data/clinicData.js";

const KEY = "your-smile-treatment-drafts-v1";
function readDrafts() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function combine(item, draft = {}) {
  const numeric = Number(draft.priceFrom);
  return {
    ...item,
    priceFrom: draft.priceFrom !== "" && draft.priceFrom !== undefined && Number.isFinite(numeric) && numeric >= 0 ? numeric : item.priceFrom,
    short: typeof draft.short === "string" ? draft.short : item.short,
    visible: typeof draft.visible === "boolean" ? draft.visible : true,
    edited: Object.keys(draft).length > 0,
  };
}

export default function TreatmentManagementPage() {
  const [drafts, setDrafts] = useState(readDrafts);
  const [selectedId, setSelectedId] = useState(TREATMENTS[0]?.id || "");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Treatments");
  const [visibility, setVisibility] = useState("all");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(drafts)); }
    catch { /* Storage may be disabled in private mode. */ }
  }, [drafts]);
  const treatments = useMemo(()=>TREATMENTS.map((t)=>combine(t,drafts[t.id])), [drafts]);
  const selected = treatments.find((t)=>t.id===selectedId);
  const visible = treatments.filter((t) =>
    (category === "All Treatments" || t.category === category) &&
    (visibility === "all" || (visibility === "shown" ? t.visible : !t.visible)) &&
    `${t.name} ${t.short} ${t.category}`.toLowerCase().includes(query.toLowerCase().trim())
  );
  const changed = treatments.filter((t)=>t.edited).length;
  const hidden = treatments.filter((t)=>!t.visible).length;

  function update(id, changes) {
    setDrafts((current)=>({ ...current, [id]: { ...(current[id] || {}), ...changes } }));
    setNotice("Local staff draft changed. The public treatment catalog remains unchanged.");
  }
  function resetOne(id) {
    if (!window.confirm("Reset the staff-only draft for this treatment?")) return;
    setDrafts((current)=>{ const next = { ...current }; delete next[id]; return next; });
    setNotice("Draft restored to original concept values.");
  }
  function resetAll() {
    if (!window.confirm("Reset all treatment drafts saved in this browser?")) return;
    setDrafts({}); setNotice("All staff-only treatment drafts reset.");
  }

  return (
    <div className="sm4-page">
      <div className="sm4-page-heading"><div><span className="sm4-eyebrow">04 / THE TREATMENT MANAGEMENT ATELIER</span><h1>Precision in <em>every detail.</em></h1><p>Curate six fictional service previews, experiment with sample fees, and plan catalog visibility in browser-local drafts.</p></div><Link className="sm4-btn" to="/treatments">PUBLIC TREATMENT LIBRARY <ArrowUpRight size={17}/></Link></div>
      <div className="sm4-strip-stats"><div><span>CONCEPT TREATMENTS</span><strong>{TREATMENTS.length}</strong></div><div><span>EDITED LOCAL DRAFTS</span><strong>{changed}</strong></div><div><span>PLANNED HIDDEN</span><strong>{hidden}</strong></div><div><span>PUBLIC CATALOG CHANGES</span><strong>00</strong></div></div>
      <div className="sm4-treatment-layout">
        <section className="sm4-panel sm4-treatment-index">
          <div className="sm4-panel-top"><div><span className="sm4-eyebrow">01 / SERVICE COLLECTION</span><h2>The care <em>index.</em></h2></div><SlidersHorizontal size={23}/></div>
          <div className="sm4-filters sm4-treatment-filters"><label className="sm4-search"><Search size={17}/><input type="search" placeholder="Find a service..." aria-label="Search treatments" value={query} onChange={(e)=>setQuery(e.target.value)}/></label><label><span>CATEGORY</span><select value={category} onChange={(e)=>setCategory(e.target.value)}>{CATEGORIES.map((c)=><option key={c}>{c}</option>)}</select></label><label><span>PLANNED VISIBILITY</span><select value={visibility} onChange={(e)=>setVisibility(e.target.value)}><option value="all">All</option><option value="shown">Visible</option><option value="hidden">Hidden</option></select></label></div>
          <div className="sm4-treatment-list">
            {visible.map((t)=><button type="button" key={t.id} className={`sm4-treatment-card ${selectedId===t.id?"is-selected":""}`} aria-pressed={selectedId===t.id} onClick={()=>setSelectedId(t.id)}>
              <img src={t.image} alt=""/><span><small>{t.number} / {t.category.toUpperCase()}</small><strong>{t.name}</strong><small>{formatPeso(t.priceFrom)} · {t.duration} MINUTE SAMPLE</small></span><b className={t.visible?"":"is-hidden"}>{t.visible?"PLANNED VISIBLE":"PLANNED HIDDEN"}{t.edited?" · EDITED":""}</b><ArrowUpRight size={17}/>
            </button>)}
            {!visible.length && <div className="sm4-empty"><Search size={28}/><p>No services match these filters.</p><button type="button" onClick={()=>{setQuery("");setCategory("All Treatments");setVisibility("all");}}>RESET FILTERS <ArrowRight size={16}/></button></div>}
          </div>
          <button type="button" className="sm4-reset-all" disabled={!changed} onClick={resetAll}><RotateCcw size={16}/> RESET ALL STAFF DRAFTS</button>
        </section>
        <aside className="sm4-panel sm4-treatment-editor">
          {selected && <>
            <div className="sm4-panel-top"><div><span className="sm4-eyebrow">02 / SELECTED SERVICE FOLIO</span><h2>Make it <em>clearer.</em></h2></div><Pencil size={23}/></div>
            <div className="sm4-editor-photo"><img src={selected.image} alt={`Illustrative ${selected.name}`}/><span>EDITORIAL SERVICE / {selected.number}</span></div>
            <h3>{selected.name}</h3><p className="sm4-fine">Draft changes are private to this browser. The public catalog still uses the original source configuration.</p>
            <label className="sm4-editor-field"><span>ILLUSTRATIVE STARTING FEE / PHP</span><input type="number" min="0" max="1000000" step="50" value={drafts[selected.id]?.priceFrom ?? selected.priceFrom} onChange={(e)=>update(selected.id,{priceFrom:e.target.value})}/></label>
            <label className="sm4-editor-field"><span>SHORT INFORMATIONAL DESCRIPTION</span><textarea rows={4} maxLength={180} value={selected.short} onChange={(e)=>update(selected.id,{short:e.target.value})}/></label>
            <div className="sm4-editor-check"><span><b>PLANNED PUBLIC VISIBILITY</b><small>This is a draft preview; it does not hide the public page.</small></span><button type="button" className={selected.visible?"is-on":""} aria-pressed={selected.visible} onClick={()=>update(selected.id,{visible:!selected.visible})}>{selected.visible?<Eye size={17}/>:<EyeOff size={17}/>} {selected.visible?"SHOW":"HIDE"}</button></div>
            <div className="sm4-editor-actions"><span><Save size={17}/> AUTO-SAVED LOCAL DRAFT</span><button type="button" disabled={!selected.edited} onClick={()=>resetOne(selected.id)}><RotateCcw size={15}/> RESET ITEM</button></div>
            {notice && <p role="status" className="sm4-alert">{notice}</p>}
            <Link className="sm4-inline" to={`/treatments/${selected.id}`}>VIEW ORIGINAL TREATMENT JOURNAL <ArrowUpRight size={16}/></Link>
          </>}
        </aside>
      </div>
      <p className="sm4-disclosure"><ShieldCheck size={17}/> Sample prices and descriptions are portfolio placeholders, not actual clinical quotations. Changes to public clinic information require verified content and source updates.</p>
    </div>
  );
}
