
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/leave";
const TYPE_API = "https://school-management-backend-ochre.vercel.app/api/leavetype";
const BALANCE_API = "https://school-management-backend-ochre.vercel.app/api/leavebalance";

const initialForm = {
  leaveType: "",
  fromDate: "",
  toDate: "",
  reason: "",
};

const LeaveApply = () => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(initialForm);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Calculate inclusive calendar days
  const totalDays = useMemo(() => {
    if (!form.fromDate || !form.toDate) return 0;

    const start = new Date(`${form.fromDate}T00:00:00`);
    const end = new Date(`${form.toDate}T00:00:00`);

    if (end < start) return 0;

    return Math.floor((end - start) / 86400000) + 1;
  }, [form.fromDate, form.toDate]);

  const selectedBalance = balances.find((item) => {
    const typeId =
      typeof item.leaveType === "object"
        ? item.leaveType?._id
        : item.leaveType;

    return typeId === form.leaveType;
  });

  const remainingDays = selectedBalance?.remainingDays ?? 0;

  const fetchData = async () => {
    try {
      const [typesRes, balanceRes, leavesRes] = await Promise.all([
        axios.get(`${TYPE_API}/active`, { headers }),
        axios.get(`${BALANCE_API}/my-balance`, { headers }),
        axios.get(`${API}/my-leaves`, { headers }),
      ]);

      setLeaveTypes(
        Array.isArray(typesRes.data)
          ? typesRes.data
          : typesRes.data.data || []
      );

      setBalances(
        Array.isArray(balanceRes.data)
          ? balanceRes.data
          : balanceRes.data.data || []
      );

      setMyLeaves(
        Array.isArray(leavesRes.data)
          ? leavesRes.data
          : leavesRes.data.leaves || leavesRes.data.data || []
      );
    } catch (error) {
      console.error("Leave data error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to load leave information"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.leaveType || !form.fromDate || !form.toDate || !form.reason.trim()) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(form.toDate) < new Date(form.fromDate)) {
      alert("To Date cannot be before From Date");
      return;
    }

    if (!selectedBalance) {
      alert("Leave balance is not assigned for this leave type");
      return;
    }

    if (totalDays > remainingDays) {
      alert(`Insufficient leave balance. Available: ${remainingDays} days`);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/apply`,
        {
          leaveType: form.leaveType,
          fromDate: form.fromDate,
          toDate: form.toDate,
          totalDays,
          reason: form.reason.trim(),
        },
        { headers }
      );

      alert(response.data.message || "Leave application submitted successfully");

      setForm(initialForm);
      await fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to submit leave application"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelLeave = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this leave?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${API}/cancel/${id}`,
        {},
        { headers }
      );

      alert(response.data.message || "Leave cancelled successfully");
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to cancel leave"
      );
    }
  };

  const getLeaveTypeName = (type) => {
    if (!type) return "-";
    if (typeof type === "string") return type;

    return type.leaveTypeName || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="container-fluid mt-3">

      <h3 className="mb-4">Apply Leave</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <strong>Leave Application Form</strong>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Leave Type *
                </label>

                <select
                  className="form-select"
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Leave Type</option>

                  {leaveTypes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.leaveTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Available Balance
                </label>

                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={
                    form.leaveType
                      ? `${remainingDays} Days`
                      : "Select Leave Type"
                  }
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  From Date *
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="fromDate"
                  value={form.fromDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  To Date *
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="toDate"
                  value={form.toDate}
                  min={form.fromDate || new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Total Days
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={totalDays}
                  readOnly
                />
                <small className="text-muted">
                  Includes weekends and holidays.
                </small>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Reason for Leave *
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Enter reason for leave"
                  required
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Apply Leave"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => setForm(initialForm)}
                >
                  Reset
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* My Leave Applications */}

      <div className="card shadow-sm">
        <div className="card-header">
          <strong>My Leave Applications</strong>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Total Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {myLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No leave applications found
                    </td>
                  </tr>
                ) : (
                  myLeaves.map((leave, index) => (
                    <tr key={leave._id}>
                      <td>{index + 1}</td>
                      <td>{getLeaveTypeName(leave.leaveType)}</td>
                      <td>{formatDate(leave.fromDate)}</td>
                      <td>{formatDate(leave.toDate)}</td>
                      <td>{leave.totalDays}</td>
                      <td>{leave.reason}</td>

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

                      <td>
                        {leave.status === "Pending" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => cancelLeave(leave._id)}
                          >
                            Cancel
                          </button>
                        )}
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

export default LeaveApply;
