import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

/* ------------------------------------------------------------------
   NAYA MODULE ADD KARNE KE LIYE: bas neeche MENU me ek object add karo.
   { id: "unique-id", label: "Module Name", items: [{ label, to }] }
   JSX/CSS ko chhoone ki zarurat nahi.
------------------------------------------------------------------- */
const MENU = [
  {
    id: "attendance",
    label: "Attendance",
    items: [
      { label: "Take Attendance", to: "/Attenddence-list" },
      { label: "Attendance Report", to: "/Attenddence-student-list" },
    ],
  },
  {
    id: "people",
    label: "Student / Teacher Management",
    items: [
      { label: "Student Registration", to: "/Add-Student" },
      { label: "Student List", to: "/Student-List" },
      { label: "Add Teacher", to: "/Add-Teacher" },
      { label: "Teacher List", to: "/Teacher-List" },
      { label: "Assign Subject", to: "/Assign-Subject" },
      { label: "Assign Subject List", to: "/Assign-Subject-List" },
      { label: "Assign Class", to: "/Assign-Class-Teacher" },
      { label: "Assign Class List", to: "/Assign-Class-List" },
      { label: "Assign Section", to: "/Assign-Class" },
      { label: "Teacher Attendance", to: "/Teacher-Attendance" },
      { label: "Salary Details", to: "/Teacher-Salary" },
      { label: "Student Attendance", to: "/Student-Attendance" },
      { label: "Student ID Card", to: "/student-id-card" },
    ],
  },
  {
    id: "class",
    label: "Class & Section",
    items: [
      { label: "Class List", to: "/Class-List" },
      { label: "Add Class", to: "/Add-Class" },
      { label: "Section", to: "/Add-Section" },
      { label: "Assign Class Teacher", to: "/Class-Teacher" },
      { label: "Assign Students", to: "/Assign-Students" },
    ],
  },
  {
    id: "subject",
    label: "Subject Management",
    items: [
      { label: "Subject Management", to: "/subject-management" },
      { label: "Assign Subjects", to: "/Assign-Subject" },
    ],
  },
  {
    id: "timetable",
    label: "Timetable",
    items: [
      { label: "Timetable", to: "/timetable-management" },
      { label: "Weekly Timetable View", to: "/Weekly-timetable-management" },
      { label: "Teacher Timetable", to: "/Teacher-timetable-management" },
      { label: "Student Timetable", to: "/Student-timetable-management" },
    ],
  },
  {
    id: "exam",
    label: "Examination",
    items: [
      { label: "Exam Master", to: "/exam-master" },
      { label: "Exam Schedule", to: "/exam-schedule" },
      { label: "Marks Entry", to: "/marks-entry" },
      { label: "Exam Result", to: "/exam-result" },
      { label: "Report Card", to: "/report-card-list" },
      { label: "Admit Card", to: "/admit-card" },
    ],
  },
  {
    id: "fee",
    label: "Fee Management",
    items: [
      { label: "Fee Structure", to: "/fee-structure" },
      { label: "Fee Collection", to: "/fee-collection" },
      { label: "Fee Receipt", to: "/fee-receipt" },
      { label: "Fee Due Report", to: "/fee-due-report" },
      { label: "Fee Discount / Concession", to: "/fee-discount" },
      { label: "Fee Installment", to: "/fee-installment" },
    ],
  },
  {
    id: "library",
    label: "Library Management",
    items: [{ label: "Library Management", to: "/library" }],
  },
  {
    id: "transport",
    label: "Transport Management",
    items: [
      { label: "Transport Dashboard", to: "/transport/dashboard" },
      { label: "Vehicle Management", to: "/transport/vehicles" },
      { label: "Driver Management", to: "/transport/drivers" },
      { label: "Route Management", to: "/transport/routes" },
      { label: "Vehicle & Driver Assignment", to: "/transport/assignments" },
      { label: "Student Transport Assignment", to: "/transport/student-assignments" },
      { label: "Transport Fee Management", to: "/transport/fees" },
      { label: "Transport Attendance", to: "/transport/attendance" },
      { label: "Vehicle Maintenance", to: "/transport/maintenance" },
      { label: "Transport Reports", to: "/transport/reports" },
    ],
  },
  {
    id: "parent",
    label: "Parent Management",
    items: [{ label: "Parent Management", to: "/parent" }],
  },
];

const same = (a, b) => a.toLowerCase() === b.toLowerCase();
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1.2" fill="currentColor" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1.2" fill="currentColor" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1.2" fill="currentColor" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function Header({ onLogout }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const [user, setUser] = useState(getUser);
  const displayName = user.name || "User";
  const displayRole = user.role || "";

  // Logout: token hatao, App ki state false karo, login page pe bhejo
  const handleLogout = () => {
    setProfileOpen(false);
    localStorage.removeItem("token");
    onLogout?.();
    navigate("/login", { replace: true });
  };


  // Page change par sab band
  useEffect(() => {
    setPanelOpen(false);
    setProfileOpen(false);
    setQuery("");
    setUser(getUser());
  }, [pathname]);

  // Bahar click ya Esc par band
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setPanelOpen(false);
        setProfileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const currentGroup = MENU.find((g) => g.items.some((i) => same(i.to, pathname)));

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    if (!q) return MENU;
    return MENU.map((g) => ({
      ...g,
      items: g.label.toLowerCase().includes(q)
        ? g.items
        : g.items.filter((i) => i.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <header className="sm-header" ref={wrapRef}>
      <div className="sm-bar">
        <Link to="/" className="sm-brand">
          <span className="sm-brand-mark">SM</span>
          <span className="sm-brand-text">School Management</span>
        </Link>

        <button
          type="button"
          className={`sm-modules-btn${panelOpen ? " is-open" : ""}`}
          aria-expanded={panelOpen}
          aria-controls="sm-mega"
          onClick={() => setPanelOpen((v) => !v)}
        >
          <GridIcon />
          <span>All Modules</span>
        </button>

        {currentGroup && (
          <span className="sm-current" title="Current module">
            {currentGroup.label}
          </span>
        )}

        <div className="sm-bar-search">
          <input
            type="search"
            value={query}
            placeholder="Search any page…"
            aria-label="Search any page"
            onFocus={() => setPanelOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setPanelOpen(true);
            }}
          />
        </div>

        <div className="sm-profile-wrap">
          <button
            type="button"
            className="sm-profile"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <span className="sm-avatar">A</span>
            <span className="sm-profile-name">{displayName}</span>
          </button>
          {profileOpen && (
            <div className="sm-profile-menu">
              <Link to="/profile">Profile</Link>
              <button type="button" className="is-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {panelOpen && (
        <>
          <div className="sm-backdrop" onClick={() => setPanelOpen(false)} />
          <div id="sm-mega" className="sm-mega" role="region" aria-label="All modules">
            {groups.length === 0 ? (
              <p className="sm-empty">Is naam ka koi page nahi mila.</p>
            ) : (
              <div className="sm-mega-cols">
                {groups.map((g) => (
                  <section className="sm-mega-group" key={g.id}>
                    <h3 className={currentGroup && currentGroup.id === g.id ? "is-current" : ""}>
                      {g.label}
                    </h3>
                    <ul>
                      {g.items.map((item, idx) => (
                        <li key={item.to + idx}>
                          <Link
                            to={item.to}
                            className={same(item.to, pathname) ? "is-active" : ""}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}

export default Header;