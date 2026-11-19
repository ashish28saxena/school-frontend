// import React from "react";
// import "./Header.css";
// import { Link } from "react-router-dom";

// function Header() {
//   return (
//     <nav className="sm-navbar navbar navbar-expand-lg">
//       <div className="container-fluid">

//         {/* Logo */}
//         <Link to="/" className="sm-brand">
//           <span className="sm-brand-mark">SM</span>
//           <span className="sm-brand-text">School Management</span>
//         </Link>

//         {/* Mobile Button */}
//         <button
//           className="sm-toggler navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#schoolNavbar"
//         >
//           <span className="sm-toggler-bar"></span>
//           <span className="sm-toggler-bar"></span>
//           <span className="sm-toggler-bar"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="schoolNavbar">

//           <ul className="sm-nav navbar-nav ms-3">

            



//             {/* ================= ATTENDANCE ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Attendance
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/Attenddence-list" className="sm-dropdown-item">Take Attendance</Link>
//                 </li>
//                 <li>
//                   <Link to="/Attenddence-student-list" className="sm-dropdown-item">Attendance Report</Link>
//                 </li>
//               </ul>
//             </li>

//             {/* =================Student Teacher Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Student / Teacher Management
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/Add-Student" className="sm-dropdown-item">Student Registration</Link>
//                 </li>
//                 <li>
//                   <Link to="/Student-List" className="sm-dropdown-item">Student List</Link>
//                 </li>
//                 <li>
//                   <Link to="/Add-Teacher" className="sm-dropdown-item">Add Teacher</Link>
//                 </li>
//                 <li>
//                   <Link to="/Teacher-List" className="sm-dropdown-item">Teacher List</Link>
//                 </li>
                
                
//                 <li>
//                   <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Subject</Link>
//                 </li>
//                 <li>
//                   <Link to="/Assign-Subject-List" className="sm-dropdown-item">Assign Subject List</Link>
//                 </li>
                
//                 <li>
//                   <Link to="/Assign-Class-Teacher" className="sm-dropdown-item">Assign Class</Link>
//                 </li>
//                 <li>
//                   <Link to="/Assign-Class-List" className="sm-dropdown-item">Assign Class List</Link>
//                 </li>
                
//                 <li>
//                   <Link to="/Assign-Class" className="sm-dropdown-item">Assign Section</Link>
//                 </li>
//                 <li>
//                   <Link to="/Teacher-Attendance" className="sm-dropdown-item">Teacher Attendance</Link>
//                 </li>
//                 <li>
//                   <Link to="/Teacher-Salary" className="sm-dropdown-item">Salary Details</Link>
//                 </li>
//                 <li>
//                   <Link to="/Student-Attendance" className="sm-dropdown-item">Student Attendance</Link>
//                 </li>
//                  <li>
//                   <Link to="/student-id-card" className="sm-dropdown-item">Student ID Card</Link>
//                 </li>
//               </ul>
//             </li>

//             {/* ================= Class & Section Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Class & Section
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/Class-List" className="sm-dropdown-item">Class List</Link>
//                 </li>
//                 <li>
//                   <Link to="/Add-Class" className="sm-dropdown-item">Add Class</Link>
//                 </li>
//                 <li>
//                   <Link to="/Add-Section" className="sm-dropdown-item">Section</Link>
//                 </li>
//                 <li>
//                   <Link to="/Class-Teacher" className="sm-dropdown-item">Assign Class Teacher</Link>
//                 </li>
//                 <li>
//                   <Link to="/Assign-Students" className="sm-dropdown-item">Assign Students</Link>
//                 </li>
                
//               </ul>
//             </li>

//             {/* ================= Subject Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Subject Management
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                     <Link to="/subject-management" className="sm-dropdown-item"> Subject Management</Link>
//                 </li>
//                 <li>
//                   <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Subjects</Link>
//                 </li>
                
//               </ul>
//             </li>

//             {/* ================= Timetable Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Timetable
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/timetable-management" className="sm-dropdown-item">Timetable</Link>
//                 </li>
//                 <li>
//                   <Link to="/Weekly-timetable-management" className="sm-dropdown-item"> Weekly Timetable View</Link>
//                 </li>
//                 <li>
//                   <Link to="/Teacher-timetable-management" className="sm-dropdown-item"> Teacher Timetable</Link>
//                 </li>
//                 <li>
//                   <Link to="/Student-timetable-management" className="sm-dropdown-item"> Student Timetable</Link>
//                 </li>
                
                
               
//                 {/* <li>
//                   <Link to="/Create-Timetable" className="sm-dropdown-item">Create Timetable</Link>
//                 </li>
//                 <li>
//                   <Link to="/Classwise-Timetable" className="sm-dropdown-item">Class-wise Timetable</Link>
//                 </li>
//                 <li>
//                   <Link to="/Teacherwise-Timetable" className="sm-dropdown-item">Teacher-wise Timetable</Link>
//                 </li>
//                 <li>
//                   <Link to="/Subjectwise-Schedule" className="sm-dropdown-item">Subject-wise Schedule</Link>
//                 </li> */}
//               </ul>
//             </li>

//             {/* ================= Examination Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Examination
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/exam-master" className="sm-dropdown-item">Exam Master</Link>
//                 </li>
//                 <li>
//                   <Link to="/exam-schedule" className="sm-dropdown-item"> Exam Schedule </Link>
//                 </li>
                

//                 <li>
//                   <Link to="/marks-entry" className="sm-dropdown-item">Marks Entry</Link>
//                 </li>

//                 <li>
//                   <Link to="/exam-result" className="sm-dropdown-item">Exam Result</Link>
//                 </li>

//                 <li>
//                   <Link to="/exam-schedule" className="sm-dropdown-item">Exam Schedule</Link>
//                 </li>

//                 <li>
//                   <Link to="/report-card-list" className="sm-dropdown-item">Report Card</Link>
//                 </li>
//                 <li>
//                   <Link to="/admit-card" className="sm-dropdown-item"> Admit Card</Link>
//                 </li>
                
                
//               </ul>
//             </li>


//             {/* ================= Fee Management Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Fee Management
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/fee-structure" className="sm-dropdown-item">Fee Structure</Link>
//                 </li>
//                 <li>
//                   <Link to="/fee-collection" className="sm-dropdown-item">Fee Collection</Link>
//                 </li>

//                 <li>
//                   <Link to="/fee-receipt" className="sm-dropdown-item">Fee Receipt</Link>
//                 </li>

//                 <li>
//                   <Link to="/fee-due-report" className="sm-dropdown-item">Fee Due Report</Link>
//                 </li>

//                 <li>
//                   <Link to="/fee-discount" className="sm-dropdown-item">Fee Discount / Concession</Link>
//                 </li>
                
//                  <li>
//                   <Link to="/fee-installment" className="sm-dropdown-item">Fee Installment</Link>
//                 </li>
                
//               </ul>
//             </li>


//              {/* ================= Library Management Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Library Management
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/library" className="sm-dropdown-item">Library Management</Link>
//                 </li>
                
                
//               </ul>
//             </li>


//              {/* ================= Transport Management ================= */}
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Transport Management
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/transport/dashboard" className="sm-dropdown-item">Transport Dashboard</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/vehicles" className="sm-dropdown-item">Vehicle Management</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/drivers" className="sm-dropdown-item">Driver Management</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/routes" className="sm-dropdown-item">Route Management</Link>
//                 </li>

//                  <li>
//                   <Link to="/transport/assignments" className="sm-dropdown-item">Vehicle & Driver Assignment</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/student-assignments" className="sm-dropdown-item">Student Transport Assignment</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/fees" className="sm-dropdown-item">Transport Fee Management</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/attendance" className="sm-dropdown-item">Transport Attendance</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/maintenance" className="sm-dropdown-item">Vehicle Maintenance</Link>
//                 </li>

//                 <li>
//                   <Link to="/transport/reports" className="sm-dropdown-item">Transport Reports</Link>
//                 </li>
                
                
//               </ul>
//             </li>

//             {/* ================= Result & Report Card ================= */}
//             {/* <li className="nav-item dropdown">
//               <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
//                 Result & Report Card
//               </Link>

//               <ul className="sm-dropdown dropdown-menu">
//                 <li>
//                   <Link to="/Student-Result" className="sm-dropdown-item">Student Result</Link>
//                 </li>
//                 <li>
//                   <Link to="/Percentage-Calculation" className="sm-dropdown-item">Percentage Calculation</Link>
//                 </li>
//                 <li>
//                   <Link to="/Grade" className="sm-dropdown-item">Grade</Link>
//                 </li>
//                 <li>
//                   <Link to="/Rank" className="sm-dropdown-item">Rank</Link>
//                 </li>
//                 <li>
//                   <Link to="/Pass-Fail" className="sm-dropdown-item">Pass / Fail</Link>
//                 </li>
//                 <li>
//                   <Link to="/Report-Card-PDF" className="sm-dropdown-item">Download Report Card PDF</Link>
//                 </li>
//               </ul>
//             </li> */}

//           </ul>

//           {/* Right Side */}
//           <ul className="sm-nav-right navbar-nav ms-auto">
//             <li className="nav-item dropdown">
//               <Link to="#" className="sm-profile dropdown-toggle" data-bs-toggle="dropdown">
//                 <span className="sm-avatar">A</span>
//                 <span className="sm-profile-name">Admin</span>
//               </Link>
//               <ul className="sm-dropdown sm-dropdown--right dropdown-menu">
//                 <li>
//                   <Link to="/profile" className="sm-dropdown-item">Profile</Link>
//                 </li>
//                 <li>
//                   <Link to="/logout" className="sm-dropdown-item sm-dropdown-item--danger">Logout</Link>
//                 </li>
//               </ul>
//             </li>
//           </ul>

//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Header;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
    items: [
      { label: "Parent Management", to: "/parent" },
      
    ],
  },
];

const same = (a, b) => a.toLowerCase() === b.toLowerCase();

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

function Header() {
  const { pathname } = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  // Page change par sab band
  useEffect(() => {
    setPanelOpen(false);
    setProfileOpen(false);
    setQuery("");
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
            <span className="sm-profile-name">Admin</span>
          </button>
          {profileOpen && (
            <div className="sm-profile-menu">
              <Link to="/profile">Profile</Link>
              <Link to="/logout" className="is-danger">Logout</Link>
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