import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function ExamResult() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
   const token = localStorage.getItem("token");
  const [filters, setFilters] = useState({
    examId: "",
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
  });

  const [results, setResults] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/exam/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json()),
      fetch(`${API}/class/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json()),
      fetch(`${API}/section/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json()),
    ])
      .then(([e, c, s]) => {
        setExams(e.data || []);
        setClasses(c || []);
        setSections(s.data || []);
      })
      .catch(() => alert("Unable to fetch filters"));
  }, []);

  const filteredSections = sections.filter((item) => {
    const id =
      typeof item.classId === "object"
        ? item.classId?._id
        : item.classId;
    return id === filters.classId;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
  };

  const fetchResults = async () => {
    const { examId, classId, sectionId, academicYear } = filters;

    if (!examId || !classId || !sectionId || !academicYear) {
      alert("Please select all filters");
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams(filters);
      const response = await fetch(
        `${API}/examresult/?${params.toString()}`
      );
      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setExam(result.exam);
      setResults(result.data || []);
    } catch {
      alert("Unable to fetch result");
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (student) =>
    student?.studentName ||
    [student?.firstName, student?.lastName].filter(Boolean).join(" ") ||
    student?.name ||
    "Student";

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Exam Result</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Select Exam</label>
              <select
                className="form-select"
                name="examId"
                value={filters.examId}
                onChange={handleChange}
              >
                <option value="">Select Exam</option>
                {exams.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.examName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Academic Year</label>
              <input
                className="form-control"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Class</label>
              <select
                className="form-select"
                name="classId"
                value={filters.classId}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                name="sectionId"
                value={filters.sectionId}
                onChange={handleChange}
                disabled={!filters.classId}
              >
                <option value="">Select Section</option>
                {sections.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={fetchResults}
                disabled={loading}
              >
                {loading ? "Loading..." : "View Result"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {exam && (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <h5 className="mb-0">{exam.examName} – Result List</h5>
            <span className="badge bg-primary">
              Students: {results.length}
            </span>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Rank</th>
                    <th>Roll No.</th>
                    <th>Student Name</th>
                    <th>Total Marks</th>
                    <th>Obtained</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Result</th>
                    <th>Report Card</th>
                  </tr>
                </thead>

                <tbody>
                  {results.length ? (
                    results.map((item) => (
                      <tr key={item.studentId}>
                        <td>{item.rank}</td>
                        <td>{item.rollNumber || "-"}</td>
                        <td>{getStudentName(item.student)}</td>
                        <td>{item.totalMarks}</td>
                        <td>{item.obtainedMarks}</td>
                        <td>{item.percentage}%</td>
                        <td>{item.grade}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.result === "Pass"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {item.result}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              window.open(
                                `/report-card/${item.studentId}?examId=${filters.examId}&academicYear=${filters.academicYear}`,
                                "_blank"
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No result found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamResult;