
import React, { useEffect, useMemo, useState } from "react";
import "./StudentAttendance.css";

const API = "https://school-management-backend-ochre.vercel.app/api";

// Change these URLs according to your existing backend routes.
const URLS = {
  classes: `${API}/class`,
  sections: `${API}/section`,
  students: `${API}/student`,
  attendance: `${API}/studentattendance`,
};

const StudentAttendance = () => {
  const today = new Date().toISOString().split("T")[0];

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load classes
  useEffect(() => {
    getClasses();
    getSections();
  }, []);

  const getClasses = async () => {
    try {
      const res = await fetch(URLS.classes);
      const result = await res.json();
      setClasses(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Class loading error:", error);
    }
  };

  const getSections = async () => {
    try {
      const res = await fetch(URLS.sections);
      const result = await res.json();
      setSections(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Section loading error:", error);
    }
  };

  // Load students when class and section are selected
  const getStudents = async () => {
    if (!classId || !sectionId) {
      alert("Please select Class and Section");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        classId,
        sectionId,
      });

      const res = await fetch(`${URLS.students}?${params}`);
      const result = await res.json();

      const studentList = Array.isArray(result)
        ? result
        : result.data || [];

      setStudents(studentList);

      // Default attendance
      setAttendance(
        studentList.map((student) => ({
          studentId: student._id,
          status: "Present",
          remarks: "",
        }))
      );

      // Load existing attendance for selected date
      await getExistingAttendance();
    } catch (error) {
      console.error(error);
      alert("Unable to load students");
    } finally {
      setLoading(false);
    }
  };

  // Load existing attendance
  const getExistingAttendance = async () => {
    try {
      const params = new URLSearchParams({
        classId,
        sectionId,
        attendenceDate: date,
      });

      const res = await fetch(
        `${URLS.attendance}/get?${params}`
      );

      if (!res.ok) return;

      const result = await res.json();

      const existing = result.data?.studentAttendence ||
        result.studentAttendence || [];

      if (existing.length > 0) {
        setAttendance((prev) =>
          prev.map((item) => {
            const oldRecord = existing.find(
              (old) =>
                String(old.studentId?._id || old.studentId) ===
                String(item.studentId)
            );

            return oldRecord
              ? {
                  ...item,
                  status: oldRecord.status,
                  remarks: oldRecord.remarks || "",
                }
              : item;
          })
        );
      }
    } catch (error) {
      console.error("Existing attendance error:", error);
    }
  };

  // Change individual student status
  const changeStatus = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? {
              ...item,
              status,
              ...(status !== "Present"
                ? {}
                : {}),
            }
          : item
      )
    );
  };

  // Remarks
  const changeRemarks = (studentId, remarks) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? { ...item, remarks }
          : item
      )
    );
  };

  // Mark all
  const markAll = (status) => {
    setAttendance((prev) =>
      prev.map((item) => ({
        ...item,
        status,
      }))
    );
  };

  // Search
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = `${student.firstName || ""} ${
        student.lastName || ""
      }`.toLowerCase();

      const admission = (
        student.admissionNumber || ""
      ).toLowerCase();

      return (
        name.includes(search.toLowerCase()) ||
        admission.includes(search.toLowerCase())
      );
    });
  }, [students, search]);

  const getStatus = (studentId) => {
    return (
      attendance.find(
        (item) => item.studentId === studentId
      )?.status || "Present"
    );
  };

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const leaveCount = attendance.filter(
    (item) => item.status === "Leave"
  ).length;

  // Submit attendance
  const handleSubmit = async () => {
    if (!classId || !sectionId || !date) {
      alert("Please select all required fields");
      return;
    }

    if (attendance.length === 0) {
      alert("No students found");
      return;
    }

    const payload = {
      classId,
      sectionId,
      attendenceDate: date,
      studentAttendence: attendance,
    };

    setSaving(true);

    try {
      const res = await fetch(`${URLS.attendance}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Attendance save failed");
      }

      alert(result.message || "Attendance saved successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid student-attendance-page py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="fw-bold mb-1">Student Attendance</h3>
          <p className="text-muted mb-0">
            Manage daily student attendance
          </p>
        </div>

        <span className="badge bg-primary fs-6 p-2">
          Daily Attendance
        </span>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">Attendance Details</h5>
        </div>

        <div className="card-body">
          <div className="row g-3 align-items-end">

            <div className="col-md-3">
              <label className="form-label fw-semibold">
                Select Class
              </label>
              <select
                className="form-select"
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setSectionId("");
                  setStudents([]);
                  setAttendance([]);
                }}
              >
                <option value="">Select Class</option>
                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">
                Select Section
              </label>
              <select
                className="form-select"
                value={sectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setStudents([]);
                  setAttendance([]);
                }}
              >
                <option value="">Select Section</option>
                {sections.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">
                Attendance Date
              </label>
              <input
                type="date"
                className="form-control"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <button
                className="btn btn-primary w-100"
                onClick={getStudents}
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Students"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {students.length > 0 && (
        <>
          <div className="row g-3 mb-4">

            <div className="col-md-3">
              <div className="attendance-summary total">
                <div>
                  <p>Total Students</p>
                  <h3>{students.length}</h3>
                </div>
                <i className="bi bi-people-fill"></i>
              </div>
            </div>

            <div className="col-md-3">
              <div className="attendance-summary present">
                <div>
                  <p>Present</p>
                  <h3>{presentCount}</h3>
                </div>
                <i className="bi bi-check-circle-fill"></i>
              </div>
            </div>

            <div className="col-md-3">
              <div className="attendance-summary absent">
                <div>
                  <p>Absent</p>
                  <h3>{absentCount}</h3>
                </div>
                <i className="bi bi-x-circle-fill"></i>
              </div>
            </div>

            <div className="col-md-3">
              <div className="attendance-summary leave">
                <div>
                  <p>Leave</p>
                  <h3>{leaveCount}</h3>
                </div>
                <i className="bi bi-calendar-check-fill"></i>
              </div>
            </div>

          </div>

          {/* Student List */}
          <div className="card border-0 shadow-sm">

            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h5 className="fw-semibold mb-1">
                    Student List
                  </h5>
                  <small className="text-muted">
                    Mark attendance for each student
                  </small>
                </div>

                <input
                  type="text"
                  className="form-control attendance-search"
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="card-body border-bottom">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markAll("Present")}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Mark All Present
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => markAll("Absent")}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Mark All Absent
                </button>

                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => markAll("Leave")}
                >
                  <i className="bi bi-calendar me-1"></i>
                  Mark All Leave
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th width="60">#</th>
                    <th>Student Name</th>
                    <th>Admission No.</th>
                    <th className="text-center">Attendance Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student, index) => {
                    const status = getStatus(student._id);

                    return (
                      <tr key={student._id}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            
                            {student.StudentPhoto ? (
                              <img
                                src={student.StudentPhoto}
                                alt=""
                                className="student-attendance-photo"
                              />
                            ) : (
                              <div className="student-avatar">
                                {(student.name || "S")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <div className="fw-semibold">
                                {student.firstName} {student.lastName}
                              </div>
                              <small className="text-muted">
                                {student.email || ""}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>{student.admissionNumber || "-"}</td>

                        <td>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            {["Present", "Absent", "Leave"].map(
                              (value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() =>
                                    changeStatus(student._id, value)
                                  }
                                  className={`btn btn-sm attendance-status-btn ${
                                    status === value
                                      ? `active-${value.toLowerCase()}`
                                      : ""
                                  }`}
                                >
                                  {value}
                                </button>
                              )
                            )}
                          </div>
                        </td>

                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Add remarks"
                            value={
                              attendance.find(
                                (item) =>
                                  item.studentId === student._id
                              )?.remarks || ""
                            }
                            onChange={(e) =>
                              changeRemarks(student._id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="card-footer bg-white py-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="text-muted">
                  Total: <strong>{attendance.length}</strong>
                  {" | "}
                  Present: <strong className="text-success">{presentCount}</strong>
                  {" | "}
                  Absent: <strong className="text-danger">{absentCount}</strong>
                  {" | "}
                  Leave: <strong className="text-warning">{leaveCount}</strong>
                </div>

                <button
                  className="btn btn-primary px-4"
                  onClick={handleSubmit}
                  disabled={saving || attendance.length === 0}
                >
                  {saving ? "Saving..." : "Submit Attendance"}
                </button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default StudentAttendance;
