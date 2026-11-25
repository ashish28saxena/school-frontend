
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/leavereport";
const TYPE_API = "https://school-management-backend-ochre.vercel.app/api/leavetype";

const LeaveReports = () => {
  const token = localStorage.getItem("token");

  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
    leaveType: "",
    search: "",
  });

  const [summary, setSummary] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    cancelled: 0,
    totalApprovedDays: 0,
    totalPendingDays: 0,
    totalRejectedDays: 0,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get(`${TYPE_API}/active`, {
        headers,
      });

      const data = response.data;

      setLeaveTypes(
        Array.isArray(data) ? data : data.data || []
      );
    } catch (error) {
      console.error("Leave types error:", error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await axios.get(`${API}/all`, {
        headers,
        params,
      });

      setLeaves(response.data.data || []);
      setSummary(
        response.data.summary || {
          totalApplications: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          cancelled: 0,
          totalApprovedDays: 0,
          totalPendingDays: 0,
          totalRejectedDays: 0,
        }
      );
    } catch (error) {
      console.error("Leave report error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to fetch leave reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchReports();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      status: "All",
      leaveType: "",
      search: "",
    });
  };

  const handleReset = () => {
    const defaultFilters = {
      fromDate: "",
      toDate: "",
      status: "All",
      leaveType: "",
      search: "",
    };

    setFilters(defaultFilters);
    loadDefaultReports(defaultFilters);
  };

  const loadDefaultReports = async (defaultFilters) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/all`, {
        headers,
        params: defaultFilters,
      });

      setLeaves(response.data.data || []);
      setSummary(response.data.summary || {});
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to fetch reports"
      );
    } finally {
      setLoading(false);
    }
  };

  const employeeName = (user) => {
    if (!user) return "-";

    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "-"
    );
  };

  const leaveTypeName = (type) => {
    if (!type) return "-";

    if (typeof type === "string") return type;

    return type.leaveTypeName || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  const exportCSV = () => {
    if (!leaves.length) {
      alert("No report data available to export");
      return;
    }

    const rows = [
      [
        "Employee",
        "Email",
        "Leave Type",
        "From Date",
        "To Date",
        "Total Days",
        "Reason",
        "Status",
      ],
      ...leaves.map((leave) => [
        employeeName(leave.userId),
        leave.userId?.email || "",
        leaveTypeName(leave.leaveType),
        formatDate(leave.fromDate),
        formatDate(leave.toDate),
        leave.totalDays || 0,
        leave.reason || "",
        leave.status || "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "leave-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid mt-3">

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3>Leave Reports</h3>
          <p className="text-muted mb-0">
            Employee leave reports and analytics
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={exportCSV}
          >
            Export CSV
          </button>

          <button
            className="btn btn-dark"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="row g-3 mb-4">

        <div className="col-md-4 col-lg-2">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h6>Total Applications</h6>
              <h3>{summary.totalApplications || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-2">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h6>Approved</h6>
              <h3 className="text-success">
                {summary.approved || 0}
              </h3>
              <small>{summary.totalApprovedDays || 0} days</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-2">
          <div className="card shadow-sm border-warning">
            <div className="card-body">
              <h6>Pending</h6>
              <h3 className="text-warning">
                {summary.pending || 0}
              </h3>
              <small>{summary.totalPendingDays || 0} days</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-2">
          <div className="card shadow-sm border-danger">
            <div className="card-body">
              <h6>Rejected</h6>
              <h3 className="text-danger">
                {summary.rejected || 0}
              </h3>
              <small>{summary.totalRejectedDays || 0} days</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-2">
          <div className="card shadow-sm border-secondary">
            <div className="card-body">
              <h6>Cancelled</h6>
              <h3>{summary.cancelled || 0}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <strong>Filter Leave Reports</strong>
        </div>

        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-3">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                name="toDate"
                value={filters.toDate}
                min={filters.fromDate || undefined}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Leave Type</label>
              <select
                className="form-select"
                name="leaveType"
                value={filters.leaveType}
                onChange={handleFilterChange}
              >
                <option value="">All Leave Types</option>

                {leaveTypes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.leaveTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Search Employee
              </label>

              <input
                type="text"
                className="form-control"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Employee name or email"
              />
            </div>

            <div className="col-md-6 d-flex align-items-end gap-2">
              <button
                className="btn btn-primary"
                onClick={fetchReports}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Report Table */}

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between">
          <strong>Leave Report Details</strong>
          <span>Total: {leaves.length}</span>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Total Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Loading reports...
                    </td>
                  </tr>
                ) : leaves.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No leave reports found
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave, index) => (
                    <tr key={leave._id}>
                      <td>{index + 1}</td>
                      <td>{employeeName(leave.userId)}</td>
                      <td>{leave.userId?.email || "-"}</td>
                      <td>{leaveTypeName(leave.leaveType)}</td>
                      <td>{formatDate(leave.fromDate)}</td>
                      <td>{formatDate(leave.toDate)}</td>
                      <td>{leave.totalDays || 0}</td>
                      <td>{leave.reason || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            leave.status === "Approved"
                              ? "bg-success"
                              : leave.status === "Rejected"
                              ? "bg-danger"
                              : leave.status === "Cancelled"
                              ? "bg-secondary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LeaveReports;
