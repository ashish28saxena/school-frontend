
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const initialForm = {
  classId: "",
  sectionId: "",
  academicYear: "2026-27",
  studentId: "",
  amountPaid: "",
  paymentDate: new Date().toISOString().split("T")[0],
  paymentMode: "Cash",
  transactionId: "",
  remarks: "",
};

function FeeCollection() {
  const [form, setForm] = useState(initialForm);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOptions();
    fetchPayments();
  }, []);

  const fetchOptions = async () => {
    try {
      const [classRes, sectionRes] = await Promise.all([
        fetch(`${API}/class/`),
        fetch(`${API}/section/`),
      ]);

      const classData = await classRes.json();
      const sectionData = await sectionRes.json();

      setClasses(classData || []);
      setSections(sectionData.data || []);
    } catch (error) {
      alert("Unable to load class and section");
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API}/feecollection/`);
      const result = await response.json();
      setPayments(result.data || []);
    } catch (error) {
      alert("Unable to load payment history");
    }
  };

  const filteredSections = sections.filter(
    (item) =>
      String(item.classId?._id || item.classId) === String(form.classId)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchStudents = async () => {
    if (!form.classId || !form.academicYear) {
      alert("Please select class and academic year");
      return;
    }

    try {
      setLoading(true);
      setStudents([]);
      setSelectedStudent(null);
      setForm((prev) => ({ ...prev, studentId: "" }));

      const params = new URLSearchParams({
        classId: form.classId,
        academicYear: form.academicYear,
      });

      if (form.sectionId) {
        params.append("sectionId", form.sectionId);
      }

      const response = await fetch(
        `${API}/feecollection/students?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch students");
      }

      setStudents(result.data || []);

      if (!result.data?.length) {
        alert("No students or fee structures found");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;

    setForm((prev) => ({
      ...prev,
      studentId,
      amountPaid: "",
      transactionId: "",
      remarks: "",
    }));

    const selected = students.find(
      (item) => String(item.student._id) === String(studentId)
    );

    setSelectedStudent(selected || null);
  };

  const getStudentName = (student) =>
    student?.studentName ||
    [student?.firstName, student?.lastName].filter(Boolean).join(" ") ||
    student?.name ||
    "Student";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    const amount = Number(form.amountPaid);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    if (amount > selectedStudent.balance) {
      alert(`Maximum pending balance is ₹${selectedStudent.balance}`);
      return;
    }

    const payload = {
      studentId: selectedStudent.student._id,
      assignStudentId: selectedStudent.assignmentId,
      feeStructureId: selectedStudent.feeStructureId,
      classId: form.classId,
      sectionId: selectedStudent.section?._id || form.sectionId || null,
      academicYear: form.academicYear,
      amountPaid: amount,
      paymentDate: form.paymentDate,
      paymentMode: form.paymentMode,
      transactionId: form.transactionId,
      remarks: form.remarks,
    };

    try {
      setLoading(true);

      const response = await fetch(`${API}/feecollection/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Payment failed");
      }

      alert(
        `${result.message}\nReceipt: ${result.data.receiptNumber}\nRemaining Balance: ₹${result.balance}`
      );

      setForm((prev) => ({
        ...prev,
        studentId: "",
        amountPaid: "",
        transactionId: "",
        remarks: "",
      }));

      setSelectedStudent(null);
      await fetchStudents();
      await fetchPayments();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this payment record?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/feecollection/delete/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to deactivate payment");
      }

      alert(result.message);
      fetchPayments();

      if (form.classId) fetchStudents();
    } catch (error) {
      alert(error.message);
    }
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Fee Collection Management</h3>

      {/* Student Search */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          Select Student
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Class *</label>
              <select
                className="form-select"
                name="classId"
                value={form.classId}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    classId: e.target.value,
                    sectionId: "",
                    studentId: "",
                  }));
                  setStudents([]);
                  setSelectedStudent(null);
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
              <label className="form-label">Section</label>
              <select
                className="form-select"
                name="sectionId"
                value={form.sectionId}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    sectionId: e.target.value,
                    studentId: "",
                  }));
                  setStudents([]);
                  setSelectedStudent(null);
                }}
              >
                <option value="">All Sections</option>
                {sections.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Academic Year *</label>
              <select
                className="form-select"
                name="academicYear"
                value={form.academicYear}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    academicYear: e.target.value,
                    studentId: "",
                  }));
                  setStudents([]);
                  setSelectedStudent(null);
                }}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 8 }, (_, i) => {
                  const year = 2026 + i;
                  const next = String(year + 1).slice(-2);
                  return (
                    <option key={year} value={`${year}-${next}`}>
                      {year}-{next}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={fetchStudents}
                disabled={loading}
              >
                {loading ? "Loading..." : "Search Students"}
              </button>
            </div>

            <div className="col-md-6">
              <label className="form-label">Select Student *</label>
              <select
                className="form-select"
                value={form.studentId}
                onChange={handleStudentSelect}
              >
                <option value="">Select Student</option>
                {students.map((item) => (
                  <option
                    key={item.assignmentId}
                    value={item.student._id}
                  >
                    {getStudentName(item.student)} | Roll: {item.rollNumber || "—"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Student Fee Summary */}
      {selectedStudent && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-primary">
                <div className="card-body">
                  <small className="text-muted">Total Fee</small>
                  <h4>{formatCurrency(selectedStudent.totalFee)}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-success">
                <div className="card-body">
                  <small className="text-muted">Paid Amount</small>
                  <h4 className="text-success">
                    {formatCurrency(selectedStudent.paidAmount)}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-danger">
                <div className="card-body">
                  <small className="text-muted">Pending Balance</small>
                  <h4 className="text-danger">
                    {formatCurrency(selectedStudent.balance)}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              Collect Student Fee
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Payment Amount (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amountPaid"
                      min="0.01"
                      max={selectedStudent.balance}
                      step="0.01"
                      value={form.amountPaid}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Payment Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="paymentDate"
                      value={form.paymentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Payment Mode *</label>
                    <select
                      className="form-select"
                      name="paymentMode"
                      value={form.paymentMode}
                      onChange={handleChange}
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Transaction / Cheque Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="transactionId"
                      value={form.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction number"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Remarks</label>
                    <input
                      type="text"
                      className="form-control"
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      placeholder="Enter remarks"
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={
                        loading ||
                        selectedStudent.balance <= 0
                      }
                    >
                      {loading ? "Processing..." : "Collect Fee"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Payment History */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Fee Collection History</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Receipt No.</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Payment Date</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.length > 0 ? (
                  payments.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.receiptNumber}</td>
                      <td>{getStudentName(item.studentId)}</td>
                      <td>{item.classId?.className || "—"}</td>
                      <td>{item.sectionId?.sectionName || "—"}</td>
                      <td>{formatDate(item.paymentDate)}</td>
                      <td>{formatCurrency(item.amountPaid)}</td>
                      <td>{item.paymentMode}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No Payment Records Found
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

export default FeeCollection;
