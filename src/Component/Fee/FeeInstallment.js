
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function getStudentName(student) {
  const value = student?.student || student?.studentId || {};
  return (
    value.fullName ||
    value.name ||
    [value.firstName, value.lastName].filter(Boolean).join(" ") ||
    "Student"
  );
}

function getId(value) {
  return typeof value === "object" ? value?._id : value;
}

export default function FeeInstallment() {
  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [plans, setPlans] = useState([]);
   const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    assignStudentId: "",
    numberOfInstallments: 3,
    frequency: "Monthly",
    firstDueDate: "",
  });

  const [payment, setPayment] = useState({
    planId: "",
    installmentId: "",
    amountPaid: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "Cash",
    transactionId: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOptions();
    fetchPlans();
  }, []);

  async function fetchOptions() {
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

      const classJson = await classRes.json();
      const sectionJson = await sectionRes.json();

      setClasses(classJson || []);
      setSections(sectionJson.data || []);
    } catch (error) {
      setMessage("Class/section load nahi ho paye.");
    }
  }

  async function fetchStudents() {
    if (!filters.classId || !filters.academicYear) {
      setMessage("Please select class and academic year.");
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        classId: filters.classId,
        academicYear: filters.academicYear,
      });

      if (filters.sectionId) {
        params.set("sectionId", filters.sectionId);
      }

      const response = await fetch(
        `${API}/feecollection/students?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Students fetch failed");
      }

      setStudents(result.data || []);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPlans() {
    try {
      const params = new URLSearchParams();

      if (filters.academicYear) {
        params.set("academicYear", filters.academicYear);
      }
      if (filters.classId) params.set("classId", filters.classId);
      if (filters.sectionId) params.set("sectionId", filters.sectionId);

      const response = await fetch(
        `${API}/feeinstallment/?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      const result = await response.json();

      if (response.ok) {
        setPlans(result.data || []);
      }
    } catch (error) {
      setMessage("Installment plans load nahi ho paye.");
    }
  }

  function updateFilter(e) {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));

    if (name === "classId") {
      setStudents([]);
      setForm((prev) => ({ ...prev, assignStudentId: "" }));
    }
  }

  async function createPlan(e) {
    e.preventDefault();

    if (!form.assignStudentId) {
      setMessage("Please select a student.");
      return;
    }

    if (!form.firstDueDate) {
      setMessage("Please select first due date.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/feeinstallment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Plan creation failed");
      }

      setMessage("Installment plan created successfully.");
      setForm({
        assignStudentId: "",
        numberOfInstallments: 3,
        frequency: "Monthly",
        firstDueDate: "",
      });

      await fetchPlans();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function openPayment(plan, installment) {
    const remaining = Number(
      (installment.amount - installment.paidAmount).toFixed(2)
    );

    setPayment({
      planId: plan._id,
      installmentId: installment._id,
      amountPaid: remaining,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: "Cash",
      transactionId: "",
      remarks: installment.installmentName,
    });

    window.setTimeout(() => {
      document.getElementById("installment-payment")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  }

  async function submitPayment(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/feeinstallment/${payment.planId}/pay/${payment.installmentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            amountPaid: Number(payment.amountPaid),
            paymentDate: payment.paymentDate,
            paymentMode: payment.paymentMode,
            transactionId: payment.transactionId,
            remarks: payment.remarks,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Payment failed");
      }

      setMessage(
        `Payment successful. Receipt: ${result.receiptNumber || ""}`
      );

      setPayment({
        planId: "",
        installmentId: "",
        amountPaid: "",
        paymentDate: new Date().toISOString().slice(0, 10),
        paymentMode: "Cash",
        transactionId: "",
        remarks: "",
      });

      await fetchPlans();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deletePlan(id) {
    if (!window.confirm("Are you sure you want to deactivate this plan?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/feeinstallment/delete/${id}`, {
        method: "DELETE",
          headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setMessage("Installment plan deactivated.");
      await fetchPlans();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function statusFor(installment) {
    if (installment.paymentStatus === "Paid") return "Paid";

    if (
      installment.paymentStatus !== "Paid" &&
      new Date(installment.dueDate) < new Date() &&
      installment.paidAmount < installment.amount
    ) {
      return "Overdue";
    }

    return installment.paymentStatus;
  }

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Fee Installment Management</h3>
        <button className="btn btn-outline-primary" onClick={fetchPlans}>
          Refresh
        </button>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage("")}
          />
        </div>
      )}

      {/* FILTER */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Select Class / Section</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Class</label>
              <select
                className="form-select"
                name="classId"
                value={filters.classId}
                onChange={updateFilter}
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
                name="sectionId"
                value={filters.sectionId}
                onChange={updateFilter}
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
                name="academicYear"
                value={filters.academicYear}
                onChange={updateFilter}
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
                onClick={fetchStudents}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Search Students"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE PLAN */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Create Installment Plan</div>
        <div className="card-body">
          <form onSubmit={createPlan}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Student</label>
                <select
                  className="form-select"
                  value={form.assignStudentId}
                  onChange={(e) =>
                    setForm({ ...form, assignStudentId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((item) => (
                    <option
                      key={item.assignmentId || item._id}
                      value={item.assignmentId || item._id}
                    >
                      {getStudentName(item)} - {item.rollNumber || ""}
                      {" | Fee: ₹"}
                      {item.netFee ?? item.totalFee ?? 0}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">No. of Installments</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  className="form-control"
                  value={form.numberOfInstallments}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      numberOfInstallments: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Frequency</label>
                <select
                  className="form-select"
                  value={form.frequency}
                  onChange={(e) =>
                    setForm({ ...form, frequency: e.target.value })
                  }
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Half-Yearly</option>
                  <option>Yearly</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">First Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.firstDueDate}
                  onChange={(e) =>
                    setForm({ ...form, firstDueDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-12">
                <button className="btn btn-success" disabled={loading}>
                  Create Installment Plan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* PAYMENT FORM */}
      {payment.planId && (
        <div className="card border-primary shadow-sm mb-4" id="installment-payment">
          <div className="card-header fw-bold">Collect Installment Payment</div>
          <div className="card-body">
            <form onSubmit={submitPayment}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control"
                    value={payment.amountPaid}
                    onChange={(e) =>
                      setPayment({ ...payment, amountPaid: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Payment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={payment.paymentDate}
                    onChange={(e) =>
                      setPayment({ ...payment, paymentDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={payment.paymentMode}
                    onChange={(e) =>
                      setPayment({ ...payment, paymentMode: e.target.value })
                    }
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Online</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Transaction ID</label>
                  <input
                    className="form-control"
                    value={payment.transactionId}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        transactionId: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Remarks</label>
                  <input
                    className="form-control"
                    value={payment.remarks}
                    onChange={(e) =>
                      setPayment({ ...payment, remarks: e.target.value })
                    }
                  />
                </div>

                <div className="col-12">
                  <button className="btn btn-success" disabled={loading}>
                    Submit Payment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() =>
                      setPayment({ ...payment, planId: "", installmentId: "" })
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLAN LIST */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Installment Plans</div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Academic Year</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Installments</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No installment plans found
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <React.Fragment key={plan._id}>
                    <tr className="table-primary">
                      <td>{getStudentName({ student: plan.studentId })}</td>
                      <td>{plan.academicYear}</td>
                      <td>₹{plan.totalFee}</td>
                      <td>₹{plan.totalPaid}</td>
                      <td>₹{plan.totalDue}</td>
                      <td>{plan.installments.length}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deletePlan(plan._id)}
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="7" className="p-0">
                        <table className="table table-sm table-striped mb-0">
                          <thead>
                            <tr>
                              <th>Installment</th>
                              <th>Due Date</th>
                              <th>Amount</th>
                              <th>Paid</th>
                              <th>Remaining</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plan.installments.map((item) => {
                              const remaining = Math.max(
                                item.amount - item.paidAmount,
                                0
                              );
                              const status = statusFor(item);

                              return (
                                <tr key={item._id}>
                                  <td>{item.installmentName}</td>
                                  <td>
                                    {new Date(item.dueDate).toLocaleDateString()}
                                  </td>
                                  <td>₹{item.amount}</td>
                                  <td>₹{item.paidAmount}</td>
                                  <td>₹{remaining}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        status === "Paid"
                                          ? "bg-success"
                                          : status === "Overdue"
                                          ? "bg-danger"
                                          : status === "Partial"
                                          ? "bg-warning text-dark"
                                          : "bg-secondary"
                                      }`}
                                    >
                                      {status}
                                    </span>
                                  </td>
                                  <td>
                                    {remaining > 0 && (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => openPayment(plan, item)}
                                      >
                                        Pay
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
