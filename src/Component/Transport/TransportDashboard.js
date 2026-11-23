
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const TransportDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const token = localStorage.getItem("token");
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch dashboard");
      }

      setDashboard(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = dashboard
    ? [
        {
          title: "Total Vehicles",
          value: dashboard.totalVehicles,
          icon: "🚌",
          color: "primary",
        },
        {
          title: "Total Drivers",
          value: dashboard.totalDrivers,
          icon: "👨‍✈️",
          color: "success",
        },
        {
          title: "Total Routes",
          value: dashboard.totalRoutes,
          icon: "🛣️",
          color: "info",
        },
        {
          title: "Assigned Students",
          value: dashboard.totalAssignedStudents,
          icon: "🎓",
          color: "warning",
        },
        {
          title: "Fees Collected",
          value: `₹${dashboard.feeSummary.totalCollected}`,
          icon: "💰",
          color: "success",
        },
        {
          title: "Pending Fees",
          value: `₹${dashboard.feeSummary.pendingAmount}`,
          icon: "⏳",
          color: "danger",
        },
        {
          title: "Maintenance Expense",
          value: `₹${dashboard.monthlyMaintenanceExpense}`,
          icon: "🔧",
          color: "secondary",
        },
        {
          title: "Upcoming Services",
          value: dashboard.upcomingServices,
          icon: "📅",
          color: "dark",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading transport dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={fetchDashboard}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return <div className="alert alert-warning">No dashboard data found.</div>;
  }

  const attendance = dashboard.todayAttendance;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Transport Dashboard</h3>
          <p className="text-muted mb-0">
            Overview of your school's transport management
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchDashboard}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-xl-3 col-md-4 col-sm-6" key={card.title}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-2">{card.title}</p>
                  <h3 className="fw-bold mb-0">{card.value}</h3>
                </div>

                <div
                  className={`bg-${card.color} bg-opacity-10 rounded-circle p-3`}
                >
                  <span style={{ fontSize: "28px" }}>{card.icon}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Attendance */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Today's Transport Attendance</h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="border rounded p-3 text-center">
                <h3 className="fw-bold">{attendance.total}</h3>
                <span className="text-muted">Total Records</span>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="border rounded p-3 text-center">
                <h3 className="fw-bold text-success">
                  {attendance.picked}
                </h3>
                <span className="text-muted">Picked Students</span>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="border rounded p-3 text-center">
                <h3 className="fw-bold text-danger">
                  {attendance.absent}
                </h3>
                <span className="text-muted">Absent Students</span>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="border rounded p-3 text-center">
                <h3 className="fw-bold text-primary">
                  {attendance.dropped}
                </h3>
                <span className="text-muted">Dropped Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransportDashboard;
