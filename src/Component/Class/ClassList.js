import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "https://school-management-backend-ochre.vercel.app/api/class";

const ClassList = () => {
  const [classData, setClassData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  function getData() {
    setLoading(true);
    fetch(`${API_BASE}/`)
      .then((response) => response.json())
      .then((result) => setClassData(Array.isArray(result) ? result : []))
      .catch((error) => {
        console.error(error);
        setMessage({ type: "danger", text: "Failed to load classes." });
      })
      .finally(() => setLoading(false));
  }

  function deleteClass(item) {
    if (!window.confirm(`Are you sure you want to delete "${item.className}"?`)) {
      return;
    }

    fetch(`${API_BASE}/delete/${item._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // Remove the deleted item from the list immediately
        setClassData((prev) => prev.filter((c) => c._id !== item._id));
        setMessage({ type: "success", text: "Class deleted successfully!" });
      })
      .catch((error) => {
        console.error(error);
        setMessage({
          type: "danger",
          text: "Something went wrong while deleting. Please try again.",
        });
      });
  }

  useEffect(() => {
    getData();
  }, []);

  // Live search filter (no button click needed)
  const filteredData = classData.filter((item) =>
    (item.className || "").toLowerCase().includes(searchItem.trim().toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Class List</h4>
          <Link to="/Add-Class" className="btn btn-light btn-sm fw-semibold">
            + Add Class
          </Link>
        </div>

        <div className="card-body p-4">
          {message.text && (
            <div
              className={`alert alert-${message.type} alert-dismissible fade show`}
              role="alert"
            >
              {message.text}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage({ type: "", text: "" })}
              ></button>
            </div>
          )}

          <div className="row mb-3">
            <div className="col-md-5 col-lg-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search class..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "70px" }}>#</th>
                  <th scope="col">Class Name</th>
                  <th scope="col" className="text-center" style={{ width: "110px" }}>Edit</th>
                  <th scope="col" className="text-center" style={{ width: "110px" }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm me-2"></div>
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No classes found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.className}</td>
                      <td className="text-center">
                        <Link
                          to={`/Edit-Class/${item._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </Link>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteClass(item)}
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
        </div>
      </div>
    </div>
  );
};

export default ClassList;