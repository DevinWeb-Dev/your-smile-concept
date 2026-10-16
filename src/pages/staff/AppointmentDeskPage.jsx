import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, CalendarDays,
  ClipboardList, Download, Search, ShieldCheck, SlidersHorizontal,
  Trash2, X,
} from "lucide-react";
import { DENTISTS, TREATMENTS, formatDate, formatTime, formatPeso } from "../../data/clinicData.js";
import { exportAppointmentCSV, localDateKey } from "../../utils/clinicReports.js";

const getDoctor = (id) => DENTISTS.find((d) => d.id === id);
const getService = (id) => TREATMENTS.find((t) => t.id === id);

export default function AppointmentDeskPage() {
  const { requests = [], onCancelRequest } = useOutletContext();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [doctor, setDoctor] = useState("all");
  const [date, setDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const today = localDateKey();
  const open = requests.filter((r) => r.status === "requested").length;
  const selected = requests.find((r) => r.id === selectedId);
  const filtered = useMemo(() => requests.filter((r) => {
    const searchable = [r.alias, r.id, getDoctor(r.doctorId)?.name, getService(r.serviceId)?.name].join(" ").toLowerCase();
    return (status === "all" || r.status === status) &&
      (doctor === "all" || r.doctorId === doctor) &&
      (!date || r.date === date) && searchable.includes(query.trim().toLowerCase());
  }).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
  [requests, query, status, doctor, date]);
  const reset = () => { setQuery(""); setStatus("all"); setDoctor("all"); setDate(""); };

  function cancel() {
    if (!selected || selected.status !== "requested") return;
    // Original App function already displays a confirmation and changes local records.
    onCancelRequest(selected.id);
    setMessage("Cancellation requested. If you confirmed, this record's status will update locally.");
  }

  return (
    <div className="sm4-page">
      <div className="sm4-page-heading">
        <div><span className="sm4-eyebrow">02 / THE APPOINTMENT DESK</span><h1>Every request, <em>in its place.</em></h1><p>Review, filter, and manage fictional appointment requests made in this browser.</p></div>
        <Link className="sm4-btn" to="/calendar">CREATE A DEMO REQUEST <ArrowUpRight size={17}/></Link>
      </div>
      <div className="sm4-strip-stats">
        <div><span>ALL RECORDS</span><strong>{requests.length}</strong></div>
        <div><span>OPEN REQUESTS</span><strong>{open}</strong></div>
        <div><span>CANCELLED</span><strong>{requests.length - open}</strong></div>
        <div><span>FUTURE OPEN REQUESTS</span><strong>{requests.filter((r)=>r.status==="requested" && r.date >= today).length}</strong></div>
      </div>
      <div className="sm4-desk-layout">
        <section className="sm4-panel sm4-ledger">
          <div className="sm4-panel-top"><div><span className="sm4-eyebrow">01 / REQUEST INDEX</span><h2>The appointment <em>ledger.</em></h2></div><ClipboardList size={23}/></div>
          <div className="sm4-filter-pills" role="group" aria-label="Filter by status">
            {[ ["all", "ALL", requests.length], ["requested", "REQUESTED", open], ["cancelled", "CANCELLED", requests.length - open] ].map(([id, label, count]) => (
              <button key={id} type="button" aria-pressed={status===id} className={status===id ? "is-active" : ""} onClick={() => setStatus(id)}><b>{count}</b><span>{label}</span></button>
            ))}
          </div>
          <div className="sm4-filters">
            <label className="sm4-search"><Search size={17}/><input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search alias, reference, service..." aria-label="Search requests"/></label>
            <label><span>DENTIST</span><select value={doctor} onChange={(e)=>setDoctor(e.target.value)}><option value="all">All sample profiles</option>{DENTISTS.map((d)=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
            <label><span>DATE</span><input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/></label>
          </div>
          <div className="sm4-ledger-toolbar">
            <span><SlidersHorizontal size={16}/> {filtered.length} MATCHING RECORD{filtered.length===1?"":"S"}</span>
            <div><button type="button" onClick={reset}>CLEAR FILTERS</button><button type="button" disabled={!filtered.length} onClick={()=>exportAppointmentCSV(filtered,"your-smile-demo-desk.csv")}><Download size={16}/> EXPORT CSV</button></div>
          </div>
          <div className="sm4-ledger-list">
            {filtered.length ? filtered.map((r, index) => (
              <button type="button" className={`sm4-ledger-item ${r.id===selectedId?"is-selected":""}`} key={r.id} aria-pressed={r.id===selectedId} onClick={()=>{setSelectedId(r.id);setMessage("");}}>
                <small>{String(index+1).padStart(2,"0")}</small>
                <span><b>{r.alias}</b><small>{r.id} · {getService(r.serviceId)?.name || "Unknown treatment"}</small></span>
                <span><strong>{formatDate(r.date)}</strong><small>{formatTime(r.time)}</small></span>
                <i className={`sm4-status sm4-status-${r.status}`}>{r.status.toUpperCase()}</i>
                <ArrowUpRight size={17}/>
              </button>
            )) : <div className="sm4-empty"><Search size={28}/><p>No requests match your filters.</p><button type="button" onClick={reset}>SHOW ALL RECORDS <ArrowRight size={15}/></button></div>}
          </div>
        </section>
        <aside className="sm4-panel sm4-inspector">
          {!selected ? <div className="sm4-inspector-placeholder"><CalendarDays size={38}/><span className="sm4-eyebrow">02 / THE REQUEST FOLIO</span><h2>Choose a <em>record.</em></h2><p>Select a sample request in the ledger to view its details and available actions.</p></div> : <>
            <div className="sm4-inspector-head"><span className="sm4-eyebrow">02 / SELECTED REQUEST</span><button type="button" aria-label="Close request details" onClick={()=>setSelectedId(null)}><X size={20}/></button></div>
            <div className="sm4-inspector-image"><img src={getService(selected.serviceId)?.image} alt="Illustrative dental care setting"/><span>YOUR SMILE / REQUEST FOLIO</span></div>
            <div className="sm4-inspector-body">
              <span className={`sm4-status sm4-status-${selected.status}`}>{selected.status.toUpperCase()}</span>
              <h2>{selected.alias}</h2><small>REFERENCE / {selected.id}</small>
              <div className="sm4-folio-facts">
                <div><span>DATE</span><strong>{formatDate(selected.date)}</strong></div>
                <div><span>TIME</span><strong>{formatTime(selected.time)}</strong></div>
                <div><span>FICTIONAL DENTIST</span><strong>{getDoctor(selected.doctorId)?.name || "Unavailable"}</strong></div>
                <div><span>TREATMENT INTEREST</span><strong>{getService(selected.serviceId)?.name || "Unavailable"}</strong></div>
                <div><span>ILLUSTRATIVE FEE FROM</span><strong>{formatPeso(getService(selected.serviceId)?.priceFrom)}</strong></div>
                <div><span>CREATED</span><strong>{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-PH") : "—"}</strong></div>
              </div>
              {selected.status === "requested" && <button type="button" className="sm4-cancel" onClick={cancel}><Trash2 size={18}/> CANCEL DEMO REQUEST</button>}
              {selected.status === "cancelled" && <p className="sm4-fine">Cancelled demo requests remain in the local history and no longer occupy their sample time slot.</p>}
              {message && <p className="sm4-alert" role="status">{message}</p>}
              <p className="sm4-disclosure"><ShieldCheck size={17}/> The original browser-local handler controls cancellation and asks for confirmation.</p>
            </div>
          </>}
        </aside>
      </div>
      <p className="sm4-disclosure"><ShieldCheck size={17}/> Aliases are fictional demo values. Exported CSVs are local files; keep them private if users have typed identifiable information.</p>
    </div>
  );
}
