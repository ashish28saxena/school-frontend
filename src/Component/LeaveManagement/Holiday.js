
import React, { useEffect, useMemo, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/holiday";

const initialForm = {
  holidayName: "",
  startDate: "",
  endDate: "",
  holidayType: "School",
  description: "",
  isOptional: false,
  status: true,
};

const Holiday = () => {
  const [form, setForm] = useState(initialForm);
  const [holidayList, setHolidayList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [typeFilter, setTypeFilter] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchHolidays = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (typeFilter) params.append("holidayType", typeFilter);

      const response = await fetch(`${API}/all?${params.toString()}`, {
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch holidays");
      }

      setHolidayList(result.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
    // Fetch when year or type filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, typeFilter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.endDate < form.startDate) {
      setMessage("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      const url = editId
        ? `${API}/update/${editId}`
        : `${API}/add`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save holiday");
      }

      setMessage(result.message);
      resetForm();
      await fetchHolidays();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (holiday) => {
    setEditId(holiday._id);

    setForm({
      holidayName: holiday.holidayName || "",
      startDate: holiday.startDate
        ? new Date(holiday.startDate).toISOString().slice(0, 10)
        : "",
      endDate: holiday.endDate
        ? new Date(holiday.endDate).toISOString().slice(0, 10)
        : "",
      holidayType: holiday.holidayType || "School",
      description: holiday.description || "",
      isOptional: Boolean(holiday.isOptional),
      status: holiday.status !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete holiday "${name}"?`)) return;

    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete holiday");
      }

      setMessage(result.message);
      await fetchHolidays();

      if (editId === id) resetForm();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const filteredHolidays = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return holidayList;

    return holidayList.filter((holiday) =>
      [
        holiday.holidayName,
        holiday.holidayType,
        holiday.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [holidayList, search]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Holiday Management</h3>
        <span className="badge bg-primary">
          Total Holidays: {filteredHolidays.length}
        </span>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
          />
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            {editId ? "Update Holiday" : "Add Holiday"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Holiday Name *</label>
                <input
                  type="text"
                  name="holidayName"
                  className="form-control"
                  value={form.holidayName}
                  onChange={handleChange}
                  placeholder="Enter holiday name"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  min={form.startDate || undefined}
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Holiday Type</label>
                <select
                  name="holidayType"
                  className="form-select"
                  value={form.holidayType}
                  onChange={handleChange}
                >
                  <option value="National">National</option>
                  <option value="Festival">Festival</option>
                  <option value="School">School</option>
                  <option value="Optional">Optional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-8 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    name="isOptional"
                    className="form-check-input"
                    id="isOptional"
                    checked={form.isOptional}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isOptional">
                    Optional Holiday
                  </label>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    name="status"
                    className="form-check-input"
                    id="holidayStatus"
                    checked={form.status}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="holidayStatus">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : editId
                ? "Update Holiday"
                : "Add Holiday"}
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
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-2">
              <label className="form-label">Year</label>
              <select
                className="form-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from(
                  { length: 10 },
                  (_, index) => new Date().getFullYear() - 5 + index
                ).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-2">
              <label className="form-label">Holiday Type</label>
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="National">National</option>
                <option value="Festival">Festival</option>
                <option value="School">School</option>
                <option value="Optional">Optional</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Search Holiday</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, type or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Holiday List */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Holiday List</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Holiday Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Optional</th>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredHolidays.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No holidays found
                  </td>
                </tr>
              ) : (
                filteredHolidays.map((holiday, index) => (
                  <tr key={holiday._id}>
                    <td>{index + 1}</td>
                    <td>{holiday.holidayName}</td>
                    <td>{formatDate(holiday.startDate)}</td>
                    <td>{formatDate(holiday.endDate)}</td>
                    <td>{holiday.holidayType}</td>
                    <td>
                      {holiday.isOptional ? (
                        <span className="badge bg-warning text-dark">
                          Yes
                        </span>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          holiday.status ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {holiday.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{holiday.description || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(holiday)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDelete(holiday._id, holiday.holidayName)
                        }
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

export default Holiday;
