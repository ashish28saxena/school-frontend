
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";

const currentMonth = new Date().toISOString().slice(0, 7);

const initialGenerateForm = {
  studentTransportId: "",
  billingMonth: currentMonth,
  dueDate: "",
};

const initialPaymentForm = {
  amountPaid: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMode: "Cash",
  transactionId: "",
  remarks: "",
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
};

const getId = (value) =>
  typeof value === "object" && value !== null ? value._id : value || "";

const getStudentName = (student) => {
  if (!student) return "-";
  return `${student.firstName || ""} ${student.lastName || ""}`.trim() || "-";
};

const TransportFeeManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [fees, setFees] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [payments, setPayments] = useState([]);

  const [generateForm, setGenerateForm] = useState(initialGenerateForm);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);

  const [selectedFee, setSelectedFee] = useState(null);
  const [activeTab, setActiveTab] = useState("fees");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  };

  // Load active student transport assignments
  const fetchAssignments = async () => {
    try {
      const result = await request("/student-transports");
      setAssignments(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load all generated invoices
  const fetchFees = async () => {
    try {
      const result = await request("/fees");
      setFees(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load pending and partial fees
  const fetchPendingFees = async () => {
    try {
      const result = await request("/fees/pending");
      setPendingFees(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load payment history
  const fetchPayments = async () => {
    try {
      const result = await request("/fee-payments");
      setPayments(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchAssignments(),
      fetchFees(),
      fetchPendingFees(),
      fetchPayments(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleGenerateChange = (e) => {
    const { name, value } = e.target;

    setGenerateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate monthly invoice
  const handleGenerateFee = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !generateForm.studentTransportId ||
      !generateForm.billingMonth ||
      !generateForm.dueDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const result = await request("/fee/generate", {
        method: "POST",
        body: JSON.stringify(generateForm),
      });

      setSuccess(result.message || "Transport fee generated successfully.");

      setGenerateForm({
        ...initialGenerateForm,
        billingMonth: currentMonth,
      });

      await Promise.all([
        fetchFees(),
        fetchPendingFees(),
        fetchPayments(),
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Select invoice for payment
  const openPaymentForm = (fee) => {
    setSelectedFee(fee);

    setPaymentForm({
      ...initialPaymentForm,
      amountPaid: fee.balance ?? fee.amountDue - fee.amountPaid,
    });

    setError("");
    setSuccess("");
    setActiveTab("collect");
  };

  // Collect partial or full payment
  const handleCollectPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFee) {
      setError("Please select a fee invoice.");
      return;
    }

    const amount = Number(paymentForm.amountPaid);
    const balance = Number(
      selectedFee.balance ??
        (Number(selectedFee.amountDue || 0) -
          Number(selectedFee.amountPaid || 0))
    );

    if (!amount || amount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (amount > balance) {
      setError(`Payment cannot exceed pending balance ₹${balance}.`);
      return;
    }

    try {
      const result = await request("/fee/collect", {
        method: "POST",
        body: JSON.stringify({
          transportFeeId: selectedFee._id,
          amountPaid: amount,
          paymentDate: paymentForm.paymentDate,
          paymentMode: paymentForm.paymentMode,
          transactionId: paymentForm.transactionId,
          remarks: paymentForm.remarks,
        }),
      });

      setSuccess(result.message || "Payment collected successfully.");

      setSelectedFee(null);
      setPaymentForm(initialPaymentForm);
      setActiveTab("payments");

      await Promise.all([
        fetchFees(),
        fetchPendingFees(),
        fetchPayments(),
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelPayment = () => {
    setSelectedFee(null);
    setPaymentForm(initialPaymentForm);
    setActiveTab("pending");
    setError("");
  };

  const filteredFees = fees.filter((item) => {
    const studentName = getStudentName(item.studentId);
    const month = item.billingMonth || "";
    const status = item.paymentStatus || "";

    return `${studentName} ${month} ${status}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const filteredPendingFees = pendingFees.filter((item) => {
    const studentName = getStudentName(item.studentId);
    const month = item.billingMonth || "";

    return `${studentName} ${month}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const filteredPayments = payments.filter((item) => {
    const studentName = getStudentName(item.studentId);

    return `${studentName} ${item.receiptNumber || ""} ${
      item.paymentMode || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <span className="badge bg-success">Paid</span>;
      case "Partial":
        return <span className="badge bg-warning text-dark">Partial</span>;
      default:
        return <span className="badge bg-danger">Pending</span>;
    }
  };

  const printReceipt = (payment) => {
    const studentName = getStudentName(payment.studentId);
    const transportFee = payment.transportFeeId || {};
    const receiptWindow = window.open("", "_blank", "width=800,height=650");

    if (!receiptWindow) {
      setError("Please allow pop-ups to print the receipt.");
      return;
    }

    const escapeHtml = (value) =>
      String(value ?? "-").replace(/[&<>"']/g, (char) => {
        const entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return entities[char];
      });

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transport Fee Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; }
          .receipt { max-width: 650px; margin: auto; border: 1px solid #ccc; padding: 25px; }
          h2, p.center { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { padding: 10px; border: 1px solid #ddd; text-align: left; }
          .amount { font-size: 20px; font-weight: bold; }
          .footer { margin-top: 35px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <h2>Transport Fee Receipt</h2>
          <p class="center">Payment Acknowledgement</p>
          <table>
            <tr><th>Receipt Number</th><td>${escapeHtml(payment.receiptNumber)}</td></tr>
            <tr><th>Student Name</th><td>${escapeHtml(studentName)}</td></tr>
            <tr><th>Billing Month</th><td>${escapeHtml(transportFee.billingMonth)}</td></tr>
            <tr><th>Payment Date</th><td>${escapeHtml(formatDate(payment.paymentDate))}</td></tr>
            <tr><th>Payment Mode</th><td>${escapeHtml(payment.paymentMode)}</td></tr>
            <tr><th>Transaction ID</th><td>${escapeHtml(payment.transactionId)}</td></tr>
            <tr><th>Amount Paid</th><td class="amount">₹${escapeHtml(payment.amountPaid)}</td></tr>
            <tr><th>Remarks</th><td>${escapeHtml(payment.remarks)}</td></tr>
          </table>
          <div class="footer">
            <p>Authorized Signature</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  const totalDue = fees.reduce(
    (sum, item) => sum + Number(item.amountDue || 0),
    0
  );

  const totalCollected = fees.reduce(
    (sum, item) => sum + Number(item.amountPaid || 0),
    0
  );

  const totalPending = fees.reduce(
    (sum, item) =>
      sum +
      Number(
        item.balance ??
          (Number(item.amountDue || 0) - Number(item.amountPaid || 0))
      ),
    0
  );

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Transport Fee Management</h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadAll}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h6 className="text-muted">Total Invoiced</h6>
              <h4>₹{totalDue.toLocaleString("en-IN")}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h6 className="text-muted">Total Collected</h6>
              <h4 className="text-success">
                ₹{totalCollected.toLocaleString("en-IN")}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-danger">
            <div className="card-body">
              <h6 className="text-muted">Pending Balance</h6>
              <h4 className="text-danger">
                ₹{totalPending.toLocaleString("en-IN")}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-warning">
            <div className="card-body">
              <h6 className="text-muted">Pending Invoices</h6>
              <h4>{pendingFees.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Monthly Fee */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Generate Transport Fee Invoice</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleGenerateFee}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Student Transport Assignment{" "}
                  <span className="text-danger">*</span>
                </label>

                <select
                  name="studentTransportId"
                  className="form-select"
                  value={generateForm.studentTransportId}
                  onChange={handleGenerateChange}
                  required
                >
                  <option value="">Select Student Assignment</option>

                  {assignments.map((item) => (
                    <option key={item._id} value={item._id}>
                      {getStudentName(item.studentId)} -{" "}
                      {item.routeId?.routeName || "Route"} - ₹
                      {item.monthlyFee || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Billing Month <span className="text-danger">*</span>
                </label>

                <input
                  type="month"
                  name="billingMonth"
                  className="form-control"
                  value={generateForm.billingMonth}
                  onChange={handleGenerateChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Due Date <span className="text-danger">*</span>
                </label>

                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={generateForm.dueDate}
                  onChange={handleGenerateChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Generate Invoice
            </button>
          </form>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "fees" ? "active" : ""
                }`}
                onClick={() => setActiveTab("fees")}
              >
                All Invoices
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "pending" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending Fees
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "collect" ? "active" : ""
                }`}
                onClick={() => setActiveTab("collect")}
              >
                Collect Payment
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "payments" ? "active" : ""
                }`}
                onClick={() => setActiveTab("payments")}
              >
                Payment History
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {activeTab !== "collect" && (
            <div className="row mb-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search student, month, receipt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* All Invoices */}
          {activeTab === "fees" && (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sr.</th>
                    <th>Student</th>
                    <th>Billing Month</th>
                    <th>Amount Due</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFees.length > 0 ? (
                    filteredFees.map((item, index) => {
                      const balance = Number(
                        item.balance ??
                          (Number(item.amountDue || 0) -
                            Number(item.amountPaid || 0))
                      );

                      return (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{getStudentName(item.studentId)}</td>
                          <td>{item.billingMonth}</td>
                          <td>₹{item.amountDue}</td>
                          <td>₹{item.amountPaid}</td>
                          <td>₹{balance}</td>
                          <td>{formatDate(item.dueDate)}</td>
                          <td>{getStatusBadge(item.paymentStatus)}</td>
                          <td>
                            {balance > 0 && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => openPaymentForm(item)}
                              >
                                Collect
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending Fees */}
          {activeTab === "pending" && (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sr.</th>
                    <th>Student</th>
                    <th>Billing Month</th>
                    <th>Total Due</th>
                    <th>Paid</th>
                    <th>Pending Balance</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPendingFees.length > 0 ? (
                    filteredPendingFees.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{getStudentName(item.studentId)}</td>
                        <td>{item.billingMonth}</td>
                        <td>₹{item.amountDue}</td>
                        <td>₹{item.amountPaid}</td>
                        <td className="text-danger fw-bold">
                          ₹
                          {item.balance ??
                            Number(item.amountDue || 0) -
                              Number(item.amountPaid || 0)}
                        </td>
                        <td>{formatDate(item.dueDate)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => openPaymentForm(item)}
                          >
                            Collect Payment
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No pending transport fees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Collect Payment */}
          {activeTab === "collect" && (
            <div>
              {!selectedFee ? (
                <div className="alert alert-info">
                  Please select an invoice from All Invoices or Pending Fees
                  and click Collect Payment.
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h5>Invoice Details</h5>
                        <hr />

                        <p>
                          <strong>Student:</strong>{" "}
                          {getStudentName(selectedFee.studentId)}
                        </p>

                        <p>
                          <strong>Billing Month:</strong>{" "}
                          {selectedFee.billingMonth}
                        </p>

                        <p>
                          <strong>Total Due:</strong> ₹
                          {selectedFee.amountDue}
                        </p>

                        <p>
                          <strong>Already Paid:</strong> ₹
                          {selectedFee.amountPaid}
                        </p>

                        <h5 className="text-danger">
                          Pending: ₹
                          {selectedFee.balance ??
                            Number(selectedFee.amountDue || 0) -
                              Number(selectedFee.amountPaid || 0)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <form onSubmit={handleCollectPayment}>
                      <div className="mb-3">
                        <label className="form-label">
                          Payment Amount (₹) *
                        </label>

                        <input
                          type="number"
                          name="amountPaid"
                          className="form-control"
                          min="1"
                          max={selectedFee.balance}
                          value={paymentForm.amountPaid}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Payment Date *</label>

                        <input
                          type="date"
                          name="paymentDate"
                          className="form-control"
                          value={paymentForm.paymentDate}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Payment Mode *</label>

                        <select
                          name="paymentMode"
                          className="form-select"
                          value={paymentForm.paymentMode}
                          onChange={handlePaymentChange}
                          required
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Online">Online</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Transaction ID</label>

                        <input
                          type="text"
                          name="transactionId"
                          className="form-control"
                          value={paymentForm.transactionId}
                          onChange={handlePaymentChange}
                          placeholder="Enter transaction ID"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Remarks</label>

                        <textarea
                          name="remarks"
                          className="form-control"
                          rows="2"
                          value={paymentForm.remarks}
                          onChange={handlePaymentChange}
                        />
                      </div>

                      <button type="submit" className="btn btn-success me-2">
                        Collect Payment
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelPayment}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment History */}
          {activeTab === "payments" && (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sr.</th>
                    <th>Receipt Number</th>
                    <th>Student</th>
                    <th>Amount Paid</th>
                    <th>Payment Date</th>
                    <th>Payment Mode</th>
                    <th>Transaction ID</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.receiptNumber}</td>
                        <td>{getStudentName(item.studentId)}</td>
                        <td>₹{item.amountPaid}</td>
                        <td>{formatDate(item.paymentDate)}</td>
                        <td>{item.paymentMode}</td>
                        <td>{item.transactionId || "-"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => printReceipt(item)}
                          >
                            Print Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No payment history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportFeeManagement;