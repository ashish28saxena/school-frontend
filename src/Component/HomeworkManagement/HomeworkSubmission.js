
import React, { useEffect, useState } from "react";

const HOMEWORK_API = "https://school-management-backend-ochre.vercel.app/api/homework";
const SUBMISSION_API = "https://school-management-backend-ochre.vercel.app/api/homework-submission";

const HomeworkSubmission = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [submissionList, setSubmissionList] = useState([]);
  const [form, setForm] = useState({
    homeworkId: "",
    studentId: "",
    answer: "",
    attachment: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadHomework = async () => {
    try {
      const response = await fetch(HOMEWORK_API, {
        headers: authHeaders,
      });
      const result = await response.json();

      if (response.ok) {
        setHomeworkList(result.data || []);
      } else {
        alert(result.message || "Homework loading failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await fetch(SUBMISSION_API, {
        headers: authHeaders,
      });
      const result = await response.json();

      if (response.ok) {
        setSubmissionList(result.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHomework();
    loadSubmissions();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.homeworkId || !form.studentId) {
      alert("Please select homework and enter student ID");
      return;
    }

    if (!form.answer.trim() && !form.attachment.trim()) {
      alert("Please enter an answer or attachment URL");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${SUBMISSION_API}/add`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      alert("Homework submitted successfully!");

      setForm({
        homeworkId: "",
        studentId: form.studentId,
        answer: "",
        attachment: "",
      });

      loadSubmissions();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Homework Submission</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Submit Your Homework</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Select Homework *</label>
                <select
                  name="homeworkId"
                  className="form-select"
                  value={form.homeworkId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Homework</option>
                  {homeworkList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  className="form-control"
                  placeholder="Enter Student MongoDB ID"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Your Answer</label>
                <textarea
                  name="answer"
                  className="form-control"
                  rows="5"
                  placeholder="Write your homework answer here..."
                  value={form.answer}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Attachment URL</label>
                <input
                  type="text"
                  name="attachment"
                  className="form-control"
                  placeholder="Enter uploaded file URL (optional)"
                  value={form.attachment}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Homework"}
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Submission History</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Homework</th>
                  <th>Student</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Marks</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {submissionList.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.homeworkId?.title || "-"}</td>
                    <td>
                      {item.studentId?.studentName ||
                        item.studentId?.name ||
                        "-"}
                    </td>
                    <td>
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === "Checked"
                            ? "bg-success"
                            : item.status === "Late"
                            ? "bg-warning text-dark"
                            : "bg-primary"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.marksObtained ?? 0}</td>
                    <td>{item.remarks || "-"}</td>
                  </tr>
                ))}

                {submissionList.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No submissions found
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

export default HomeworkSubmission;
