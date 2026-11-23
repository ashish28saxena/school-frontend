
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

function StudentTimetable() {
  const [students, setStudents] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [studentAssignment, setStudentAssignment] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
   const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API}/student/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setStudents(result.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getStudentName = (student) => {
    if (!student) return "-";

    return (
      student.studentName ||
      `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
      "-"
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("Please select Student");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/timetable/student/${studentId}?academicYear=${academicYear}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      const result = await response.json();

      if (!response.ok) {
        setTimetables([]);
        setStudentAssignment(null);
        setSearched(true);
        alert(result.message || "Timetable not found");
        return;
      }

      setTimetables(result.data || []);
      setStudentAssignment(result.assignment || null);
      setSearched(true);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = students.find(
    (item) => item._id === studentId
  );

  const getClassName = (item) =>
    item.classId?.className || "-";

  const getSectionName = (item) =>
    item.sectionId?.sectionName || "-";

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Student Timetable</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Search Student Timetable</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row">

              <div className="col-md-4 mb-3">
                <label className="form-label">Academic Year</label>
                <select
                  className="form-select"
                  value={academicYear}
                  onChange={(e) => {
                    setAcademicYear(e.target.value);
                    setSearched(false);
                  }}
                >
                  {Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, index) => {
                  const startYear = 2020 + index;
                  const endYear = startYear + 1;
                  const year = `${startYear}-${String(endYear).slice(-2)}`;

                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Student</label>
                <select
                  className="form-select"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    setSearched(false);
                  }}
                  required
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {getStudentName(student)}
                      {student.admissionNumber
                        ? ` (${student.admissionNumber})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Search Timetable"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {searched && (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Weekly Student Timetable</h5>
              <small>
                Student: {getStudentName(selectedStudent)} |
                Academic Year: {academicYear}
              </small>
            </div>

            <button
              className="btn btn-success btn-sm"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>

          <div className="card-body">

            {timetables.length > 0 ? (
              <>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Class:</strong>{" "}
                    {getClassName(timetables[0])}
                  </div>

                  <div className="col-md-4">
                    <strong>Section:</strong>{" "}
                    {getSectionName(timetables[0])}
                  </div>

                  <div className="col-md-4">
                    <strong>Admission No:</strong>{" "}
                    {selectedStudent?.admissionNumber || "-"}
                  </div>
                </div>

                {days.map((day) => {
                  const dayData = timetables.find(
                    (item) => item.day === day
                  );

                  if (!dayData || !dayData.periods?.length) {
                    return null;
                  }

                  return (
                    <div className="mb-4" key={day}>
                      <h5 className="text-primary">{day}</h5>

                      <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Period</th>
                              <th>Time</th>
                              <th>Subject</th>
                              <th>Teacher</th>
                              <th>Room</th>
                            </tr>
                          </thead>

                          <tbody>
                            {dayData.periods.map((period, index) => (
                              <tr key={index}>
                                <td>{period.periodNumber}</td>
                                <td>
                                  {period.startTime} - {period.endTime}
                                </td>
                                <td>
                                  {period.periodType === "Teaching"
                                    ? period.subjectId?.subjectName || "-"
                                    : period.periodType}
                                </td>
                                <td>
                                  {period.teacherID
                                    ? `${period.teacherID.firstName || ""} ${
                                        period.teacherID.lastName || ""
                                      }`.trim() ||
                                      period.teacherID.teacherName ||
                                      "-"
                                    : "-"}
                                </td>
                                <td>{period.roomNumber || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="alert alert-warning text-center">
                No timetable found for this student.
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default StudentTimetable;
