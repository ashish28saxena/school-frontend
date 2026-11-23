import React, { useEffect, useState } from "react";

const BASE_URL = "https://school-management-backend-ochre.vercel.app/api";

const initialForm = {
  examId: "",
  academicYear: "2026-27",
  classId: "",
  sectionId: "",
  subjectId: "",
  examDate: "",
  startTime: "",
  endTime: "",
  maxMarks: 100,
  passingMarks: 33,
  roomNumber: "",
  status: true,
};

function ExamSchedule() {
  const [form, setForm] = useState(initialForm);

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
   const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDropdownData();
    fetchSchedules();
  }, []);

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const [examRes, classRes, sectionRes, subjectRes] =
        await Promise.all([
          fetch(`${BASE_URL}/exam/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
          fetch(`${BASE_URL}/class/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
          fetch(`${BASE_URL}/section/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
          fetch(`${BASE_URL}/subject/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
        ]);

      const [examData, classData, sectionData, subjectData] =
        await Promise.all([
          examRes.json(),
          classRes.json(),
          sectionRes.json(),
          subjectRes.json(),
        ]);

      setExams(examData.data || []);
      setClasses(classData || []);
      setSections(sectionData.data || []);
      setSubjects(subjectData.data || []);
    } catch (error) {
      alert("Unable to fetch dropdown data");
    }
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${BASE_URL}/examschedule/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setSchedules(result.data || []);
    } catch (error) {
      alert("Unable to fetch exam schedules");
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Exam selection
  const handleExamChange = (e) => {
    const examId = e.target.value;
    const selectedExam = exams.find((item) => item._id === examId);

    setForm((prev) => ({
      ...prev,
      examId,
      academicYear: selectedExam?.academicYear || prev.academicYear,
    }));
  };

  // Class selection
  const handleClassChange = (e) => {
    setForm((prev) => ({
      ...prev,
      classId: e.target.value,
      sectionId: "",
    }));
  };

  // Filter sections according to selected class
  const filteredSections = sections.filter((section) => {
    const sectionClassId =
      typeof section.classId === "object"
        ? section.classId?._id
        : section.classId;

    return sectionClassId === form.classId;
  });

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.startTime >= form.endTime) {
      alert("End time must be after start time");
      return;
    }

    if (Number(form.passingMarks) > Number(form.maxMarks)) {
      alert("Passing marks cannot be greater than maximum marks");
      return;
    }

    const payload = {
      ...form,
      maxMarks: Number(form.maxMarks),
      passingMarks: Number(form.passingMarks),
    };

    try {
      setLoading(true);

      const response = await fetch(
        editId
          ? `${BASE_URL}/examschedule/update/${editId}`
          : `${BASE_URL}/examschedule/submit`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

      setForm(initialForm);
      setEditId(null);
      fetchSchedules();
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      examId: item.examId?._id || item.examId || "",
      academicYear: item.academicYear || "2026-27",
      classId: item.classId?._id || item.classId || "",
      sectionId: item.sectionId?._id || item.sectionId || "",
      subjectId: item.subjectId?._id || item.subjectId || "",
      examDate: item.examDate
        ? new Date(item.examDate).toISOString().substring(0, 10)
        : "",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      maxMarks: item.maxMarks ?? 100,
      passingMarks: item.passingMarks ?? 33,
      roomNumber: item.roomNumber || "",
      status: item.status ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam schedule?")) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/examschedule/delete/${id}`,
        { method: "DELETE",
          headers: {
          Authorization: `Bearer ${token}`,
        },
         }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Delete failed");
        return;
      }

      alert(result.message);
      fetchSchedules();
    } catch (error) {
      alert("Server error");
    }
  };

  // Reset
  const handleReset = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const getName = (value, field) => {
    if (!value) return "-";
    return typeof value === "object" ? value[field] || "-" : "-";
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Exam Schedule</h3>

        <span className="badge bg-primary fs-6">
          Total Schedules: {schedules.length}
        </span>
      </div>

      {/* Schedule Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {editId ? "Update Exam Schedule" : "Add Exam Schedule"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Exam */}
              <div className="col-md-4">
                <label className="form-label">Select Exam *</label>
                <select
                  className="form-select"
                  value={form.examId}
                  onChange={handleExamChange}
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.examName} ({item.examType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="col-md-4">
                <label className="form-label">Academic Year</label>
                {/* <input
                  type="text"
                  className="form-control"
                  value={form.academicYear}
                  readOnly
                /> */}
                <select
                  className="form-select"
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
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

              {/* Class */}
              <div className="col-md-4">
                <label className="form-label">Select Class *</label>
                <select
                  className="form-select"
                  value={form.classId}
                  onChange={handleClassChange}
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

              {/* Section */}
              <div className="col-md-4">
                <label className="form-label">Select Section *</label>
                <select
                  className="form-select"
                  name="sectionId"
                  value={form.sectionId}
                  onChange={handleChange}
                  required
                  disabled={!form.classId}
                >
                  <option value="">Select Section</option>
                  {sections.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="col-md-4">
                <label className="form-label">Select Subject *</label>
                <select
                  className="form-select"
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Date */}
              <div className="col-md-4">
                <label className="form-label">Exam Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="examDate"
                  value={form.examDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Start Time */}
              <div className="col-md-3">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  className="form-control"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* End Time */}
              <div className="col-md-3">
                <label className="form-label">End Time *</label>
                <input
                  type="time"
                  className="form-control"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Maximum Marks */}
              <div className="col-md-3">
                <label className="form-label">Maximum Marks *</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxMarks"
                  min="1"
                  value={form.maxMarks}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Passing Marks */}
              <div className="col-md-3">
                <label className="form-label">Passing Marks *</label>
                <input
                  type="number"
                  className="form-control"
                  name="passingMarks"
                  min="0"
                  value={form.passingMarks}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Room Number */}
              <div className="col-md-4">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="roomNumber"
                  placeholder="Enter room number"
                  value={form.roomNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={String(form.status)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : editId
                    ? "Update Schedule"
                    : "Add Schedule"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Schedule List */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Exam Schedule List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Exam</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Exam Date</th>
                  <th>Time</th>
                  <th>Marks</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {schedules.length > 0 ? (
                  schedules.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{getName(item.examId, "examName")}</td>
                      <td>{getName(item.classId, "className")}</td>
                      <td>{getName(item.sectionId, "sectionName")}</td>
                      <td>{getName(item.subjectId, "subjectName")}</td>
                      <td>
                        {new Date(item.examDate).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        {item.startTime} - {item.endTime}
                      </td>
                      <td>
                        {item.passingMarks}/{item.maxMarks}
                      </td>
                      <td>{item.roomNumber || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No Exam Schedule Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamSchedule;