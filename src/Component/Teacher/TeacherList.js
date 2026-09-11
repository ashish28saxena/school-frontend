import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import "./TeacherList.css";

const TeacherList=()=>{
     const [teacherData, setTeacherData] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
   const toggleStatus = (id) => {
    setTeacherData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  };

  const removeTeacher = async(item) => {
        let response=await fetch("http://localhost:5000/api/teacher/delete/"+item._id,{
             method: "DELETE"
        })
        const result = await response.json();
        if(result)
        {
            getTeacherData();
        }
  };

  async function getTeacherData()
  {
      const response = await fetch("http://localhost:5000/api/teacher/");
        const result = await response.json();
        console.log("%%%%%",result.data)
        setTeacherData(result.data || []);

  }

  useEffect(()=>{
       getTeacherData()
  },[])
    return(
         <div className="subl-wrap">
      <div className="subl-card">

        <div className="subl-header">
          <div>
            <h2>Teacher List</h2>
            <p>{teacherData.length} of {teacherData.length} Teacher</p>
          </div>
          <Link className="subl-add-btn" to="/Add-Teacher">+ Add Teacher</Link>
          
        </div>

        <div className="subl-toolbar">
          <input
            type="text"
            className="subl-search"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="subl-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Extra-curricular">Extra-curricular</option>
          </select>
        </div>

        <div className="subl-table-scroll">
          <table className="subl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Date Of Birth</th>
                <th>Number</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Photo</th>
                <th>Status</th>
                <th className="subl-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacherData.length === 0 && (
                <tr>
                  <td colSpan="6" className="subl-empty">
                    No Teacher match your search.
                  </td>
                </tr>
              )}

              {teacherData.map((s,index) => (
                <tr key={index}>
                  <td className="subl-name">{s.firstName}</td>
                  <td className="subl-code">{s.gender}</td>
                  <td>
                    <span className="subl-code">
                      
                     {new Date(s.dateOfBirth).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}
                    </span>
                  </td>
                  <td>{s.mobileNumber}</td>
                  <td>{s.email}</td>
                  <td>{s.employeeID}</td>
                  <img
    src={`http://localhost:5000/uploads/teacher/${s.profileImage}`}
    alt="Profile"
    width="50"
    height="50"
  />
                  <td>
                    <button
                      className={`subl-status ${s.status ? "is-active" : "is-inactive"}`}
                      onClick={() => toggleStatus(s.id)}
                    >
                      <span className="subl-status-dot"></span>
                      {s.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="subl-actions-col">
                    <button><Link to={"/Teacher-Profile/"+s._id}>View</Link></button>
                    <button className="subl-icon-btn" title="Edit">Edit</button>
                    <button
                      className="subl-icon-btn subl-icon-btn--danger"
                      title="Delete"
                      onClick={() => removeTeacher(s)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
    )
}

export default TeacherList;