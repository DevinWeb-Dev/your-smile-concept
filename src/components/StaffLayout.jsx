import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity, ArrowLeft, ArrowUpRight, BarChart3, CalendarClock,
  ClipboardList, Database, HeartPulse, LayoutDashboard,
  Menu, Settings2, ShieldCheck, Smile, Stethoscope, X,
} from "lucide-react";
import "../styles/staff.css";
import "../styles/smile-staff-batch4.css";

const SECTIONS = [
  { label: "Command Center", to: "/staff", icon: LayoutDashboard, end: true },
  { label: "Appointment Desk", to: "/staff/appointments", icon: ClipboardList },
  { label: "Dentist Schedules", to: "/staff/schedules", icon: CalendarClock },
  { label: "Treatment Studio", to: "/staff/treatments", icon: Stethoscope },
  { label: "Reports & Analytics", to: "/staff/reports", icon: BarChart3 },
  { label: "Treatment Insights", to: "/staff/insights", icon: HeartPulse },
  { label: "Clinic Settings", to: "/staff/settings", icon: Settings2 },
  { label: "Data & Backups", to: "/staff/data", icon: Database },
];

export default function StaffLayout({ requests = [], onCancelRequest, onReplaceRequests }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1100px)").matches
  );
  const drawer = useRef(null);
  const trigger = useRef(null);
  const active = requests.filter((r) => r.status === "requested").length;
  const page = SECTIONS.find((item) => item.end ? pathname === item.to : pathname.startsWith(item.to));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1100px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open || !mobile) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector("a")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key !== "Tab") return;
      const links = [...drawer.current.querySelectorAll('a[href],button:not([disabled])')];
      if (!links.length) return;
      if (event.shiftKey && document.activeElement === links[0]) {
        event.preventDefault(); links.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
        event.preventDefault(); links[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, mobile]);

  return (
    <div className="ysm3-app sm4-shell">
      {open && mobile && (
        <button className="sm4-overlay" aria-label="Close staff navigation" type="button" onClick={() => setOpen(false)} />
      )}
      <aside
        ref={drawer}
        id="sm4-sidebar"
        className={`sm4-sidebar ${open ? "is-open" : ""}`}
        aria-label="Clinic staff navigation"
        inert={mobile && !open}
      >
        <Link to="/staff" className="sm4-brand" onClick={() => setOpen(false)}>
          <span className="sm4-brand-icon"><Smile size={29} strokeWidth={1.4} /></span>
          <span><strong>YOUR SMILE.</strong><small>CLINICAL OPERATIONS ATELIER</small></span>
        </Link>
        <div className="sm4-side-kicker"><span>PRIVATE STUDIO / NO. 04</span><Activity size={17} /></div>
        <nav className="sm4-nav" aria-label="Staff workspaces">
          {SECTIONS.map(({ to, label, icon: Icon, end }, index) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) => `sm4-nav-link ${isActive ? "is-active" : ""}`}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <Icon size={19} strokeWidth={1.5} />
              <span>{label}</span>
              <ArrowUpRight size={15} className="sm4-nav-arrow" />
            </NavLink>
          ))}
        </nav>
        <div className="sm4-sidebar-bottom">
          <div className="sm4-side-card">
            <ShieldCheck size={23} />
            <strong>The careful side of care.</strong>
            <p>All entries in this clinic workspace are fictional records stored locally in this browser.</p>
            <small>NO PATIENT DATABASE · NO REAL BOOKINGS</small>
          </div>
          <Link to="/" className="sm4-back"><ArrowLeft size={17} /> PUBLIC WEBSITE <ArrowUpRight size={17} /></Link>
        </div>
      </aside>

      <div className="sm4-main">
        <header className="sm4-topbar">
          <div className="sm4-top-title">
            <button ref={trigger} type="button" className="sm4-menu" aria-controls="sm4-sidebar"
              aria-expanded={open} aria-label={open ? "Close staff menu" : "Open staff menu"}
              onClick={() => setOpen((current) => !current)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="sm4-top-symbol"><Smile size={23} strokeWidth={1.35} /></span>
            <span><small>YOUR SMILE. / THE OPERATIONS JOURNAL</small><strong>{page?.label || "Clinic Studio"}</strong></span>
          </div>
          <div className="sm4-top-actions">
            <span className="sm4-demo-pill"><i /> LOCAL DEMO</span>
            <span className="sm4-top-count">{active} OPEN REQUEST{active === 1 ? "" : "S"}</span>
            <Link to="/calendar" title="Public scheduling demo"><CalendarClock size={17} /><span>PUBLIC CALENDAR</span><ArrowUpRight size={15} /></Link>
          </div>
        </header>
        <main id="sm4-staff-main" className="sm4-content">
          <Outlet context={{ requests, onCancelRequest, onReplaceRequests }} />
        </main>
        <footer className="sm4-footer"><span>YOUR SMILE. / STAFF OPERATIONS CONCEPT</span><span>Website Concept Made by: Web Developer Devin Planas</span></footer>
      </div>
    </div>
  );
}
