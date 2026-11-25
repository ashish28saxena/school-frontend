
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/leavebalance";
const TYPE_API = "https://school-management-backend-ochre.vercel.app/api/leavetype";
 const currentYear = new Date().getFullYear();

const academicYears = Array.from(
  { length: currentYear - 2020 + 1 },
  (_, index) => {
    const year = 2020 + index;
    return `${year}-${String(year + 1).slice(-2)}`;
  }
);

const currentSession = `${currentYear}-${String(currentYear + 1).slice(-2)}`;
const initialForm = {
  userId: "",
  leaveType: "",
  academicYear: currentSession,
  totalDays: 12,
  status: true,
};


const LeaveBalance = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [form, setForm] = useState(initialForm);
  const [balances, setBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [academicYear, setAcademicYear] = useState(currentSession);
  const [loading, setLoading] = useState(false);
  

  const headers = {
    Authorization: `Bearer ${token}`,
  };

 

  // Fetch Leave Types
  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get(`${TYPE_API}/active`, {
        headers,
      });

      setLeaveTypes(res.data.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Leave types fetch failed");
    }
  };

  // Fetch Leave Balances
  const fetchBalances = async () => {
    try {
      setLoading(true);

      const url = isAdmin
        ? `${API}/all`
        : `${API}/my-balance`;

      const res = await axios.get(url, {
        headers,
        params: { academicYear },
      });

      setBalances(res.data.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Balance fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();

    if (isAdmin) {
      fetchLeaveTypes();
    }
  }, [academicYear]);

  // Handle Input
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Assign / Update Balance
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        totalDays: Number(form.totalDays),
      };

      let res;

      if (editId) {
        res = await axios.put(
          `${API}/update/${editId}`,
          {
            totalDays: payload.totalDays,
            status: payload.status,
          },
          { headers }
        );
      } else {
        res = await axios.post(
          `${API}/assign`,
          payload,
          { headers }
        );
      }

      alert(res.data.message);

      setForm(initialForm);
      setEditId(null);
      fetchBalances();

    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  // Edit Balance
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      userId: item.userId?._id || "",
      leaveType: item.leaveType?._id || "",
      academicYear: item.academicYear,
      totalDays: item.totalDays,
      status: item.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete Balance
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this balance?")) {
      return;
    }

    try {
      const res = await axios.delete(`${API}/delete/${id}`, {
        headers,
      });

      alert(res.data.message);
      fetchBalances();

    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  return (
    <div className="container-fluid mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Leave Balance Management</h3>

        <select
  className="form-select w-auto"
  value={academicYear}
  onChange={(e) => setAcademicYear(e.target.value)}
>
  {academicYears.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>
      </div>

      {/* Admin Assign Form */}
      {isAdmin && (
        <div className="card mb-4">

          <div className="card-header">
            <h5 className="mb-0">
              {editId ? "Update Leave Balance" : "Assign Leave Balance"}
            </h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">

                {!editId && (
                  <>
                    <div className="col-md-4 mb-3">
                      <label>Employee / Teacher ID *</label>
                      <input
                        type="text"
                        name="userId"
                        className="form-control"
                        value={form.userId}
                        onChange={handleChange}
                        placeholder="Enter User MongoDB ID"
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Leave Type *</label>
                      <select
                        name="leaveType"
                        className="form-control"
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

                    <div className="col-md-4 mb-3">
                      <label>Academic Year</label>
                      <input
                        type="text"
                        className="form-control"
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-md-4 mb-3">
                  <label>Total Leave Days *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalDays"
                    value={form.totalDays}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Status</label>
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="status"
                      checked={form.status}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Active
                    </label>
                  </div>
                </div>

                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary me-2">
                    {editId ? "Update Balance" : "Assign Balance"}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Balance List */}
      <div className="card">

        <div className="card-header">
          <h5 className="mb-0">Leave Balance List</h5>
        </div>

        <div className="card-body table-responsive">

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                {isAdmin && <th>Employee</th>}
                <th>Leave Type</th>
                <th>Academic Year</th>
                <th>Total Days</th>
                <th>Used Days</th>
                <th>Remaining Days</th>
                <th>Status</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 7} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : balances.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 7} className="text-center">
                    No Leave Balance Found
                  </td>
                </tr>
              ) : (
                balances.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    {isAdmin && (
                      <td>
                        {item.userId?.firstName || ""}
                        {" "}
                        {item.userId?.lastName || ""}
                        {!item.userId?.firstName &&
                          !item.userId?.lastName &&
                          (item.userId?.email || item.userId?._id || "-")}
                      </td>
                    )}

                    <td>
                      {item.leaveType?.leaveTypeName || "-"}
                    </td>

                    <td>{item.academicYear}</td>

                    <td>{item.totalDays}</td>

                    <td>
                      <span className="text-danger fw-bold">
                        {item.usedDays}
                      </span>
                    </td>

                    <td>
                      <span className="text-success fw-bold">
                        {item.remainingDays}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${item.status ? "bg-success" : "bg-danger"}`}>
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {isAdmin && (
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
};

export default LeaveBalance;
