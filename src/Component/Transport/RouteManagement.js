
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const initialForm = {
  routeName: "",
  routeCode: "",
  startingPoint: "",
  endingPoint: "",
  pickupPoints: [],
  totalDistance: "",
  estimatedTravelTime: "",
  description: "",
};

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Routes
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/routes`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch routes");
      }

      setRoutes(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Pickup Point
  const addPickupPoint = () => {
    setForm((prev) => ({
      ...prev,
      pickupPoints: [
        ...prev.pickupPoints,
        {
          pointName: "",
          address: "",
          sequence: prev.pickupPoints.length + 1,
        },
      ],
    }));
  };

  // Update Pickup Point
  const handlePickupChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      pickupPoints: prev.pickupPoints.map((point, i) =>
        i === index
          ? { ...point, [field]: value }
          : point
      ),
    }));
  };

  // Remove Pickup Point
  const removePickupPoint = (index) => {
    setForm((prev) => ({
      ...prev,
      pickupPoints: prev.pickupPoints
        .filter((_, i) => i !== index)
        .map((point, i) => ({
          ...point,
          sequence: i + 1,
        })),
    }));
  };

  // Reset Form
  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  // Add / Update Route
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = editId
        ? `${API}/route/update/${editId}`
        : `${API}/route/submit`;

      const payload = {
        ...form,
        totalDistance: Number(form.totalDistance),
        estimatedTravelTime: Number(form.estimatedTravelTime),
        pickupPoints: form.pickupPoints.map((point, index) => ({
          pointName: point.pointName,
          address: point.address,
          sequence: Number(point.sequence) || index + 1,
        })),
      };

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setSuccess(result.message || "Route saved successfully");
      resetForm();
      await fetchRoutes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit Route
  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API}/route/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch route");
      }

      const route = result.data;

      setForm({
        routeName: route.routeName || "",
        routeCode: route.routeCode || "",
        startingPoint: route.startingPoint || "",
        endingPoint: route.endingPoint || "",
        pickupPoints: (route.pickupPoints || []).map((point, index) => ({
          pointName: point.pointName || "",
          address: point.address || "",
          sequence: point.sequence || index + 1,
        })),
        totalDistance: route.totalDistance ?? "",
        estimatedTravelTime: route.estimatedTravelTime ?? "",
        description: route.description || "",
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

  // Delete Route
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this route?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API}/route/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete route");
      }

      setSuccess(result.message || "Route deleted successfully");
      await fetchRoutes();
    } catch (err) {
      setError(err.message);
    }
  };

  // Search Routes
  const filteredRoutes = routes.filter((route) => {
    const text = search.toLowerCase();

    return (
      route.routeName?.toLowerCase().includes(text) ||
      route.routeCode?.toLowerCase().includes(text) ||
      route.startingPoint?.toLowerCase().includes(text) ||
      route.endingPoint?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="container-fluid py-3">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Route Management</h3>
          <p className="text-muted mb-0">
            Manage school transport routes and pickup points
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchRoutes}
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

      {/* Route Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            {editId ? "Update Route" : "Add New Route"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-4">
                <label className="form-label">Route Name *</label>
                <input
                  type="text"
                  name="routeName"
                  className="form-control"
                  placeholder="Example: Noida to Delhi"
                  value={form.routeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Route Code *</label>
                <input
                  type="text"
                  name="routeCode"
                  className="form-control"
                  placeholder="Example: RT001"
                  value={form.routeCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Total Distance (KM)</label>
                <input
                  type="number"
                  name="totalDistance"
                  className="form-control"
                  placeholder="Enter distance"
                  min="0"
                  step="0.1"
                  value={form.totalDistance}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Starting Point *</label>
                <input
                  type="text"
                  name="startingPoint"
                  className="form-control"
                  placeholder="Enter starting point"
                  value={form.startingPoint}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Ending Point *</label>
                <input
                  type="text"
                  name="endingPoint"
                  className="form-control"
                  placeholder="Enter ending point"
                  value={form.endingPoint}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Estimated Travel Time (Minutes)
                </label>
                <input
                  type="number"
                  name="estimatedTravelTime"
                  className="form-control"
                  placeholder="Example: 90"
                  min="0"
                  value={form.estimatedTravelTime}
                  onChange={handleChange}
                />
              </div>

              {/* Pickup Points */}
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Pickup Points</h5>

                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={addPickupPoint}
                  >
                    + Add Pickup Point
                  </button>
                </div>

                {form.pickupPoints.length === 0 && (
                  <div className="alert alert-light border">
                    No pickup points added yet.
                  </div>
                )}

                {form.pickupPoints.map((point, index) => (
                  <div
                    className="row g-2 align-items-end border rounded p-3 mb-3"
                    key={index}
                  >
                    <div className="col-md-1">
                      <label className="form-label">Sequence</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={point.sequence}
                        onChange={(e) =>
                          handlePickupChange(
                            index,
                            "sequence",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Point Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter pickup point"
                        value={point.pointName}
                        onChange={(e) =>
                          handlePickupChange(
                            index,
                            "pointName",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter pickup address"
                        value={point.address}
                        onChange={(e) =>
                          handlePickupChange(
                            index,
                            "address",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() => removePickupPoint(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Enter route description"
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
                    ? "Update Route"
                    : "Add Route"}
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

      {/* Route List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center g-2">
            <div className="col-md-6">
              <h5 className="mb-0">
                Route List ({filteredRoutes.length})
              </h5>
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search route name, code or location..."
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
                    <th>Route Name</th>
                    <th>Route Code</th>
                    <th>Starting Point</th>
                    <th>Ending Point</th>
                    <th>Pickup Points</th>
                    <th>Distance (KM)</th>
                    <th>Travel Time</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((route, index) => (
                      <tr key={route._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{route.routeName}</td>
                        <td>{route.routeCode}</td>
                        <td>{route.startingPoint}</td>
                        <td>{route.endingPoint}</td>
                        <td>
                          {route.pickupPoints?.length || 0}
                        </td>
                        <td>{route.totalDistance || 0}</td>
                        <td>
                          {route.estimatedTravelTime
                            ? `${route.estimatedTravelTime} min`
                            : "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2 mb-1"
                            onClick={() => handleEdit(route._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger mb-1"
                            onClick={() => handleDelete(route._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No routes found
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

export default RouteManagement;
