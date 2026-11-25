import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const HomeworkReports = () => {
  const token = localStorage.getItem("token");

  const [homeworkList, setHomeworkList] = useState([]);
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    totalSubmissions: 0,
    submitted: 0,
    late: 0,
    checked: 0,
    rejected: 0,
  });

  const [filters, setFilters] = useState({
    homeworkId: "",
    status: "",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchHomework = async () => {
    try {
      const response = await fetch(`${API}/homework`, {
        headers,
      });

      const result = await response.json();

      if (result.success) {
        setHomeworkList(result.data || []);
      }
    } catch (error) {
      console.error("Homework fetch error:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.homeworkId) {
        params.append("homeworkId", filters.homeworkId);
      }

      if (filters.status) {
        params.append("status", filters.status);
      }

      const query = params.toString();

      const [summaryResponse, detailsResponse] = await Promise.all([
        fetch(
          `${API}/homework-submission/reports/summary?${query}`,
          { headers }
        ),
        fetch(
          `${API}/homework-submission/reports/details?${query}`,
          { headers }
        ),
      ]);

      const summaryResult = await summaryResponse.json();
      const detailsResult = await detailsResponse.json();

      if (summaryResult.success) {
        setSummary(summaryResult.data);
      }

      if (detailsResult.success) {
        setReports(detailsResult.data || []);
      }
    } catch (error) {
      console.error("Homework report error:", error);
    }
  };

  const cards = [
    ["Total Submissions", summary.totalSubmissions],
    ["Submitted", summary.submitted],
    ["Late", summary.late],
    ["Checked", summary.checked],
    ["Rejected", summary.rejected],
  ];

  return (
    <div className="container mt-4">
      <h2>Homework Reports</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Homework</label>
          <select
            className="form-control"
            value={filters.homeworkId}
            onChange={(e) =>
              setFilters({
                ...filters,
                homeworkId: e.target.value,
              })
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

        <div className="col-md-6">
          <label>Status</label>
          <select
            className="form-control"
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
          >
            <option value="">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Late">Late</option>
            <option value="Checked">Checked</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="row mb-4">
        {cards.map(([title, value]) => (
          <div className="col-md-4 mb-3" key={title}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>{title}</h6>
                <h3>{value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Homework</th>
              <th>Student</th>
              <th>Class</th>
              <th>Section</th>
              <th>Subject</th>
              <th>Submitted Date</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {reports.length > 0 ? (
              reports.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.homeworkId?.title || "-"}</td>
                  <td>
                    {item.studentId?.studentName ||
                      item.studentId?.name ||
                      "-"}
                  </td>
                  <td>
                    {item.homeworkId?.classId?.className || "-"}
                  </td>
                  <td>
                    {item.homeworkId?.sectionId?.sectionName || "-"}
                  </td>
                  <td>
                    {item.homeworkId?.subjectId?.subjectName || "-"}
                  </td>
                  <td>
                    {item.submittedAt
                      ? new Date(item.submittedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{item.marksObtained || 0}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No homework reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeworkReports;