
import React, { useEffect, useState } from "react";
import "./AdmitCard.css";

const API = "https://school-management-backend-ochre.vercel.app/api";

function AdmitCard() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/exam/`)
      .then((res) => res.json())
      .then((result) => setExams(result.data || []));

    fetch(`${API}/class/`)
      .then((res) => res.json())
      .then((result) => setClasses(result || []));

    fetch(`${API}/section/`)
      .then((res) => res.json())
      .then((result) => setSections(result.data || []));
  }, []);

  const filteredSections = sections.filter(
    (item) =>
      String(item.classId?._id || item.classId) === String(classId)
  );

  const fetchAdmitCards = async () => {
    if (!examId || !classId || !sectionId) {
      alert("Please select Exam, Class and Section");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/admitcard/data?examId=${examId}&classId=${classId}&sectionId=${sectionId}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch data");
      }

      setStudents(result.students || []);
      setSchedules(result.schedules || []);

      if (!result.students?.length) {
        alert("No students found for selected class and section");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (student) => {
    return (
      student.studentName ||
      [student.firstName, student.lastName].filter(Boolean).join(" ") ||
      student.name ||
      "Student"
    );
  };

  const selectedExam = exams.find(
    (item) => String(item._id) === String(examId)
  );

  const selectedClass = classes.find(
    (item) => String(item._id) === String(classId)
  );

  const selectedSection = sections.find(
    (item) => String(item._id) === String(sectionId)
  );

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const printCards = () => {
    if (!students.length) {
      alert("Please generate admit cards first");
      return;
    }
    window.print();
  };

  return (
    <div className="container-fluid py-4 admit-page">
      <div className="card shadow-sm mb-4 no-print">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Admit Card Generation</h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Select Exam *</label>
              <select
                className="form-select"
                value={examId}
                onChange={(e) => {
                  setExamId(e.target.value);
                  setStudents([]);
                  setSchedules([]);
                }}
              >
                <option value="">Select Exam</option>
                {exams.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.examName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Select Class *</label>
              <select
                className="form-select"
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setSectionId("");
                  setStudents([]);
                  setSchedules([]);
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

            <div className="col-md-4">
              <label className="form-label">Select Section *</label>
              <select
                className="form-select"
                value={sectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setStudents([]);
                  setSchedules([]);
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

            <div className="col-12 d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={fetchAdmitCards}
                disabled={loading}
              >
                {loading ? "Loading..." : "Generate Admit Cards"}
              </button>

              <button
                className="btn btn-success"
                onClick={printCards}
                disabled={!students.length}
              >
                Print All Admit Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="d-flex justify-content-between mb-3 no-print">
          <h5>Generated Admit Cards ({students.length})</h5>
          <button className="btn btn-outline-primary" onClick={printCards}>
            <i className="bi bi-printer me-2"></i>
            Print
          </button>
        </div>
      )}

      <div className="admit-card-list">
        {students.map((item, index) => {
          const student = item.student || {};

          return (
            <div className="admit-card" key={item.assignmentId || student._id || index}>
              <div className="admit-header">
                <h2>YOUR SCHOOL NAME</h2>
                <p>School Address | Contact Number</p>
                <h4>EXAMINATION ADMIT CARD</h4>
                <h5>{selectedExam?.examName}</h5>
                <p>Academic Year: {item.academicYear || selectedExam?.academicYear || "—"}</p>
              </div>

              <div className="admit-student-info">
                <div className="student-details">
                  <p><strong>Student Name:</strong> {getStudentName(student)}</p>
                  <p><strong>Admission No:</strong> {student.admissionNumber || "—"}</p>
                  <p><strong>Roll Number:</strong> {item.rollNumber || "—"}</p>
                  <p><strong>Class:</strong> {selectedClass?.className || "—"}</p>
                  <p><strong>Section:</strong> {selectedSection?.sectionName || "—"}</p>
                  <p><strong>Father's Name:</strong> {student.fatherName || "—"}</p>
                </div>

                <div className="student-photo">
                  {student.StudentPhoto ? (
                    <img
                      src={student.StudentPhoto}
                      alt="Student"
                    />
                  ) : (
                    <span>Student Photo</span>
                  )}
                </div>
              </div>

              <h6 className="mt-3">Examination Schedule</h6>

              <table className="table table-bordered table-sm schedule-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Max Marks</th>
                  </tr>
                </thead>

                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td>
                        {schedule.subjectId?.subjectName || "—"}
                      </td>
                      <td>{formatDate(schedule.examDate)}</td>
                      <td>
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td>{schedule.roomNumber || "—"}</td>
                      <td>{schedule.maxMarks ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="exam-instructions">
                <strong>Instructions:</strong>
                <ol>
                  <li>Bring this admit card to the examination hall.</li>
                  <li>Reach the examination centre before the scheduled time.</li>
                  <li>Mobile phones and electronic devices are not allowed.</li>
                  <li>Follow all examination rules and instructions.</li>
                </ol>
              </div>

              <div className="admit-footer">
                <div>
                  <p>____________________</p>
                  <strong>Student Signature</strong>
                </div>
                <div>
                  <p>____________________</p>
                  <strong>Principal Signature</strong>
                </div>
              </div>

              <div className="admit-bottom">
                <small>Best of Luck!</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdmitCard;
