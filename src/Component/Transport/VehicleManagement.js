
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const initialForm = {
  vehicleNumber: "",
  vehicleType: "Bus",
  vehicleModel: "",
  capacity: "",
  registrationDate: "",
  insuranceExpiryDate: "",
  fitnessExpiryDate: "",
  description: "",
};

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/vehicles`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch vehicles");
      }

      setVehicles(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = editId
        ? `${API}/vehicle/update/${editId}`
        : `${API}/vehicle/submit`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setSuccess(result.message || "Vehicle saved successfully");
      resetForm();
      await fetchVehicles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API}/vehicle/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch vehicle");
      }

      const vehicle = result.data;

      setForm({
        vehicleNumber: vehicle.vehicleNumber || "",
        vehicleType: vehicle.vehicleType || "Bus",
        vehicleModel: vehicle.vehicleModel || "",
        capacity: vehicle.capacity ?? "",
        registrationDate: vehicle.registrationDate
          ? new Date(vehicle.registrationDate).toISOString().slice(0, 10)
          : "",
        insuranceExpiryDate: vehicle.insuranceExpiryDate
          ? new Date(vehicle.insuranceExpiryDate).toISOString().slice(0, 10)
          : "",
        fitnessExpiryDate: vehicle.fitnessExpiryDate
          ? new Date(vehicle.fitnessExpiryDate).toISOString().slice(0, 10)
          : "",
        description: vehicle.description || "",
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API}/vehicle/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete vehicle");
      }

      setSuccess(result.message || "Vehicle deleted successfully");
      await fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNumber
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

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
          <h3 className="mb-1">Vehicle Management</h3>
          <p className="text-muted mb-0">
            Manage school buses, vans and other vehicles
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchVehicles}
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

      {/* Vehicle Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            {editId ? "Update Vehicle" : "Add New Vehicle"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-4">
                <label className="form-label">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  className="form-control"
                  placeholder="Example: UP16AB1234"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  className="form-select"
                  value={form.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  className="form-control"
                  placeholder="Example: Tata Starbus"
                  value={form.vehicleModel}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  placeholder="Enter capacity"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Registration Date
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  className="form-control"
                  value={form.registrationDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Insurance Expiry Date
                </label>
                <input
                  type="date"
                  name="insuranceExpiryDate"
                  className="form-control"
                  value={form.insuranceExpiryDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Fitness Expiry Date
                </label>
                <input
                  type="date"
                  name="fitnessExpiryDate"
                  className="form-control"
                  value={form.fitnessExpiryDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-8">
                <label className="form-label">
                  Description
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  placeholder="Enter vehicle description"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
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
                    ? "Update Vehicle"
                    : "Add Vehicle"}
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

      {/* Vehicle List */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center g-2">
            <div className="col-md-6">
              <h5 className="mb-0">
                Vehicle List ({filteredVehicles.length})
              </h5>
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search vehicle number..."
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
                    <th>Vehicle Number</th>
                    <th>Type</th>
                    <th>Model</th>
                    <th>Capacity</th>
                    <th>Registration</th>
                    <th>Insurance</th>
                    <th>Fitness</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => (
                      <tr key={vehicle._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">
                          {vehicle.vehicleNumber}
                        </td>
                        <td>{vehicle.vehicleType}</td>
                        <td>{vehicle.vehicleModel || "-"}</td>
                        <td>{vehicle.capacity}</td>
                        <td>{formatDate(vehicle.registrationDate)}</td>
                        <td>
                          <div>{formatDate(vehicle.insuranceExpiryDate)}</div>
                          {expiryBadge(vehicle.insuranceExpiryDate)}
                        </td>
                        <td>
                          <div>{formatDate(vehicle.fitnessExpiryDate)}</div>
                          {expiryBadge(vehicle.fitnessExpiryDate)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2 mb-1"
                            onClick={() => handleEdit(vehicle._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger mb-1"
                            onClick={() => handleDelete(vehicle._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No vehicles found
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

export default VehicleManagement;