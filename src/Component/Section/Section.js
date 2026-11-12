
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://school-management-backend-ochre.vercel.app/api/section";

const Section = () => {
  const [form, setForm] = useState({
    sectionName: "",
    status: true,
  });

  const [sectionList, setSectionList] = useState([]);
  const [id, setId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Get Section List
  const getSectionList = async () => {
    try {
      const res = await axios.get(`${API}/`);
      setSectionList(
        Array.isArray(res.data)
          ? res.data
          : res.data.data || []
      );
    } catch (error) {
      console.log(error);
      alert("Unable to fetch sections");
    }
  };

  useEffect(() => {
    getSectionList();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add / Update Section
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.sectionName.trim()) {
      alert("Please enter section name");
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await axios.put(`${API}/update/${id}`, form);
        alert("Section updated successfully");
      } else {
        await axios.post(`${API}/submit`, form);
        alert("Section added successfully");
      }

      resetForm();
      getSectionList();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Edit Section
  const editSection = (item) => {
    setId(item._id);

    setForm({
      sectionName: item.sectionName,
      status: item.status ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Section
  const deleteSection = async (item) => {
    if (!window.confirm(
      `Are you sure you want to delete section ${item.sectionName}?`
    )) return;

    try {
      await axios.delete(`${API}/delete/${item._id}`);
      alert("Section deleted successfully");
      getSectionList();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // Reset Form
  const resetForm = () => {
    setId(null);
    setForm({
      sectionName: "",
      status: true,
    });
  };

  // Search
  const filteredSections = sectionList.filter((item) =>
    item.sectionName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">

      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Section Management</h3>
          <p className="text-muted mb-0">
            Manage school sections
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          Total: {sectionList.length}
        </span>
      </div>

      {/* Add Section Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">
            {id ? "Update Section" : "Add New Section"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row align-items-end">

              <div className="col-md-5 mb-3">
                <label className="form-label fw-semibold">
                  Section Name
                </label>

                <input
                  type="text"
                  name="sectionName"
                  className="form-control"
                  placeholder="Enter section name (A, B, C...)"
                  value={form.sectionName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold d-block">
                  Status
                </label>

                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    name="status"
                    className="form-check-input"
                    checked={form.status}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    {form.status ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : id
                    ? "Update Section"
                    : "Add Section"}
                </button>

                {id && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Section List */}
      <div className="card shadow-sm border-0">

        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0 fw-bold">Section List</h5>
            </div>

            <div className="col-md-6 mt-2 mt-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Search section..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th width="80">S.No.</th>
                  <th>Section Name</th>
                  <th>Status</th>
                  <th width="180">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSections.length > 0 ? (
                  filteredSections.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {item.sectionName}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.status
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editSection(item)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteSection(item)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No sections found
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
};

export default Section;
