
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API = "https://school-management-backend-ochre.vercel.app/api/dashboard";

const COLORS = [
  "#0d6efd",
  "#198754",
  "#ffc107",
  "#dc3545",
  "#6f42c1",
  "#20c997",
  "#fd7e14",
  "#0dcaf0",
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const role = user.role?.toLowerCase();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Dashboard fetch failed");
      }

      setData(result.data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>

        <button className="btn btn-primary" onClick={fetchDashboard}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const stats = data.stats || [];
  const attendance = data.attendance || [];
  const monthlyData = data.monthlyData || [];
  const distribution = data.distribution || [];
  const feeData = data.feeData || [];
  const marksData = data.marksData || [];
  const recent = data.recent || [];

  const chartEmpty = (message) => (
    <div
      className="d-flex align-items-center justify-content-center text-muted"
      style={{ height: 280 }}
    >
      {message}
    </div>
  );

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h2 className="fw-bold">
            {role?.toUpperCase()} Dashboard
          </h2>

          <h5>
            Welcome, {user.name || user.fullName || "User"} 👋
          </h5>

          <p className="text-muted mb-0">
            School Management System Overview
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchDashboard}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="row mb-4">
        {stats.map((item, index) => (
          <div
            className="col-xl-3 col-lg-4 col-md-6 mb-3"
            key={index}
          > 
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">
                      {item.title}
                    </p>

                    <h3 className="fw-bold mb-1">
                      {item.value ?? 0}
                    </h3>

                    {item.subtitle && (
                      <small className="text-muted">
                        {item.subtitle}  
                      </small>
                    )}
                  </div>

                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                    style={{
                      width: 55,
                      height: 55,
                      fontSize: 25,
                    }}
                  >
                    {item.icon || "📊"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MONTHLY OVERVIEW */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            {data.monthlyTitle || "Monthly Overview"}
          </h5>

          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                {data.monthlyKeys?.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.15}
                    strokeWidth={3}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            chartEmpty("No monthly data available")
          )}
        </div>
      </div>

      <div className="row">

        {/* ATTENDANCE */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                Attendance Overview
              </h5>

              {attendance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendance}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="present"
                      name="Present"
                      fill="#198754"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="absent"
                      name="Absent"
                      fill="#dc3545"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="leave"
                      name="Leave"
                      fill="#ffc107"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                chartEmpty("No attendance data available")
              )}
            </div>
          </div>
        </div>

        {/* DISTRIBUTION */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                {data.distributionTitle || "Class Distribution"}
              </h5>

              {distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      innerRadius={55}
                      paddingAngle={3}
                      label
                    >
                      {distribution.map((item, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                chartEmpty("No distribution data available")
              )}
            </div>
          </div>
        </div>

        {/* FEES */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                Fee Collection Overview
              </h5>

              {feeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={feeData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="collected"
                      name="Collected"
                      fill="#198754"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="pending"
                      name="Pending"
                      fill="#ffc107"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                chartEmpty("No fee data available")
              )}
            </div>
          </div>
        </div>

        {/* EXAM PERFORMANCE */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                Exam Performance
              </h5>

              {marksData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marksData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="subject" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="marks"
                      name="Obtained Marks"
                      fill="#0d6efd"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="maxMarks"
                      name="Maximum Marks"
                      fill="#adb5bd"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                chartEmpty("No exam performance data available")
              )}
            </div>
          </div>
        </div>

        {/* EXTRA GRAPH - STUDENT GROWTH */}
        {data.studentGrowth?.length > 0 && (
          <div className="col-lg-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  Student Admission Growth
                </h5>

                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={data.studentGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="students"
                      name="Total Students"
                      stroke="#6f42c1"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* RECENT DATA */}
      {recent.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              {data.recentTitle || "Recent Activity"}
            </h5>

            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    {Object.keys(recent[0]).map((key) => (
                      <th key={key}>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {recent.map((item, index) => (
                    <tr key={item._id || index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i}>
                          {typeof value === "object" && value !== null
                            ? value.name ||
                              value.firstName ||
                              value.subjectName ||
                              JSON.stringify(value)
                            : String(value ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
