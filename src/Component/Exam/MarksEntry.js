import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function MarksEntry() {
  const [schedules, setSchedules] = useState([]);
  const [scheduleId, setScheduleId] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/examschedule/`)
      .then((res) => res.json())
      .then((result) => setSchedules(result.data || []))
      .catch(() => alert("Unable to fetch schedules"));
  }, []);

  const loadStudents = async (id) => {
    setScheduleId(id);
    setStudents([]);
    setSchedule(null);

    if (!id) return;

    try {
      const response = await fetch(`${API}/exammark/students/${id}`);
      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setSchedule(result.schedule);
      setStudents(
        (result.data || []).map((item) => ({
          studentId: item.student._id,
          student: item.student,
          obtainedMarks: item.obtainedMarks,
          attendanceStatus: item.attendanceStatus,
          remarks: item.remarks,
        }))
      );
    } catch {
      alert("Unable to fetch students");
    }
  };

  const updateStudent = (studentId, field, value) => {
    setStudents((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? {
              ...item,
              [field]:
                field === "obtainedMarks" ? value : value,
              ...(field === "attendanceStatus" && value === "Absent"
                ? { obtainedMarks: 0 }
                : {}),
            }
          : item
      )
    );
  };

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";

    return (
      student.studentName ||
      [student.firstName, student.lastName].filter(Boolean).join(" ") ||
      student.name ||
      "Student"
    );
  };

  const saveMarks = async () => {
    if (!scheduleId || !students.length) {
      alert("Please select a schedule with students");
      return;
    }

    for (const item of students) {
      if (
        item.attendanceStatus === "Present" &&
        (item.obtainedMarks === "" ||
          !Number.isFinite(Number(item.obtainedMarks)) ||
          Number(item.obtainedMarks) < 0 ||
          Number(item.obtainedMarks) > schedule.maxMarks)
      ) {
        alert(`Enter valid marks for ${getStudentName(item.student)}`);
        return;
      }
    }

    const payload = {
      examScheduleId: scheduleId,
      marks: students.map((item) => ({
        studentId: item.studentId,
        obtainedMarks:
          item.attendanceStatus === "Absent"
            ? 0
            : Number(item.obtainedMarks),
        attendanceStatus: item.attendanceStatus,
        remarks: item.remarks,
      })),
    };

    try {
      setLoading(true);

      const response = await fetch(`${API}/exammark/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Unable to save marks");
        return;
      }

      alert(result.message);
      loadStudents(scheduleId);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Marks Entry</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <label className="form-label">Select Exam Schedule *</label>
          <select
            className="form-select"
            value={scheduleId}
            onChange={(e) => loadStudents(e.target.value)}
          >
            <option value="">Select Exam / Class / Subject</option>
            {schedules.map((item) => (
              <option key={item._id} value={item._id}>
                {item.examId?.examName || "Exam"} |{" "}
                {item.classId?.className || "Class"} |{" "}
                {item.sectionId?.sectionName || "Section"} |{" "}
                {item.subjectId?.subjectName || "Subject"} |{" "}
                {item.examDate
                  ? new Date(item.examDate).toLocaleDateString("en-IN")
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {schedule && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <strong>Exam:</strong>{" "}
                  {schedule.examId?.examName}
                </div>
                <div className="col-md-3">
                  <strong>Class:</strong>{" "}
                  {schedule.classId?.className}
                </div>
                <div className="col-md-3">
                  <strong>Section:</strong>{" "}
                  {schedule.sectionId?.sectionName}
                </div>
                <div className="col-md-3">
                  <strong>Subject:</strong>{" "}
                  {schedule.subjectId?.subjectName}
                </div>
                <div className="col-md-3">
                  <strong>Maximum Marks:</strong> {schedule.maxMarks}
                </div>
                <div className="col-md-3">
                  <strong>Passing Marks:</strong> {schedule.passingMarks}
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Student Marks List</h5>
              <button
                className="btn btn-primary"
                onClick={saveMarks}
                disabled={loading || !students.length}
              >
                {loading ? "Saving..." : "Save Marks"}
              </button>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>S.No.</th>
                      <th>Student Name</th>
                      <th>Admission No.</th>
                      <th>Obtained Marks</th>
                      <th>Attendance</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.length ? (
                      students.map((item, index) => (
                        <tr key={item.studentId}>
                          <td>{index + 1}</td>
                          <td>{getStudentName(item.student)}</td>
                          <td>
                            {item.student.admissionNumber || "-"}
                          </td>
                          <td style={{ width: "150px" }}>
                            <input
                              type="number"
                              className="form-control"
                              min="0"
                              max={schedule.maxMarks}
                              disabled={
                                item.attendanceStatus === "Absent"
                              }
                              value={item.obtainedMarks}
                              onChange={(e) =>
                                updateStudent(
                                  item.studentId,
                                  "obtainedMarks",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td style={{ minWidth: "130px" }}>
                            <select
                              className="form-select"
                              value={item.attendanceStatus}
                              onChange={(e) =>
                                updateStudent(
                                  item.studentId,
                                  "attendanceStatus",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.remarks}
                              onChange={(e) =>
                                updateStudent(
                                  item.studentId,
                                  "remarks",
                                  e.target.value
                                )
                              }
                              placeholder="Remarks"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No students assigned to this class and section.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MarksEntry;