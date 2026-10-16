import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, CalendarClock,
  ChevronLeft, ChevronRight, Clock3, ShieldCheck, Users,
} from "lucide-react";
import { DENTISTS, TIME_SLOTS, TREATMENTS, formatDate, formatTime } from "../../data/clinicData.js";
import { localDateKey, shiftDate } from "../../utils/clinicReports.js";

const moveDay = (key, amount) => {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
};

export default function DentistSchedulesPage() {
  const { requests = [] } = useOutletContext();
  const [date, setDate] = useState(() => shiftDate(1));
  const [doctorId, setDoctorId] = useState("all");
  const [selection, setSelection] = useState(null);
  const closed = new Date(`${date}T12:00:00`).getDay() === 0;
  const doctors = DENTISTS.filter((d) => doctorId === "all" || d.id === doctorId);
  const live = useMemo(() => requests.filter((r) => r.date === date && r.status === "requested"), [requests, date]);
  const occupied = new Map(live.map((r) => [`${r.doctorId}|${r.time}`, r]));
  const daily = live.filter((r) => doctors.some((d) => d.id === r.doctorId));
  const capacity = closed ? 0 : doctors.length * TIME_SLOTS.length;
  const inspectorRecord = selection && occupied.get(`${selection.doctorId}|${selection.time}`);
  const inspectorDoctor = selection && DENTISTS.find((d) => d.id === selection.doctorId);

  function pickDate(next) {
    setDate(next); setSelection(null);
  }

  return (
    <div className="sm4-page">
      <div className="sm4-page-heading"><div><span className="sm4-eyebrow">03 / THE CLINICAL TIME ATLAS</span><h1>The day, <em>thoughtfully mapped.</em></h1><p>Inspect sample appointment slots by fictional dentist, date, and time. This timeline is read-only; the public Calendar creates demo requests.</p></div><Link className="sm4-btn" to="/calendar">PUBLIC APPOINTMENT CALENDAR <ArrowUpRight size={17}/></Link></div>
      <section className="sm4-panel sm4-schedule-panel">
        <div className="sm4-panel-top"><div><span className="sm4-eyebrow">01 / DAILY SCHEDULE</span><h2>Time as a <em>canvas.</em></h2></div><CalendarClock size={24}/></div>
        <div className="sm4-schedule-controls">
          <div className="sm4-date-picker">
            <button type="button" aria-label="Previous date" onClick={()=>pickDate(moveDay(date,-1))}><ChevronLeft size={20}/></button>
            <div><small>SELECTED DAY</small><strong>{formatDate(date)}</strong><input type="date" value={date} aria-label="Choose schedule date" onChange={(e)=>e.target.value && pickDate(e.target.value)}/></div>
            <button type="button" aria-label="Next date" onClick={()=>pickDate(moveDay(date,1))}><ChevronRight size={20}/></button>
          </div>
          <label className="sm4-filter-select"><span>VIEW</span><select value={doctorId} onChange={(e)=>{setDoctorId(e.target.value);setSelection(null);}}><option value="all">All sample dentists</option>{DENTISTS.map((d)=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
          <button type="button" className="sm4-today-btn" onClick={()=>pickDate(shiftDate(1))}>NEXT DAY</button>
        </div>
        <div className="sm4-strip-stats sm4-schedule-stats">
          <div><span>THEORETICAL SLOT GRID</span><strong>{capacity}</strong></div>
          <div><span>REQUESTED / DEMO</span><strong>{daily.length}</strong></div>
          <div><span>NO REQUEST RECORDED</span><strong>{Math.max(0,capacity-daily.length)}</strong></div>
        </div>
        {closed ? <div className="sm4-empty"><Clock3 size={30}/><h3>Sunday / no demo slots</h3><p>This sample calendar does not offer appointments on Sundays.</p><button type="button" onClick={()=>pickDate(moveDay(date,1))}>GO TO MONDAY <ArrowRight size={16}/></button></div> :
          <div className="sm4-schedule-scroll" tabIndex={0} aria-label="Scrollable dentist-by-time schedule">
            <div className="sm4-schedule-board" style={{ "--sm4-doc-count": doctors.length }}>
              <div className="sm4-schedule-corner">TIME / DENTIST →</div>
              {doctors.map((d)=><div key={d.id} className="sm4-schedule-doc"><img src={d.image} alt=""/><span><strong>{d.name}</strong><small>{d.role}</small></span></div>)}
              {TIME_SLOTS.map((time) => (
                <div className="sm4-schedule-line" key={time} style={{ "--sm4-doc-count": doctors.length }}>
                  <div className="sm4-schedule-time">{formatTime(time)}</div>
                  {doctors.map((d) => {
                    const entry = occupied.get(`${d.id}|${time}`);
                    const isSelected = selection?.doctorId === d.id && selection?.time === time;
                    return <button key={d.id} type="button" aria-pressed={isSelected}
                      aria-label={`${d.name}, ${formatDate(date)}, ${formatTime(time)}: ${entry ? "demo request recorded" : "no request recorded"}`}
                      className={`sm4-slot ${entry?"is-taken":""} ${isSelected?"is-selected":""}`}
                      onClick={()=>setSelection({doctorId:d.id,time})}>
                      {entry ? <><span>REQUESTED</span><strong>{entry.alias}</strong></> : <><span>NO REQUEST</span><Clock3 size={17}/></>}
                    </button>;
                  })}
                </div>
              ))}
            </div>
          </div>}
        <div className="sm4-schedule-legend"><span><i/> REQUESTED</span><span><i/> NO REQUEST RECORDED</span><span><i/> SELECTED CELL</span></div>
      </section>
      <div className="sm4-panels-two sm4-schedule-after">
        <section className="sm4-panel"><div className="sm4-panel-top"><div><span className="sm4-eyebrow">02 / TIME-SLOT INSPECTOR</span><h2>A closer <em>look.</em></h2></div><Users size={23}/></div>
          {selection ? <div className="sm4-slot-inspector"><span className="sm4-eyebrow">{formatDate(date)} / {formatTime(selection.time)}</span><h3>{inspectorDoctor?.name}</h3><strong>{inspectorRecord?"DEMO REQUEST RECORDED":"NO REQUEST RECORDED"}</strong>{inspectorRecord ? <p>{inspectorRecord.alias} · {TREATMENTS.find((t)=>t.id===inspectorRecord.serviceId)?.name || "Care interest"} · {inspectorRecord.id}</p> : <p>No request in this browser occupies this sample time. This does not represent verified clinical availability.</p>}<Link className="sm4-inline" to={`/calendar?doctor=${selection.doctorId}`}>OPEN PUBLIC CALENDAR <ArrowUpRight size={16}/></Link></div> : <p className="sm4-fine">Choose any slot in the schedule to inspect its fictional record or sample availability state.</p>}
        </section>
        <section className="sm4-panel"><div className="sm4-panel-top"><div><span className="sm4-eyebrow">03 / DAILY REQUEST LOG</span><h2>Requests by <em>time.</em></h2></div><CalendarClock size={23}/></div>
          {daily.length ? <div className="sm4-daily-list">{[...daily].sort((a,b)=>a.time.localeCompare(b.time)).map((r)=><div key={r.id}><time>{formatTime(r.time)}</time><span><strong>{r.alias}</strong><small>{DENTISTS.find((d)=>d.id===r.doctorId)?.name} · {TREATMENTS.find((t)=>t.id===r.serviceId)?.name}</small></span></div>)}</div> : <p className="sm4-fine">No requested appointments on this date for the selected profile(s).</p>}
          <Link className="sm4-inline" to="/staff/appointments">OPEN APPOINTMENT DESK <ArrowRight size={17}/></Link>
        </section>
      </div>
      <p className="sm4-disclosure"><ShieldCheck size={17}/> No schedule changes or confirmed bookings are performed here. An occupied cell means a local demo request exists.</p>
    </div>
  );
}
