import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, CalendarClock, CalendarDays,
  CheckCircle2, ClipboardList, Clock3, HeartPulse,
  ShieldCheck, Smile, Users, XCircle,
} from "lucide-react";
import { DENTISTS, IMAGES, TREATMENTS, formatDate, formatTime } from "../../data/clinicData.js";
import { localDateKey, shiftDate } from "../../utils/clinicReports.js";

const treatment = (id) => TREATMENTS.find((t) => t.id === id)?.name || "Unknown study";
const dentist = (id) => DENTISTS.find((d) => d.id === id)?.name || "Unknown profile";

function Metric({ no, icon: Icon, label, value, note }) {
  return (
    <article className="sm4-metric">
      <div><span>{no} / {label}</span><Icon size={20} strokeWidth={1.5} /></div>
      <strong>{value}</strong><small>{note}</small>
    </article>
  );
}

export default function DashboardPage() {
  const { requests = [] } = useOutletContext();
  const today = localDateKey();
  const active = requests.filter((r) => r.status === "requested");
  const upcoming = active.filter((r) => r.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const todayList = active.filter((r) => r.date === today);
  const cancelled = requests.length - active.length;
  const days = Array.from({ length: 7 }, (_, i) => {
    const key = shiftDate(i);
    return {
      key,
      count: active.filter((r) => r.date === key).length,
      day: new Date(`${key}T12:00:00`).toLocaleDateString("en-PH", { weekday: "short" }),
    };
  });
  const max = Math.max(1, ...days.map((d) => d.count));
  const demand = TREATMENTS.map((t) => ({
    ...t,
    count: active.filter((r) => r.serviceId === t.id).length,
  })).sort((a, b) => b.count - a.count);
  const maxDemand = Math.max(1, ...demand.map((t) => t.count));
  const dayLabel = new Date().toLocaleDateString("en-PH", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="sm4-page">
      <section className="sm4-command-hero">
        <div className="sm4-command-copy">
          <span className="sm4-eyebrow">01 / THE CLINIC COMMAND CENTER</span>
          <h1>Good care begins <em>behind the scenes.</em></h1>
          <p>{dayLabel}. A considered overview of fictional requests, daily rhythms, and the people behind this concept practice.</p>
          <div className="sm4-hero-cta">
            <Link to="/staff/appointments">OPEN APPOINTMENT DESK <ArrowUpRight size={17}/></Link>
            <Link to="/staff/schedules">VIEW THE SCHEDULE <ArrowRight size={17}/></Link>
          </div>
        </div>
        <div className="sm4-command-image">
          <img src={IMAGES.clinic} alt="Illustrative modern dental clinic architecture" />
          <div className="sm4-command-arc" aria-hidden="true"><span/><span/></div>
          <small>THE PRACTICE / AN ARCHITECTURAL STUDY</small>
        </div>
      </section>

      <div className="sm4-brief"><span>THE DAILY BRIEF / {today}</span><span>NO LIVE PATIENT SYSTEM · LOCAL DEMONSTRATION</span></div>
      <section className="sm4-metrics" aria-label="Clinic demo statistics">
        <Metric no="01" icon={ClipboardList} label="TOTAL REQUESTS" value={requests.length} note="All local records, including cancelled" />
        <Metric no="02" icon={CheckCircle2} label="OPEN REQUESTS" value={active.length} note="Requested, not clinically confirmed" />
        <Metric no="03" icon={CalendarDays} label="TODAY'S REQUESTS" value={todayList.length} note="Sample schedule for this date" />
        <Metric no="04" icon={XCircle} label="CANCELLED" value={cancelled} note="Retained in the local history" />
      </section>

      <div className="sm4-panels-two">
        <section className="sm4-panel">
          <div className="sm4-panel-top"><div><span className="sm4-eyebrow">02 / THE NEXT SEVEN DAYS</span><h2>The weekly <em>pulse.</em></h2></div><CalendarClock size={24}/></div>
          <div className="sm4-graph" role="img" aria-label={days.map((d)=>`${d.day}: ${d.count} demo requests`).join(", ")}>
            {days.map((d) => (
              <div key={d.key} className="sm4-graph-day"><b>{d.count}</b><div><i style={{ height: `${(d.count / max) * 100}%` }} /></div><small>{d.day}</small></div>
            ))}
          </div>
          <p className="sm4-fine">Counts active fictional requests by requested visit date, not confirmed attendance.</p>
        </section>
        <section className="sm4-panel">
          <div className="sm4-panel-top"><div><span className="sm4-eyebrow">03 / THE TREATMENT MIX</span><h2>Areas of <em>interest.</em></h2></div><HeartPulse size={24}/></div>
          <div className="sm4-demand">
            {demand.map((t, i) => (
              <div key={t.id}><small>{String(i + 1).padStart(2, "0")}</small><span><b>{t.name}</b><i><em style={{ width: `${t.count / maxDemand * 100}%` }}/></i></span><strong>{t.count}</strong></div>
            ))}
          </div>
          <Link className="sm4-inline" to="/staff/treatments">OPEN THE TREATMENT STUDIO <ArrowUpRight size={17}/></Link>
        </section>
      </div>

      <div className="sm4-panels-two">
        <section className="sm4-panel">
          <div className="sm4-panel-top"><div><span className="sm4-eyebrow">04 / THE NEXT ARRIVALS</span><h2>The appointment <em>journal.</em></h2></div><Clock3 size={22}/></div>
          {upcoming.length ? <div className="sm4-arrivals">
            {upcoming.slice(0, 5).map((r) => (
              <div key={r.id}><time dateTime={r.date}>{formatDate(r.date)}<b>{formatTime(r.time)}</b></time><span><strong>{r.alias}</strong><small>{treatment(r.serviceId)} · {dentist(r.doctorId)}</small></span><ArrowUpRight size={17}/></div>
            ))}
          </div> : <div className="sm4-empty"><Smile size={26}/><p>No upcoming demo requests yet.</p><Link to="/calendar">CREATE SAMPLE REQUEST <ArrowRight size={16}/></Link></div>}
          <Link className="sm4-inline" to="/staff/appointments">ALL REQUEST RECORDS <ArrowUpRight size={17}/></Link>
        </section>
        <section className="sm4-panel sm4-team-panel">
          <div className="sm4-panel-top"><div><span className="sm4-eyebrow">05 / THE SAMPLE CLINICAL TEAM</span><h2>Three different <em>perspectives.</em></h2></div><Users size={22}/></div>
          {DENTISTS.map((d, i) => (
            <div key={d.id} className="sm4-team-row"><img src={d.image} alt=""/><span><small>0{i+1} / FICTIONAL PROFILE</small><strong>{d.name}</strong><small>{d.role}</small></span><b>{upcoming.filter((r) => r.doctorId === d.id).length} UPCOMING</b></div>
          ))}
          <Link className="sm4-inline" to="/staff/schedules">OPEN DENTIST SCHEDULES <ArrowUpRight size={17}/></Link>
        </section>
      </div>
      <p className="sm4-disclosure"><ShieldCheck size={17}/> Fictional sample records only. There is no live booking verification, patient database, or payment processing.</p>
    </div>
  );
}
