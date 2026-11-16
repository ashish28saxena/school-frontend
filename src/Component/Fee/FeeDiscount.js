
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function FeeDiscount() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
  });

  const [form, setForm] = useState({
    studentId: "",
    discountType: "Fixed",
    discountValue: "",
    reason: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadOptions();
    loadDiscounts();
  }, []);

  const loadOptions = async () => {
    const [c, s] = await Promise.all([
      fetch(`${API}/class/`),
      fetch(`${API}/section/`),
    ]);
    const cd = await c.json();
    const sd = await s.json();
    setClasses(cd || []);
    setSections(sd.data || []);
  };

  const loadDiscounts = async () => {
    const response = await fetch(`${API}/feediscount/`);
    const result = await response.json();
    setList(result.data || []);
  };

  const filteredSections = sections.filter(
    (x) => String(x.classId?._id || x.classId) === filters.classId
  );

  const searchStudents = async () => {
    if (!filters.classId) {
      alert("Select class first");
      return;
    }

    const params = new URLSearchParams({
      classId: filters.classId,
      academicYear: filters.academicYear,
    });

    if (filters.sectionId) {
      params.append("sectionId", filters.sectionId);
    }

    const response = await fetch(
      `${API}/feecollection/students?${params}`
    );
    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      return;
    }

    setStudents(result.data || []);
    setSelected(null);
    setForm((p) => ({ ...p, studentId: "" }));
  };

  const selectStudent = (id) => {
    const item = students.find(
      (x) => String(x.student._id) === String(id)
    );
    setSelected(item || null);
    setForm((p) => ({ ...p, studentId: id }));
  };

  const studentName = (student) =>
    student?.studentName ||
    [student?.firstName, student?.lastName].filter(Boolean).join(" ") ||
    student?.name ||
    "Student";

  const reset = () => {
    setForm({
      studentId: "",
      discountType: "Fixed",
      discountValue: "",
      reason: "",
    });
    setSelected(null);
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!selected) {
      alert("Select student");
      return;
    }

    const value = Number(form.discountValue);

    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      (form.discountType === "Percentage" && value > 100)
    ) {
      alert("Enter a valid discount");
      return;
    }

    const payload = {
      studentId: selected.student._id,
      assignStudentId: selected.assignmentId,
      feeStructureId: selected.feeStructureId,
      classId: filters.classId,
      sectionId: selected.section?._id || filters.sectionId || null,
      academicYear: filters.academicYear,
      discountType: form.discountType,
      discountValue: value,
      reason: form.reason,
    };

    try {
      const url = editId
        ? `${API}/feediscount/update/${editId}`
        : `${API}/feediscount/submit`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alert(result.message);
      reset();
      loadDiscounts();
    } catch (error) {
      alert(error.message);
    }
  };

  const editDiscount = (item) => {
    setEditId(item._id);
    setForm({
      studentId: item.studentId?._id || "",
      discountType: item.discountType,
      discountValue: item.discountValue,
      reason: item.reason || "",
    });
    setSelected({
      student: item.studentId,
      feeStructureId: item.feeStructureId?._id || item.feeStructureId,
      assignmentId: item.assignStudentId,
      section: item.sectionId,
    });
    setFilters({
      classId: item.classId?._id || item.classId,
      sectionId: item.sectionId?._id || item.sectionId || "",
      academicYear: item.academicYear,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeDiscount = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this discount?")) {
      return;
    }

    const response = await fetch(`${API}/feediscount/delete/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    alert(result.message);
    loadDiscounts();
    if (editId === id) reset();
  };

  const previewDiscount = selected
    ? form.discountType === "Percentage"
      ? selected.totalFee * (Number(form.discountValue || 0) / 100)
      : Number(form.discountValue || 0)
    : 0;

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Fee Discount / Concession</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          {editId ? "Update Discount" : "Add Student Discount"}
        </div>

        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label">Class</label>
              <select
                className="form-select"
                value={filters.classId}
                onChange={(e) => {
                  setFilters((p) => ({
                    ...p,
                    classId: e.target.value,
                    sectionId: "",
                  }));
                  setStudents([]);
                  setSelected(null);
                }}
              >
                <option value="">Select Class</option>
                {classes.map((x) => (
                  <option key={x._id} value={x._id}>
                    {x.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={filters.sectionId}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, sectionId: e.target.value }))
                }
              >
                <option value="">All Sections</option>
                {sections.map((x) => (
                  <option key={x._id} value={x._id}>
                    {x.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Academic Year</label>
              <input
                className="form-control"
                value={filters.academicYear}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    academicYear: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-12">
              <button className="btn btn-primary" onClick={searchStudents}>
                Search Students
              </button>
            </div>
          </div>

          <form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Select Student *</label>
                <select
                  className="form-select"
                  value={form.studentId}
                  onChange={(e) => selectStudent(e.target.value)}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((x) => (
                    <option key={x.assignmentId} value={x.student._id}>
                      {studentName(x.student)} | Roll: {x.rollNumber || "—"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Discount Type *</label>
                <select
                  className="form-select"
                  value={form.discountType}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      discountType: e.target.value,
                    }))
                  }
                >
                  <option value="Fixed">Fixed Amount</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  {form.discountType === "Fixed" ? "Amount (₹)" : "Percentage (%)"}
                </label>
                <input
                  type="number"
                  min="0.01"
                  max={form.discountType === "Percentage" ? 100 : undefined}
                  step="0.01"
                  className="form-control"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      discountValue: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {selected && (
                <div className="col-12">
                  <div className="alert alert-info mb-0">
                    Total Fee: ₹{selected.totalFee} | Discount Preview: ₹
                    {previewDiscount.toFixed(2)}
                  </div>
                </div>
              )}

              <div className="col-12">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  placeholder="Scholarship / Staff Ward / Financial Assistance"
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button className="btn btn-success" type="submit">
                  {editId ? "Update Discount" : "Save Discount"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={reset}
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
          <h5 className="mb-0">Discount List</h5>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Student</th>
                <th>Class</th>
                <th>Academic Year</th>
                <th>Discount Type</th>
                <th>Discount</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length ? list.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{studentName(item.studentId)}</td>
                  <td>{item.classId?.className || "—"}</td>
                  <td>{item.academicYear}</td>
                  <td>{item.discountType}</td>
                  <td>₹{item.discountAmount}</td>
                  <td>{item.reason || "—"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editDiscount(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeDiscount(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="text-center">No Discounts Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeeDiscount;
