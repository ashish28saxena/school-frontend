
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const initialForm = {
  teacherID: "",
  classId: "",
  sectionId: "",
  subjectId: "",
  academicYear: "2026-27",
  status: true,
};

function AssignSubject() {
  const [form, setForm] = useState(initialForm);

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getData = (response) =>
    Array.isArray(response.data) ? response.data : [];

  // Fetch dropdowns and assignment list
  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API}/teacher/`),
        fetch(`${API}/class/`),
        fetch(`${API}/section/`),
        fetch(`${API}/subject/`),
        fetch(`${API}/assignsubject/`),
      ]);

      if (responses.some((response) => !response.ok)) {
        throw new Error("Unable to fetch data");
      }

      const data = await Promise.all(
        responses.map((response) => response.json())
      );

      setTeachers(getData(data[0]));
      setClasses(data[1]);
      setSections(getData(data[2]));
      setSubjects(getData(data[3]));
      setAssignments(getData(data[4]));
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sections according to selected class
  const filteredSections = sections.filter((section) => {
    if (!form.classId) return false;

    const sectionClassId =
      section.classId?._id || section.classId;

    if (!sectionClassId) return true;

    return sectionClassId.toString() === form.classId;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
  };

  // Submit / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const url = editId
        ? `${API}/assignsubject/update/${editId}`
        : `${API}/assignsubject/submit`;

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

      await fetchData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      teacherID: item.teacherID?._id || item.teacherID || "",
      classId: item.classId?._id || item.classId || "",
      sectionId: item.sectionId?._id || item.sectionId || "",
      subjectId: item.subjectId?._id || item.subjectId || "",
      academicYear: item.academicYear || "2026-27",
      status: item.status ?? true,
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Deactivate
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this subject assignment?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/assignsubject/delete/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to deactivate");
      }

      setMessage(result.message);
      await fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const teacherName = (teacher) => {
    if (!teacher) return "-";

    return (
      [teacher.firstName, teacher.lastName]
        .filter(Boolean)
        .join(" ") ||
      teacher.teacherName ||
      teacher.name ||
      "-"
    );
  };

  const className = (item) =>
    item?.className || item?.name || "-";

  const sectionName = (item) =>
    item?.sectionName || item?.name || "-";

  const subjectName = (item) =>
    item?.subjectName || item?.name || item?.subject || "-";

  return (
    <div className="container-fluid py-4">

      {/* Form */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {editId ? "Update Assign Subject" : "Assign Subject"}
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

              {/* Teacher */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Teacher <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="teacherID"
                  value={form.teacherID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Teacher</option>

                  {teachers.map((item) => (
                    <option key={item._id} value={item._id}>
                      {teacherName(item)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Class <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>

                  {classes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {className(item)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Section <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="sectionId"
                  value={form.sectionId}
                  onChange={handleChange}
                  disabled={!form.classId}
                  required
                >
                  <option value="">Select Section</option>

                  {filteredSections.map((item) => (
                    <option key={item._id} value={item._id}>
                      {sectionName(item)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Subject <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Subject</option>

                  {subjects.map((item) => (
                    <option key={item._id} value={item._id}>
                      {subjectName(item)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Academic Year <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Academic Year</option>

                  {Array.from({ length: 10 }, (_, i) => {
                    const year = 2020 + i;
                    const value =
                      `${year}-${String(year + 1).slice(-2)}`;

                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
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
                ? "Update Assign Subject"
                : "Assign Subject"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setForm(initialForm);
                  setEditId(null);
                  setMessage("");
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* List */}
      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Assigned Subjects List</h5>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Teacher</th>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignments.length > 0 ? (
                assignments.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{teacherName(item.teacherID)}</td>
                    <td>{className(item.classId)}</td>
                    <td>{sectionName(item.sectionId)}</td>
                    <td>{subjectName(item.subjectId)}</td>
                    <td>{item.academicYear}</td>

                    <td>
                      <span
                        className={`badge ${
                          item.status ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {item.status && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            Deactivate
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No assigned subjects found
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

export default AssignSubject;
