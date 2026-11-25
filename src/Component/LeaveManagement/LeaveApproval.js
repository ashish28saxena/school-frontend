
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/leave-approval";

const LeaveApproval = () => {
  const token = localStorage.getItem("token");

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState({});
  const [history, setHistory] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/pending`, {
        headers,
      });

      setLeaves(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to fetch pending leaves"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, action) => {
    const remark = remarks[id] || "";

    if (action === "reject" && !remark.trim()) {
      alert("Please enter rejection remark");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this leave?`
    );

    if (!confirmed) return;

    try {
      const response = await axios.put(
        `${API}/${action}/${id}`,
        { remark },
        { headers }
      );

      alert(response.data.message);

      setRemarks((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchLeaves();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Action failed"
      );
    }
  };

  const viewHistory = async (id) => {
    try {
      const response = await axios.get(
        `${API}/history/${id}`,
        { headers }
      );

      setHistory(response.data.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to fetch approval history"
      );
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

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Leave Approval</h3>

        <button
          className="btn btn-primary"
          onClick={fetchLeaves}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : leaves.length === 0 ? (
        <div className="alert alert-info">
          No pending leave applications found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Approval Stage</th>
                <th>Remark</th>
                <th>Action</th>
                <th>History</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => {
                const currentStep =
                  leave.approvalFlow?.[
                    leave.currentApprovalLevel
                  ];

                return (
                  <tr key={leave._id}>
                    <td>{employeeName(leave.userId)}</td>

                    <td>
                      {leaveTypeName(leave.leaveType)}
                    </td>

                    <td>
                      {new Date(leave.fromDate).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      {new Date(leave.toDate).toLocaleDateString("en-IN")}
                    </td>

                    <td>{leave.totalDays}</td>

                    <td>{leave.reason}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
                        {currentStep?.role || "Pending"}
                      </span>
                    </td>

                    <td style={{ minWidth: "160px" }}>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Enter remark"
                        value={remarks[leave._id] || ""}
                        onChange={(e) =>
                          setRemarks((prev) => ({
                            ...prev,
                            [leave._id]: e.target.value,
                          }))
                        }
                      />
                    </td>

                    <td style={{ minWidth: "150px" }}>
                      <button
                        className="btn btn-success btn-sm me-2 mb-1"
                        onClick={() =>
                          handleAction(leave._id, "approve")
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-danger btn-sm mb-1"
                        onClick={() =>
                          handleAction(leave._id, "reject")
                        }
                      >
                        Reject
                      </button>
                    </td>

                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => viewHistory(leave._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {history && (
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between">
            <strong>Approval History</strong>

            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setHistory(null)}
            >
              Close
            </button>
          </div>

          <div className="card-body">
            <h6>Current Status: {history.status}</h6>

            <h6 className="mt-3">Approval Flow</h6>

            {history.approvalFlow?.map((step, index) => (
              <div
                className="border rounded p-2 mb-2"
                key={index}
              >
                <strong>{step.role.toUpperCase()}</strong>
                <span className="ms-2">{step.status}</span>

                {step.remark && (
                  <p className="mb-0">
                    Remark: {step.remark}
                  </p>
                )}
              </div>
            ))}

            <h6 className="mt-3">Action History</h6>

            {history.approvalHistory?.map((item, index) => (
              <div key={index} className="border-bottom py-2">
                <strong>{item.role}</strong> - {item.action}
                <p className="mb-0">{item.remark}</p>
                <small className="text-muted">
                  {item.actionDate
                    ? new Date(item.actionDate).toLocaleString("en-IN")
                    : ""}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
