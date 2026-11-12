import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Page numbers with dots: 1 ... 4 5 6 ... 10
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const delta = 1; // current page ke aas-paas kitne pages dikhane hain

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // pehla page
      i === totalPages || // last page
      (i >= currentPage - delta && i <= currentPage + delta) // current ke aas-paas
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
};

const StudentList = () => {
  const [searchItem, setSearchItem] = useState("");
  const [data, setData] = useState([]);

  // Pagination states
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  async function deleteStudent(id) {
    await fetch("https://school-management-backend-ochre.vercel.app/api/student/delete/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => console.log(result));

    // Agar current page ka last record delete hua, to pichle page par jao
    if (data.length === 1 && offset > 0) {
      setOffset(offset - limit);
    } else {
      getData();
    }
  }

  function filterData() {
    // filter logic yahan likhna hai
  }

  function getData() {
    fetch(`https://school-management-backend-ochre.vercel.app/api/student?offset=${offset}&limit=${limit}`)
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
        // Backend se total count aaye to use karo
        if (result.total !== undefined) {
          setTotal(result.total);
        }
      });
  }

  // offset change hone par data dobara fetch hoga
  useEffect(() => {
    getData();
  }, [offset]);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePrev = () => {
    if (offset > 0) setOffset(offset - limit);
  };

  const handleNext = () => {
    // total pata ho to uske hisaab se, warna data.length se check
    if (total > 0) {
      if (offset + limit < total) setOffset(offset + limit);
    } else if (data.length === limit) {
      setOffset(offset + limit);
    }
  };

  const goToPage = (page) => {
    setOffset((page - 1) * limit);
  };

  const isNextDisabled =
    total > 0 ? offset + limit >= total : data.length < limit;

  return (
    <div>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Student List</h1>
          <Link to="/Add-Student" className="btn btn-primary">
            Add Student
          </Link>
        </div>

        <div className="row mb-3">
          <div className="col-md-4 d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search role..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={filterData}
            >
              Filter
            </button>
          </div>
        </div>

        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Class Name</th>
              <th scope="col">Gender</th>
              <th scope="col">Admission Number</th>
              <th scope="col">Date Of Birth</th>
              <th scope="col">Father Name</th>
              <th scope="col">Mother Name</th>
              <th scope="col">Parent Mobile</th>
              <th scope="col">Emergency Contact</th>
              <th scope="col">Student Photo</th>
              <th scope="col">View</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={item._id}>
                  {/* offset add kiya taaki page 2 par 11, 12... dikhe */}
                  <th scope="row">{offset + index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.className?.className}</td>
                  <td>{item.gender}</td>
                  <td>{item.admissionNumber}</td>
                  <td>{item.dataOfBirth}</td>
                  <td>{item.fatherName}</td>
                  <td>{item.motherName}</td>
                  <td>{item.parentMobile}</td>
                  <td>{item.emergencyContact}</td>
                  <td>
                    <img width={50} src={`${item.StudentPhoto}`} alt="Student" />
                  </td>
                  <td>
                    <Link
                      to={`/View-Student/${item._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/Edit-Student/${item._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStudent(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <nav className="d-flex justify-content-between align-items-center">
          <span>
            Page {currentPage}
            {totalPages > 0 && ` of ${totalPages}`}
          </span>

          <ul className="pagination mb-0">
            <li className={`page-item ${offset === 0 ? "disabled" : ""}`}>
              <button className="page-link" onClick={handlePrev}>
                Previous
              </button>
            </li>

            {/* Page numbers with dots (tabhi dikhenge jab backend total bheje) */}
            {totalPages > 0 &&
              getPageNumbers(currentPage, totalPages).map((page, i) =>
                page === "..." ? (
                  <li key={`dots-${i}`} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                ) : (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

            <li className={`page-item ${isNextDisabled ? "disabled" : ""}`}>
              <button className="page-link" onClick={handleNext}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default StudentList;