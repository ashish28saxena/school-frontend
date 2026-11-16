
import React, { useEffect, useState } from "react";
import "./Library.css";

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
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
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
    { id: "book-form", label: bookId ? "Edit Book" : "Add Book" },
    { id: "issue", label: "Issue Book" },
    { id: "return", label: "Return Book" },
  ];

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

                <div className="col-md-6">
                  <label className="form-label">Student ID *</label>
                  <input
                    className="form-control"
                    name="studentId"
                    value={issueForm.studentId}
                    onChange={handleIssueChange}
                    placeholder="Enter Student MongoDB ID"
                    required
                  />
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
    </div>
  );
}

export default Library;
