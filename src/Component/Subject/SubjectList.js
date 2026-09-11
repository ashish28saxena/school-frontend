import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import "./SubjectList.css";



function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

 

  const toggleStatus = (id) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  };

  const removeSubject = async(item) => {
        let response=await fetch("http://localhost:5000/api/subject/delete/"+item._id,{
             method: "DELETE"
        })
        const result = await response.json();
        if(result)
        {
            getSubjectData();
        }
  };

  async function getSubjectData()
  {
      const response = await fetch("http://localhost:5000/api/subject");
        const result = await response.json();

        setSubjects(result.data || []);

  }

  useEffect(()=>{
       getSubjectData()
  },[])

  return (
    <div className="subl-wrap">
      <div className="subl-card">

        <div className="subl-header">
          <div>
            <h2>Subject List</h2>
            <p>{subjects.length} of {subjects.length} subjects</p>
          </div>
          <Link className="subl-add-btn" to="/Add-Subject">+ Add Subject</Link>
          
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
                <th>Subject Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Class</th>
                <th>Status</th>
                <th className="subl-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="subl-empty">
                    No subjects match your search.
                  </td>
                </tr>
              )}

              {subjects.map((s,index) => (
                <tr key={index}>
                  <td className="subl-name">{s.name}</td>
                  <td className="subl-code">{s.code}</td>
                  <td>
                    <span className={`subl-type subl-type--${s.subjectType.replace(/\s|-/g, "").toLowerCase()}`}>
                      {s.subjectType}
                    </span>
                  </td>
                  <td>{s.classId.className}</td>
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
                    <button className="subl-icon-btn" title="Edit">Edit</button>
                    <button
                      className="subl-icon-btn subl-icon-btn--danger"
                      title="Delete"
                      onClick={() => removeSubject(s)}
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
  );
}

export default SubjectList;