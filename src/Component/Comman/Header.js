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
import {  Link } from "react-router-dom";
function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">

        {/* Logo */}
        <a className="navbar-brand fw-bold" href="/">
          School Management
        </a>

        {/* Mobile Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#schoolNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="schoolNavbar">

          <ul className="navbar-nav ms-4">

            {/* ================= MASTER ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Master
              </a>

              <ul className="dropdown-menu">

                {/* Class */}
                <li className="submenu">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    Class
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      
                      <Link to="/Class-List" className="dropdown-item">Class List</Link>
                    </li>

                    <li>
                      
                      <Link to="/Add-Class" className="dropdown-item">Add Class</Link>
                    </li>

                    <li>

                      <a className="dropdown-item" href="/class/edit">
                        Edit Class
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Section */}
                <li className="submenu">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    Section
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/section/add">
                        Add Section
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href="/section/edit">
                        Edit Section
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Teacher */}
                <li className="submenu">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    Teacher
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/teacher/add">
                        Add Teacher
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href="/teacher/edit">
                        Edit Teacher
                      </a>
                    </li>
                  </ul>
                </li>

              </ul>
            </li>


            {/* ================= STUDENT ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Student
              </a>

              <ul className="dropdown-menu">

                <li>
                  <a className="dropdown-item" href="/student/add">
                    Student Registration
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="/student/list">
                    Student List
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="/student/edit">
                    Edit Student
                  </a>
                </li>

              </ul>
            </li>


            {/* ================= ATTENDANCE ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Attendance
              </a>

              <ul className="dropdown-menu">

                <li>
                  <a className="dropdown-item" href="/attendance/take">
                    Take Attendance
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="/attendance/report">
                    Attendance Report
                  </a>
                </li>

              </ul>
            </li>


             {/* ================= Teacher Management ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Teacher Management
              </a>

              <ul className="dropdown-menu">

                <li>
                    <Link to="/Add-Teacher" className="dropdown-item">Add Teacher</Link>
                    
                </li>

                <li>
                    <Link to="Teacher-Profile/1" className="dropdown-item">Teacher Profile</Link>
                  
                </li>

                <li>
                    <Link to="/Assign-Subject" className="dropdown-item">Assign Subject</Link>
                  
                </li>

                <li>
                    <Link to="/Assign-Class-Teacher" className="dropdown-item">Assign Class</Link>
                  
                </li>

                <li>
                    <Link to="/Add-Teacher" className="dropdown-item">Assign Section</Link>
                  
                </li>

                <li>
                    <Link to="/Add-Teacher" className="dropdown-item">Teacher Attendance</Link>
                  
                </li>

                <li>
                    <Link to="/Add-Teacher" className="dropdown-item">Salary Details</Link>
                  
                </li>

              </ul>
            </li>

          </ul>

          {/* Right Side */}
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <a className="nav-link" href="/profile">
                Profile
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/logout">
                Logout
              </a>
            </li>

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Header;