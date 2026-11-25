
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/leave";

const LeaveManagement = () => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdmin = user.role === "admin";

  const initialForm = {
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  };

  const [form, setForm] = useState(initialForm);
  const [leaveList, setLeaveList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");
  const [adminRemark, setAdminRemark] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Get Leave List
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const url = isAdmin
        ? `${API}/all`
        : `${API}/my-leaves`;

      const response = await axios.get(url, {
        headers,
        params: isAdmin
          ? { status, page, limit: 10 }
          : {},
      });

      if (isAdmin) {
        setLeaveList(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setLeaveList(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [status, page]);

  // Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Leave
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.fromDate > form.toDate) {
        alert("To date must be after From date");
        return;
      }

      const response = await axios.post(
        `${API}/apply`,
        form,
        { headers }
      );

      alert(response.data.message);

      setForm(initialForm);
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // Cancel Leave
  const cancelLeave = async (id) => {
    if (!window.confirm("Are you sure you want to cancel leave?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${API}/cancel/${id}`,
        {},
        { headers }
      );

      alert(response.data.message);
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  // Approve Leave
  const approveLeave = async (id) => {
    try {
      const response = await axios.put(
        `${API}/approve/${id}`,
        { adminRemark },
        { headers }
      );

      alert(response.data.message);
      setAdminRemark("");
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  // Reject Leave
  const rejectLeave = async (id) => {
    try {
      if (!adminRemark.trim()) {
        alert("Please enter rejection remark");
        return;
      }

      const response = await axios.put(
        `${API}/reject/${id}`,
        { adminRemark },
        { headers }
      );

      alert(response.data.message);
      setAdminRemark("");
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || "Rejection failed");
    }
  };

  // Delete Leave
  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API}/delete/${id}`,
        { headers }
      );

      alert(response.data.message);
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const getStatusClass = (value) => {
    switch (value) {
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    <div className="container-fluid mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Leave Management</h3>
        <span className="badge bg-primary">
          {isAdmin ? "Admin Panel" : "Employee Panel"}
        </span>
      </div>

      {/* Apply Leave Form */}
      {!isAdmin && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Apply for Leave</h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">

                <div className="col-md-4 mb-3">
                  <label>Leave Type</label>
                  <select
                    className="form-control"
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleChange}
                    required
                  >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Earned Leave</option>
                    <option>Unpaid Leave</option>
                    <option>Emergency Leave</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fromDate"
                    value={form.fromDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="toDate"
                    min={form.fromDate || undefined}
                    value={form.toDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Reason</label>
                  <textarea
                    className="form-control"
                    name="reason"
                    rows="3"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Enter leave reason"
                    required
                  />
                </div>

                <div className="col-md-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Apply Leave
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave List */}
      <div className="card">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Leave List</h5>

          {isAdmin && (
            <select
              className="form-select w-auto"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          )}
        </div>

        <div className="card-body table-responsive">

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                {isAdmin && <th>Employee</th>}
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Remark</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : leaveList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    No Leave Records Found
                  </td>
                </tr>
              ) : (
                leaveList.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    {isAdmin && (
                      <td>
                        {item.userId?.firstName || ""}
                        {" "}
                        {item.userId?.lastName || ""}
                        {!item.userId?.firstName &&
                          !item.userId?.lastName &&
                          (item.userId?.email || "-")}
                      </td>
                    )}

                    <td>{item.leaveType}</td>

                    <td>
                      {new Date(item.fromDate).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(item.toDate).toLocaleDateString()}
                    </td>

                    <td>{item.totalDays}</td>

                    <td>{item.reason}</td>

                    <td>
                      <span className={`badge bg-${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    <td>{item.adminRemark || "-"}</td>

                    <td>
                      {isAdmin && item.status === "Pending" && (
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => setSelectedLeave(item)}
                        >
                          Review
                        </button>
                      )}

                      {!isAdmin && item.status === "Pending" && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => cancelLeave(item._id)}
                        >
                          Cancel
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          className="btn btn-sm btn-danger ms-1"
                          onClick={() => deleteLeave(item._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {isAdmin && (
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-outline-primary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span className="align-self-center">
                {page} / {totalPages}
              </span>

              <button
                className="btn btn-outline-primary"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Review Modal */}
      {selectedLeave && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Review Leave Application
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setSelectedLeave(null)}
                />
              </div>

              <div className="modal-body">
                <p>
                  <strong>Employee:</strong>{" "}
                  {selectedLeave.userId?.firstName || ""}
                  {" "}
                  {selectedLeave.userId?.lastName || ""}
                </p>

                <p>
                  <strong>Leave Type:</strong>{" "}
                  {selectedLeave.leaveType}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {selectedLeave.reason}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {selectedLeave.totalDays} Days
                </p>

                <label>Admin Remark</label>

                <textarea
                  className="form-control"
                  rows="3"
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Enter admin remark"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedLeave(null)}
                >
                  Close
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => rejectLeave(selectedLeave._id)}
                >
                  Reject
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => approveLeave(selectedLeave._id)}
                >
                  Approve
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveManagement;
