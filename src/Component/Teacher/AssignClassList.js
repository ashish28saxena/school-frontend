import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

const API = "https://school-management-backend-ochre.vercel.app";

const emptyFilters = {
  search: "",
  classId: "",
  sectionId: "",
  subjectId: "",
  status: "",
};

const AssignClassList = () => {
  const [assignSubjectData, setAssignSubjectData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState(emptyFilters);
  const [searchInput, setSearchInput] = useState(""); // typing ke liye
  const [options, setOptions] = useState({
    classes: [],
    sections: [],
    
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const offset = (currentPage - 1) * pageSize;

  // Dropdown options (ek baar)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/assignclass/filter-options`);
        const result = await res.json();
        setOptions({
          classes: result.classes || [],
          sections: result.sections || [],
          subjects: result.subjects || [],
        });
      } catch (error) {
        console.error("Filter options error:", error);
      }
    })();
  }, []);

  // Search debounce: typing rukne ke 400ms baad hi API call
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput.trim()) return prev;
        setCurrentPage(1);
        return { ...prev, search: searchInput.trim() };
      });
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const getAssignClass = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ offset, limit: pageSize });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`${API}/api/assignclass?${params}`);
      const result = await response.json();

      setAssignSubjectData(result.data || []);
      setTotalItems(Number(result.total) || 0);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, pageSize, filters]);

  useEffect(() => {
    getAssignClass();
  }, [getAssignClass]);

  async function removeAssignClass(item) {
    if (
      !window.confirm(
        `Delete ${item.teacherID?.firstName}? This can't be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/assignclass/delete/${item._id}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (response.ok && response.status === 200) {
        alert("Assign Subject deleted successfully!");
        // Page ka akela record delete hua to pichle page par jao
        if (assignSubjectData.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else {
          getAssignClass();
        }
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong while deleting");
    }
  }

  const updateFilter = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || searchInput;

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Page numbers with "..." (e.g. 1 ... 4 5 6 ... 12)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const delta = 1;
    for (let p = 1; p <= totalPages; p++) {
      if (
        p === 1 ||
        p === totalPages ||
        (p >= currentPage - delta && p <= currentPage + delta)
      ) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const rangeStart = assignSubjectData.length === 0 ? 0 : offset + 1;
  const rangeEnd = offset + assignSubjectData.length;

  return (
    <div className="container-fluid py-3">
      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label mb-1">Search teacher</label>
              <input
                type="text"
                className="form-control"
                placeholder="Teacher name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="form-label mb-1">Class</label>
              <select
                className="form-select"
                value={filters.classId}
                onChange={updateFilter("classId")}
              >
                <option value="">All classes</option>
                {options.classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="form-label mb-1">Section</label>
              <select
                className="form-select"
                value={filters.sectionId}
                onChange={updateFilter("sectionId")}
              >
                <option value="">All sections</option>
                {options.sections.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="form-label mb-1">Academic Year</label>
              {/* <select
                className="form-select"
                value={filters.subjectId}
                onChange={updateFilter("subjectId")}
              >
                <option value="">All subjects</option>
                {options.subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select> */}
              <select
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={updateFilter("subjectId")}
                  className="form-select"
                >

                 {Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, index) => {
                  const startYear = 2020 + index;
                  const endYear = startYear + 1;
                  const year = `${startYear}-${String(endYear).slice(-2)}`;

                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}

                </select>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="form-label mb-1">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={updateFilter("status")}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="col-12 col-lg-1 d-grid">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Teacher</th>
              <th scope="col">Class</th>
              <th scope="col">Section</th>
              <th scope="col">Academic-Year</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Loading...
                </td>
              </tr>
            ) : assignSubjectData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  {hasActiveFilters
                    ? "No records match these filters. Try resetting them."
                    : "No subjects assigned yet."}
                </td>
              </tr>
            ) : (
              assignSubjectData.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{offset + index + 1}</th>
                  <td>
                    {item.teacherID?.firstName} {item.teacherID?.lastName}
                  </td>
                  <td>{item.classId?.className}</td>
                  <td>{item.sectionId?.sectionName}</td>
                  <td>{item.academicYear}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="btn btn-success btn-sm me-2"
                      to={"/Edit-Assign-Class/" + item._id}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeAssignClass(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Rows per page</span>
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-muted">
            {`${rangeStart}–${rangeEnd} of ${totalItems}`}
          </span>
        </div>

        <nav aria-label="Assign subject pagination">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <li key={`dots-${i}`} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li
                  key={p}
                  className={`page-item ${p === currentPage ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(p)}>
                    {p}
                  </button>
                </li>
              )
            )}

            <li
              className={`page-item ${
                currentPage >= totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AssignClassList;