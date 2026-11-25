
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/notification";

export default function NotificationReports() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/history?page=1&limit=100`, {
        headers,
      });
      const result = await res.json();

      if (res.ok) setHistory(result.data || []);
      else alert(result.message || "History loading failed");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await fetch(`${API}/read-unread-summary`, {
        headers,
      });
      const result = await res.json();

      if (res.ok) setSummary(result.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadReport = async (id) => {
    try {
      setSelectedId(id);
      setReport(null);

      const res = await fetch(`${API}/report/${id}`, {
        headers,
      });
      const result = await res.json();

      if (res.ok) setReport(result);
      else alert(result.message || "Report loading failed");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHistory();
    loadSummary();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Notification Reports</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Total Notifications</h5>
            <h2>{history.length}</h2>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5>Notification Reports</h5>
            <h2>{summary.length}</h2>
          </div>
        </div>
      </div>

      <h4>Notification History</h4>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Audience</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.targetAudience}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => loadReport(item._id)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan="5">No notifications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <h4 className="mt-4">Read / Unread Summary</h4>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Notification</th>
              <th>Type</th>
              <th>Read Count</th>
              <th>Targeted Users</th>
            </tr>
          </thead>

          <tbody>
            {summary.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.totalRead}</td>
                <td>{item.totalTargeted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {report && selectedId && (
        <div className="mt-4">
          <h4>{report.notification.title} - User Report</h4>

          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card p-3">
                Total: {report.total}
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 text-success">
                Read: {report.read}
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 text-danger">
                Unread: {report.unread}
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {report.users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>
                      <span
                        className={
                          user.status === "Read"
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
