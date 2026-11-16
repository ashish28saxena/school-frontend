
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

function TeacherTimetable() {
  const [teachers, setTeachers] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [teacherID, setTeacherID] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API}/teacher/`);
      const result = await response.json();
      setTeachers(result.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return "-";

    return (
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      teacher.teacherName ||
      teacher.name ||
      "-"
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!teacherID) {
      alert("Please select Teacher");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/timetable/teacher/${teacherID}?academicYear=${academicYear}`
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Unable to fetch timetable");
        return;
      }

      setTimetables(result.data || []);
      setSearched(true);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const selectedTeacher = teachers.find(
    (item) => item._id === teacherID
  );

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Teacher Timetable</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Search Teacher Timetable</h5>
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
                <label className="form-label">Teacher</label>
                <select
                  className="form-select"
                  value={teacherID}
                  onChange={(e) => {
                    setTeacherID(e.target.value);
                    setSearched(false);
                  }}
                  required
                >
                  <option value="">Select Teacher</option>

                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {getTeacherName(teacher)}
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
              <h5 className="mb-1">Weekly Teacher Schedule</h5>
              <small>
                Teacher: {getTeacherName(selectedTeacher)} |
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
              days.map((day) => {
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
                            <th>Class</th>
                            <th>Section</th>
                            <th>Subject</th>
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
                              <td>{dayData.className || "-"}</td>
                              <td>{dayData.sectionName || "-"}</td>
                              <td>
                                {period.periodType === "Teaching"
                                  ? period.subjectId?.subjectName || "-"
                                  : period.periodType}
                              </td>
                              <td>{period.roomNumber || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="alert alert-warning text-center">
                No timetable found for this teacher.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherTimetable;
