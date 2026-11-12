import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = "https://school-management-backend-ochre.vercel.app/api/class";

const AddClass = () => {
  const { id } = useParams();
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  function submitData() {
    if (!className.trim()) {
      setMessage({ type: "danger", text: "Class name is required." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const url = id ? `${API_BASE}/update/${id}` : `${API_BASE}/submit`;
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ className: className.trim() }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMessage({
          type: "success",
          text: id
            ? "Class updated successfully!"
            : "Class added successfully!",
        });
        if (!id) setClassName("");
      })
      .catch((error) => {
        console.error(error);
        setMessage({
          type: "danger",
          text: "Something went wrong. Please try again.",
        });
      })
      .finally(() => setLoading(false));
  }

  function getEditClassData() {
    fetch(`${API_BASE}/edit/${id}`)
      .then((response) => response.json())
      .then((result) => {
        setClassName(result.className);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (id) {
      getEditClassData();
    }
  }, [id]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{id ? "Edit Class" : "Add Class"}</h4>
            </div>

            <div className="card-body p-4">
              {message.text && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitData();
                }}
              >
                <div className="mb-4">
                  <label htmlFor="className" className="form-label fw-semibold">
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="className"
                    className="form-control"
                    placeholder="Enter Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : id ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClass;