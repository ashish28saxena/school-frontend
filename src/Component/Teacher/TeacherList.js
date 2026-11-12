import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TeacherList.css";

const API = "https://school-management-backend-ochre.vercel.app";

const TeacherList = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function getTeacherData() {
    const response = await fetch(`${API}/api/teacher/`);
    const result = await response.json();
    setTeacherData(result.data || []);
  }

  useEffect(() => {
    getTeacherData();
  }, []);

  const toggleStatus = (id) => {
    setTeacherData((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: !t.status } : t))
    );
  };

  const removeTeacher = async (item) => {
    if (!window.confirm(`Delete ${item.firstName}? This can't be undone.`)) return;
    const response = await fetch(`${API}/api/teacher/delete/${item._id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result) getTeacherData();
  };

  const query = search.trim().toLowerCase();
  const filtered = teacherData.filter((t) => {
    const matchesSearch =
      !query ||
      [t.firstName, t.email, t.employeeID, t.mobileNumber]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query));
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" ? t.status : !t.status);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="tl-page">
      <div className="tl-card">
        <header className="tl-header">
          <div>
            <h2 className="tl-title">Teachers</h2>
            <p className="tl-sub">
              Showing {filtered.length} of {teacherData.length} teachers
            </p>
          </div>
          <Link className="tl-btn tl-btn--primary" to="/Add-Teacher">
            + Add teacher
          </Link>
        </header>

        <div className="tl-toolbar">
          <input
            type="text"
            className="tl-input"
            placeholder="Search by name, email or employee ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="tl-input tl-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="tl-scroll">
          <table className="tl-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Gender</th>
                <th>Date of birth</th>
                <th>Contact</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th className="tl-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="tl-empty">
                    No teachers found. Try a different search or add a new teacher.
                  </td>
                </tr>
              )}

              {filtered.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="tl-person">
                      {t.profileImage ? (
                        <img
                          className="tl-avatar"
                          src={`${API}/uploads/teacher/${t.profileImage}`}
                          alt={t.firstName}
                        />
                      ) : (
                        <span className="tl-avatar tl-avatar--fallback">
                          {(t.firstName || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="tl-name">{t.firstName}</span>
                    </div>
                  </td>
                  <td>{t.gender}</td>
                  <td>{formatDate(t.dateOfBirth)}</td>
                  <td>
                    <div className="tl-contact">
                      <span>{t.email}</span>
                      <span className="tl-muted">{t.mobileNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="tl-id">{t.employeeID}</span>
                  </td>
                  <td>
                    <button
                      className={`tl-status ${t.status ? "is-active" : "is-inactive"}`}
                      onClick={() => toggleStatus(t._id)}
                      title="Click to change status"
                    >
                      <span className="tl-dot" />
                      {t.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div className="tl-actions">
                      <Link className="tl-btn" to={"/Teacher-Profile/" + t._id}>
                        View
                      </Link>
                      <Link className="tl-btn" to={"/Add-Teacher/" + t._id}>
                        Edit
                      </Link>
                      <button
                        className="tl-btn tl-btn--danger"
                        onClick={() => removeTeacher(t)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;