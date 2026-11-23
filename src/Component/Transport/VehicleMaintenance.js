
import React, { useEffect, useMemo, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const initialForm = {
  vehicleId: "",
  maintenanceType: "Service",
  serviceDate: "",
  nextServiceDate: "",
  odometerReading: "",
  workshopName: "",
  amount: "",
  description: "",
  documentUrl: "",
  remarks: "",
};

const maintenanceTypes = [
  "Service",
  "Repair",
  "Insurance",
  "Fitness",
  "Other",
];

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
};

const getId = (value) => {
  if (!value) return "";
  return typeof value === "object" ? value._id : value;
};

const getVehicleName = (vehicle) => {
  if (!vehicle) return "-";
  if (typeof vehicle === "object") {
    return `${vehicle.vehicleNumber || ""} ${
      vehicle.vehicleModel || ""
    }`.trim();
  }
  return vehicle;
};

function VehicleMaintenance() {
  const [vehicles, setVehicles] = useState([]);
  const [records, setRecords] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState("");
  const [viewRecord, setViewRecord] = useState(null);

  const [vehicleFilter, setVehicleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("records");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
   const token = localStorage.getItem("token");
  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Something went wrong"
      );
    }

    return result;
  };

  const fetchVehicles = async () => {
    try {
      const result = await request("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVehicles(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (vehicleFilter) {
        params.append("vehicleId", vehicleFilter);
      }

      if (typeFilter) {
        params.append("maintenanceType", typeFilter);
      }

      const query = params.toString()
        ? `?${params.toString()}`
        : "";

      const result = await request(`/maintenances${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const result = await request("/maintenance/reminders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReminders(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchReminders();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [vehicleFilter, typeFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.vehicleId || !form.serviceDate) {
      setError("Please select vehicle and service date.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        odometerReading: form.odometerReading
          ? Number(form.odometerReading)
          : undefined,
        amount: form.amount
          ? Number(form.amount)
          : 0,
        nextServiceDate: form.nextServiceDate || null,
      };

      const url = editId
        ? `/maintenance/update/${editId}`
        : "/maintenance/submit";

      const method = editId ? "PUT" : "POST";

      await request(url, {
        method,
         headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      alert(
        editId
          ? "Maintenance record updated successfully"
          : "Maintenance record added successfully"
      );

      resetForm();
      setActiveTab("records");

      await Promise.all([
        fetchRecords(),
        fetchReminders(),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setError("");

      const result = await request(`/maintenance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const item = result.data;

      setForm({
        vehicleId: getId(item.vehicleId),
        maintenanceType: item.maintenanceType || "Service",
        serviceDate: item.serviceDate
          ? new Date(item.serviceDate).toISOString().slice(0, 10)
          : "",
        nextServiceDate: item.nextServiceDate
          ? new Date(item.nextServiceDate).toISOString().slice(0, 10)
          : "",
        odometerReading: item.odometerReading ?? "",
        workshopName: item.workshopName || "",
        amount: item.amount ?? "",
        description: item.description || "",
        documentUrl: item.documentUrl || "",
        remarks: item.remarks || "",
      });

      setEditId(id);
      setActiveTab("form");
      setViewRecord(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleView = async (id) => {
    try {
      setError("");

      const result = await request(`/maintenance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setViewRecord(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this maintenance record?"
      )
    ) {
      return;
    }

    try {
      await request(`/maintenance/delete/${id}`, {
        method: "DELETE",
         headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      alert("Maintenance record deleted successfully");

      await Promise.all([
        fetchRecords(),
        fetchReminders(),
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRecords = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return records;

    return records.filter((item) => {
      const vehicle = getVehicleName(item.vehicleId).toLowerCase();
      const workshop = (item.workshopName || "").toLowerCase();
      const type = (item.maintenanceType || "").toLowerCase();

      return (
        vehicle.includes(value) ||
        workshop.includes(value) ||
        type.includes(value)
      );
    });
  }, [records, search]);

  const totalExpense = records.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <div>
          <h3 className="mb-1">Vehicle Maintenance Management</h3>
          <p className="text-muted mb-0">
            Manage vehicle servicing, repairs and maintenance expenses.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setActiveTab("form");
            setError("");
          }}
        >
          + Add Maintenance
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

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Records</h6>
              <h3>{records.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Maintenance Expense</h6>
              <h3>{formatAmount(totalExpense)}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Upcoming Service Reminders</h6>
              <h3>{reminders.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "records" ? "active" : ""
            }`}
            onClick={() => setActiveTab("records")}
          >
            Maintenance Records
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "form" ? "active" : ""
            }`}
            onClick={() => setActiveTab("form")}
          >
            {editId ? "Update Maintenance" : "Add Maintenance"}
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "reminders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reminders")}
          >
            Service Reminders
          </button>
        </li>
      </ul>

      {/* Add/Edit Form */}
      {activeTab === "form" && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              {editId ? "Update Maintenance Record" : "Add Maintenance Record"}
            </h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Select Vehicle *</label>
                  <select
                    className="form-select"
                    name="vehicleId"
                    value={form.vehicleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleNumber} - {vehicle.vehicleModel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Maintenance Type *</label>
                  <select
                    className="form-select"
                    name="maintenanceType"
                    value={form.maintenanceType}
                    onChange={handleChange}
                    required
                  >
                    {maintenanceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Service Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="serviceDate"
                    value={form.serviceDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Next Service Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="nextServiceDate"
                    value={form.nextServiceDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Odometer Reading (KM)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="odometerReading"
                    value={form.odometerReading}
                    onChange={handleChange}
                    placeholder="Enter odometer reading"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Workshop Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="workshopName"
                    value={form.workshopName}
                    onChange={handleChange}
                    placeholder="Enter workshop name"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Maintenance Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Document URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="documentUrl"
                    value={form.documentUrl}
                    onChange={handleChange}
                    placeholder="Enter invoice/document URL"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter maintenance details"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Enter remarks"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-success me-2"
                  disabled={saving}
                >
                  {saving
                    ? "Please wait..."
                    : editId
                    ? "Update Maintenance"
                    : "Save Maintenance"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Records */}
      {activeTab === "records" && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Maintenance Records</h5>
          </div>

          <div className="card-body">
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                >
                  <option value="">All Vehicles</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Maintenance Types</option>
                  {maintenanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search vehicle/workshop/type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="text-center py-4">Loading records...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>S.No.</th>
                      <th>Vehicle</th>
                      <th>Type</th>
                      <th>Service Date</th>
                      <th>Next Service</th>
                      <th>Odometer (KM)</th>
                      <th>Workshop</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No maintenance records found
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{getVehicleName(item.vehicleId)}</td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {item.maintenanceType}
                            </span>
                          </td>
                          <td>{formatDate(item.serviceDate)}</td>
                          <td>{formatDate(item.nextServiceDate)}</td>
                          <td>{item.odometerReading ?? "-"}</td>
                          <td>{item.workshopName || "-"}</td>
                          <td>{formatAmount(item.amount)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-info text-white"
                                onClick={() => handleView(item._id)}
                                title="View"
                              >
                                View
                              </button>

                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(item._id)}
                                title="Edit"
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(item._id)}
                                title="Delete"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Reminders */}
      {activeTab === "reminders" && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Upcoming Service Reminders</h5>
            <small className="text-muted">
              Vehicles with next service dates within the next 30 days.
            </small>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Vehicle</th>
                    <th>Maintenance Type</th>
                    <th>Last Service Date</th>
                    <th>Next Service Date</th>
                    <th>Workshop</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {reminders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No upcoming service reminders
                      </td>
                    </tr>
                  ) : (
                    reminders.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{getVehicleName(item.vehicleId)}</td>
                        <td>{item.maintenanceType}</td>
                        <td>{formatDate(item.serviceDate)}</td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {formatDate(item.nextServiceDate)}
                          </span>
                        </td>
                        <td>{item.workshopName || "-"}</td>
                        <td>{formatAmount(item.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewRecord && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Maintenance Details
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setViewRecord(null)}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Vehicle:</strong>
                    <p>{getVehicleName(viewRecord.vehicleId)}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Maintenance Type:</strong>
                    <p>{viewRecord.maintenanceType || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Service Date:</strong>
                    <p>{formatDate(viewRecord.serviceDate)}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Next Service Date:</strong>
                    <p>{formatDate(viewRecord.nextServiceDate)}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Odometer Reading:</strong>
                    <p>{viewRecord.odometerReading ?? "-"} KM</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Workshop:</strong>
                    <p>{viewRecord.workshopName || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Amount:</strong>
                    <p>{formatAmount(viewRecord.amount)}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Document:</strong>
                    <p>
                      {viewRecord.documentUrl ? (
                        <a
                          href={viewRecord.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Document
                        </a>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Description:</strong>
                    <p>{viewRecord.description || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Remarks:</strong>
                    <p>{viewRecord.remarks || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewRecord(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleMaintenance;
