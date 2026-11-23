
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./StudentIdCard.css";

const API = "https://school-management-backend-ochre.vercel.app/api";

const SCHOOL = {
  name: "YOUR SCHOOL NAME",
  address: "School Address, City",
  phone: "Contact Number",
  logo: "",
};

function studentName(student = {}) {
  return (
    student.fullName ||
    student.name ||
    [student.firstName, student.lastName].filter(Boolean).join(" ") ||
    "Student Name"
  );
}

function photoUrl(student = {}) {
  const photo = student.StudentPhoto || student.studentPhoto || student.photo;

  if (!photo) return "";

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `https://school-management-backend-ochre.vercel.app/${photo.replace(/^\/+/, "")}`;
}

function StudentCard({ item }) {
  const student = item.student || {};
  const className = item.class?.className || "";
  const sectionName = item.section?.sectionName || "";
  const qrValue = JSON.stringify({
    studentId: student._id,
    admissionNumber: student.admissionNumber || "",
    academicYear: item.academicYear,
  });
   const token = localStorage.getItem("token");

  return (
    <div className="student-id-card">
      <div className="id-school-header">
        {SCHOOL.logo ? (
          <img src={SCHOOL.logo} alt="School Logo" className="id-school-logo" />
        ) : (
          <div className="id-school-logo-placeholder">LOGO</div>
        )}

        <div>
          <h5>{SCHOOL.name}</h5>
          <small>{SCHOOL.address}</small>
          <small>{SCHOOL.phone}</small>
        </div>
      </div>

      <div className="id-card-title">STUDENT IDENTITY CARD</div>

      <div className="id-card-content">
        <div className="id-photo-box">
          {photoUrl(student) ? (
            <img
              src={photoUrl(student)}
              alt={studentName(student)}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span>PHOTO</span>
          )}
        </div>

        <div className="id-student-details">
          <h6>{studentName(student)}</h6>
          <p>
            <b>Admission No:</b> {student.admissionNumber || "-"}
          </p>
          <p>
            <b>Class:</b> {className} {sectionName && `- ${sectionName}`}
          </p>
          <p>
            <b>Roll No:</b> {item.rollNumber || "-"}
          </p>
          <p>
            <b>DOB:</b>{" "}
            {student.dataOfBirth
              ? new Date(student.dataOfBirth).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <b>Academic Year:</b> {item.academicYear}
          </p>
        </div>
      </div>

      <div className="id-card-footer">
        <div className="id-qr">
          <QRCodeCanvas value={qrValue} size={65} level="M" />
          <small>Scan to verify</small>
        </div>
        <div className="id-signature">
          <div className="signature-line"></div>
          <small>Principal Signature</small>
        </div>
      </div>
    </div>
  );
}

export default function StudentIdCard() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
  });

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    try {
      const [classResponse, sectionResponse] = await Promise.all([
        fetch(`${API}/class/`),
        fetch(`${API}/section/`),
      ]);

      const classResult = await classResponse.json();
      const sectionResult = await sectionResponse.json();

      if (!classResponse.ok) {
        throw new Error(classResult.message || "Class fetch failed");
      }

      if (!sectionResponse.ok) {
        throw new Error(sectionResult.message || "Section fetch failed");
      }

      setClasses(classResult || []);
      setSections(sectionResult.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function searchStudents(e) {
    if (e) e.preventDefault();

    if (!filters.classId) {
      setMessage("Please select a class.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setSelected([]);

      const params = new URLSearchParams({
        classId: filters.classId,
        academicYear: filters.academicYear,
      });

      if (filters.sectionId) {
        params.set("sectionId", filters.sectionId);
      }

      const response = await fetch(
        `${API}/student-id-card/students?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Students fetch failed");
      }

      setStudents(result.data || []);
      if (!result.data?.length) {
        setMessage("No students found for this selection.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleStudent(id) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  function selectAll() {
    if (selected.length === students.length) {
      setSelected([]);
    } else {
      setSelected(students.map((item) => item.assignmentId));
    }
  }

  function printCards() {
    if (!selected.length) {
      setMessage("Please select at least one student.");
      return;
    }

    window.print();
  }

  const selectedStudents = students.filter((item) =>
    selected.includes(item.assignmentId)
  );

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <h3>Student ID Card Management</h3>
        <button
          className="btn btn-success"
          onClick={printCards}
          disabled={!selected.length}
        >
          Print Selected ({selected.length})
        </button>
      </div>

      {message && (
        <div className="alert alert-info no-print">
          {message}
        </div>
      )}

      {/* FILTERS */}
      <div className="card shadow-sm mb-4 no-print">
        <div className="card-header fw-bold">Select Class and Section</div>
        <div className="card-body">
          <form onSubmit={searchStudents}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Class</label>
                <select
                  className="form-select"
                  value={filters.classId}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      classId: e.target.value,
                      sectionId: "",
                    })
                  }
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

              <div className="col-md-4">
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  value={filters.sectionId}
                  onChange={(e) =>
                    setFilters({ ...filters, sectionId: e.target.value })
                  }
                >
                  <option value="">All Sections</option>
                  {sections.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.sectionName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Academic Year</label>
                <select
                  className="form-select"
                  value={filters.academicYear}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      academicYear: e.target.value,
                    })
                  }
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = 2020 + i;
                    const value = `${year}-${String(year + 1).slice(-2)}`;

                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-12">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Search Students"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* STUDENT LIST */}
      {students.length > 0 && (
        <div className="card shadow-sm mb-4 no-print">
          <div className="card-header d-flex justify-content-between">
            <b>Student List ({students.length})</b>
            <button className="btn btn-sm btn-outline-primary" onClick={selectAll}>
              {selected.length === students.length
                ? "Unselect All"
                : "Select All"}
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Select</th>
                  <th>Admission No.</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Roll No.</th>
                </tr>
              </thead>
              <tbody>
                {students.map((item) => {
                  const student = item.student || {};

                  return (
                    <tr key={item.assignmentId}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selected.includes(item.assignmentId)}
                          onChange={() => toggleStudent(item.assignmentId)}
                        />
                      </td>
                      <td>{student.admissionNumber || "-"}</td>
                      <td>{studentName(student)}</td>
                      <td>{item.class?.className || "-"}</td>
                      <td>{item.section?.sectionName || "-"}</td>
                      <td>{item.rollNumber || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINT AREA */}
      <div className="id-card-print-area">
        {selectedStudents.map((item) => (
          <StudentCard key={item.assignmentId} item={item} />
        ))}
      </div>
    </div>
  );
}
