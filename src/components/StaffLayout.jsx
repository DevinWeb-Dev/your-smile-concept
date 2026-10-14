import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  Database,
  ChartNoAxesCombined,
  ChartPie,
  LayoutDashboard,
  Menu,
  Settings2,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";

import "../styles/staff.css";

const LINKS = [
  {
    label: "Overview",
    to: "/staff",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Appointment Desk",
    to: "/staff/appointments",
    icon: ClipboardList,
  },
  {
    label: "Dentist Schedules",
    to: "/staff/schedules",
    icon: CalendarClock,
  },
  {
    label: "Treatment Management",
    to: "/staff/treatments",
    icon: Stethoscope,
  },
  {
    label: "Reports & Analytics",
    to: "/staff/reports",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Treatment Insights",
    to: "/staff/insights",
    icon: ChartPie,
  },
  {
    label: "Clinic Settings",
    to: "/staff/settings",
    icon: Settings2,
  },
  {
    label: "Data & Backups",
    to: "/staff/data",
    icon: Database,
  },
];

const PAGE_TITLES = {
  "/staff": "Clinic Overview",
  "/staff/appointments": "Appointment Desk",
  "/staff/schedules": "Dentist Schedules",
  "/staff/treatments": "Treatment Management",
  "/staff/reports": "Reports & Analytics",
  "/staff/insights": "Treatment Insights",
  "/staff/settings": "Clinic Settings",
  "/staff/data": "Data & Backups",
};

export default function StaffLayout({
  requests = [],
  onCancelRequest,
  onReplaceRequests,
}) {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [menuOpen]);

  const activeCount = requests.filter(
    (item) => item.status === "requested"
  ).length;

  const title =
    PAGE_TITLES[location.pathname] ||
    "Clinic Operations";

  return (
    <div className="ysm3-app">
      <aside
        className={`ysm3-sidebar ${
          menuOpen ? "is-open" : ""
        }`}
        aria-label="Clinic operations navigation"
      >
        <div className="ysm3-sidebar-top">
          <Link
            to="/staff"
            className="ysm3-sidebar-brand"
          >
            <span className="ysm3-brand-icon">
              <Smile
                size={24}
                strokeWidth={1.5}
              />
            </span>

            <span>
              <strong>YOUR SMILE.</strong>
              <small>CLINIC STUDIO</small>
            </span>
          </Link>

          <div className="ysm3-sidebar-divider" />

          <span className="ysm3-nav-caption">
            CLINIC OPERATIONS
          </span>

          <nav
            className="ysm3-sidebar-nav"
            aria-label="Staff pages"
          >
            {LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `ysm3-nav-link ${
                      isActive ? "is-active" : ""
                    }`
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={1.7}
                  />

                  <span>{item.label}</span>

                  <ChevronRight
                    className="ysm3-nav-chevron"
                    size={15}
                  />
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="ysm3-sidebar-bottom">
          <div className="ysm3-concept-card">
            <Sparkles size={22} />

            <strong>
              Concept environment
            </strong>

            <p>
              Preview premium clinic operations
              using fictional records and
              browser-local storage.
            </p>

            <span>
              NO REAL PATIENT DATA
            </span>
          </div>

          <Link
            to="/"
            className="ysm3-back-site"
          >
            <ArrowLeft size={17} />
            View Public Website
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="ysm3-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}

      <div className="ysm3-workspace">
        <header className="ysm3-topbar">
          <div className="ysm3-topbar-left">
            <button
              type="button"
              className="ysm3-menu-toggle"
              aria-label={
                menuOpen
                  ? "Close staff navigation"
                  : "Open staff navigation"
              }
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen((current) => !current)
              }
            >
              {menuOpen
                ? <X size={22} />
                : <Menu size={22} />}
            </button>

            <span className="ysm3-topbar-icon">
              <Activity size={20} />
            </span>

            <div>
              <span className="ysm3-topbar-label">
                YOUR SMILE / OPERATIONS
              </span>

              <h2>{title}</h2>
            </div>
          </div>

          <div className="ysm3-topbar-right">
            <span className="ysm3-live-chip">
              <span />
              LOCAL DEMO
            </span>

            <Link
              className="ysm3-topbar-site"
              to="/calendar"
            >
              <CalendarClock size={17} />
              Public Calendar
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        <main className="ysm3-main">
          <div className="ysm3-main-inner">
            <div className="ysm3-context-line">
              <span>
                <ShieldCheck size={15} />
                Browser-local clinic concept
              </span>

              <span>
                {activeCount} active demo{" "}
                {activeCount === 1
                  ? "request"
                  : "requests"}
              </span>
            </div>

            <Outlet
              context={{
                requests,
                onCancelRequest,
                onReplaceRequests,
              }}
            />
          </div>
        </main>

        <footer className="ysm3-footer">
          <span>
            © {new Date().getFullYear()} YOUR SMILE.
            Clinic Studio
          </span>

          <span>
            Website Concept Made by:
            Web Developer Devin Planas
          </span>
        </footer>
      </div>
    </div>
  );
}