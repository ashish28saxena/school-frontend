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
        
        <Link to="/"className="navbar-brand fw-bold">School Management</Link>

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
               <Link to="/" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Master</Link>
              

              <ul className="dropdown-menu">

                {/* Class */}
                <li className="submenu">
                  <Link to="/" className="dropdown-item dropdown-toggle" >
                    Class
                  </Link>

                  <ul className="dropdown-menu">
                    <li>
                      
                      <Link to="/Class-List" className="dropdown-item">Class List</Link>
                    </li>

                    <li>
                      
                      <Link to="/Add-Class" className="dropdown-item">Add Class</Link>
                    </li>

                   
                  </ul>
                </li>

            

              </ul>
            </li>


            {/* ================= STUDENT ================= */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                data-bs-toggle="dropdown"
              >
                Student
              </Link>

              <ul className="dropdown-menu">

                <li>
                  <Link className="dropdown-item" to="/Add-Student">
                    Student Registration
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" href="/Student-List">
                    Student List
                  </Link>
                </li>

                

              </ul>
            </li>


            {/* ================= ATTENDANCE ================= */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                data-bs-toggle="dropdown"
              >
                Attendance
              </Link>

              <ul className="dropdown-menu">

                <li>
                  <Link className="dropdown-item" to="/Attenddence-list">
                    Take Attendance
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/Attenddence-student-list">
                    Attendance Report
                  </Link>
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
                    <Link to="/Assign-Class" className="dropdown-item">Assign Section</Link>
                  
                </li>

                <li>
                    <Link to="/Teacher-Attendance" className="dropdown-item">Teacher Attendance</Link>
                  
                </li>

                <li>
                    <Link to="/Teacher-Salary" className="dropdown-item">Salary Details</Link>
                  
                </li>

              </ul>
            </li>


             {/* ================= Class & Section Management ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Class & Section Management
              </a>

              <ul className="dropdown-menu">

                <li>
                      
                      <Link to="/Class-List" className="dropdown-item">Class List</Link>
                    </li>

                    <li>
                      
                      <Link to="/Add-Class" className="dropdown-item">Add Class</Link>
                    </li>

                <li>
                    <Link to="Teacher-Profile/1" className="dropdown-item">Add Section</Link>
                  
                </li>
                

                <li>
                    <Link to="/Assign-Subject" className="dropdown-item">Assign Class Teacher</Link>
                  
                </li>

                <li>
                    <Link to="/Assign-Class-Teacher" className="dropdown-item">Assign Students</Link>
                  
                </li>

                <li>
                    <Link to="/Assign-Class" className="dropdown-item">Assign Subjects</Link>
                  
                </li>

                

              </ul>
            </li>


             {/* ================= Subject Management ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Subject Management
              </a>

              <ul className="dropdown-menu">

                <li>
                      
                      <Link to="/Class-List" className="dropdown-item">Add Subject</Link>
                    </li>

                    <li>
                      
                      <Link to="/Add-Class" className="dropdown-item">Subject Code</Link>
                    </li>

                <li>
                    <Link to="Teacher-Profile/1" className="dropdown-item">Assign Teacher</Link>
                  
                </li>
                

                <li>
                    <Link to="/Assign-Subject" className="dropdown-item">Assign Class</Link>
                  
                </li>

                

                

              </ul>
            </li>


             {/* ================= Timetable Management ================= */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Timetable Management
              </a>

              <ul className="dropdown-menu">

                <li>
                      
                      <Link to="/Class-List" className="dropdown-item">Create Timetable</Link>
                    </li>

                    <li>
                      
                      <Link to="/Add-Class" className="dropdown-item">Class-wise Timetable</Link>
                    </li>

                <li>
                    <Link to="Teacher-Profile/1" className="dropdown-item">Teacher-wise Timetable</Link>
                  
                </li>
                

                <li>
                    <Link to="/Assign-Subject" className="dropdown-item">Subject-wise Schedule</Link>
                  
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