import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API = "https://school-management-backend-ochre.vercel.app/api/dashboard/admin";

const admissionDemo = [
  { month: "Jan", students: 35 },
  { month: "Feb", students: 42 },
  { month: "Mar", students: 55 },
  { month: "Apr", students: 68 },
  { month: "May", students: 48 },
  { month: "Jun", students: 75 },
  { month: "Jul", students: 92 },
  { month: "Aug", students: 65 },
  { month: "Sep", students: 80 },
  { month: "Oct", students: 58 },
  { month: "Nov", students: 72 },
  { month: "Dec", students: 45 },
];

const attendanceDemo = [
  { month: "Jan", present: 920, absent: 130 },
  { month: "Feb", present: 950, absent: 110 },
  { month: "Mar", present: 980, absent: 120 },
  { month: "Apr", present: 890, absent: 160 },
  { month: "May", present: 1000, absent: 100 },
  { month: "Jun", present: 940, absent: 140 },
];

const feesDemo = [
  { month: "Jan", collected: 450000, pending: 120000 },
  { month: "Feb", collected: 520000, pending: 100000 },
  { month: "Mar", collected: 680000, pending: 180000 },
  { month: "Apr", collected: 750000, pending: 150000 },
  { month: "May", collected: 600000, pending: 200000 },
  { month: "Jun", collected: 820000, pending: 140000 },
];

const classDemo = [
  { name: "Class 1", value: 120 },
  { name: "Class 2", value: 110 },
  { name: "Class 3", value: 105 },
  { name: "Class 4", value: 95 },
  { name: "Class 5", value: 100 },
  { name: "Class 6", value: 90 },
  { name: "Class 7", value: 85 },
  { name: "Class 8", value: 80 },
];

const genderDemo = [
  { name: "Male", value: 650 },
  { name: "Female", value: 550 },
];

const marksDemo = [
  { subject: "English", marks: 78 },
  { subject: "Hindi", marks: 82 },
  { subject: "Math", marks: 75 },
  { subject: "Science", marks: 88 },
  { subject: "Computer", marks: 92 },
  { subject: "Social", marks: 80 },
];

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Dashboard data failed");
        }

        setDashboard(result.data || result);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStat = (title, fallback) => {
    const stat = dashboard?.stats?.find(
      (item) => item.title?.toLowerCase() === title.toLowerCase()
    );

    return stat?.value ?? fallback;
  };

  const admissions =
    dashboard?.monthlyData?.length > 0
      ? dashboard.monthlyData
      : admissionDemo;

  const classDistribution =
    dashboard?.distribution?.length > 0
      ? dashboard.distribution
      : classDemo;

  const attendance =
    dashboard?.attendance?.length > 0
      ? dashboard.attendance
      : attendanceDemo;

  const feeData =
    dashboard?.feeData?.length > 0
      ? dashboard.feeData
      : feesDemo;

  const marks =
    dashboard?.marksData?.length > 0
      ? dashboard.marksData
      : marksDemo;

  const recentStudents = dashboard?.recent || [];

  const cards = [
    {
      title: "Total Students",
      value: getStat("Total Students", 1250),
      icon: "🎓",
      color: "#4e73df",
    },
    {
      title: "Total Teachers",
      value: getStat("Total Teachers", 85),
      icon: "👨‍🏫",
      color: "#1cc88a",
    },
    {
      title: "Total Parents",
      value: getStat("Total Parents", 980),
      icon: "👪",
      color: "#36b9cc",
    },
    {
      title: "Total Classes",
      value: getStat("Total Classes", 24),
      icon: "🏫",
      color: "#f6c23e",
    },
    {
      title: "Today's Attendance",
      value: getStat("Today's Attendance", "94%"),
      icon: "📋",
      color: "#e74a3b",
    },
    {
      title: "Fees Collected",
      value: getStat("Fees Collected", "₹8.5L"),
      icon: "💰",
      color: "#20c997",
    },
    {
      title: "Pending Fees",
      value: getStat("Pending Fees", "₹2.3L"),
      icon: "⏳",
      color: "#fd7e14",
    },
    {
      title: "Active Vehicles",
      value: getStat("Active Vehicles", 18),
      icon: "🚌",
      color: "#6f42c1",
    },
  ];

  if (loading) {
    return (
      <div className="container-fluid p-4 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">
            School overview and analytics
          </p>
        </div>

        <div className="badge bg-primary fs-6 mt-2">
          Academic Year 2026-27
        </div>
      </div>

      {error && (
        <div className="alert alert-warning">
          Dashboard API unavailable. Demo values are being displayed.
          <br />
          <small>{error}</small>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {cards.map((card, index) => (
          <div className="col-12 col-sm-6 col-xl-3" key={index}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderLeft: `5px solid ${card.color}` }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small fw-semibold">
                      {card.title}
                    </div>
                    <h3 className="fw-bold mt-2 mb-0">
                      {card.value}
                    </h3>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      background: card.color + "20",
                      width: 55,
                      height: 55,
                      fontSize: 26,
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="row g-3 mb-4">
        {/* Admission Chart */}
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold py-3">
              Student Admission Trend
            </div>

            <div className="card-body">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={admissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="students"
                    name="Admissions"
                    stroke="#4e73df"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Class Distribution */}
        <div className="col-12 col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold py-3">
              Class-wise Students
            </div>

            <div className="card-body">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={classDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {classDistribution.map((entry, index) => (
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
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row g-3 mb-4">
        {/* Fee Collection */}
        <div className="col-12 col-xl-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold py-3">
              Monthly Fee Collection
            </div>

            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />

                  <Bar
                    dataKey="collected"
                    name="Collected"
                    fill="#1cc88a"
                    radius={[5, 5, 0, 0]}
                  />

                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="#f6c23e"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="col-12 col-xl-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold py-3">
              Attendance Overview
            </div>

            <div className="card-body">
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
                    fill="#1cc88a"
                  />

                  <Bar
                    dataKey="absent"
                    name="Absent"
                    fill="#e74a3b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="row g-3 mb-4">
        {/* Exam Performance */}
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold py-3">
              Subject-wise Exam Performance
            </div>

            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="marks"
                    name="Average Marks (%)"
                    fill="#6366f1"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="col-12 col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold py-3">
              Gender Distribution
            </div>

            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderDemo}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={105}
                    label
                  >
                    {genderDemo.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions Table */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white fw-bold py-3">
          Recent Student Admissions
        </div>

        <div className="card-body table-responsive">
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Admission Number</th>
                <th>Class</th>
                <th>Admission Date</th>
              </tr>
            </thead>

            <tbody>
              {recentStudents.length > 0 ? (
                recentStudents.map((student, index) => (
                  <tr key={student._id || index}>
                    <td>{index + 1}</td>
                    <td>{student.name || student.studentName || "-"}</td>
                    <td>{student.admissionNumber || "-"}</td>
                    <td>
                      {student.className?.className ||
                        student.className ||
                        "-"}
                    </td>
                    <td>
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No recent admission data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo data notice */}
      <div className="text-muted small text-center pb-3">
        Charts with unavailable backend data currently display sample data.
      </div>
    </div>
  );
};

export default Home;
