
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/subject";

const initialForm = {
  subjectName: "",
  subjectCode: "",
  subjectType: "Core",
  description: "",
  status: true,
};

function SubjectManagement() {
  const [form, setForm] = useState(initialForm);
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API}/`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch subjects");
      }

      setSubjects(
        Array.isArray(result.data) ? result.data : []
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add / Update Subject
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const url = editId
        ? `${API}/update/${editId}`
        : `${API}/submit`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setMessage(result.message);
      setForm(initialForm);
      setEditId(null);

      await fetchSubjects();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Subject
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      subjectName: item.subjectName || "",
      subjectCode: item.subjectCode || "",
      subjectType: item.subjectType || "Core",
      description: item.description || "",
      status: item.status ?? true,
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Deactivate Subject
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this subject?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to deactivate subject");
      }

      setMessage(result.message);
      await fetchSubjects();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setMessage("");
  };

  return (
    <div className="container-fluid py-4">

      {/* Subject Form */}
      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {editId ? "Update Subject" : "Add Subject"}
          </h4>
        </div>

        <div className="card-body">

          {message && (
            <div className="alert alert-info">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* Subject Name */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Subject Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="subjectName"
                  value={form.subjectName}
                  onChange={handleChange}
                  placeholder="Enter subject name"
                  required
                />
              </div>

              {/* Subject Code */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Subject Code <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="subjectCode"
                  value={form.subjectCode}
                  onChange={handleChange}
                  placeholder="Example: MATH101"
                  required
                />
              </div>

              {/* Subject Type */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Subject Type
                </label>

                <select
                  className="form-select"
                  name="subjectType"
                  value={form.subjectType}
                  onChange={handleChange}
                >
                  <option value="Core">Core</option>
                  <option value="Optional">Optional</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-md-8 mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter subject description"
                />
              </div>

              {/* Status */}
              <div className="col-md-4 mb-3 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="status"
                    name="status"
                    checked={form.status}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label"
                    htmlFor="status"
                  >
                    Active
                  </label>
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : editId
                ? "Update Subject"
                : "Add Subject"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </form>
        </div>
      </div>

      {/* Subject List */}
      <div className="card shadow-sm">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Subject List</h5>

          <span className="badge bg-primary">
            Total: {subjects.length}
          </span>
        </div>

        <div className="card-body table-responsive">

          <table className="table table-bordered table-hover align-middle">

            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Subject Name</th>
                <th>Subject Code</th>
                <th>Subject Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {subjects.length > 0 ? (
                subjects.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.subjectName}</td>
                    <td>{item.subjectCode}</td>
                    <td>{item.subjectType}</td>
                    <td>{item.description || "-"}</td>

                    <td>
                      <span
                        className={`badge ${
                          item.status
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      {item.status && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}

export default SubjectManagement;
