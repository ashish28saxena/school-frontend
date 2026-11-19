
import React, { useEffect, useMemo, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const today = new Date().toISOString().slice(0, 10);

const initialAttendance = {
  pickupStatus: "Pending",
  pickupTime: "",
  dropStatus: "Pending",
  dropTime: "",
  remarks: "",
};

const getId = (value) =>
  typeof value === "object" && value !== null ? value._id : value || "";

const getStudentName = (student) =>
  `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "-";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
};

const TransportAttendance = () => {
  const [routes, setRoutes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [routeId, setRouteId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(today);

  const [historyStudentId, setHistoryStudentId] = useState("");
  const [studentHistory, setStudentHistory] = useState([]);

  const [activeTab, setActiveTab] = useState("daily");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      headers: {
        "Content-Type": "application/json",
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

  // Load routes and active student transport assignments
  const loadInitialData = async () => {
    try {
      const [routeRes, assignmentRes] = await Promise.all([
        request("/routes"),
        request("/student-transports"),
      ]);

      setRoutes(routeRes.data || []);
      setAssignments(assignmentRes.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch attendance for selected date and route
  const fetchAttendance = async () => {
    if (!routeId || !attendanceDate) {
      setAttendance([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await request(
        `/attendance?date=${attendanceDate}&routeId=${routeId}`
      );

      setAttendance(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [routeId, attendanceDate]);

  // Students assigned to the selected route
  const routeStudents = useMemo(() => {
    return assignments.filter(
      (item) =>
        getId(item.routeId) === routeId &&
        item.status !== false
    );
  }, [assignments, routeId]);

  // Map existing attendance by student transport assignment
  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach((item) => {
      map[getId(item.studentTransportId)] = item;
    });

    return map;
  }, [attendance]);

  const updateLocalAttendance = (assignmentId, field, value) => {
    setAttendance((prev) => {
      const existingIndex = prev.findIndex(
        (item) => getId(item.studentTransportId) === assignmentId
      );

      if (existingIndex === -1) {
        return [
          ...prev,
          {
            _id: `local-${assignmentId}`,
            studentTransportId: assignmentId,
            ...initialAttendance,
            [field]: value,
          },
        ];
      }

      return prev.map((item, index) =>
        index === existingIndex
          ? { ...item, [field]: value }
          : item
      );
    });
  };

  // Save new attendance or update existing attendance
  const handleSaveAttendance = async (assignment) => {
    const assignmentId = assignment._id;
    const existing = attendanceMap[assignmentId];

    const payload = {
      studentTransportId: assignmentId,
      attendanceDate,
      pickupStatus: existing?.pickupStatus || "Pending",
      pickupTime: existing?.pickupTime || "",
      dropStatus: existing?.dropStatus || "Pending",
      dropTime: existing?.dropTime || "",
      remarks: existing?.remarks || "",
    };

    try {
      setSavingId(assignmentId);
      setError("");
      setSuccess("");

      let result;

      if (existing?._id && !String(existing._id).startsWith("local-")) {
        result = await request(`/attendance/update/${existing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        result = await request("/attendance/submit", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setSuccess(
        result.message || "Attendance saved successfully."
      );

      await fetchAttendance();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId("");
    }
  };

  // Save all students one by one
  const handleSaveAll = async () => {
    if (!routeId || !attendanceDate) {
      setError("Please select route and date.");
      return;
    }

    if (routeStudents.length === 0) {
      setError("No students assigned to this route.");
      return;
    }

    setError("");
    setSuccess("");

    let saved = 0;
    let failed = 0;

    for (const assignment of routeStudents) {
      const existing = attendanceMap[assignment._id];

      const payload = {
        studentTransportId: assignment._id,
        attendanceDate,
        pickupStatus: existing?.pickupStatus || "Pending",
        pickupTime: existing?.pickupTime || "",
        dropStatus: existing?.dropStatus || "Pending",
        dropTime: existing?.dropTime || "",
        remarks: existing?.remarks || "",
      };

      try {
        if (existing?._id && !String(existing._id).startsWith("local-")) {
          await request(`/attendance/update/${existing._id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
        } else {
          await request("/attendance/submit", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }

        saved++;
      } catch (err) {
        failed++;
      }
    }

    await fetchAttendance();

    if (failed === 0) {
      setSuccess(`Attendance saved for ${saved} students.`);
    } else {
      setError(
        `Saved: ${saved}, Failed: ${failed}. Please refresh and check the failed records.`
      );
    }
  };

  // Student-wise attendance history
  const fetchStudentHistory = async (studentId) => {
    setStudentHistory([]);
    setHistoryStudentId(studentId);

    if (!studentId) return;

    try {
      setLoading(true);
      const result = await request(`/attendance/student/${studentId}`);
      setStudentHistory(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = routeStudents.filter((assignment) => {
    const student = assignment.studentId || {};
    const name = getStudentName(student);

    return `${name} ${assignment.rollNumber || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const pickedCount = attendance.filter(
    (item) => item.pickupStatus === "Picked"
  ).length;

  const pickupAbsentCount = attendance.filter(
    (item) => item.pickupStatus === "Absent"
  ).length;

  const droppedCount = attendance.filter(
    (item) => item.dropStatus === "Dropped"
  ).length;

  const getStatusBadge = (status) => {
    const classes = {
      Pending: "bg-secondary",
      Picked: "bg-success",
      Dropped: "bg-success",
      Absent: "bg-danger",
    };

    return (
      <span className={`badge ${classes[status] || "bg-secondary"}`}>
        {status || "Pending"}
      </span>
    );
  };

  const selectedRoute = routes.find((item) => item._id === routeId);

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Transport Attendance Management</h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={fetchAttendance}
          disabled={loading}
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

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "daily" ? "active" : ""}`}
            onClick={() => setActiveTab("daily")}
          >
            Daily Attendance
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Student History
          </button>
        </li>
      </ul>

      {activeTab === "daily" && (
        <>
          {/* Filters */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Select Route *</label>

                  <select
                    className="form-select"
                    value={routeId}
                    onChange={(e) => {
                      setRouteId(e.target.value);
                      setAttendance([]);
                    }}
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
                  <label className="form-label">Attendance Date *</label>

                  <input
                    type="date"
                    className="form-control"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Search Student</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search name or roll number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {selectedRoute && (
                <p className="mb-0 text-muted">
                  Selected Route: <strong>{selectedRoute.routeName}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          {routeId && (
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted">Total Students</h6>
                    <h4>{routeStudents.length}</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted">Picked Up</h6>
                    <h4 className="text-success">{pickedCount}</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted">Pickup Absent</h6>
                    <h4 className="text-danger">{pickupAbsentCount}</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted">Dropped</h6>
                    <h4 className="text-success">{droppedCount}</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Daily Student Attendance</h5>

              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={handleSaveAll}
                disabled={!routeId || loading || routeStudents.length === 0}
              >
                Save All Attendance
              </button>
            </div>

            <div className="card-body">
              {!routeId ? (
                <div className="alert alert-info">
                  Please select a route to load assigned students.
                </div>
              ) : loading ? (
                <p className="text-center">Loading attendance...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Sr.</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Pickup Status</th>
                        <th>Pickup Time</th>
                        <th>Drop Status</th>
                        <th>Drop Time</th>
                        <th>Remarks</th>
                        <th>Saved Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((assignment, index) => {
                          const item = attendanceMap[assignment._id] || {};
                          const student = assignment.studentId || {};

                          return (
                            <tr key={assignment._id}>
                              <td>{index + 1}</td>

                              <td>{getStudentName(student)}</td>

                              <td>{assignment.rollNumber || "-"}</td>

                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={item.pickupStatus || "Pending"}
                                  onChange={(e) =>
                                    updateLocalAttendance(
                                      assignment._id,
                                      "pickupStatus",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Picked">Picked</option>
                                  <option value="Absent">Absent</option>
                                </select>
                              </td>

                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.pickupTime || ""}
                                  onChange={(e) =>
                                    updateLocalAttendance(
                                      assignment._id,
                                      "pickupTime",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={item.dropStatus || "Pending"}
                                  onChange={(e) =>
                                    updateLocalAttendance(
                                      assignment._id,
                                      "dropStatus",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Dropped">Dropped</option>
                                  <option value="Absent">Absent</option>
                                </select>
                              </td>

                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.dropTime || ""}
                                  onChange={(e) =>
                                    updateLocalAttendance(
                                      assignment._id,
                                      "dropTime",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.remarks || ""}
                                  placeholder="Remarks"
                                  onChange={(e) =>
                                    updateLocalAttendance(
                                      assignment._id,
                                      "remarks",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                {item._id &&
                                !String(item._id).startsWith("local-") ? (
                                  <span className="badge bg-success">
                                    Saved
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark">
                                    Not Saved
                                  </span>
                                )}
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  disabled={savingId === assignment._id}
                                  onClick={() =>
                                    handleSaveAttendance(assignment)
                                  }
                                >
                                  {savingId === assignment._id
                                    ? "Saving..."
                                    : "Save"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No students assigned to this route.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Student History */}
      {activeTab === "history" && (
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Student Transport Attendance History</h5>
          </div>

          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-5">
                <label className="form-label">Select Student</label>

                <select
                  className="form-select"
                  value={historyStudentId}
                  onChange={(e) => fetchStudentHistory(e.target.value)}
                >
                  <option value="">Select Student</option>

                  {assignments.map((item) => (
                    <option
                      key={item._id}
                      value={getId(item.studentId)}
                    >
                      {getStudentName(item.studentId)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sr.</th>
                    <th>Date</th>
                    <th>Route</th>
                    <th>Pickup Status</th>
                    <th>Pickup Time</th>
                    <th>Drop Status</th>
                    <th>Drop Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {studentHistory.length > 0 ? (
                    studentHistory.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{formatDate(item.attendanceDate)}</td>
                        <td>{item.routeId?.routeName || "-"}</td>
                        <td>{getStatusBadge(item.pickupStatus)}</td>
                        <td>{item.pickupTime || "-"}</td>
                        <td>{getStatusBadge(item.dropStatus)}</td>
                        <td>{item.dropTime || "-"}</td>
                        <td>{item.remarks || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        {historyStudentId
                          ? "No attendance history found."
                          : "Please select a student."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportAttendance;
