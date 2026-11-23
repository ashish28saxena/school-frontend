
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const initialForm = {
  driverName: "",
  mobileNumber: "",
  email: "",
  address: "",
  licenseNumber: "",
  licenseType: "Transport",
  licenseExpiryDate: "",
  joiningDate: "",
};

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  // Fetch Drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch drivers");
      }

      setDrivers(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset Form
  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  // Add / Update Driver
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = editId
        ? `${API}/driver/update/${editId}`
        : `${API}/driver/submit`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setSuccess(result.message || "Driver saved successfully");
      resetForm();
      await fetchDrivers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit Driver
  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API}/driver/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch driver");
      }

      const driver = result.data;

      setForm({
        driverName: driver.driverName || "",
        mobileNumber: driver.mobileNumber || "",
        email: driver.email || "",
        address: driver.address || "",
        licenseNumber: driver.licenseNumber || "",
        licenseType: driver.licenseType || "Transport",
        licenseExpiryDate: driver.licenseExpiryDate
          ? new Date(driver.licenseExpiryDate).toISOString().slice(0, 10)
          : "",
        joiningDate: driver.joiningDate
          ? new Date(driver.joiningDate).toISOString().slice(0, 10)
          : "",
      });

      setEditId(id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Soft Delete Driver
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API}/driver/delete/${id}`, {
        method: "DELETE",
         headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete driver");
      }

      setSuccess(result.message || "Driver deleted successfully");
      await fetchDrivers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Search Filter
  const filteredDrivers = drivers.filter((driver) => {
    const searchText = search.toLowerCase();

    return (
      driver.driverName?.toLowerCase().includes(searchText) ||
      driver.mobileNumber?.toLowerCase().includes(searchText) ||
      driver.licenseNumber?.toLowerCase().includes(searchText)
    );
  });

  // Format Date
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  // License Expiry Status
  const getExpiryStatus = (date) => {
    if (!date) return "Not Available";

    const expiry = new Date(date);
    const today = new Date();

    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (expiry < today) return "Expired";

    const days = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (days <= 30) return "Expiring Soon";

    return "Valid";
  };

  const expiryBadge = (date) => {
    const status = getExpiryStatus(date);

    const badgeClass =
      status === "Expired"
        ? "bg-danger"
        : status === "Expiring Soon"
        ? "bg-warning text-dark"
        : status === "Valid"
        ? "bg-success"
        : "bg-secondary";

    return (
      <span className={`badge ${badgeClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container-fluid py-3">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Driver Management</h3>
          <p className="text-muted mb-0">
            Manage school transport drivers and license details
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchDrivers}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {/* Driver Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            {editId ? "Update Driver" : "Add New Driver"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-4">
                <label className="form-label">Driver Name *</label>
                <input
                  type="text"
                  name="driverName"
                  className="form-control"
                  placeholder="Enter driver name"
                  value={form.driverName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  className="form-control"
                  placeholder="Enter mobile number"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  placeholder="Enter address"
                  value={form.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-3">
                <label className="form-label">License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="form-control"
                  placeholder="Enter license number"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">License Type *</label>
                <select
                  name="licenseType"
                  className="form-select"
                  value={form.licenseType}
                  onChange={handleChange}
                  required
                >
                  <option value="LMV">LMV</option>
                  <option value="HMV">HMV</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  name="licenseExpiryDate"
                  className="form-control"
                  value={form.licenseExpiryDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  className="form-control"
                  value={form.joiningDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={saving}
                >
                  {saving
                    ? "Please wait..."
                    : editId
                    ? "Update Driver"
                    : "Add Driver"}
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

      {/* Driver List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center g-2">
            <div className="col-md-6">
              <h5 className="mb-0">
                Driver List ({filteredDrivers.length})
              </h5>
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search name, mobile or license..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Driver Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>License Number</th>
                    <th>License Type</th>
                    <th>License Expiry</th>
                    <th>Joining Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver, index) => (
                      <tr key={driver._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">
                          {driver.driverName}
                        </td>
                        <td>{driver.mobileNumber}</td>
                        <td>{driver.email || "-"}</td>
                        <td>{driver.licenseNumber}</td>
                        <td>{driver.licenseType}</td>
                        <td>
                          <div>{formatDate(driver.licenseExpiryDate)}</div>
                          {expiryBadge(driver.licenseExpiryDate)}
                        </td>
                        <td>{formatDate(driver.joiningDate)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2 mb-1"
                            onClick={() => handleEdit(driver._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger mb-1"
                            onClick={() => handleDelete(driver._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
