
import React, { useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function FeeDueReport() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
    paymentStatus: "",
  });

  React.useEffect(() => {
    Promise.all([
      fetch(`${API}/class/`).then((r) => r.json()),
      fetch(`${API}/section/`).then((r) => r.json()),
    ]).then(([c, s]) => {
      setClasses(c || []);
      setSections(s.data || []);
    }).catch(() => alert("Unable to load filters"));
  }, []);

  const filteredSections = sections.filter(
    (x) => String(x.classId?._id || x.classId) === filters.classId
  );

  const searchReport = async () => {
    if (!filters.academicYear) {
      alert("Select academic year");
      return;
    }

    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`${API}/feedue/?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setData(result.data || []);
      setSummary(result.summary || {});
    } catch (error) {
      alert(error.message);
    }
  };

  const name = (s) =>
    s?.studentName ||
    [s?.firstName, s?.lastName].filter(Boolean).join(" ") ||
    s?.name ||
    "Student";

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Fee Due Report</h3>
        <button className="btn btn-outline-primary no-print" onClick={() => window.print()}>
          Print Report
        </button>
      </div>

      <div className="card shadow-sm mb-4 no-print">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Class</label>
              <select
                className="form-select"
                value={filters.classId}
                onChange={(e) => setFilters((p) => ({
                  ...p, classId: e.target.value, sectionId: "",
                }))}
              >
                <option value="">All Classes</option>
                {classes.map((x) => (
                  <option key={x._id} value={x._id}>{x.className}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={filters.sectionId}
                onChange={(e) => setFilters((p) => ({
                  ...p, sectionId: e.target.value,
                }))}
              >
                <option value="">All Sections</option>
                {sections.map((x) => (
                  <option key={x._id} value={x._id}>{x.sectionName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Academic Year</label>
              <input
                className="form-control"
                value={filters.academicYear}
                onChange={(e) => setFilters((p) => ({
                  ...p, academicYear: e.target.value,
                }))}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={filters.paymentStatus}
                onChange={(e) => setFilters((p) => ({
                  ...p, paymentStatus: e.target.value,
                }))}
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" onClick={searchReport}>
                Search Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm"><div className="card-body">
            <small>Total Students</small>
            <h4>{summary.totalStudents || 0}</h4>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm"><div className="card-body">
            <small>Total Fee</small>
            <h4>{money(summary.totalFee)}</h4>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm"><div className="card-body">
            <small>Total Paid</small>
            <h4 className="text-success">{money(summary.totalPaid)}</h4>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm"><div className="card-body">
            <small>Total Due</small>
            <h4 className="text-danger">{money(summary.totalDue)}</h4>
          </div></div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Student Fee Details</h5>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Section</th>
                <th>Total Fee</th>
                <th>Discount</th>
                <th>Net Fee</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? data.map((item, i) => (
                <tr key={item.assignmentId}>
                  <td>{i + 1}</td>
                  <td>{name(item.student)}</td>
                  <td>{item.rollNumber || "—"}</td>
                  <td>{item.class?.className || "—"}</td>
                  <td>{item.section?.sectionName || "—"}</td>
                  <td>{money(item.totalFee)}</td>
                  <td>{money(item.discountAmount)}</td>
                  <td>{money(item.netFee)}</td>
                  <td>{money(item.paidAmount)}</td>
                  <td className="text-danger fw-bold">{money(item.balance)}</td>
                  <td>
                    <span className={`badge ${
                      item.paymentStatus === "Paid"
                        ? "bg-success"
                        : item.paymentStatus === "Partial"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}>
                      {item.paymentStatus}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="11" className="text-center">No Report Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeeDueReport;
