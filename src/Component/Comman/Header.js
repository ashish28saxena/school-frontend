// import React from "react";
// import {  Link } from "react-router-dom";
// const Header=()=>{
//     return (
//         <div>
//             <nav className="navbar navbar-expand-lg bg-body-tertiary">
//                 <div className="container-fluid">
                    
//                     <img src={process.env.PUBLIC_URL + "/images.jpg"} width={50}></img>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
//                         <div className="navbar-nav">
//                             <Link to="/" className="nav-link">Home</Link>
//                             <Link to="/user" className="nav-link">User List</Link>
//                             <Link to="/todo" className="nav-link">Todo List</Link>
//                             <Link to="/quotesList" className="nav-link">Quotes List</Link>
//                             <Link to="/Role" className="nav-link">Role List</Link>
//                             <Link to="/Class-List" className="nav-link">Class List</Link>
//                             <Link to="/Student-List" className="nav-link">Student List</Link>
//                             <Link to="/login" className="nav-link">Login</Link>
//                             <Link to="/Attenddence-list" className="nav-link">Attendence</Link>
//                             <Link to="/Attenddence-student-list" className="nav-link">Attendence View</Link>
                            

                            
                            
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//         </div>
//     )
// }

// export default Header


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

            {/* ================= MASTER ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Master
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li className="submenu">
                  <Link to="#" className="sm-dropdown-item dropdown-toggle">
                    Class
                  </Link>
                  <ul className="sm-dropdown dropdown-menu">
                    <li>
                      <Link to="/Class-List" className="sm-dropdown-item">Class List</Link>
                    </li>
                    <li>
                      <Link to="/Add-Class" className="sm-dropdown-item">Add Class</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* ================= STUDENT ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Student
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Add-Student" className="sm-dropdown-item">Student Registration</Link>
                </li>
                <li>
                  <Link to="/Student-List" className="sm-dropdown-item">Student List</Link>
                </li>
              </ul>
            </li>

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

            {/* ================= Teacher Management ================= */}
            <li className="nav-item dropdown">
              <Link to="#" className="sm-link dropdown-toggle" data-bs-toggle="dropdown">
                Teacher Management
              </Link>

              <ul className="sm-dropdown dropdown-menu">
                <li>
                  <Link to="/Add-Teacher" className="sm-dropdown-item">Add Teacher</Link>
                </li>
                <li>
                  <Link to="/Teacher-List" className="sm-dropdown-item">Teacher List</Link>
                </li>
                
                <li>
                  <Link to="/Teacher-Profile/1" className="sm-dropdown-item">Teacher Profile</Link>
                </li>
                <li>
                  <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Subject</Link>
                </li>
                <li>
                  <Link to="/Assign-Class-Teacher" className="sm-dropdown-item">Assign Class</Link>
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
                  <Link to="/Add-Section" className="sm-dropdown-item">Add Section</Link>
                </li>
                <li>
                  <Link to="/Assign-Class-Teacher" className="sm-dropdown-item">Assign Class Teacher</Link>
                </li>
                <li>
                  <Link to="/Assign-Students" className="sm-dropdown-item">Assign Students</Link>
                </li>
                <li>
                  <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Subjects</Link>
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
                  <Link to="/Add-Subject" className="sm-dropdown-item">Add Subject</Link>
                </li>
                <li>
                  <Link to="/Subject-List" className="sm-dropdown-item">Subject List</Link>
                </li>
                
                <li>
                  <Link to="/Subject-Code" className="sm-dropdown-item">Subject Code</Link>
                </li>
                <li>
                  <Link to="/Assign-Subject-Teacher" className="sm-dropdown-item">Assign Teacher</Link>
                </li>
                <li>
                  <Link to="/Assign-Subject" className="sm-dropdown-item">Assign Class</Link>
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