
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/leavetype";

const initialForm = {
  leaveTypeName: "",
  description: "",
  totalDays: 0,
  status: true,
};

const LeaveType = () => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(initialForm);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Get All Leave Types
  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/all`, {
        headers,
      });

      setLeaveTypes(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to fetch leave types"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add / Update Leave Type
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        totalDays: Number(form.totalDays),
      };

      let response;

      if (editId) {
        response = await axios.put(
          `${API}/update/${editId}`,
          payload,
          { headers }
        );
      } else {
        response = await axios.post(
          `${API}/add`,
          payload,
          { headers }
        );
      }

      alert(response.data.message);

      setForm(initialForm);
      setEditId(null);
      fetchLeaveTypes();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  // Edit Leave Type
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      leaveTypeName: item.leaveTypeName || "",
      description: item.description || "",
      totalDays: item.totalDays ?? 0,
      status: item.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete Leave Type
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave type?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API}/delete/${id}`,
        { headers }
      );

      alert(response.data.message);
      fetchLeaveTypes();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  // Reset Form
  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  return (
    <div className="container-fluid mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Leave Type Management</h3>
        <span className="badge bg-primary">
          Total: {leaveTypes.length}
        </span>
      </div>

      {/* Leave Type Form */}
      <div className="card mb-4">

        <div className="card-header">
          <h5 className="mb-0">
            {editId ? "Update Leave Type" : "Add Leave Type"}
          </h5>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Leave Type Name *
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="leaveTypeName"
                  value={form.leaveTypeName}
                  onChange={handleChange}
                  placeholder="Enter leave type"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Total Days *
                </label>

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
                <label className="form-label">
                  Status
                </label>

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

              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>

              <div className="col-md-12">

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                >
                  {editId ? "Update Leave Type" : "Add Leave Type"}
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

      {/* Leave Type List */}
      <div className="card">

        <div className="card-header">
          <h5 className="mb-0">Leave Type List</h5>
        </div>

        <div className="card-body table-responsive">

          <table className="table table-bordered table-striped">

            <thead>
              <tr>
                <th>#</th>
                <th>Leave Type</th>
                <th>Total Days</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : leaveTypes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Leave Types Found
                  </td>
                </tr>
              ) : (
                leaveTypes.map((item, index) => (

                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td>{item.leaveTypeName}</td>

                    <td>{item.totalDays}</td>

                    <td>{item.description || "-"}</td>

                    <td>
                      {item.status ? (
                        <span className="badge bg-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Inactive
                        </span>
                      )}
                    </td>

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

export default LeaveType;
