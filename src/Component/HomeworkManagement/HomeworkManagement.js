
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/homework";

const initialForm = {
  title: "",
  description: "",
  classId: "",
  sectionId: "",
  subjectId: "",
  teacherId: "",
  dueDate: "",
  academicSession: "",
  attachment: "",
  totalMarks: 0,
};

const HomeworkManagement = () => {
  const [form, setForm] = useState(initialForm);
  const [homeworkList, setHomeworkList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadHomework = async () => {
    try {
      setLoading(true);

      const response = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load homework");
      }

      setHomeworkList(result.data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        totalMarks: Number(form.totalMarks) || 0,
      };

      const response = await fetch(
        editId ? `${API}/update/${editId}` : `${API}/add`,
        {
          method: editId ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }

      alert(
        editId
          ? "Homework updated successfully"
          : "Homework added successfully"
      );

      resetForm();
      loadHomework();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      classId: item.classId?._id || item.classId || "",
      sectionId: item.sectionId?._id || item.sectionId || "",
      subjectId: item.subjectId?._id || item.subjectId || "",
      teacherId: item.teacherId?._id || item.teacherId || "",
      dueDate: item.dueDate
        ? new Date(item.dueDate).toISOString().slice(0, 10)
        : "",
      academicSession: item.academicSession || "",
      attachment: item.attachment || "",
      totalMarks: item.totalMarks || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this homework?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      alert("Homework deleted successfully");
      loadHomework();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Homework Management</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            {editId ? "Update Homework" : "Add Homework"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Homework Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Academic Session *</label>
                <select
                  name="academicSession"
                  className="form-select"
                  value={form.academicSession}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Session</option>
                  {Array.from({ length: new Date().getFullYear() - 2020 + 1 },
                    (_, i) => 2020 + i
                  ).map((year) => (
                    <option key={year} value={`${year}-${String(year + 1).slice(-2)}`}>
                      {year}-{String(year + 1).slice(-2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {[
                ["classId", "Class ID"],
                ["sectionId", "Section ID"],
                ["subjectId", "Subject ID"],
                ["teacherId", "Teacher ID"],
              ].map(([name, label]) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label className="form-label">{label} *</label>
                  <input
                    type="text"
                    name={name}
                    className="form-control"
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${label}`}
                    required
                  />
                </div>
              ))}

              <div className="col-md-6 mb-3">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  className="form-control"
                  min="0"
                  value={form.totalMarks}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Attachment URL</label>
                <input
                  type="text"
                  name="attachment"
                  className="form-control"
                  placeholder="Enter document URL (optional)"
                  value={form.attachment}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
            >
              {editId ? "Update Homework" : "Add Homework"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Reset
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Homework List</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Due Date</th>
                    <th>Session</th>
                    <th>Marks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {homeworkList.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.classId?.className || "-"}</td>
                      <td>{item.sectionId?.sectionName || "-"}</td>
                      <td>{item.subjectId?.subjectName || "-"}</td>
                      <td>{item.teacherId?.teacherName || item.teacherId?.name || "-"}</td>
                      <td>
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{item.academicSession}</td>
                      <td>{item.totalMarks}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {homeworkList.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No homework found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeworkManagement;
