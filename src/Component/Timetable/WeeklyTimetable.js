
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function WeeklyTimetable() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
  });

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, sectionRes] = await Promise.all([
        fetch(`${API}/class/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
        fetch(`${API}/section/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      ]);

      const classData = await classRes.json();
      const sectionData = await sectionRes.json();

      setClasses(classData || []);
      setSections(sectionData.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSections = sections.filter(
    (section) =>
      String(section.classId?._id || section.classId) ===
      filters.classId
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));

    setTimetables([]);
    setSearched(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!filters.classId || !filters.sectionId) {
      alert("Please select Class and Section");
      return;
    }

    try {
      setLoading(true);

      const query = new URLSearchParams({
        classId: filters.classId,
        sectionId: filters.sectionId,
        academicYear: filters.academicYear,
      });

      const response = await fetch(
        `${API}/timetable/filter?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Unable to fetch timetable");
        return;
      }

      setTimetables(
        (result.data || []).filter((item) => item.status !== false)
      );

      setSearched(true);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Find timetable for selected day
  const getDayTimetable = (day) => {
    return timetables.find((item) => item.day === day);
  };

  // Find a period by period number
  const getPeriod = (day, periodNumber) => {
    const timetable = getDayTimetable(day);

    return timetable?.periods?.find(
      (period) => Number(period.periodNumber) === periodNumber
    );
  };

  // Find maximum periods in the selected week
  const maxPeriods = Math.max(
    0,
    ...timetables.map((item) =>
      item.periods?.length || 0
    )
  );

  const getTeacherName = (teacher) => {
    if (!teacher) return "-";

    return (
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      teacher.teacherName ||
      teacher.name ||
      "-"
    );
  };

  const selectedClass = classes.find(
    (item) => item._id === filters.classId
  );

  const selectedSection = sections.find(
    (item) => item._id === filters.sectionId
  );

  return (
    <div className="container-fluid py-4">

      <h3 className="mb-4">Weekly Timetable View</h3>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Select Class and Section</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row">

              <div className="col-md-3 mb-3">
                <label className="form-label">Academic Year</label>
                <select
                  className="form-select"
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleChange}
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

              <div className="col-md-3 mb-3">
                <label className="form-label">Class</label>
                <select
                  className="form-select"
                  name="classId"
                  value={filters.classId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>

                  {classes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  name="sectionId"
                  value={filters.sectionId}
                  onChange={handleChange}
                  disabled={!filters.classId}
                  required
                >
                  <option value="">Select Section</option>

                  {sections.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3 d-flex align-items-end">
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

      {/* Weekly Schedule */}
      {searched && (
        <div className="card shadow-sm">

          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Weekly Timetable</h5>
              <small>
                {selectedClass?.className} -{" "}
                {selectedSection?.sectionName} |{" "}
                {filters.academicYear}
              </small>
            </div>

            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => window.print()}
            >
              Print Timetable
            </button>
          </div>

          <div className="card-body table-responsive">

            {timetables.length > 0 && maxPeriods > 0 ? (
              <table className="table table-bordered text-center align-middle weekly-table">

                <thead className="table-light">
                  <tr>
                    <th>Period</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.from(
                    { length: maxPeriods },
                    (_, index) => index + 1
                  ).map((periodNumber) => (
                    <tr key={periodNumber}>

                      <th>
                        Period {periodNumber}
                      </th>

                      {days.map((day) => {
                        const period = getPeriod(
                          day,
                          periodNumber
                        );

                        return (
                          <td key={day}>
                            {period ? (
                              <div>
                                <strong>
                                  {period.periodType === "Teaching"
                                    ? period.subjectId?.subjectName || "-"
                                    : period.periodType}
                                </strong>

                                {period.periodType === "Teaching" && (
                                  <div className="small text-muted">
                                    {getTeacherName(period.teacherID)}
                                  </div>
                                )}

                                <div className="small text-primary">
                                  {period.startTime} - {period.endTime}
                                </div>

                                {period.roomNumber && (
                                  <div className="small text-muted">
                                    Room: {period.roomNumber}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        );
                      })}

                    </tr>
                  ))}
                </tbody>

              </table>
            ) : (
              <div className="alert alert-warning text-center">
                No timetable found for this Class and Section.
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
} 

export default WeeklyTimetable;
