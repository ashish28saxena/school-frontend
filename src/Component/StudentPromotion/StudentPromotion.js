
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/studentpromotion";
const CLASS_API = "https://school-management-backend-ochre.vercel.app/api/class";
const SECTION_API = "https://school-management-backend-ochre.vercel.app/api/section";

const StudentPromotion = () => {
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [form, setForm] = useState({
    fromClass: "",
    fromSection: "",
    fromAcademicYear: "",
    toClass: "",
    toSection: "",
    toAcademicYear: "",
    promotionStatus: "Promoted",
    remarks: "",
  });

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const academicYears = [];

  for (let year = 2020; year <= 2035; year++) {
    academicYears.push(`${year}-${String(year + 1).slice(-2)}`);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // FETCH CLASSES AND SECTIONS
  useEffect(() => {
    fetchClasses();
    fetchSections();
    fetchHistory();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(CLASS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setClasses(
          Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : []
        );
      }
    } catch (err) {
      console.error("Class fetch error:", err);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(SECTION_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSections(
          Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : []
        );
      }
    } catch (err) {
      console.error("Section fetch error:", err);
    }
  };

  // FETCH STUDENTS BY SOURCE CLASS / YEAR
  const fetchStudents = async () => {
    if (!form.fromClass || !form.fromSection || !form.fromAcademicYear) {
      setError("Please select source class, section and academic year");
      return;
    }

    try {
      setStudentLoading(true);
      setError("");
      setMessage("");
      setSelectedStudents([]);

      const params = new URLSearchParams({
        classId: form.fromClass,
        academicYear: form.fromAcademicYear,
      });

      params.append("sectionId", form.fromSection);

      const response = await fetch(`${API}/students?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Students fetch failed");
      }

      setStudents(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
      setStudents([]);
    } finally {
      setStudentLoading(false);
    }
  };

  // FETCH PROMOTION HISTORY
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setHistory(result.data || []);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  // SELECT / DESELECT STUDENT
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id]
    );
  };

  // SELECT ALL
  const toggleAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.student?._id).filter(Boolean));
    }
  };

  // FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (["fromClass", "fromSection", "fromAcademicYear"].includes(name)) {
      setStudents([]);
      setSelectedStudents([]);
    }
  };

  // BULK PROMOTION
  const handlePromotion = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      setError("Please select at least one student");
      return;
    }

    if (!form.fromSection || !form.toClass || !form.toSection || !form.toAcademicYear) {
      setError("Please select source section, destination class, destination section and academic year");
      return;
    }

    if (form.fromAcademicYear === form.toAcademicYear) {
      setError("Source and destination academic year cannot be same");
      return;
    }

    if (
      form.promotionStatus === "Promoted" &&
      form.fromClass === form.toClass
    ) {
      const confirmSameClass = window.confirm(
        "Source and destination class are same. Continue?"
      );

      if (!confirmSameClass) return;
    }

    const confirmPromotion = window.confirm(
      `Are you sure you want to ${form.promotionStatus.toLowerCase()} ${selectedStudents.length} students?`
    );

    if (!confirmPromotion) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const payload = {
        studentIds: selectedStudents,
        fromClass: form.fromClass,
        fromSection: form.fromSection,
        toClass: form.toClass,
        toSection: form.toSection,
        fromAcademicYear: form.fromAcademicYear,
        toAcademicYear: form.toAcademicYear,
        promotionStatus: form.promotionStatus,
        remarks: form.remarks,
      };

      const response = await fetch(`${API}/promote`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Promotion failed");
      }

      setMessage(result.message || "Promotion completed successfully");

      setSelectedStudents([]);
      setStudents([]);

      await fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getClassName = (classId) => {
    const found = classes.find((item) => item._id === classId);
    return found?.className || "-";
  };

  const getSectionName = (sectionId) => {
    const found = sections.find((item) => item._id === sectionId);
    return found?.sectionName || "-";
  };

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Student Promotion</h2>
        <p className="text-muted">
          Promote students from one academic year to another
        </p>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
          />
        </div>
      )}

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

      {/* SOURCE SELECTION */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Current Class Details</h5>

          <div className="row">

            {/* SOURCE CLASS */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Current Class</label>

              <select
                className="form-select"
                name="fromClass"
                value={form.fromClass}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>

                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            {/* SOURCE SECTION */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Current Section</label>

              <select
                className="form-select"
                name="fromSection"
                value={form.fromSection}
                onChange={handleChange}
                required
              >
                <option value="">All Sections</option>

                {sections.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.sectionName}
                  </option>
                ))}
              </select>
            </div>

            {/* SOURCE YEAR */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Current Academic Year</label>

              <select
                className="form-select"
                name="fromAcademicYear"
                value={form.fromAcademicYear}
                onChange={handleChange}
                required
              >
                <option value="">Select Academic Year</option>

                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* LOAD STUDENTS */}
            <div className="col-md-3 mb-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={fetchStudents}
                disabled={studentLoading}
              >
                {studentLoading ? "Loading..." : "Load Students"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* STUDENT TABLE */}
      {students.length > 0 && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">

            <div className="d-flex justify-content-between flex-wrap mb-3">
              <h5 className="fw-bold">
                Students ({students.length})
              </h5>

              <span className="badge bg-primary fs-6">
                Selected: {selectedStudents.length}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          students.length > 0 &&
                          selectedStudents.length === students.length
                        }
                        onChange={toggleAllStudents}
                      />
                    </th>
                    <th>S.No.</th>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Admission Number</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Academic Year</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.student?._id)}
                          onChange={() => toggleStudent(student.student?._id)}
                        />
                      </td>

                      <td>{index + 1}</td>
                      <td>{student.rollNumber ?? "-"}</td>
                      <td>{student.student?.name || "-"}</td>
                      <td>{student.student?.admissionNumber || "-"}</td>

                      <td>
                        {student.class?.className || "-"}
                      </td>

                      <td>
                        {student.section?.sectionName || "-"}
                      </td>

                      <td>{student.academicYear || "-"}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      )}

      {students.length === 0 && !studentLoading && (
        <div className="alert alert-info">
          Select class and academic year, then click Load Students.
        </div>
      )}

      {/* PROMOTION FORM */}
      {students.length > 0 && (
        <form onSubmit={handlePromotion}>
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">

              <h5 className="fw-bold mb-3">
                Promotion Details
              </h5>

              <div className="row">

                {/* DESTINATION CLASS */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Promote To Class</label>

                  <select
                    className="form-select"
                    name="toClass"
                    value={form.toClass}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Destination Class</option>

                    {classes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.className}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DESTINATION SECTION */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Promote To Section</label>

                  <select
                    className="form-select"
                    name="toSection"
                    value={form.toSection}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Section</option>

                    {sections.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.sectionName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DESTINATION YEAR */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Next Academic Year</label>
                  <select
                  className="form-select"
                  name="toAcademicYear"
                  value={form.toAcademicYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                  {/* <select
                    className="form-select"
                    name="toAcademicYear"
                    value={form.toAcademicYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Academic Year</option>

                    {academicYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select> */}
                </div>

                {/* STATUS */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Promotion Status</label>

                  <select
                    className="form-select"
                    name="promotionStatus"
                    value={form.promotionStatus}
                    onChange={handleChange}
                  >
                    <option value="Promoted">Promoted</option>
                    <option value="Detained">Detained</option>
                  </select>
                </div>

                {/* REMARKS */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Remarks</label>

                  <textarea
                    className="form-control"
                    name="remarks"
                    rows="2"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Optional remarks"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || selectedStudents.length === 0}
              >
                {loading
                  ? "Processing..."
                  : `${form.promotionStatus} ${selectedStudents.length} Students`}
              </button>

            </div>
          </div>
        </form>
      )}

      {/* PROMOTION HISTORY */}
      <div className="card shadow-sm border-0">
        <div className="card-body">

          <div className="d-flex justify-content-between mb-3">
            <h5 className="fw-bold">Promotion History</h5>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={fetchHistory}
            >
              Refresh History
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Student</th>
                  <th>Admission No.</th>
                  <th>From Class</th>
                  <th>From Section</th>
                  <th>From Year</th>
                  <th>To Class</th>
                  <th>To Section</th>
                  <th>To Year</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td>
                        {item.studentId?.name || "-"}
                      </td>

                      <td>
                        {item.studentId?.admissionNumber || "-"}
                      </td>

                      <td>
                        {item.fromClass?.className || "-"}
                      </td>

                      <td>
                        {item.fromSection?.sectionName || "-"}
                      </td>

                      <td>{item.fromAcademicYear}</td>

                      <td>
                        {item.toClass?.className || "-"}
                      </td>

                      <td>
                        {item.toSection?.sectionName || "-"}
                      </td>

                      <td>{item.toAcademicYear}</td>

                      <td>
                        <span
                          className={`badge ${
                            item.promotionStatus === "Promoted"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {item.promotionStatus}
                        </span>
                      </td>

                      <td>
                        {item.promotedAt
                          ? new Date(item.promotedAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No promotion history found
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
};

export default StudentPromotion;
