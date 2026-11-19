
import React, { useEffect, useMemo, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/parent";

const initialForm = {
  parentName: "",
  relation: "Father",
  mobileNumber: "",
  alternateMobileNumber: "",
  email: "",
  occupation: "",
  address: "",
  studentIds: [],
};

function ParentManagement() {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");
  const [viewParent, setViewParent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  const [classes, setClasses] = useState([]);
const [assignStudents, setAssignStudents] = useState([]);
const [selectedClass, setSelectedClass] = useState("");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }

    return result;
  };

  const fetchParents = async () => {
    try {
      setLoading(true);
      const result = await request("/");
      setParents(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const result = await request("/students/list");
      setStudents(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchClasses = async () => {
  try {
    const response = await fetch("https://school-management-backend-ochre.vercel.app/api/class");
    const result = await response.json();

    setClasses(result || []);
  } catch (error) {
    setError(error.message);
  }
};

const fetchAssignStudents = async (classId) => {
  try {
    setAssignStudents([]);

    if (!classId) return;

    const response = await fetch(
      `https://school-management-backend-ochre.vercel.app/api/assignstudent?classId=${classId}`
    );

    const result = await response.json();

    setStudents(result.data || []);
  } catch (error) {
    setError(error.message);
  }
};

  useEffect(() => {
    fetchParents();
   
    fetchClasses();
    
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentChange = (studentId) => {
    setForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter((id) => id !== studentId)
        : [...prev.studentIds, studentId],
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      const url = editId
        ? `/update/${editId}`
        : "/submit";

      await request(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });

      alert(
        editId
          ? "Parent updated successfully"
          : "Parent added successfully"
      );

      resetForm();
      await fetchParents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const result = await request(`/${id}`);
      const parent = result.data;

      setForm({
        parentName: parent.parentName || "",
        relation: parent.relation || "Father",
        mobileNumber: parent.mobileNumber || "",
        alternateMobileNumber: parent.alternateMobileNumber || "",
        email: parent.email || "",
        occupation: parent.occupation || "",
        address: parent.address || "",
        studentIds: (parent.studentIds || []).map((student) =>
          typeof student === "object" ? student._id : student
        ),
      });

      setEditId(id);
      setViewParent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleView = async (id) => {
    try {
      const result = await request(`/${id}`);
      setViewParent(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parent?")) {
      return;
    }

    try {
      await request(`/delete/${id}`, {
        method: "DELETE",
      });

      alert("Parent deleted successfully");
      await fetchParents();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStudentName = (student) => {
    if (!student) return "-";

    if (typeof student === "string") {
      const found = students.find((item) => item._id === student);
      return found
        ? `${found.firstName || ""} ${found.lastName || ""}`.trim()
        : student;
    }

    return `${student.firstName || ""} ${student.lastName || ""}`.trim();
  };

  const filteredParents = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return parents;

    return parents.filter((parent) => {
      const name = (parent.parentName || "").toLowerCase();
      const mobile = (parent.mobileNumber || "").toLowerCase();
      const email = (parent.email || "").toLowerCase();

      const childNames = (parent.studentIds || [])
        .map((student) => getStudentName(student))
        .join(" ")
        .toLowerCase();

      return (
        name.includes(value) ||
        mobile.includes(value) ||
        email.includes(value) ||
        childNames.includes(value)
      );
    });
  }, [parents, search, students]);

  const selectedStudentNames = (studentIds = []) =>
    studentIds.map(getStudentName).filter(Boolean).join(", ") || "-";

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <div>
          <h3 className="mb-1">Parent Management</h3>
          <p className="text-muted mb-0">
            Manage parents, guardians and their children.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={resetForm}
        >
          + Add Parent
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {/* Parent Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            {editId ? "Update Parent" : "Add New Parent"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Parent Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent name"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Relation *</label>
                <select
                  className="form-select"
                  name="relation"
                  value={form.relation}
                  onChange={handleChange}
                  required
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Alternate Mobile</label>
                <input
                  type="tel"
                  className="form-control"
                  name="alternateMobileNumber"
                  value={form.alternateMobileNumber}
                  onChange={handleChange}
                  placeholder="Enter alternate mobile"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  className="form-control"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  placeholder="Enter occupation"
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                />
              </div>
              <div className="col-md-4 mb-3">
  <label className="form-label">Select Class</label>

  <select
    className="form-select"
    value={selectedClass}
    onChange={(e) => {
      const classId = e.target.value;

      setSelectedClass(classId);
      fetchAssignStudents(classId);
    }}
  >
    <option value="">Select Class</option>

    {classes.map((item) => (
      <option key={item._id} value={item._id}>
        {item.className}
      </option>
    ))}
  </select>
</div>

              <div className="col-md-12">
                <label className="form-label">
                  Assign Students
                </label>

                <div
                  className="border rounded p-3"
                  style={{ maxHeight: "220px", overflowY: "auto" }}
                >
                  {students.length === 0 ? (
                    <p className="text-muted mb-0">
                      No students available
                    </p>
                  ) : (
                    <div className="row">
                      {students.map((student) => (
                        <div className="col-md-4 mb-2" key={student._id}>
                          <label className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.studentIds.includes(student._id)}
                              onChange={() =>
                                handleStudentChange(student._id)
                              }
                            />

                            <span className="form-check-label">
                              {student.firstName} {student.lastName}
                              {student.admissionNumber
                                ? ` (${student.admissionNumber})`
                                : ""}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <small className="text-muted">
                  Selected students: {form.studentIds.length}
                </small>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-success me-2"
                disabled={saving}
              >
                {saving
                  ? "Please wait..."
                  : editId
                  ? "Update Parent"
                  : "Save Parent"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Parent List */}
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap">
          <h5 className="mb-0">Parent List</h5>

          <input
            type="search"
            className="form-control"
            style={{ maxWidth: "300px" }}
            placeholder="Search name, mobile, email or student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card-body table-responsive">
          {loading ? (
            <p className="text-center">Loading parents...</p>
          ) : (
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Parent Name</th>
                  <th>Relation</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No parents found
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((parent, index) => (
                    <tr key={parent._id}>
                      <td>{index + 1}</td>
                      <td>{parent.parentName}</td>
                      <td>{parent.relation}</td>
                      <td>{parent.mobileNumber}</td>
                      <td>{parent.email || "-"}</td>
                      <td>
                        {parent.studentIds?.length || 0}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-info text-white"
                            onClick={() => handleView(parent._id)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(parent._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(parent._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Parent Modal */}
      {viewParent && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Parent Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setViewParent(null)}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Parent Name:</strong>
                    <p>{viewParent.parentName}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Relation:</strong>
                    <p>{viewParent.relation}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Mobile:</strong>
                    <p>{viewParent.mobileNumber}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Alternate Mobile:</strong>
                    <p>{viewParent.alternateMobileNumber || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Email:</strong>
                    <p>{viewParent.email || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Occupation:</strong>
                    <p>{viewParent.occupation || "-"}</p>
                  </div>

                  <div className="col-md-12">
                    <strong>Address:</strong>
                    <p>{viewParent.address || "-"}</p>
                  </div>

                  <div className="col-md-12">
                    <strong>Linked Students:</strong>
                    <ul>
                      {(viewParent.studentIds || []).map((student) => (
                        <li key={student._id}>
                          {getStudentName(student)}
                          {student.admissionNumber
                            ? ` - ${student.admissionNumber}`
                            : ""}
                        </li>
                      ))}

                      {(!viewParent.studentIds ||
                        viewParent.studentIds.length === 0) && (
                        <li>No students linked</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewParent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentManagement;
