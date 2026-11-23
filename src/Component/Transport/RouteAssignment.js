
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const initialForm = {
  vehicleId: "",
  driverId: "",
  routeId: "",
  assignmentDate: new Date().toISOString().slice(0, 10),
  startTime: "",
  endTime: "",
  remarks: "",
};

const getId = (value) =>
  typeof value === "object" && value !== null ? value._id : value || "";

const RouteAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   const token = localStorage.getItem("token");
  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  };

  const loadDropdowns = async () => {
    try {
      const [vehicleRes, driverRes, routeRes] = await Promise.all([
        request("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
        request("/drivers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
        request("/routes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      ]);

      setVehicles(vehicleRes.data || []);
      setDrivers(driverRes.data || []);
      setRoutes(routeRes.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const result = await request("/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignments(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropdowns();
    fetchAssignments();
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.vehicleId ||
      !form.driverId ||
      !form.routeId ||
      !form.assignmentDate ||
      !form.startTime ||
      !form.endTime
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.endTime <= form.startTime) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      const url = editId
        ? `/assignment/update/${editId}`
        : "/assignment/submit";

      const method = editId ? "PUT" : "POST";

      const result = await request(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      setSuccess(
        result.message ||
          (editId
            ? "Assignment updated successfully."
            : "Assignment created successfully.")
      );

      resetForm();
      fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    setError("");
    setSuccess("");

    try {
      const result = await request(`/assignment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const item = result.data;

      if (!item) {
        throw new Error("Assignment not found.");
      }

      setForm({
        vehicleId: getId(item.vehicleId),
        driverId: getId(item.driverId),
        routeId: getId(item.routeId),
        assignmentDate: item.assignmentDate
          ? new Date(item.assignmentDate).toISOString().slice(0, 10)
          : "",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
        remarks: item.remarks || "",
      });

      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const result = await request(`/assignment/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setSuccess(result.message || "Assignment deleted successfully.");

      if (editId === id) {
        resetForm();
      }

      fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredAssignments = assignments.filter((item) => {
    const vehicle = item.vehicleId?.vehicleNumber || "";
    const driver = item.driverId?.driverName || "";
    const route = item.routeId?.routeName || "";

    const searchText =
      `${vehicle} ${driver} ${route} ${item.assignmentDate || ""}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Vehicle & Driver Route Assignment</h3>
        <button
          className="btn btn-secondary"
          onClick={fetchAssignments}
          type="button"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      {/* Assignment Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {editId ? "Update Route Assignment" : "Create Route Assignment"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Select Vehicle <span className="text-danger">*</span>
                </label>
                <select
                  name="vehicleId"
                  className="form-select"
                  value={form.vehicleId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleNumber} - {vehicle.vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Select Driver <span className="text-danger">*</span>
                </label>
                <select
                  name="driverId"
                  className="form-select"
                  value={form.driverId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.driverName} - {driver.mobileNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Select Route <span className="text-danger">*</span>
                </label>
                <select
                  name="routeId"
                  className="form-select"
                  value={form.routeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} ({route.routeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Assignment Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="assignmentDate"
                  className="form-control"
                  value={form.assignmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Start Time <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  className="form-control"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  End Time <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  className="form-control"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Remarks</label>
                <textarea
                  name="remarks"
                  className="form-control"
                  rows="2"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {editId ? "Update Assignment" : "Create Assignment"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Reset
            </button>
          </form>
        </div>
      </div>

      {/* Assignment List */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Route Assignment List</h5>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search vehicle, driver or route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Vehicle Number</th>
                  <th>Driver Name</th>
                  <th>Route Name</th>
                  <th>Assignment Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Loading assignments...
                    </td>
                  </tr>
                ) : filteredAssignments.length > 0 ? (
                  filteredAssignments.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.vehicleId?.vehicleNumber || "-"}</td>
                      <td>{item.driverId?.driverName || "-"}</td>
                      <td>{item.routeId?.routeName || "-"}</td>
                      <td>
                        {item.assignmentDate
                          ? new Date(item.assignmentDate).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>
                      <td>{item.startTime || "-"}</td>
                      <td>{item.endTime || "-"}</td>
                      <td>{item.remarks || "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(item._id)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No route assignments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteAssignment;
