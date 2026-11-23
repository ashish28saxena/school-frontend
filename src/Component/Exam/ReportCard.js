import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const API = "https://school-management-backend-ochre.vercel.app/api";

function ReportCard() {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();

  const examId = searchParams.get("examId");
  const academicYear = searchParams.get("academicYear");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
   const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const params = new URLSearchParams({
          examId,
          academicYear,
        });

        const response = await fetch(
          `${API}/reportcard/${studentId}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        );

        const result = await response.json();

        if (!response.ok) {
          alert(result.message || "Report card not found");
          return;
        }

        setReport(result.data);
      } catch {
        alert("Unable to fetch report card");
      } finally {
        setLoading(false);
      }
    };

    if (studentId && examId && academicYear) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [studentId, examId, academicYear]);

  if (loading) {
    return <div className="text-center p-5">Loading report card...</div>;
  }

  if (!report) {
    return <div className="alert alert-warning m-4">Report card not found.</div>;
  }

  const studentName =
    report.student?.studentName ||
    [
      report.student?.firstName,
      report.student?.lastName,
    ].filter(Boolean).join(" ") ||
    report.student?.name ||
    "Student";

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-3 no-print">
        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          Print Report Card
        </button>
      </div>

      <div className="card shadow-sm report-card">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold">YOUR SCHOOL NAME</h2>
            <p className="mb-1">School Address / Contact Details</p>
            <h4 className="mt-3 text-primary">STUDENT REPORT CARD</h4>
            <h5>{report.exam.examName}</h5>
            <p>Academic Year: {report.academicYear}</p>
          </div>

          <hr />

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <strong>Student Name:</strong> {studentName}
            </div>

            <div className="col-md-6">
              <strong>Admission Number:</strong>{" "}
              {report.student?.admissionNumber || "-"}
            </div>

            <div className="col-md-4">
              <strong>Class:</strong> {report.className}
            </div>

            <div className="col-md-4">
              <strong>Section:</strong> {report.sectionName}
            </div>

            <div className="col-md-4">
              <strong>Roll Number:</strong> {report.rollNumber || "-"}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Subject</th>
                  <th>Maximum Marks</th>
                  <th>Passing Marks</th>
                  <th>Obtained Marks</th>
                  <th>Attendance</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {report.subjects.map((item, index) => (
                  <tr key={`${item.subjectName}-${index}`}>
                    <td>{index + 1}</td>
                    <td className="text-start">{item.subjectName}</td>
                    <td>{item.maxMarks}</td>
                    <td>{item.passingMarks}</td>
                    <td>{item.obtainedMarks}</td>
                    <td>{item.attendanceStatus}</td>
                    <td>{item.result}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="table-light fw-bold">
                <tr>
                  <td colSpan="2">Total</td>
                  <td>{report.totalMarks}</td>
                  <td>-</td>
                  <td>{report.obtainedMarks}</td>
                  <td colSpan="2">-</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <small>Total Marks</small>
                <h4>{report.totalMarks}</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <small>Obtained Marks</small>
                <h4>{report.obtainedMarks}</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <small>Percentage</small>
                <h4>{report.percentage}%</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <small>Grade</small>
                <h4>{report.grade}</h4>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <h4>
              Final Result:{" "}
              <span
                className={
                  report.result === "Pass"
                    ? "text-success"
                    : "text-danger"
                }
              >
                {report.result}
              </span>
            </h4>
          </div>

          <div className="row mt-5 pt-4">
            <div className="col-6">
              <p>_____________________</p>
              <strong>Class Teacher Signature</strong>
            </div>

            <div className="col-6 text-end">
              <p>_____________________</p>
              <strong>Principal Signature</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          body * {
            visibility: hidden;
          }

          .report-card,
          .report-card * {
            visibility: visible;
          }

          .report-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ReportCard;