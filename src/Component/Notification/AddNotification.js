
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/notification";

const initialForm = {
  title: "",
  message: "",
  type: "general",
  targetAudience: "all",
  targetUserIds: "",
  expiresAt: "",
  status: true,
};

const AddNotification = () => {
  const [form, setForm] = useState(initialForm);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load notifications");
      }

      setNotifications(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      alert("Title and message are required");
      return;
    }

    if (
      form.targetAudience === "specific" &&
      !form.targetUserIds.trim()
    ) {
      alert("Please enter at least one User ID");
      return;
    }

    const targetUserIds =
      form.targetAudience === "specific"
        ? form.targetUserIds
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : [];

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      targetAudience: form.targetAudience,
      targetUserIds,
      status: form.status,
      expiresAt: form.expiresAt || null,
    };

    try {
      setSaving(true);

      const url = editId
        ? `${API}/update/${editId}`
        : `${API}/add`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }

      alert(
        editId
          ? "Notification updated successfully"
          : "Notification added successfully"
      );

      resetForm();
      loadNotifications();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      title: item.title || "",
      message: item.message || "",
      type: item.type || "general",
      targetAudience: item.targetAudience || "all",
      targetUserIds: (item.targetUserIds || [])
        .map((user) =>
          typeof user === "object" ? user._id : user
        )
        .join(", "),
      expiresAt: item.expiresAt
        ? new Date(item.expiresAt).toISOString().slice(0, 10)
        : "",
      status: item.status ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      alert("Notification deleted successfully");
      loadNotifications();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">
        {editId ? "Update Notification" : "Add Notification"}
      </h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            {editId ? "Edit Notification Details" : "Notification Details"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Notification Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter notification title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Notification Type *</label>
                <select
                  name="type"
                  className="form-select"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="exam">Exam</option>
                  <option value="fee">Fee</option>
                  <option value="leave">Leave</option>
                  <option value="holiday">Holiday</option>
                  <option value="alert">Alert</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Enter notification message"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Target Audience *</label>
                <select
                  name="targetAudience"
                  className="form-select"
                  value={form.targetAudience}
                  onChange={handleChange}
                >
                  <option value="all">All Users</option>
                  <option value="teacher">Teachers</option>
                  <option value="staff">Staff</option>
                  <option value="student">Students</option>
                  <option value="parent">Parents</option>
                  <option value="specific">Specific Users</option>
                </select>
              </div>

              {form.targetAudience === "specific" && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">User IDs *</label>
                  <input
                    type="text"
                    name="targetUserIds"
                    className="form-control"
                    placeholder="Enter comma separated User IDs"
                    value={form.targetUserIds}
                    onChange={handleChange}
                  />
                  <small className="text-muted">
                    Example: UserID1, UserID2
                  </small>
                </div>
              )}

              <div className="col-md-6 mb-3">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiresAt"
                  className="form-control"
                  value={form.expiresAt}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    name="status"
                    className="form-check-input"
                    id="notificationStatus"
                    checked={form.status}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="notificationStatus"
                  >
                    Active Notification
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editId
                ? "Update Notification"
                : "Add Notification"}
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

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Notification List</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading notifications...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Audience</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {notifications.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.type}</td>
                      <td>{item.targetAudience}</td>
                      <td>
                        {item.expiresAt
                          ? new Date(item.expiresAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
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
                  ))}

                  {notifications.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No notifications found
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

export default AddNotification;
