import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/exam";

const initialForm = {
  examName: "",
  examType: "Unit Test",
  academicYear: "2026-27",
  startDate: "",
  endDate: "",
  description: "",
  status: true,
};

function ExamMaster() {
  const [form, setForm] = useState(initialForm);
  const [exams, setExams] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch exam list
  const fetchExams = async () => {
    try {
      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setExams(result.data || []);
    } catch (error) {
      alert("Unable to fetch exams");
    }
  };

  // Input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.endDate < form.startDate) {
      alert("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        editId ? `${API}/update/${editId}` : `${API}/submit`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong");
        return;
      }

      alert(result.message);
      setForm(initialForm);
      setEditId(null);
      fetchExams();
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Edit exam
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      examName: item.examName || "",
      examType: item.examType || "Unit Test",
      academicYear: item.academicYear || "2026-27",
      startDate: item.startDate
        ? item.startDate.substring(0, 10)
        : "",
      endDate: item.endDate
        ? item.endDate.substring(0, 10)
        : "",
      description: item.description || "",
      status: item.status,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete exam
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Delete failed");
        return;
      }

      alert(result.message);
      fetchExams();
    } catch (error) {
      alert("Server error");
    }
  };

  // Reset form
  const handleReset = () => {
    setForm(initialForm);
    setEditId(null);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Exam Master</h3>
        <span className="badge bg-primary fs-6">
          Total Exams: {exams.length}
        </span>
      </div>

      {/* Exam Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {editId ? "Update Exam" : "Add New Exam"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Exam Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="examName"
                  value={form.examName}
                  onChange={handleChange}
                  placeholder="Enter exam name"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Exam Type *</label>
                <select
                  className="form-select"
                  name="examType"
                  value={form.examType}
                  onChange={handleChange}
                  required
                >
                  <option value="Unit Test">Unit Test</option>
                  <option value="Monthly Test">Monthly Test</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Annual">Annual</option>
                  <option value="Final">Final</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Academic Year *</label>
                <select
                  className="form-select"
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  required
                >
                  {Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, index) => {
                  const startYear = 2020 + index;
                  const endYear = startYear + 1;
                  const year = `${startYear}-${String(endYear).slice(-2)}`;

                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={String(form.status)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter exam description"
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : editId
                    ? "Update Exam"
                    : "Add Exam"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Exam List */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Exam List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Exam Name</th>
                  <th>Exam Type</th>
                  <th>Academic Year</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {exams.length > 0 ? (
                  exams.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.examName}</td>
                      <td>{item.examType}</td>
                      <td>{item.academicYear}</td>
                      <td>
                        {new Date(item.startDate).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        {new Date(item.endDate).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No Exam Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamMaster;