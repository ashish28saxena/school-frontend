
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

const initialForm = {
  classId: "",
  sectionId: "",
  academicYear: "2026-27",
  fees: [
    { feeType: "Admission Fee", amount: 0 },
    { feeType: "Tuition Fee", amount: 0 },
    { feeType: "Transport Fee", amount: 0 },
    { feeType: "Exam Fee", amount: 0 },
  ],
  description: "",
};

function FeeStructure() {
  const [form, setForm] = useState(initialForm);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [feeList, setFeeList] = useState([]);
  const [editId, setEditId] = useState(null);
   const token = localStorage.getItem("token");
  useEffect(() => {
    fetchOptions();
    fetchFeeStructures();
  }, []);

  const fetchOptions = async () => {
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

      const classData = await classRes.json();
      const sectionData = await sectionRes.json();

      setClasses(classData || []);
      setSections(sectionData.data || []);
    } catch (error) {
      alert("Unable to load class and section");
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const response = await fetch(`${API}/feestructure/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setFeeList(result.data || []);
    } catch (error) {
      alert("Unable to load fee structures");
    }
  };

  const filteredSections = sections.filter(
    (item) =>
      String(item.classId?._id || item.classId) === String(form.classId)
  );

  const totalAmount = form.fees.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeeChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      fees: prev.fees.map((item, i) =>
        i === index
          ? { ...item, [field]: field === "amount" ? value : value }
          : item
      ),
    }));
  };

  const addFeeRow = () => {
    setForm((prev) => ({
      ...prev,
      fees: [...prev.fees, { feeType: "", amount: 0 }],
    }));
  };

  const removeFeeRow = (index) => {
    setForm((prev) => ({
      ...prev,
      fees: prev.fees.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classId || !form.academicYear) {
      alert("Please select class and academic year");
      return;
    }

    if (
      form.fees.some(
        (item) =>
          !item.feeType.trim() ||
          item.amount === "" ||
          !Number.isFinite(Number(item.amount)) ||
          Number(item.amount) < 0
      )
    ) {
      alert("Please enter valid fee details");
      return;
    }

    const payload = {
      ...form,
      sectionId: form.sectionId || null,
      fees: form.fees.map((item) => ({
        feeType: item.feeType.trim(),
        amount: Number(item.amount),
      })),
    };

    try {
      const url = editId
        ? `${API}/feestructure/update/${editId}`
        : `${API}/feestructure/submit`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save fee structure");
      }

      alert(result.message);
      resetForm();
      fetchFeeStructures();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      classId: item.classId?._id || item.classId || "",
      sectionId: item.sectionId?._id || item.sectionId || "",
      academicYear: item.academicYear || "",
      fees: (item.fees || []).map((fee) => ({
        feeType: fee.feeType,
        amount: fee.amount,
      })),
      description: item.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this fee structure?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/feestructure/delete/${id}`,
        { method: "DELETE",
           headers: {
          Authorization: `Bearer ${token}`,
        }
         }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to deactivate");
      }

      alert(result.message);
      fetchFeeStructures();

      if (editId === id) resetForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const getClassName = (item) =>
    item.classId?.className || "—";

  const getSectionName = (item) =>
    item.sectionId?.sectionName || "All Sections";

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Fee Structure Management</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          {editId ? "Update Fee Structure" : "Add Fee Structure"}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Class *</label>
                <select
                  className="form-select"
                  name="classId"
                  value={form.classId}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      classId: e.target.value,
                      sectionId: "",
                    }));
                  }}
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

              <div className="col-md-4">
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  name="sectionId"
                  value={form.sectionId}
                  onChange={handleChange}
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
                <label className="form-label">Academic Year *</label>
                <select
                  className="form-select"
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 8 }, (_, i) => {
                    const year = 2026 + i;
                    return (
                      <option key={year} value={`${year}-${String(year + 1).slice(-2)}`}>
                        {year}-{String(year + 1).slice(-2)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-12">
                <h5 className="mt-3">Fee Details</h5>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "55%" }}>Fee Type</th>
                        <th>Amount (₹)</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {form.fees.map((fee, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter fee type"
                              value={fee.feeType}
                              onChange={(e) =>
                                handleFeeChange(index, "feeType", e.target.value)
                              }
                              required
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="form-control"
                              value={fee.amount}
                              onChange={(e) =>
                                handleFeeChange(index, "amount", e.target.value)
                              }
                              required
                            />
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeFeeRow(index)}
                              disabled={form.fees.length === 1}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th className="text-end">Total Fee</th>
                        <th colSpan="2">
                          ₹{totalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={addFeeRow}
                >
                  + Add Fee Type
                </button>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="2"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editId ? "Update Fee Structure" : "Save Fee Structure"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Fee Structure List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>S.No.</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Academic Year</th>
                  <th>Fee Details</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {feeList.length > 0 ? (
                  feeList.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{getClassName(item)}</td>
                      <td>{getSectionName(item)}</td>
                      <td>{item.academicYear}</td>
                      <td>
                        {item.fees?.map((fee, i) => (
                          <div key={i}>
                            {fee.feeType}: ₹{Number(fee.amount).toLocaleString("en-IN")}
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>
                          ₹{Number(item.totalAmount || 0).toLocaleString("en-IN")}
                        </strong>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Fee Structure Found
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
}

export default FeeStructure;
