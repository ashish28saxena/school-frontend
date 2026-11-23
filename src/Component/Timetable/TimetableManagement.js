import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const initialPeriod = {
  periodNumber: 1,
  periodType: "Teaching",
  subjectId: "",
  teacherID: "",
  startTime: "09:00",
  endTime: "09:45",
  roomNumber: "",
};

const initialForm = {
  academicYear: "2026-27",
  classId: "",
  sectionId: "",
  day: "Monday",
  periods: [{ ...initialPeriod }],
  status: true,
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function TimetableManagement() {
  const [form, setForm] = useState(initialForm);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState(null);
   const token = localStorage.getItem("token");
  useEffect(() => {
    fetchDropdowns();
    fetchTimetables();
  }, []);

  const handleView = (item) => {
  setViewData(item);
};

  const fetchDropdowns = async () => {
    try {
      const responses = await Promise.all([
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
        fetch(`${API}/subject/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
        fetch(`${API}/teacher/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      ]);

      const data = await Promise.all(
        responses.map((response) => response.json())
      );

      setClasses(data[0]|| []);
      setSections(data[1].data || []);
      setSubjects(data[2].data || []);
      setTeachers(data[3].data || []);
    } catch (error) {
      console.error("Dropdown error:", error);
    }
  };

  const fetchTimetables = async () => {
    try {
      const response = await fetch(`${API}/timetable/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setTimetables(result.data || []);
    } catch (error) {
      console.error("Timetable fetch error:", error);
    }
  };

  const filteredSections = sections.filter(
    (section) =>
      String(section.classId?._id || section.classId) === form.classId
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
  };

  const handlePeriodChange = (index, e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      periods: prev.periods.map((period, i) =>
        i === index
          ? {
              ...period,
              [name]: name === "periodNumber" ? Number(value) : value,
              ...(name === "periodType" && value !== "Teaching"
                ? { subjectId: "", teacherID: "" }
                : {}),
            }
          : period
      ),
    }));
  };

  const addPeriod = () => {
    setForm((prev) => ({
      ...prev,
      periods: [
        ...prev.periods,
        {
          ...initialPeriod,
          periodNumber: prev.periods.length + 1,
        },
      ],
    }));
  };

  const removePeriod = (index) => {
    setForm((prev) => ({
      ...prev,
      periods: prev.periods
        .filter((_, i) => i !== index)
        .map((period, i) => ({
          ...period,
          periodNumber: i + 1,
        })),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      periods: form.periods.map((period, index) => ({
        ...period,
        periodNumber: index + 1,
        subjectId: period.subjectId || null,
        teacherID: period.teacherID || null,
      })),
    };

    try {
      setLoading(true);

      const response = await fetch(
        editId
          ? `${API}/timetable/update/${editId}`
          : `${API}/timetable/submit`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong");
        return;
      }

      alert(result.message);
      resetForm();
      fetchTimetables();
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      academicYear: item.academicYear,
      classId: item.classId?._id || item.classId,
      sectionId: item.sectionId?._id || item.sectionId,
      day: item.day,
      status: item.status,
      periods: item.periods.map((period) => ({
        periodNumber: period.periodNumber,
        periodType: period.periodType,
        subjectId: period.subjectId?._id || period.subjectId || "",
        teacherID: period.teacherID?._id || period.teacherID || "",
        startTime: period.startTime,
        endTime: period.endTime,
        roomNumber: period.roomNumber || "",
      })),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this timetable?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/timetable/delete/${id}`,
        { method: "DELETE",
          headers: {
          Authorization: `Bearer ${token}`,
        }
         }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Delete failed");
        return;
      }

      alert(result.message);
      fetchTimetables();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const teacherName = (teacher) => {
    if (!teacher) return "-";

    return (
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      teacher.teacherName ||
      teacher.name ||
      "-"
    );
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Timetable Management</h3>

      {/* Timetable Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          {editId ? "Update Timetable" : "Create Timetable"}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Academic Year</label>
                
                 <select
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  className="form-select"
                  required
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
                  value={form.classId}
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
                  value={form.sectionId}
                  onChange={handleChange}
                  disabled={!form.classId}
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

              <div className="col-md-3 mb-3">
                <label className="form-label">Day</label>
                <select
                  className="form-select"
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  required
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Period Details</h5>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={addPeriod}
              >
                + Add Period
              </button>
            </div>

            {form.periods.map((period, index) => (
              <div className="border rounded p-3 mb-3" key={index}>
                <div className="d-flex justify-content-between mb-3">
                  <strong>Period {index + 1}</strong>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removePeriod(index)}
                    disabled={form.periods.length === 1}
                  >
                    Remove
                  </button>
                </div>

                <div className="row">
                  <div className="col-md-2 mb-3">
                    <label className="form-label">Period Type</label>
                    <select
                      className="form-select"
                      name="periodType"
                      value={period.periodType}
                      onChange={(e) => handlePeriodChange(index, e)}
                    >
                      <option value="Teaching">Teaching</option>
                      <option value="Break">Break</option>
                      <option value="Lunch">Lunch</option>
                    </select>
                  </div>

                  {period.periodType === "Teaching" && (
                    <>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Subject</label>
                        <select
                          className="form-select"
                          name="subjectId"
                          value={period.subjectId}
                          onChange={(e) => handlePeriodChange(index, e)}
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects
                            .filter((item) => item.status !== false)
                            .map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.subjectName}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="col-md-3 mb-3">
                        <label className="form-label">Teacher</label>
                        <select
                          className="form-select"
                          name="teacherID"
                          value={period.teacherID}
                          onChange={(e) => handlePeriodChange(index, e)}
                          required
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                              {teacherName(teacher)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="col-md-2 mb-3">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="startTime"
                      value={period.startTime}
                      onChange={(e) => handlePeriodChange(index, e)}
                      required
                    />
                  </div>

                  <div className="col-md-2 mb-3">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="endTime"
                      value={period.endTime}
                      onChange={(e) => handlePeriodChange(index, e)}
                      required
                    />
                  </div>

                  <div className="col-md-2 mb-3">
                    <label className="form-label">Room Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="roomNumber"
                      placeholder="Room 101"
                      value={period.roomNumber}
                      onChange={(e) => handlePeriodChange(index, e)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : editId
                ? "Update Timetable"
                : "Save Timetable"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Timetable List */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Timetable List</h5>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Academic Year</th>
                <th>Class</th>
                <th>Section</th>
                <th>Day</th>
                <th>Periods</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {timetables.length > 0 ? (
                timetables.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.academicYear}</td>
                    <td>{item.classId?.className || "-"}</td>
                    <td>{item.sectionId?.sectionName || "-"}</td>
                    <td>{item.day}</td>
                    <td>{item.periods?.length || 0}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      {item.status && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      )}

                      <button
  type="button"
  className="btn btn-info btn-sm me-2 text-white"
  onClick={() => handleView(item)}
>
  View
</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Timetable Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
      </div>
      {viewData && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    style={{ background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-xl modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5 className="modal-title">Timetable Details</h5>

          <button
            type="button"
            className="btn-close"
            onClick={() => setViewData(null)}
          ></button>
        </div>

        <div className="modal-body">

          <div className="row mb-3">
            <div className="col-md-3">
              <strong>Academic Year:</strong>
              <p>{viewData.academicYear}</p>
            </div>

            <div className="col-md-3">
              <strong>Class:</strong>
              <p>{viewData.classId?.className}</p>
            </div>

            <div className="col-md-3">
              <strong>Section:</strong>
              <p>{viewData.sectionId?.sectionName}</p>
            </div>

            <div className="col-md-3">
              <strong>Day:</strong>
              <p>{viewData.day}</p>
            </div>
          </div>

          <h5>Period Details</h5>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Period</th>
                  <th>Type</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Room</th>
                </tr>
              </thead>

              <tbody>
                {viewData.periods?.map((period, index) => (
                  <tr key={index}>
                    <td>{period.periodNumber}</td>
                    <td>{period.periodType}</td>
                    <td>{period.startTime}</td>
                    <td>{period.endTime}</td>
                    <td>
                      {period.subjectId?.subjectName || "-"}
                    </td>
                    <td>
                      {period.teacherID
                        ? `${period.teacherID.firstName || ""} ${
                            period.teacherID.lastName || ""
                          }`.trim() || period.teacherID.teacherName || "-"
                        : "-"}
                    </td>
                    <td>{period.roomNumber || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setViewData(null)}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default TimetableManagement;