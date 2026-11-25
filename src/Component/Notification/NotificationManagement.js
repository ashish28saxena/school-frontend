
import React, { useEffect, useState } from "react";
import axios from "axios";

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

const NotificationManagement = () => {
  const token = localStorage.getItem("token");
  const role = (
    localStorage.getItem("role") ||
    localStorage.getItem("roleName") ||
    ""
  ).toLowerCase();

  const isAdmin = ["admin", "principal", "superadmin", "super admin"].includes(role);

  const headers = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState(initialForm);
  const [notifications, setNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("my");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showMessage = (msg, isError = false) => {
    setMessage(isError ? "" : msg);
    setError(isError ? msg : "");
  };

  const fetchMyNotifications = async () => {
    try {
      const res = await axios.get(`${API}/my-notifications`, { headers });
      setNotifications(res.data.data || []);
    } catch (err) {
      showMessage(err.response?.data?.message || "Unable to load notifications", true);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`${API}/unread-count`, { headers });
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminNotifications = async () => {
    if (!isAdmin) return;

    try {
      const res = await axios.get(`${API}/list`, { headers });
      setAdminNotifications(res.data.data || []);
    } catch (err) {
      showMessage(err.response?.data?.message || "Unable to load notification list", true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchMyNotifications(),
      fetchUnreadCount(),
      fetchAdminNotifications(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      showMessage("Title and message are required", true);
      return;
    }

    if (form.targetAudience === "specific" && !form.targetUserIds.trim()) {
      showMessage("Please enter at least one User ID", true);
      return;
    }

    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      targetAudience: form.targetAudience,
      targetUserIds:
        form.targetAudience === "specific"
          ? form.targetUserIds.split(",").map((id) => id.trim()).filter(Boolean)
          : [],
      expiresAt: form.expiresAt || null,
      status: form.status,
    };

    try {
      setLoading(true);

      if (editId) {
        await axios.put(`${API}/update/${editId}`, payload, { headers });
        showMessage("Notification updated successfully");
      } else {
        await axios.post(`${API}/add`, payload, { headers });
        showMessage("Notification created successfully");
      }

      resetForm();
      await fetchAdminNotifications();
      await fetchMyNotifications();
      await fetchUnreadCount();
    } catch (err) {
      showMessage(err.response?.data?.message || "Unable to save notification", true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      title: item.title || "",
      message: item.message || "",
      type: item.type || "general",
      targetAudience: item.targetAudience || "all",
      targetUserIds: (item.targetUserIds || []).map((id) => id._id || id).join(", "),
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : "",
      status: item.status !== false,
    });
    setActiveTab("manage");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      await axios.delete(`${API}/delete/${id}`, { headers });
      showMessage("Notification deleted successfully");
      await fetchAdminNotifications();
      await fetchMyNotifications();
      await fetchUnreadCount();
    } catch (err) {
      showMessage(err.response?.data?.message || "Unable to delete notification", true);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/mark-read/${id}`, {}, { headers });
      await fetchMyNotifications();
      await fetchUnreadCount();
    } catch (err) {
      showMessage(err.response?.data?.message || "Unable to mark as read", true);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API}/mark-all-read`, {}, { headers });
      showMessage("All notifications marked as read");
      await fetchMyNotifications();
      await fetchUnreadCount();
    } catch (err) {
      showMessage(err.response?.data?.message || "Unable to mark all as read", true);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN");
  };

  const typeBadge = (type) => {
    const classes = {
      general: "bg-secondary",
      announcement: "bg-primary",
      event: "bg-info text-dark",
      exam: "bg-warning text-dark",
      fee: "bg-success",
      leave: "bg-dark",
      holiday: "bg-info text-dark",
      alert: "bg-danger",
    };
    return classes[type] || "bg-secondary";
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Notification Management</h3>
          <p className="text-muted mb-0">Manage school notifications and announcements</p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <span className="badge bg-danger fs-6">
            Unread: {unreadCount}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible">
          {message}
          <button className="btn-close" onClick={() => setMessage("")}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "my" ? "active" : ""}`}
            onClick={() => setActiveTab("my")}
          >
            My Notifications
          </button>
        </li>

        {isAdmin && (
          <>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "manage" ? "active" : ""}`}
                onClick={() => setActiveTab("manage")}
              >
                {editId ? "Edit Notification" : "Create Notification"}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "list" ? "active" : ""}`}
                onClick={() => setActiveTab("list")}
              >
                Manage Notifications
              </button>
            </li>
          </>
        )}
      </ul>

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {/* MY NOTIFICATIONS */}
      {activeTab === "my" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">My Notifications</h5>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </button>
          </div>

          {notifications.length > 0 ? (
            <div className="row">
              {notifications.map((item) => (
                <div className="col-md-6 col-lg-4 mb-3" key={item._id}>
                  <div className={`card h-100 shadow-sm ${!item.isRead ? "border-primary" : ""}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span className={`badge ${typeBadge(item.type)}`}>
                          {item.type}
                        </span>
                        {!item.isRead && (
                          <span className="badge bg-danger">New</span>
                        )}
                      </div>

                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.message}</p>

                      <small className="text-muted d-block mb-3">
                        {formatDate(item.createdAt)}
                      </small>

                      {!item.isRead && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => markAsRead(item._id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">No notifications found.</div>
          )}
        </div>
      )}

      {/* CREATE / EDIT */}
      {activeTab === "manage" && isAdmin && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              {editId ? "Update Notification" : "Create Notification"}
            </h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Notification Title *</label>
                  <input
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter notification title"
                    required
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Notification Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    {["general", "announcement", "event", "exam", "fee", "leave", "holiday", "alert"].map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-select"
                    name="targetAudience"
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
                  <div className="col-md-12 mb-3">
                    <label className="form-label">
                      User IDs (comma separated)
                    </label>
                    <input
                      className="form-control"
                      name="targetUserIds"
                      value={form.targetUserIds}
                      onChange={handleChange}
                      placeholder="Enter MongoDB User IDs separated by commas"
                    />
                  </div>
                )}

                <div className="col-md-12 mb-3">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Enter notification message"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Expiry Date (Optional)</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3 d-flex align-items-center">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="notificationStatus"
                      checked={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, status: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="notificationStatus">
                      Active
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary me-2" type="submit" disabled={loading}>
                    {editId ? "Update Notification" : "Create Notification"}
                  </button>

                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN NOTIFICATION LIST */}
      {activeTab === "list" && isAdmin && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">All Notifications</h5>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Audience</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {adminNotifications.length > 0 ? (
                  adminNotifications.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{item.title}</strong>
                        <div className="small text-muted">{item.message}</div>
                      </td>
                      <td>
                        <span className={`badge ${typeBadge(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>{item.targetAudience}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        <span className={`badge ${item.status ? "bg-success" : "bg-secondary"}`}>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No notifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;