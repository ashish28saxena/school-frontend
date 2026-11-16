
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function FeeReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const loadReceipts = async (receiptNumber = "") => {
    try {
      const params = new URLSearchParams();
      if (receiptNumber) params.append("receiptNumber", receiptNumber);

      const response = await fetch(
        `${API}/feereceipt/?${params.toString()}`
      );
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setReceipts(result.data || []);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const studentName = (student) =>
    student?.studentName ||
    [student?.firstName, student?.lastName].filter(Boolean).join(" ") ||
    student?.name ||
    "Student";

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

  const openReceipt = async (receiptNumber) => {
    try {
      const response = await fetch(
        `${API}/feereceipt/${encodeURIComponent(receiptNumber)}`
      );
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setSelected(result.data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4 no-print">Fee Receipt Management</h3>

      <div className="card shadow-sm mb-4 no-print">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-9">
              <input
                className="form-control"
                placeholder="Search by receipt number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadReceipts(search);
                }}
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button
                className="btn btn-primary w-100"
                onClick={() => loadReceipts(search)}
              >
                Search
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearch("");
                  loadReceipts();
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="card shadow-sm mb-4 receipt-paper">
          <div className="card-body p-4">
            <div className="text-center border-bottom pb-3">
              <h2 className="fw-bold">YOUR SCHOOL NAME</h2>
              <p className="mb-1">School Address | Contact Number</p>
              <h4 className="mt-3">FEE PAYMENT RECEIPT</h4>
            </div>

            <div className="row mt-4">
              <div className="col-6">
                <p><strong>Receipt No:</strong> {selected.receiptNumber}</p>
                <p><strong>Student:</strong> {studentName(selected.studentId)}</p>
                <p><strong>Admission No:</strong> {selected.studentId?.admissionNumber || "—"}</p>
                <p><strong>Class:</strong> {selected.classId?.className || "—"}</p>
              </div>
              <div className="col-6 text-end">
                <p><strong>Date:</strong> {formatDate(selected.paymentDate)}</p>
                <p><strong>Academic Year:</strong> {selected.academicYear}</p>
                <p><strong>Section:</strong> {selected.sectionId?.sectionName || "—"}</p>
                <p><strong>Payment Mode:</strong> {selected.paymentMode}</p>
              </div>
            </div>

            <table className="table table-bordered mt-3">
              <thead className="table-light">
                <tr>
                  <th>Description</th>
                  <th>Transaction ID</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>School Fee Payment</td>
                  <td>{selected.transactionId || "—"}</td>
                  <td className="text-end fw-bold">
                    {money(selected.amountPaid)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="2" className="text-end">Total Paid</th>
                  <th className="text-end">{money(selected.amountPaid)}</th>
                </tr>
              </tfoot>
            </table>

            <p><strong>Remarks:</strong> {selected.remarks || "—"}</p>

            <div className="d-flex justify-content-between text-center mt-5">
              <div>
                ____________________
                <p>Accountant Signature</p>
              </div>
              <div>
                ____________________
                <p>Authorized Signature</p>
              </div>
            </div>

            <p className="text-center mt-4 mb-0">
              Thank you for your payment.
            </p>
          </div>
        </div>
      )}

      {selected && (
        <div className="mb-4 no-print">
          <button
            className="btn btn-success"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setSelected(null)}
          >
            Close Receipt
          </button>
        </div>
      )}

      <div className="card shadow-sm no-print">
        <div className="card-header">
          <h5 className="mb-0">Receipt History</h5>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Receipt Number</th>
                <th>Student</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length ? receipts.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.receiptNumber}</td>
                  <td>{studentName(item.studentId)}</td>
                  <td>{formatDate(item.paymentDate)}</td>
                  <td>{money(item.amountPaid)}</td>
                  <td>{item.paymentMode}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openReceipt(item.receiptNumber)}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center">No Receipts Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeeReceipt;
