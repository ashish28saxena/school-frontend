
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

function TransportReports() {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  const [activeTab, setActiveTab] = useState("monthly-fees");

  const [monthlyFees, setMonthlyFees] = useState([]);
  const [routeStudents, setRouteStudents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [month, setMonth] = useState(currentMonth);
  const [date, setDate] = useState(today);
  const [vehicleId, setVehicleId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const request = async (url) => {
    const response = await fetch(`${API}${url}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to fetch report");
    }

    return result;
  };

  const loadDropdowns = async () => {
    try {
      const [vehicleResult, routeResult] = await Promise.all([
        request("/vehicles"),
        request("/routes"),
      ]);

      setVehicles(vehicleResult.data || []);
      setRoutes(routeResult.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMonthlyFees = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await request(
        `/reports/monthly-fees?month=${month}`
      );

      setMonthlyFees(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await request("/reports/route-students");
      setRouteStudents(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (vehicleId) params.append("vehicleId", vehicleId);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);

      const query = params.toString()
        ? `?${params.toString()}`
        : "";

      const result = await request(
        `/reports/maintenance-expenses${query}`
      );

      setMaintenance(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({ date });

      if (routeId) params.append("routeId", routeId);

      const result = await request(
        `/reports/attendance?${params.toString()}`
      );

      setAttendance(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadReport = () => {
    if (activeTab === "monthly-fees") {
      fetchMonthlyFees();
    } else if (activeTab === "route-students") {
      fetchRouteStudents();
    } else if (activeTab === "maintenance") {
      fetchMaintenance();
    } else if (activeTab === "attendance") {
      fetchAttendance();
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeTab]);

  const getId = (value) => {
    if (!value) return "";
    return typeof value === "object" ? value._id : value;
  };

  const getStudentName = (student) => {
    if (!student) return "-";

    if (typeof student === "object") {
      return `${student.firstName || ""} ${
        student.lastName || ""
      }`.trim() || "-";
    }

    return student;
  };

  const getVehicleName = (vehicle) => {
    if (!vehicle) return "-";

    if (typeof vehicle === "object") {
      return vehicle.vehicleNumber || "-";
    }

    return vehicle;
  };

  const getRouteName = (route) => {
    if (!route) return "-";

    if (typeof route === "object") {
      return route.routeName || "-";
    }

    return route;
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const printReport = () => {
    window.print();
  };

  const totalCollected = monthlyFees.reduce(
    (sum, item) => sum + Number(item.amountPaid || 0),
    0
  );

  const totalPending = monthlyFees.reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  );

  const totalMaintenance = maintenance.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalStudents = routeStudents.reduce(
    (sum, item) => sum + Number(item.totalStudents || 0),
    0
  );

  const totalAttendance = attendance.reduce(
    (sum, item) => sum + Number(item.totalStudents || 0),
    0
  );

  const totalPicked = attendance.reduce(
    (sum, item) => sum + Number(item.pickedStudents || 0),
    0
  );

  const totalAbsent = attendance.reduce(
    (sum, item) => sum + Number(item.absentStudents || 0),
    0
  );

  return (
    <div className="container-fluid py-3">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3>Transport Reports & Analytics</h3>
          <p className="text-muted mb-0">
            View transport fees, routes, maintenance and attendance reports.
          </p>
        </div>

        <button
          className="btn btn-dark no-print"
          onClick={printReport}
        >
          Print Report
        </button>
      </div>

      {error && (
        <div className="alert alert-danger no-print">
          {error}
        </div>
      )}

      {/* Report Tabs */}
      <div className="card shadow-sm mb-3 no-print">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn ${
                activeTab === "monthly-fees"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("monthly-fees")}
            >
              Monthly Fee Report
            </button>

            <button
              className={`btn ${
                activeTab === "route-students"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("route-students")}
            >
              Route-wise Students
            </button>

            <button
              className={`btn ${
                activeTab === "maintenance"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("maintenance")}
            >
              Maintenance Expenses
            </button>

            <button
              className={`btn ${
                activeTab === "attendance"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("attendance")}
            >
              Attendance Report
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info no-print">
          Loading report...
        </div>
      )}

      {/* Monthly Fee Report */}
      {activeTab === "monthly-fees" && (
        <>
          <div className="card shadow-sm mb-3 no-print">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Select Month</label>
                  <input
                    type="month"
                    className="form-control"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>

                <div className="col-md-2">
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchMonthlyFees}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Total Collected</h6>
                  <h4 className="text-success">
                    {formatAmount(totalCollected)}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Total Pending</h6>
                  <h4 className="text-danger">
                    {formatAmount(totalPending)}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Total Invoices</h6>
                  <h4>{monthlyFees.length}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Monthly Transport Fee Collection</h5>
            </div>

            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Student</th>
                    <th>Route</th>
                    <th>Month</th>
                    <th>Amount Due</th>
                    <th>Amount Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyFees.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No fee records found
                      </td>
                    </tr>
                  ) : (
                    monthlyFees.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{getStudentName(item.studentId)}</td>
                        <td>{getRouteName(item.routeId)}</td>
                        <td>{item.billingMonth || month}</td>
                        <td>{formatAmount(item.amountDue)}</td>
                        <td>{formatAmount(item.amountPaid)}</td>
                        <td>{formatAmount(item.balance)}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.paymentStatus === "Paid"
                                ? "bg-success"
                                : item.paymentStatus === "Partial"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {item.paymentStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Route-wise Students */}
      {activeTab === "route-students" && (
        <>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Total Assigned Students</h6>
                  <h4>{totalStudents}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Total Routes</h6>
                  <h4>{routeStudents.length}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Route-wise Student Report</h5>
            </div>

            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Route</th>
                    <th>Starting Point</th>
                    <th>Ending Point</th>
                    <th>Total Students</th>
                  </tr>
                </thead>

                <tbody>
                  {routeStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No route data found
                      </td>
                    </tr>
                  ) : (
                    routeStudents.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>{item.routeName || getRouteName(item.routeId)}</td>
                        <td>{item.startingPoint || "-"}</td>
                        <td>{item.endingPoint || "-"}</td>
                        <td>{item.totalStudents || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Maintenance Expense Report */}
      {activeTab === "maintenance" && (
        <>
          <div className="card shadow-sm mb-3 no-print">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Vehicle</label>
                  <select
                    className="form-select"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                  >
                    <option value="">All Vehicles</option>
                    {vehicles.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.vehicleNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchMaintenance}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6>Total Maintenance Expense</h6>
              <h4 className="text-danger">
                {formatAmount(totalMaintenance)}
              </h4>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Vehicle Maintenance Expenses</h5>
            </div>

            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Service Date</th>
                    <th>Workshop</th>
                    <th>Odometer</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {maintenance.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No maintenance records found
                      </td>
                    </tr>
                  ) : (
                    maintenance.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{getVehicleName(item.vehicleId)}</td>
                        <td>{item.maintenanceType}</td>
                        <td>
                          {item.serviceDate
                            ? new Date(item.serviceDate).toLocaleDateString("en-IN")
                            : "-"}
                        </td>
                        <td>{item.workshopName || "-"}</td>
                        <td>{item.odometerReading ?? "-"}</td>
                        <td>{formatAmount(item.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Attendance Report */}
      {activeTab === "attendance" && (
        <>
          <div className="card shadow-sm mb-3 no-print">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Attendance Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Route</label>
                  <select
                    className="form-select"
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                  >
                    <option value="">All Routes</option>
                    {routes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.routeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchAttendance}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Total Students</h6>
                  <h4>{totalAttendance}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Picked Students</h6>
                  <h4 className="text-success">{totalPicked}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6>Absent Students</h6>
                  <h4 className="text-danger">{totalAbsent}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Daily Transport Attendance Report</h5>
            </div>

            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>S.No.</th>
                    <th>Route</th>
                    <th>Total Students</th>
                    <th>Picked</th>
                    <th>Absent</th>
                    <th>Dropped</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No attendance data found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>{item.routeName || getRouteName(item.routeId)}</td>
                        <td>{item.totalStudents || 0}</td>
                        <td>{item.pickedStudents || 0}</td>
                        <td>{item.absentStudents || 0}</td>
                        <td>{item.droppedStudents || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TransportReports;