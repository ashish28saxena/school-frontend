
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/homework-submission";
const HOMEWORK_API = "https://school-management-backend-ochre.vercel.app/api/homework";

const HomeworkEvaluation = () => {
  const [submissions, setSubmissions] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [filters, setFilters] = useState({
    homeworkId: "",
    status: "",
  });

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    marksObtained: 0,
    remarks: "",
    status: "Checked",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const loadHomework = async () => {
    try {
      const response = await fetch(HOMEWORK_API, { headers });
      const result = await response.json();

      if (response.ok) {
        setHomeworkList(result.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.homeworkId) {
        params.append("homeworkId", filters.homeworkId);
      }

      if (filters.status) {
        params.append("status", filters.status);
      }

      const response = await fetch(
        `${API}/evaluation/list?${params.toString()}`,
        { headers }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load submissions");
      }

      setSubmissions(result.data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [filters.homeworkId, filters.status]);

  const openEvaluation = (item) => {
    setSelected(item);
    setForm({
      marksObtained: item.marksObtained ?? 0,
      remarks: item.remarks || "",
      status: item.status === "Rejected" ? "Rejected" : "Checked",
    });
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();

    if (!selected) return;

    try {
      const response = await fetch(
        `${API}/evaluate/${selected._id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            marksObtained: Number(form.marksObtained),
            remarks: form.remarks,
            status: form.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Evaluation failed");
      }

      alert("Homework evaluated successfully");

      setSelected(null);
      loadSubmissions();
    } catch (error) {
      alert(error.message);
    }
  };

  const getStudentName = (student) =>
    student?.studentName || student?.name || "-";

  const getSubjectName = (homework) =>
    homework?.subjectId?.subjectName || "-";

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Homework Submission & Evaluation</h2>

      {/* FILTERS */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-5 mb-3">
              <label className="form-label">Filter By Homework</label>
              <select
                className="form-select"
                value={filters.homeworkId}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    homeworkId: e.target.value,
                  }))
                }
              >
                <option value="">All Homework</option>
                {homeworkList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-5 mb-3">
              <label className="form-label">Filter By Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Late">Late</option>
                <option value="Checked">Checked</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              <button
                className="btn btn-secondary w-100"
                onClick={() =>
                  setFilters({ homeworkId: "", status: "" })
                }
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUBMISSION TABLE */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Student Submissions</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading submissions...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Student</th>
                    <th>Homework</th>
                    <th>Subject</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Marks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{getStudentName(item.studentId)}</td>
                      <td>{item.homeworkId?.title || "-"}</td>
                      <td>{getSubjectName(item.homeworkId)}</td>
                      <td>
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Checked"
                              ? "bg-success"
                              : item.status === "Rejected"
                              ? "bg-danger"
                              : item.status === "Late"
                              ? "bg-warning text-dark"
                              : "bg-primary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.marksObtained ?? 0} /{" "}
                        {item.homeworkId?.totalMarks ?? 0}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => openEvaluation(item)}
                        >
                          View / Evaluate
                        </button>
                      </td>
                    </tr>
                  ))}

                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No submissions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* EVALUATION FORM */}
      {selected && (
        <div className="card shadow-sm mb-4">
          <div className="card-header d-flex justify-content-between">
            <h5 className="mb-0">Evaluate Homework</h5>
            <button
              className="btn-close"
              onClick={() => setSelected(null)}
            />
          </div>

          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Student:</strong>{" "}
                {getStudentName(selected.studentId)}
              </div>
              <div className="col-md-6">
                <strong>Homework:</strong>{" "}
                {selected.homeworkId?.title || "-"}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Student Answer</label>
              <div className="border rounded p-3">
                {selected.answer || "No text answer provided"}
              </div>
            </div>

            {selected.attachment && (
              <div className="mb-3">
                <label className="form-label">Student Attachment</label>
                <div>
                  <a
                    href={selected.attachment}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Attachment
                  </a>
                </div>
              </div>
            )}

            <form onSubmit={handleEvaluate}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Marks Obtained (Max: {selected.homeworkId?.totalMarks || 0})
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max={selected.homeworkId?.totalMarks || 0}
                    value={form.marksObtained}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        marksObtained: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Evaluation Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="Checked">Checked</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Teacher Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.remarks}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    placeholder="Enter teacher remarks..."
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success me-2">
                Save Evaluation
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkEvaluation;
