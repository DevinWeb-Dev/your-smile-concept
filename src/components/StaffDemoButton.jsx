import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";

import "../styles/smile-staff-batch4.css";

export default function StaffDemoButton() {
  return (
    <Link
      to="/staff"
      className="sm4-staff-access"
      aria-label="Open Staff Demo Dashboard"
      title="Open Staff Dashboard"
    >
      <LayoutDashboard
        size={17}
        strokeWidth={1.8}
      />

      <span>STAFF DEMO</span>

      <ArrowUpRight
        size={14}
        className="sm4-staff-access-arrow"
      />
    </Link>
  );
}