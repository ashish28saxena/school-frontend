
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const initialForm = {
  studentId: "",
  classId: "",
  sectionId: "",
  rollNumber: "",
  academicYear: "2026-27",
  status: true,
};

function AssignStudent() {
  const [form, setForm] = useState(initialForm);

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // API response se data array nikalna
  const getData = (response) => {
    return Array.isArray(response.data)
      ? response.data
      : [];
  };

  // Load dropdowns and assignment list
  const fetchData = async () => {
    try {
      const [studentRes, classRes, sectionRes, assignRes] =
        await Promise.all([
          fetch(`${API}/student/`),
          fetch(`${API}/Class/`),
          fetch(`${API}/section/`),
          fetch(`${API}/assignstudent/`),
        ]);

      if (
        !studentRes.ok ||
        !classRes.ok ||
        !sectionRes.ok |
        !assignRes.ok
      ) {
        throw new Error("Unable to fetch data");
      }

      const [studentJson, classJson, sectionJson, assignJson] =
        await Promise.all([
          studentRes.json(),
          classRes.json(),
          sectionRes.json(),
          assignRes.json(),
        ]);

      setStudents(getData(studentJson));
      setClasses(classJson);
      setAllSections(getData(sectionJson));
      setAssignments(getData(assignJson));
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sections based on selected class
  const filteredSections = allSections.filter((section) => {
    if (!form.classId) return false;

    // Agar Section model mein classId hai
    const sectionClassId =
      section.classId?._id || section.classId;

    // Agar section mein classId nahi hai,
    // to sab sections dikha do
    if (!sectionClassId) return true;

    return sectionClassId.toString() === form.classId;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,

      // Class change hone par section reset
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const url = editId
        ? `${API}/assignstudent/update/${editId}`
        : `${API}/assignstudent/submit`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
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

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      studentId: item.studentId?._id || item.studentId || "",
      classId: item.classId?._id || item.classId || "",
      sectionId: item.sectionId?._id || item.sectionId || "",
      rollNumber: item.rollNumber || "",
      academicYear: item.academicYear || "2026-27",
      status: item.status ?? true,
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this assignment?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/assignstudent/delete/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setMessage(result.message);
      await fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const getStudentName = (student) => {
    if (!student) return "-";

    return (
      student.studentName ||
      student.name ||
      [student.firstName, student.lastName].filter(Boolean).join(" ") ||
      student.admissionNumber ||
      "Student"
    );
  };

  const getClassName = (classItem) => {
    if (!classItem) return "-";

    return classItem.className || classItem.name || "-";
  };

  const getSectionName = (section) => {
    if (!section) return "-";

    return section.sectionName || section.name || "-";
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {editId ? "Update Student Assignment" : "Assign Student"}
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

              {/* Student */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Student <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {getStudentName(student)}
                      {student.admissionNumber
                        ? ` (${student.admissionNumber})`
                        : ""}
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
                      {getClassName(item)}
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
                  required
                  disabled={!form.classId}
                >
                  <option value="">Select Section</option>

                  {filteredSections.map((item) => (
                    <option key={item._id} value={item._id}>
                      {getSectionName(item)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll Number */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Roll Number <span className="text-danger">*</span>
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter roll number"
                  required
                />
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
                    const academicYear = `${year}-${String(year + 1).slice(-2)}`;

                    return (
                      <option key={academicYear} value={academicYear}>
                        {academicYear}
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

                  <label className="form-check-label" htmlFor="status">
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
                ? "Update Assignment"
                : "Assign Student"}
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

      {/* Assignment List */}
      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Assigned Students List</h5>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Student</th>
                <th>Admission No.</th>
                <th>Class</th>
                <th>Section</th>
                <th>Roll No.</th>
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

                    <td>{getStudentName(item.studentId)}</td>

                    <td>
                      {item.studentId?.admissionNumber || "-"}
                    </td>

                    <td>{getClassName(item.classId)}</td>

                    <td>{getSectionName(item.sectionId)}</td>

                    <td>{item.rollNumber}</td>

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
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
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
                  <td colSpan="9" className="text-center">
                    No assigned students found
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

export default AssignStudent;
