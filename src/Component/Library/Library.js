import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./Library.css";
import LibraryExtras from "./LibraryExtras";
const API = "https://school-management-backend-ochre.vercel.app/api/library";

const emptyBook = {
  bookName: "",
  bookCode: "",
  isbn: "",
  categoryId: "",
  author: "",
  publisher: "",
  edition: "",
  publicationYear: "",
  shelfNumber: "",
  price: "",
  totalCopies: 1,
  description: "",
};

function Library() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [reports, setReports] = useState({});

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [bookForm, setBookForm] = useState(emptyBook);
  const [bookId, setBookId] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeBook, setBarcodeBook] = useState(null);

  const [classes, setClasses] = useState([]);
const [classId, setClassId] = useState("");
const [classStudents, setClassStudents] = useState([]);

  const [issueForm, setIssueForm] = useState({
    bookId: "",
    studentId: "",
    assignStudentId: "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    finePerDay: 5,
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [historyStudentId, setHistoryStudentId] = useState("");
const [studentHistory, setStudentHistory] = useState([]);
const [historyLoading, setHistoryLoading] = useState(false);


const [pendingFines, setPendingFines] = useState([]);
const [finePayments, setFinePayments] = useState([]);
const [selectedFine, setSelectedFine] = useState(null);

const [finePaymentForm, setFinePaymentForm] = useState({
  amountPaid: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMode: "Cash",
  transactionId: "",
  remarks: "",
});
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

  const notify = (msg) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 3000);
  };

  const showError = (err) => {
    setError(err.message || "Something went wrong");
    setMessage("");
  };

  // Load categories
  const fetchCategories = async () => {
    try {
      const result = await request("/categories");
      setCategories(result.data || []);
    } catch (err) {
      showError(err);
    }
  };

  // Load books
  const fetchBooks = async () => {
    try {
      const result = await request("/books");
      setBooks(result.data || []);
    } catch (err) {
      showError(err);
    }
  };

  // Load issue records
  const fetchIssues = async () => {
    try {
      const result = await request("/issues");
      setIssues(result.data || []);
    } catch (err) {
      showError(err);
    }
  };

  // Load dashboard report
  const fetchReports = async () => {
    try {
      const result = await request("/reports");
      setReports(result.data || {});
    } catch (err) {
      showError(err);
    }
  };

const loadAll = async () => {
  setLoading(true);

  await Promise.all([
    fetchCategories(),
    fetchBooks(),
    fetchIssues(),
    fetchReports(),
    fetchPendingFines(),
    fetchFinePayments(),
  ]);

  setLoading(false);
};

  useEffect(() => {
    loadAll();
    fetchClasses();
  }, []);

  // Category submit/update
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      const url = categoryId
        ? `/category/update/${categoryId}`
        : "/category/submit";

      await request(url, {
        method: categoryId ? "PUT" : "POST",
        body: JSON.stringify({
          categoryName,
          description: categoryDescription,
        }),
      });

      notify(categoryId ? "Category updated successfully" : "Category added successfully");

      setCategoryName("");
      setCategoryDescription("");
      setCategoryId("");
      fetchCategories();
    } catch (err) {
      showError(err);
    }
  };

  const editCategory = (item) => {
    setCategoryId(item._id);
    setCategoryName(item.categoryName);
    setCategoryDescription(item.description || "");
    setActiveTab("category");
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const result = await request(`/category/delete/${id}`, {
        method: "DELETE",
      });
      notify(result.message);
      fetchCategories();
    } catch (err) {
      showError(err);
    }
  };

  // Book form input
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add/update book
  const handleBookSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...bookForm,
        price: Number(bookForm.price || 0),
        totalCopies: Number(bookForm.totalCopies),
        publicationYear: bookForm.publicationYear
          ? Number(bookForm.publicationYear)
          : null,
      };

      const url = bookId
        ? `/book/update/${bookId}`
        : "/book/submit";

      const result = await request(url, {
        method: bookId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      notify(result.message);
      setBookForm(emptyBook);
      setBookId("");
      fetchBooks();
      fetchReports();
      setActiveTab("books");
    } catch (err) {
      showError(err);
    }
  };

  const editBook = (item) => {
    setBookId(item._id);

    setBookForm({
      bookName: item.bookName || "",
      bookCode: item.bookCode || "",
      isbn: item.isbn || "",
      categoryId: item.categoryId?._id || item.categoryId || "",
      author: item.author || "",
      publisher: item.publisher || "",
      edition: item.edition || "",
      publicationYear: item.publicationYear || "",
      shelfNumber: item.shelfNumber || "",
      price: item.price || "",
      totalCopies: item.totalCopies || 1,
      description: item.description || "",
    });

    setActiveTab("book-form");
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const result = await request(`/book/delete/${id}`, {
        method: "DELETE",
      });
      notify(result.message);
      fetchBooks();
      fetchReports();
    } catch (err) {
      showError(err);
    }
  };

  // Search book using scanned/typed Book Code or ISBN
  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    try {
      const result = await request(`/book/barcode/${encodeURIComponent(code)}`);
      setBarcodeBook(result.data || null);
    } catch (err) {
      setBarcodeBook(null);
      showError(err);
    }
  };

  const printBookBarcode = () => {
    const canvas = document.getElementById("library-book-qr");
    if (!canvas || !barcodeBook) return showError(new Error("QR code is not ready"));
    const qrImage = canvas.toDataURL("image/png");
    const win = window.open("", "_blank", "width=600,height=600");
    if (!win) return showError(new Error("Please allow pop-ups to print"));
    const safe = (value) => String(value || "-").replace(/[<>]/g, "");
    win.document.write(`<html><head><title>Book QR Label</title><style>
      body{font-family:Arial;text-align:center;padding:24px}.label{width:280px;margin:auto;border:1px solid #222;padding:16px}
      img{width:170px;height:170px}h3{font-size:18px}
      </style></head><body><div class="label"><h3>${safe(barcodeBook.bookName)}</h3>
      <img src="${qrImage}"/><p><b>Book Code:</b> ${safe(barcodeBook.bookCode)}</p>
      <p><b>Author:</b> ${safe(barcodeBook.author)}</p></div>
      <script>window.onload=()=>window.print();</script></body></html>`);
    win.document.close();
  };

  // Issue book
  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setIssueForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...issueForm,
        finePerDay: Number(issueForm.finePerDay),
      };

      const result = await request("/issue", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      notify(result.message);

      setIssueForm({
        bookId: "",
        studentId: "",
        assignStudentId: "",
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: "",
        finePerDay: 5,
        remarks: "",
      });

      fetchBooks();
      fetchIssues();
      fetchReports();
    } catch (err) {
      showError(err);
    }
  };

  // Return book
  const handleReturn = async (id) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;

    try {
      const result = await request(`/return/${id}`, {
        method: "POST",
        body: JSON.stringify({
          returnDate: new Date().toISOString().slice(0, 10),
        }),
      });

      notify(
        `${result.message}. Fine: ₹${result.fineAmount || 0}`
      );

      fetchIssues();
      fetchBooks();
      fetchReports();
    } catch (err) {
      showError(err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "category", label: "Book Category" },
    { id: "books", label: "Book List" },
    { id: "barcode", label: "Barcode / QR Code" },
    { id: "book-form", label: bookId ? "Edit Book" : "Add Book" },
    { id: "issue", label: "Issue Book" },
    { id: "return", label: "Return Book" },
    { id: "student-history", label: "Student Book History" },
    { id: "overdue", label: "Overdue Books" },
    { id: "fine-collection", label: "Fine Collection" },
    { id: "advanced", label: "Advanced Library" }
  ];

  // Fetch classes
const fetchClasses = async () => {
  try {
    const result = await fetch("https://school-management-backend-ochre.vercel.app/api/class/");
    const data = await result.json();

    setClasses(data || []);
  } catch (error) {
    showError(error);
  }
};

// Fetch students according to selected class
const fetchClassStudents = async (selectedClassId) => {
  try {
    setClassStudents([]);

    const result = await request(
      `/students?classId=${selectedClassId}`
    );

    setClassStudents(result.data || []);
  } catch (error) {
    showError(error);
  }
};

// Class change
const handleClassChange = (e) => {
  const selectedClassId = e.target.value;

  setClassId(selectedClassId);

  setIssueForm((prev) => ({
    ...prev,
    studentId: "",
    assignStudentId: "",
  }));

  if (selectedClassId) {
    fetchClassStudents(selectedClassId);
  } else {
    setClassStudents([]);
  }
};

// Student change
const handleStudentChange = (e) => {
  const assignmentId = e.target.value;

  const selectedStudent = classStudents.find(
    (item) => item._id === assignmentId
  );

  setIssueForm((prev) => ({
    ...prev,
    assignStudentId: selectedStudent?._id || "",
    studentId: selectedStudent?.studentId?._id || "",
  }));
};

const fetchStudentHistory = async (studentId) => {
  if (!studentId) {
    setStudentHistory([]);
    return;
  }

  try {
    setHistoryLoading(true);

    const result = await request(
      `/issues?studentId=${studentId}`
    );

    setStudentHistory(result.data || []);
  } catch (error) {
    showError(error);
  } finally {
    setHistoryLoading(false);
  }
};

const handleHistoryStudentChange = (e) => {
  const studentId = e.target.value;

  setHistoryStudentId(studentId);
  fetchStudentHistory(studentId);
};

const [historyClassId, setHistoryClassId] = useState("");
const [historyStudents, setHistoryStudents] = useState([]);

const handleHistoryClassChange = async (e) => {
  const selectedClassId = e.target.value;

  setHistoryClassId(selectedClassId);
  setHistoryStudentId("");
  setHistoryStudents([]);
  setStudentHistory([]);

  if (!selectedClassId) return;

  try {
    const result = await request(
      `/students?classId=${selectedClassId}`
    );

    setHistoryStudents(result.data || []);
  } catch (error) {
    showError(error);
  }
};


// Check whether book is overdue
const isOverdue = (item) => {
  if (item.status !== "Issued" || !item.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(item.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

// Calculate overdue days
const getOverdueDays = (dueDate) => {
  if (!dueDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.ceil((today - due) / (1000 * 60 * 60 * 24))
  );
};

// Calculate pending fine
const getOverdueFine = (item) => {
  const days = getOverdueDays(item.dueDate);
  return days * Number(item.finePerDay || 0);
};


// Fetch pending fines
const fetchPendingFines = async () => {
  try {
    const result = await request("/fine-pending");
    setPendingFines(result.data || []);
  } catch (error) {
    showError(error);
  }
};

// Fetch payment history
const fetchFinePayments = async () => {
  try {
    const result = await request("/fine-collections");
    setFinePayments(result.data || []);
  } catch (error) {
    showError(error);
  }
};

// Select fine for payment
const handleSelectFine = (item) => {
  setSelectedFine(item);

  setFinePaymentForm({
    amountPaid: item.balance,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "Cash",
    transactionId: "",
    remarks: "",
  });
};

// Handle payment form changes
const handleFinePaymentChange = (e) => {
  const { name, value } = e.target;

  setFinePaymentForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// Collect fine payment
const handleFinePaymentSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await request("/fine-collection", {
      method: "POST",
      body: JSON.stringify({
        issueId: selectedFine._id,
        ...finePaymentForm,
        amountPaid: Number(finePaymentForm.amountPaid),
      }),
    });

    notify(
      `${result.message}. Remaining Fine: ₹${result.balance}`
    );

    setSelectedFine(null);

    setFinePaymentForm({
      amountPaid: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: "Cash",
      transactionId: "",
      remarks: "",
    });

    await Promise.all([
      fetchPendingFines(),
      fetchFinePayments(),
    ]);
  } catch (error) {
    showError(error);
  }
};

// Print a fine payment receipt. Use the browser print dialog to print or save as PDF.
const printFineReceipt = (item) => {
  const escapeHtml = (value) =>
    String(value ?? "-").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));

  const student = item.studentId || {};
  const studentName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.studentName || "-";
  const bookName = item.bookId?.bookName || "-";
  const receiptWindow = window.open("", "_blank", "width=800,height=900");

  if (!receiptWindow) {
    showError("Please allow pop-ups to print the receipt.");
    return;
  }

  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fine Receipt - ${escapeHtml(item.receiptNumber)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #222; margin: 0; padding: 30px; }
          .receipt { max-width: 720px; margin: 0 auto; border: 1px solid #bbb; padding: 28px; }
          .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 16px; }
          .header h2 { margin: 0 0 6px; }
          .header p { margin: 0; color: #555; }
          .receipt-title { text-align: center; margin: 22px 0; font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .meta { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #bbb; padding: 11px; text-align: left; }
          th { width: 38%; background: #f4f4f4; }
          .amount { font-size: 20px; font-weight: bold; }
          .footer { margin-top: 45px; display: flex; justify-content: space-between; }
          .signature { border-top: 1px solid #555; padding-top: 8px; width: 190px; text-align: center; }
          .thanks { text-align: center; margin-top: 30px; color: #555; }
          @media print { body { padding: 0; } .receipt { border: 0; max-width: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>School Library</h2>
            <p>Fine Payment Receipt</p>
          </div>
          <div class="receipt-title">Payment Receipt</div>
          <div class="meta">
            <div><strong>Receipt No:</strong> ${escapeHtml(item.receiptNumber)}</div>
            <div><strong>Date:</strong> ${escapeHtml(formatDate(item.paymentDate))}</div>
          </div>
          <table>
            <tr><th>Student Name</th><td>${escapeHtml(studentName)}</td></tr>
            <tr><th>Admission Number</th><td>${escapeHtml(student.admissionNumber || "-")}</td></tr>
            <tr><th>Book Name</th><td>${escapeHtml(bookName)}</td></tr>
            <tr><th>Amount Paid</th><td class="amount">₹${escapeHtml(Number(item.amountPaid || 0).toFixed(2))}</td></tr>
            <tr><th>Payment Mode</th><td>${escapeHtml(item.paymentMode)}</td></tr>
            <tr><th>Transaction ID</th><td>${escapeHtml(item.transactionId || "-")}</td></tr>
            <tr><th>Remarks</th><td>${escapeHtml(item.remarks || "-")}</td></tr>
          </table>
          <div class="footer">
            <div class="signature">Received By</div>
            <div class="signature">Authorized Signature</div>
          </div>
          <div class="thanks">Thank you.</div>
        </div>
        <script>window.onload = function () { window.focus(); window.print(); };</script>
      </body>
    </html>
  `);
  receiptWindow.document.close();
};

  return (
    <div className="container-fluid library-page">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Library Management</h3>
          <p className="text-muted mb-0">
            Manage books, categories, issue and return records
          </p>
        </div>

        <button className="btn btn-primary" onClick={loadAll}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible">
          {message}
          <button
            className="btn-close"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="library-tabs mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn ${
              activeTab === tab.id ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== "book-form") {
                setBookId("");
                setBookForm(emptyBook);
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="row g-3">
          {[
            ["Total Book Titles", reports.totalTitles || 0, "primary"],
            ["Total Copies", reports.totalCopies || 0, "info"],
            ["Available Copies", reports.availableCopies || 0, "success"],
            ["Issued Books", reports.issuedBooks || 0, "warning"],
            ["Overdue Books", reports.overdueBooks || 0, "danger"],
            ["Returned Books", reports.returnedBooks || 0, "secondary"],
          ].map(([label, value, color]) => (
            <div className="col-md-4 col-lg-2" key={label}>
              <div className={`card border-0 shadow-sm library-stat ${color}`}>
                <div className="card-body">
                  <p className="mb-2">{label}</p>
                  <h3 className="fw-bold mb-0">{value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY */}
      {activeTab === "category" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white fw-bold">
                {categoryId ? "Update Category" : "Add Category"}
              </div>
              <div className="card-body">
                <form onSubmit={handleCategorySubmit}>
                  <div className="mb-3">
                    <label className="form-label">Category Name *</label>
                    <input
                      className="form-control"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      placeholder="Enter category name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>

                  <button className="btn btn-primary me-2">
                    {categoryId ? "Update Category" : "Add Category"}
                  </button>

                  {categoryId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setCategoryId("");
                        setCategoryName("");
                        setCategoryDescription("");
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white fw-bold">
                Category List
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.categoryName}</td>
                        <td>{item.description || "-"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => editCategory(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCategory(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BARCODE / QR CODE MANAGEMENT */}
      {activeTab === "barcode" && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white fw-bold">Find Book by Barcode / QR</div>
              <div className="card-body">
                <p className="text-muted">USB barcode scanners work like a keyboard. Scan the code here and press Enter.</p>
                <form onSubmit={handleBarcodeSearch} className="d-flex gap-2">
                  <input autoFocus className="form-control" value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan or enter Book Code / ISBN" />
                  <button className="btn btn-primary" type="submit">Search</button>
                </form>
                {barcodeBook && <div className="mt-4 border rounded p-3">
                  <h5 className="fw-bold">{barcodeBook.bookName}</h5>
                  <p className="mb-1"><b>Book Code:</b> {barcodeBook.bookCode}</p>
                  <p className="mb-1"><b>ISBN:</b> {barcodeBook.isbn || "-"}</p>
                  <p className="mb-1"><b>Author:</b> {barcodeBook.author || "-"}</p>
                  <p className="mb-1"><b>Total Copies:</b> {barcodeBook.totalCopies}</p>
                  <p className="mb-0"><b>Available Copies:</b> {barcodeBook.availableCopies}</p>
                  <button className="btn btn-outline-success btn-sm mt-3" onClick={() => {
                    setIssueForm((prev) => ({ ...prev, bookId: barcodeBook._id }));
                    setActiveTab("issue");
                  }}>Use Book in Issue Form</button>
                </div>}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white fw-bold">Generate & Print QR Label</div>
              <div className="card-body text-center">
                <p className="text-muted">QR code contains the Book Code.</p>
                {barcodeBook ? <>
                  <div className="d-inline-block bg-white p-3 border rounded">
                    <QRCodeCanvas id="library-book-qr" value={barcodeBook.bookCode} size={190} level="H" includeMargin />
                  </div>
                  <div className="mt-2 fw-bold">{barcodeBook.bookCode}</div>
                  <button className="btn btn-success mt-3" onClick={printBookBarcode}>
                    <i className="bi bi-printer me-1"></i> Print QR Label
                  </button>
                </> : <div className="text-muted py-5">Search a book to preview its QR code.</div>}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-bold">Book Codes</div>
              <div className="table-responsive"><table className="table table-hover align-middle mb-0">
                <thead className="table-light"><tr><th>#</th><th>Book Name</th><th>Book Code</th><th>ISBN</th><th>Available</th><th>Action</th></tr></thead>
                <tbody>{books.map((book, index) => <tr key={book._id}>
                  <td>{index + 1}</td><td>{book.bookName}</td><td>{book.bookCode}</td>
                  <td>{book.isbn || "-"}</td><td>{book.availableCopies}</td>
                  <td><button className="btn btn-sm btn-outline-primary" onClick={() => {
                    setBarcodeBook(book); setBarcodeInput(book.bookCode);
                  }}>Generate QR</button></td>
                </tr>)}
                {books.length === 0 && <tr><td colSpan="6" className="text-center py-3">No books found</td></tr>}</tbody>
              </table></div>
            </div>
          </div>
        </div>
      )}

      {/* BOOK LIST */}
      {activeTab === "books" && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <strong>Book List</strong>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setBookId("");
                setBookForm(emptyBook);
                setActiveTab("book-form");
              }}
            >
              + Add New Book
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Book Name</th>
                  <th>Code</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{item.bookName}</td>
                    <td>{item.bookCode}</td>
                    <td>
                      {item.categoryId?.categoryName || "-"}
                    </td>
                    <td>{item.author}</td>
                    <td>{item.totalCopies}</td>
                    <td>
                      <span className="badge bg-success">
                        {item.availableCopies}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editBook(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteBook(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT BOOK */}
      {activeTab === "book-form" && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white fw-bold">
            {bookId ? "Update Book" : "Add New Book"}
          </div>
          <div className="card-body">
            <form onSubmit={handleBookSubmit}>
              <div className="row g-3">
                {[
                  ["bookName", "Book Name", true],
                  ["bookCode", "Book Code", true],
                  ["isbn", "ISBN", false],
                  ["author", "Author", true],
                  ["publisher", "Publisher", false],
                  ["edition", "Edition", false],
                  ["publicationYear", "Publication Year", false],
                  ["shelfNumber", "Shelf Number", false],
                  ["price", "Price", false],
                  ["totalCopies", "Total Copies", true],
                ].map(([name, label, required]) => (
                  <div className="col-md-6 col-lg-4" key={name}>
                    <label className="form-label">
                      {label} {required && "*"}
                    </label>
                    <input
                      type={
                        ["price", "totalCopies", "publicationYear"].includes(name)
                          ? "number"
                          : "text"
                      }
                      min={
                        ["price", "totalCopies"].includes(name) ? "0" : undefined
                      }
                      className="form-control"
                      name={name}
                      value={bookForm[name]}
                      onChange={handleBookChange}
                      required={required}
                    />
                  </div>
                ))}

                <div className="col-md-6 col-lg-4">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    name="categoryId"
                    value={bookForm.categoryId}
                    onChange={handleBookChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={bookForm.description}
                    onChange={handleBookChange}
                  />
                </div>
              </div>

              <div className="mt-4">
                <button className="btn btn-primary me-2">
                  {bookId ? "Update Book" : "Save Book"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setBookId("");
                    setBookForm(emptyBook);
                    setActiveTab("books");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE BOOK */}
      {activeTab === "issue" && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white fw-bold">Issue Book to Student</div>
          <div className="card-body">
            <form onSubmit={handleIssueSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Select Book *</label>
                  <select
                    className="form-select"
                    name="bookId"
                    value={issueForm.bookId}
                    onChange={handleIssueChange}
                    required
                  >
                    <option value="">Select Book</option>
                    {books
                      .filter((book) => book.availableCopies > 0)
                      .map((book) => (
                        <option key={book._id} value={book._id}>
                          {book.bookName} ({book.availableCopies} available)
                        </option>
                      ))}
                  </select>
                </div>

                {/* <div className="col-md-6">
                  <label className="form-label">Student ID *</label>
                  <input
                    className="form-control"
                    name="studentId"
                    value={issueForm.studentId}
                    onChange={handleIssueChange}
                    placeholder="Enter Student MongoDB ID"
                    required
                  />
                </div> */}

                {/* Select Class */}
<div className="col-md-6">
  <label className="form-label">Select Class *</label>
  <select
    className="form-select"
    value={classId}
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

{/* Select Student / Assign Student ID */}
<div className="col-md-6">
  <label className="form-label">Select Student *</label>
  <select
    className="form-select"
    value={issueForm.assignStudentId}
    onChange={handleStudentChange}
    disabled={!classId || classStudents.length === 0}
    required
  >
    <option value="">
      {!classId
        ? "First Select Class"
        : classStudents.length === 0
        ? "No Students Found"
        : "Select Student"}
    </option>

    {classStudents.map((item) => {
      const student = item.studentId || {};

      const studentName = `${student.firstName || ""} ${
        student.lastName || ""
      }`.trim();

      return (
        <option key={item._id} value={item._id}>
          {studentName || student.studentName || "Student"}
          {" - Roll No: "}
          {item.rollNumber}
          {" - Section: "}
          {item.sectionId?.sectionName || "-"}
        </option>
      );
    })}
  </select>
</div>

                <div className="col-md-6">
                  <label className="form-label">Assign Student ID</label>
                  <input
                    className="form-control"
                    name="assignStudentId"
                    value={issueForm.assignStudentId}
                    onChange={handleIssueChange}
                    placeholder="Optional assignment ID"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Issue Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="issueDate"
                    value={issueForm.issueDate}
                    onChange={handleIssueChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={issueForm.dueDate}
                    min={issueForm.issueDate}
                    onChange={handleIssueChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Fine Per Day (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="finePerDay"
                    value={issueForm.finePerDay}
                    onChange={handleIssueChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="remarks"
                    value={issueForm.remarks}
                    onChange={handleIssueChange}
                  />
                </div>
              </div>

              <button className="btn btn-primary mt-4">
                Issue Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RETURN BOOK */}
      {activeTab === "return" && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white fw-bold">
            Issued Books / Return Book
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues
                  .filter((item) => item.status === "Issued")
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        {item.bookId?.bookName || "-"}
                        <div className="small text-muted">
                          {item.bookId?.bookCode}
                        </div>
                      </td>
                      <td>
                        {item.studentId?.firstName || ""}
                        {" "}
                        {item.studentId?.lastName || ""}
                        {!item.studentId?.firstName &&
                          (item.studentId?._id || "-")}
                      </td>
                      <td>{formatDate(item.issueDate)}</td>
                      <td>{formatDate(item.dueDate)}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          Issued
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleReturn(item._id)}
                        >
                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))}
                {issues.filter((item) => item.status === "Issued").length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No issued books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT BOOK HISTORY */}
{activeTab === "student-history" && (
  <div className="card shadow-sm border-0">

    <div className="card-header bg-white">
      <h5 className="mb-0 fw-bold">Student Book History</h5>
    </div>

    <div className="card-body">

      {/* Filters */}
      <div className="row g-3 mb-4">

        <div className="col-md-6">
          <label className="form-label">Select Class *</label>

          <select
            className="form-select"
            value={historyClassId}
            onChange={handleHistoryClassChange}
          >
            <option value="">Select Class</option>

            {classes.map((item) => (
              <option key={item._id} value={item._id}>
                {item.className}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Select Student *</label>

          <select
            className="form-select"
            value={historyStudentId}
            onChange={handleHistoryStudentChange}
            disabled={!historyClassId || historyStudents.length === 0}
          >
            <option value="">Select Student</option>

            {historyStudents.map((item) => {
              const student = item.studentId || {};

              const name = `${student.firstName || ""} ${
                student.lastName || ""
              }`.trim();

              return (
                <option key={item._id} value={student._id || ""}>
                  {name || student.studentName || "Student"}
                  {" - Roll No: "}
                  {item.rollNumber}
                  {" - Section: "}
                  {item.sectionId?.sectionName || "-"}
                </option>
              );
            })}
          </select>
        </div>

      </div>

      {/* History Table */}
      {historyStudentId && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Book Issue History</h6>

            <span className="badge bg-primary">
              Total Records: {studentHistory.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Book Name</th>
                  <th>Book Code</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine Amount</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {historyLoading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                    </td>
                  </tr>
                ) : studentHistory.length > 0 ? (
                  studentHistory.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {item.bookId?.bookName || "-"}
                      </td>

                      <td>{item.bookId?.bookCode || "-"}</td>

                      <td>{formatDate(item.issueDate)}</td>

                      <td>{formatDate(item.dueDate)}</td>

                      <td>{formatDate(item.returnDate)}</td>

                      <td>
                        ₹{item.fineAmount || 0}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.status === "Returned"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>{item.remarks || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No book history found for this student.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </>
      )}

      {!historyStudentId && (
        <div className="text-center text-muted py-4">
          Please select a class and student to view book history.
        </div>
      )}

    </div>
  </div>
)}


{/* OVERDUE BOOKS */}
{activeTab === "overdue" && (
  <div className="card shadow-sm border-0">

    <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
      <h5 className="fw-bold mb-0">Overdue Books</h5>

      <span className="badge bg-danger">
        Total Overdue: {issues.filter(isOverdue).length}
      </span>
    </div>

    <div className="card-body">

      {/* Summary */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card bg-danger-subtle border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Overdue Books</p>
              <h3 className="fw-bold text-danger mb-0">
                {issues.filter(isOverdue).length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-warning-subtle border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Total Overdue Days</p>
              <h3 className="fw-bold text-warning-emphasis mb-0">
                {issues
                  .filter(isOverdue)
                  .reduce(
                    (total, item) =>
                      total + getOverdueDays(item.dueDate),
                    0
                  )}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success-subtle border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Estimated Pending Fine</p>
              <h3 className="fw-bold text-success mb-0">
                ₹
                {issues
                  .filter(isOverdue)
                  .reduce(
                    (total, item) =>
                      total + getOverdueFine(item),
                    0
                  )}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Overdue Table */}
      <div className="table-responsive">

        <table className="table table-hover table-bordered align-middle">

          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Book Name</th>
              <th>Book Code</th>
              <th>Student Name</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Overdue Days</th>
              <th>Fine / Day</th>
              <th>Estimated Fine</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {issues
              .filter(isOverdue)
              .map((item, index) => {
                const student = item.studentId || {};
                const studentName = `${student.firstName || ""} ${
                  student.lastName || ""
                }`.trim();

                return (
                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      {item.bookId?.bookName || "-"}
                    </td>

                    <td>
                      {item.bookId?.bookCode || "-"}
                    </td>

                    <td>
                      {studentName || student.studentName || "-"}
                    </td>

                    <td>{formatDate(item.issueDate)}</td>

                    <td className="text-danger fw-semibold">
                      {formatDate(item.dueDate)}
                    </td>

                    <td>
                      <span className="badge bg-danger">
                        {getOverdueDays(item.dueDate)} Days
                      </span>
                    </td>

                    <td>
                      ₹{item.finePerDay || 0}
                    </td>

                    <td className="fw-bold text-danger">
                      ₹{getOverdueFine(item)}
                    </td>

                    <td>
                      <span className="badge bg-danger">
                        Overdue
                      </span>
                    </td>

                  </tr>
                );
              })}

            {issues.filter(isOverdue).length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  <div className="text-success">
                    <i className="bi bi-check-circle fs-2"></i>
                    <p className="mb-0 mt-2">
                      No overdue books found.
                    </p>
                  </div>
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  </div>
)}


{/* FINE COLLECTION */}
{activeTab === "fine-collection" && (
  <div className="row g-4">

    {/* Summary Cards */}
    <div className="col-md-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <p className="text-muted mb-1">Pending Fine Records</p>
          <h3 className="fw-bold text-danger">
            {pendingFines.length}
          </h3>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <p className="text-muted mb-1">Total Pending Fine</p>
          <h3 className="fw-bold text-warning">
            ₹{pendingFines.reduce(
              (total, item) => total + Number(item.balance || 0),
              0
            )}
          </h3>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <p className="text-muted mb-1">Total Fine Payments</p>
          <h3 className="fw-bold text-success">
            ₹{finePayments.reduce(
              (total, item) => total + Number(item.amountPaid || 0),
              0
            )}
          </h3>
        </div>
      </div>
    </div>

    {/* Pending Fine List */}
    <div className="col-12">
      <div className="card shadow-sm border-0">

        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Pending Fine List</h5>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              fetchPendingFines();
              fetchFinePayments();
            }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Book Name</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Total Fine</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingFines.map((item, index) => {
                const student = item.studentId || {};

                const studentName = `${student.firstName || ""} ${
                  student.lastName || ""
                }`.trim();

                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>
                      {studentName || student.studentName || "-"}
                    </td>

                    <td>
                      {item.bookId?.bookName || "-"}
                      <div className="small text-muted">
                        {item.bookId?.bookCode || ""}
                      </div>
                    </td>

                    <td>{formatDate(item.issueDate)}</td>
                    <td>{formatDate(item.returnDate)}</td>

                    <td>₹{item.totalFine}</td>
                    <td className="text-success">
                      ₹{item.totalPaid}
                    </td>

                    <td className="fw-bold text-danger">
                      ₹{item.balance}
                    </td>

                    <td>
                      <span className={`badge ${
                        item.paymentStatus === "Partial"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}>
                        {item.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSelectFine(item)}
                      >
                        Collect Fine
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pendingFines.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No pending fine records found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>

    {/* Fine Payment Form */}
    {selectedFine && (
      <div className="col-12">
        <div className="card shadow-sm border-0">

          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Collect Fine Payment</h5>

            <button
              type="button"
              className="btn-close"
              onClick={() => setSelectedFine(null)}
            ></button>
          </div>

          <div className="card-body">

            <div className="row g-3 mb-3">

              <div className="col-md-4">
                <label className="form-label">Total Fine</label>
                <input
                  className="form-control"
                  value={`₹${selectedFine.totalFine}`}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Already Paid</label>
                <input
                  className="form-control"
                  value={`₹${selectedFine.totalPaid}`}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Remaining Balance</label>
                <input
                  className="form-control text-danger fw-bold"
                  value={`₹${selectedFine.balance}`}
                  readOnly
                />
              </div>

            </div>

            <form onSubmit={handleFinePaymentSubmit}>
              <div className="row g-3">

                <div className="col-md-4">
                  <label className="form-label">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="amountPaid"
                    value={finePaymentForm.amountPaid}
                    onChange={handleFinePaymentChange}
                    min="0.01"
                    max={selectedFine.balance}
                    step="0.01"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="paymentDate"
                    value={finePaymentForm.paymentDate}
                    onChange={handleFinePaymentChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Payment Mode *
                  </label>
                  <select
                    className="form-select"
                    name="paymentMode"
                    value={finePaymentForm.paymentMode}
                    onChange={handleFinePaymentChange}
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
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="transactionId"
                    value={finePaymentForm.transactionId}
                    onChange={handleFinePaymentChange}
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    name="remarks"
                    value={finePaymentForm.remarks}
                    onChange={handleFinePaymentChange}
                    placeholder="Enter remarks"
                  />
                </div>

              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-success me-2"
                >
                  <i className="bi bi-cash-coin me-1"></i>
                  Collect Payment
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedFine(null)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    )}

    {/* Payment History */}
    <div className="col-12">
      <div className="card shadow-sm border-0">

        <div className="card-header bg-white">
          <h5 className="fw-bold mb-0">Fine Payment History</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Receipt No.</th>
                <th>Student</th>
                <th>Book</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Payment Mode</th>
                <th>Transaction ID</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {finePayments.map((item, index) => {
                const student = item.studentId || {};

                const studentName = `${student.firstName || ""} ${
                  student.lastName || ""
                }`.trim();

                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">
                      {item.receiptNumber}
                    </td>
                    <td>
                      {studentName || student.studentName || "-"}
                    </td>
                    <td>{item.bookId?.bookName || "-"}</td>
                    <td className="text-success fw-bold">
                      ₹{item.amountPaid}
                    </td>
                    <td>{formatDate(item.paymentDate)}</td>
                    <td>{item.paymentMode}</td>
                    <td>{item.transactionId || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => printFineReceipt(item)}
                      >
                        <i className="bi bi-printer me-1"></i>
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}

              {finePayments.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No fine payment history found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>

    

  </div>
)}
{activeTab === "advanced" && (
  <LibraryExtras
    books={books}
    onRefreshBooks={() => {
      fetchBooks();
      fetchReports();
    }}
  />
)}


    </div>
  );
}

export default Library;
