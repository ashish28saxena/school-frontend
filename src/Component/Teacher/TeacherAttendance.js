import React, { useState, useEffect, useCallback } from "react";

const API = "https://school-management-backend-ochre.vercel.app";

const todayString = () => new Date().toISOString().split("T")[0];

// Current time as "YYYY-MM-DDTHH:mm" in local time (for datetime-local inputs)
const getCurrentDateTime = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const TeacherAttendance = () => {
  const [date, setDate] = useState(todayString());
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load teachers + any attendance already saved for the selected date
  const loadAttendance = useCallback(async (selectedDate, isCancelled = () => false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API}/api/teacherAttendance/date/${selectedDate}`
      );
      const result = await response.json();
      if (isCancelled()) return;

      const formatted = (result.data || []).map((row) => ({
        attendanceId: row.attendanceId || null,
        teacherID: row.teacherId,
        teacherName: `${row.teacher?.firstName || ""} ${row.teacher?.lastName || ""}`.trim(),
        mobileNumber: row.teacher?.mobileNumber || "",
        status: row.status || "",
        checkIn: row.checkIn || "",
        checkOut: row.checkOut || "",
        remarks: row.remarks || "",
      }));

      setAttendanceData(formatted);
    } catch (err) {
      if (isCancelled()) return;
      setAttendanceData([]);
      setMessage("Could not load attendance. Check that the server is running.");
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  }, []);

  // Re-fetch whenever the date changes
  useEffect(() => {
    let cancelled = false;
    setMessage("");
    loadAttendance(date, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [date, loadAttendance]);

  const updateRow = (teacherID, changes) => {
    setAttendanceData((prev) =>
      prev.map((row) =>
        row.teacherID === teacherID ? { ...row, ...changes } : row
      )
    );
  };

  const handleStatusChange = (teacherID, status) => {
    const clearTimes = status === "Absent" || status === "Leave";
    updateRow(teacherID, {
      status,
      ...(clearTimes ? { checkIn: "", checkOut: "" } : {}),
    });
  };

  const markAllPresent = () => {
    setAttendanceData((prev) => prev.map((row) => ({ ...row, status: "Present" })));
  };

  // Discard unsaved edits and reload what is stored for this date
  const resetChanges = () => {
    setMessage("");
    loadAttendance(date);
  };

  const handleCheckIn = (teacherID) => {
    const row = attendanceData.find((r) => r.teacherID === teacherID);
    updateRow(teacherID, {
      checkIn: getCurrentDateTime(),
      status: row?.status || "Present",
    });
  };

  const handleCheckOut = (teacherID) => {
    updateRow(teacherID, { checkOut: getCurrentDateTime() });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");

    const payload = {
      attendanceDate: date,
      attendance: attendanceData.map((t) => ({
        attendanceId: t.attendanceId,
        teacherID: t.teacherID,
        status: t.status,
        checkIn: t.checkIn,
        checkOut: t.checkOut,
        remarks: t.remarks,
      })),
    };

    try {
      const response = await fetch(`${API}/api/teacherAttendance/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Attendance saved");
        // Reload so new records get their attendanceId
        await loadAttendance(date);
      } else {
        setMessage(
          typeof result.message === "string" ? result.message : "Something went wrong"
        );
      }
    } catch (err) {
      setMessage("Could not reach the server");
    } finally {
      setSaving(false);
    }
  };

  const count = (status) => attendanceData.filter((t) => t.status === status).length;

  return (
    <div className="container-fluid p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Teacher Attendance</h3>
          <p className="text-muted mb-0">Manage daily teacher attendance</p>
        </div>

        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={saving || loading || attendanceData.length === 0}
        >
          <i className="bi bi-save me-2"></i>
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>

      {/* Date Filter */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Attendance Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-8 text-md-end mt-3 mt-md-0">
              <button
                className="btn btn-outline-primary me-2"
                onClick={markAllPresent}
                disabled={loading}
              >
                Mark All Present
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={resetChanges}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <SummaryCard title="Total Teachers" count={attendanceData.length} color="primary" />
        <SummaryCard title="Present" count={count("Present")} color="success" />
        <SummaryCard title="Absent" count={count("Absent")} color="danger" />
        <SummaryCard title="Leave" count={count("Leave")} color="warning" />
        <SummaryCard title="Half Day" count={count("Half Day")} color="info" />
      </div>

      {/* Attendance Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Teacher Attendance List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Teacher Name</th>
                  <th>Mobile Number</th>
                  <th>Attendance Status</th>
                  <th>CheckIn</th>
                  <th>CheckOut</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Loading attendance...
                    </td>
                  </tr>
                )}

                {!loading && attendanceData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No teachers found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  attendanceData.map((item, index) => {
                    const noTimes = item.status === "Absent" || item.status === "Leave";
                    return (
                      <tr key={item.teacherID}>
                        <td>{index + 1}</td>
                        <td>{item.teacherName}</td>
                        <td>{item.mobileNumber}</td>

                        <td>
                          <select
                            className="form-select"
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.teacherID, e.target.value)
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Leave">Leave</option>
                            <option value="Half Day">Half Day</option>
                          </select>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={item.checkIn}
                              readOnly
                            />
                            <button
                              className="btn btn-success"
                              type="button"
                              disabled={noTimes || !!item.checkIn}
                              onClick={() => handleCheckIn(item.teacherID)}
                            >
                              In
                            </button>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={item.checkOut}
                              readOnly
                            />
                            <button
                              className="btn btn-danger"
                              type="button"
                              disabled={noTimes || !item.checkIn || !!item.checkOut}
                              onClick={() => handleCheckOut(item.teacherID)}
                            >
                              Out
                            </button>
                          </div>
                        </td>

                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.remarks}
                            onChange={(e) =>
                              updateRow(item.teacherID, { remarks: e.target.value })
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <button
              className="btn btn-primary px-4"
              onClick={handleSubmit}
              disabled={saving || loading || attendanceData.length === 0}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>

          {message && <div className="success-message mt-3">✓ {message}</div>}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, color }) => (
  <div className="col-xl col-md-4 col-6">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <p className="text-muted mb-2">{title}</p>
        <h3 className={`text-${color} fw-bold mb-0`}>{count}</h3>
      </div>
    </div>
  </div>
);

export default TeacherAttendance;