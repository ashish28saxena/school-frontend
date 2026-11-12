import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="sm-navbar navbar navbar-expand-lg">
      <div className="container-fluid">

        {/* Logo */}
        <Link to="/" className="sm-brand">
          <span className="sm-brand-mark">SM</span>
          <span className="sm-brand-text">School Management</span>
        </Link>

        {/* Mobile Button */}
        <button
          className="sm-toggler navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#schoolNavbar"
        >
          <span className="sm-toggler-bar"></span>
          <span className="sm-toggler-bar"></span>
          <span className="sm-toggler-bar"></span>
        </button>

        <div className="collapse navbar-collapse" id="schoolNavbar">

          <ul className="sm-nav navbar-nav ms-3">

            



            {/* ================= ATTENDANCE ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Attendance
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Attenddence-list" className="sm-dropdown-item">Take Attendance</Link>
                </li>
                <li>
                  <Link to="/Attenddence-student-list" className="sm-dropdown-item">Attendance Report</Link>
                </li>
              </ul>
            </li>

            {/* =================Student Teacher Management ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Student / Teacher Management
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Add-Student" className="sm-dropdown-item">Student Registration</Link>
                </li>
                <li>
                  <Link to="/Student-List" className="sm-dropdown-item">Student List</Link>
                </li>
                <li>
                  <Link to="/Add-Teacher" className="sm-dropdown-item">Add Teacher</Link>
                </li>
                <li>
                  <Link to="/Teacher-List" className="sm-dropdown-item">Teacher List</Link>
                </li>
                
                
                <li>
                  <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Subject</Link>
                </li>
                <li>
                  <Link to="/Assign-Subject-List" className="sm-dropdown-item">Assign Subject List</Link>
                </li>
                
                <li>
                  <Link to="/Assign-Class-Teacher" className="sm-dropdown-item">Assign Class</Link>
                </li>
                <li>
                  <Link to="/Assign-Class-List" className="sm-dropdown-item">Assign Class List</Link>
                </li>
                
                <li>
                  <Link to="/Assign-Class" className="sm-dropdown-item">Assign Section</Link>
                </li>
                <li>
                  <Link to="/Teacher-Attendance" className="sm-dropdown-item">Teacher Attendance</Link>
                </li>
                <li>
                  <Link to="/Teacher-Salary" className="sm-dropdown-item">Salary Details</Link>
                </li>
                <li>
                  <Link to="/Student-Attendance" className="sm-dropdown-item">Student Attendance</Link>
                </li>
              </ul>
            </li>

            {/* ================= Class & Section Management ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Class & Section
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Class-List" className="sm-dropdown-item">Class List</Link>
                </li>
                <li>
                  <Link to="/Add-Class" className="sm-dropdown-item">Add Class</Link>
                </li>
                <li>
                  <Link to="/Add-Section" className="sm-dropdown-item">Section</Link>
                </li>
                <li>
                  <Link to="/Class-Teacher" className="sm-dropdown-item">Assign Class Teacher</Link>
                </li>
                <li>
                  <Link to="/Assign-Students" className="sm-dropdown-item">Assign Students</Link>
                </li>
                
              </ul>
            </li>

            {/* ================= Subject Management ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Subject Management
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                    <Link to="/subject-management" className="sm-dropdown-item"> Subject Management</Link>
                </li>
                <li>
                  <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Subjects</Link>
                </li>
                
              </ul>
            </li>

            {/* ================= Timetable Management ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Timetable
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Create-Timetable" className="sm-dropdown-item">Create Timetable</Link>
                </li>
                <li>
                  <Link to="/Classwise-Timetable" className="sm-dropdown-item">Class-wise Timetable</Link>
                </li>
                <li>
                  <Link to="/Teacherwise-Timetable" className="sm-dropdown-item">Teacher-wise Timetable</Link>
                </li>
                <li>
                  <Link to="/Subjectwise-Schedule" className="sm-dropdown-item">Subject-wise Schedule</Link>
                </li>
              </ul>
            </li>

            {/* ================= Examination Management ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Examination
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Create-Exam" className="sm-dropdown-item">Create Exam</Link>
                </li>
                <li>
                  <Link to="/Mid-Term" className="sm-dropdown-item">Mid Term</Link>
                </li>
                <li>
                  <Link to="/Final-Exam" className="sm-dropdown-item">Final Exam</Link>
                </li>
                <li>
                  <Link to="/Unit-Test" className="sm-dropdown-item">Unit Test</Link>
                </li>
                <li>
                  <Link to="/Subjectwise-Marks" className="sm-dropdown-item">Subject-wise Marks</Link>
                </li>
                <li>
                  <Link to="/Grade-Calculation" className="sm-dropdown-item">Grade Calculation</Link>
                </li>
                <li>
                  <Link to="/Result-Generation" className="sm-dropdown-item">Result Generation</Link>
                </li>
              </ul>
            </li>

            {/* ================= Result & Report Card ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Result & Report Card
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Student-Result" className="sm-dropdown-item">Student Result</Link>
                </li>
                <li>
                  <Link to="/Percentage-Calculation" className="sm-dropdown-item">Percentage Calculation</Link>
                </li>
                <li>
                  <Link to="/Grade" className="sm-dropdown-item">Grade</Link>
                </li>
                <li>
                  <Link to="/Rank" className="sm-dropdown-item">Rank</Link>
                </li>
                <li>
                  <Link to="/Pass-Fail" className="sm-dropdown-item">Pass / Fail</Link>
                </li>
                <li>
                  <Link to="/Report-Card-PDF" className="sm-dropdown-item">Download Report Card PDF</Link>
                </li>
              </ul>
            </li>

          </ul>

          {/* Right Side */}
          <ul className="sm-nav-right navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <Link to="#" className="sm-profile dropdown-toggle" data-bs-toggle="dropdown">
                <span className="sm-avatar">A</span>
                <span className="sm-profile-name">Admin</span>
              </Link>
              <ul className="sm-dropdown sm-dropdown--right dropdown-menu">
                <li>
                  <Link to="/profile" className="sm-dropdown-item">Profile</Link>
                </li>
                <li>
                  <Link to="/logout" className="sm-dropdown-item sm-dropdown-item--danger">Logout</Link>
                </li>
              </ul>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Header;