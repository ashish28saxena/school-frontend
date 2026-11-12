import React, { useState, useEffect, useRef } from "react";

const API = "https://school-management-backend-ochre.vercel.app";

const emptyForm = {
  teacherId: "",
  basicSalary: "",
  hra: "",
  medicalAllowance: "",
  transportAllowance: "",
  otherAllowance: "",
  pf: "",
  professionalTax: "",
  effectiveFrom: "",
};

// Ek record se gross / deduction / net nikalne ka helper
const calcSalary = (item) => {
  const gross =
    Number(item.basicSalary || 0) +
    Number(item.hra || 0) +
    Number(item.medicalAllowance || 0) +
    Number(item.transportAllowance || 0) +
    Number(item.otherAllowance || 0);
  const deduction = Number(item.pf || 0) + Number(item.professionalTax || 0);
  return { gross, deduction, net: gross - deduction };
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN") : "-";

// <input type="date"> ko "YYYY-MM-DD" chahiye
const toInputDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

const Salary = () => {
  const [form, setForm] = useState(emptyForm);
  const [salaryList, setSalaryList] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null); // null = add mode, id = edit mode
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Form ka live calculation
  const {
    gross: grossSalary,
    deduction: totalDeduction,
    net: netSalary,
  } = calcSalary(form);

  // List ka total
  const totals = salaryList.reduce(
    (acc, item) => {
      const { gross, net } = calcSalary(item);
      acc.gross += gross;
      acc.net += net;
      return acc;
    },
    { gross: 0, net: 0 }
  );

  async function getTeacher() {
    try {
      const response = await fetch(`${API}/api/teacher/`);
      const result = await response.json();
      setTeacherData(result.data || []);
    } catch (err) {
      console.error("Teacher fetch error:", err);
    }
  }

  async function getSalaryData() {
    try {
      const response = await fetch(`${API}/api/teachersalary/get`);
      const result = await response.json();
      setSalaryList(result.data || []);
    } catch (err) {
      console.error("Salary fetch error:", err);
    }
  }

  useEffect(() => {
    getTeacher();
    getSalaryData();
  }, []);

  // Message 3 second baad apne aap hat jaye
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  // EDIT: row ka data form me bhar do
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      teacherId: item.teacherId?._id || item.teacherId || "",
      basicSalary: item.basicSalary ?? "",
      hra: item.hra ?? "",
      medicalAllowance: item.medicalAllowance ?? "",
      transportAllowance: item.transportAllowance ?? "",
      otherAllowance: item.otherAllowance ?? "",
      pf: item.pf ?? "",
      professionalTax: item.professionalTax ?? "",
      effectiveFrom: toInputDate(item.effectiveFrom),
    });
    setMessage("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/api/teachersalary/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        // Agar usi record ko edit kar rahe the to form reset kar do
        if (editId === id) handleCancelEdit();
        getSalaryData();
      } else {
        setMessage(result.message || "Delete nahi ho paya");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      setMessage("Something went wrong!");
    }
  };

  // ADD + UPDATE dono yahin se
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editId);
    const url = isEdit
      ? `${API}/api/teachersalary/update/${editId}`
      : `${API}/api/teachersalary/submit`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setForm(emptyForm);
        setEditId(null);
        getSalaryData(); // fresh data (populated teacherId ke saath)
      } else {
        setMessage(
          typeof result.message === "string"
            ? result.message
            : "Something went wrong"
        );
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setMessage("Something went wrong!");
    }
  };

  const uniqueTeachers = new Set(
    salaryList.map((s) => s.teacherId?._id)
  ).size;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Teacher Salary Management</h3>
          <p className="text-muted mb-0">
            Manage teacher salary structure and allowances
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Teachers</h6>
              <h3>{uniqueTeachers}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Gross Salary</h6>
              <h3>₹{totals.gross.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Net Salary</h6>
              <h3>₹{totals.net.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Form */}
      <div ref={formRef} className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            {editId ? "Edit Teacher Salary" : "Add Teacher Salary"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Select Teacher</label>
                <select
                  className="form-select"
                  name="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Teacher --</option>
                  {teacherData.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.firstName} {item.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Basic Salary</label>
                <input type="number" name="basicSalary" className="form-control" value={form.basicSalary} onChange={handleChange} required />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">HRA</label>
                <input type="number" name="hra" className="form-control" value={form.hra} onChange={handleChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Medical Allowance</label>
                <input type="number" name="medicalAllowance" className="form-control" value={form.medicalAllowance} onChange={handleChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Transport Allowance</label>
                <input type="number" name="transportAllowance" className="form-control" value={form.transportAllowance} onChange={handleChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Other Allowance</label>
                <input type="number" name="otherAllowance" className="form-control" value={form.otherAllowance} onChange={handleChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">PF Deduction</label>
                <input type="number" name="pf" className="form-control" value={form.pf} onChange={handleChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Professional Tax</label>
                <input type="number" name="professionalTax" className="form-control" value={form.professionalTax} onChange={handleChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Effective From</label>
                <input type="date" name="effectiveFrom" className="form-control" value={form.effectiveFrom} onChange={handleChange} required />
              </div>
            </div>

            {/* Salary Calculation */}
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="alert alert-light border">
                  <strong>Gross Salary</strong>
                  <h4 className="text-primary mb-0">₹{grossSalary}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="alert alert-light border">
                  <strong>Total Deduction</strong>
                  <h4 className="text-danger mb-0">₹{totalDeduction}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="alert alert-light border">
                  <strong>Net Salary</strong>
                  <h4 className="text-success mb-0">₹{netSalary}</h4>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? "Update Salary" : "Save Salary"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {message && <div className="success-message">✓ {message}</div>}
      </div>

      {/* Salary List */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Teacher Salary List</h5>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Teacher</th>
                <th>Basic Salary</th>
                <th>Gross Salary</th>
                <th>Deduction</th>
                <th>Net Salary</th>
                <th>Effective From</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {salaryList.length > 0 ? (
                salaryList.map((item, index) => {
                  const { gross, deduction, net } = calcSalary(item);
                  return (
                    <tr
                      key={item._id || index}
                      className={editId === item._id ? "table-warning" : ""}
                    >
                      <td>{index + 1}</td>
                      <td>
                        {item.teacherId?.firstName} {item.teacherId?.lastName}
                      </td>
                      <td>₹{Number(item.basicSalary).toLocaleString("en-IN")}</td>
                      <td>₹{gross.toLocaleString("en-IN")}</td>
                      <td>₹{deduction.toLocaleString("en-IN")}</td>
                      <td className="fw-bold text-success">
                        ₹{net.toLocaleString("en-IN")}
                      </td>
                      <td>{formatDate(item.effectiveFrom)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No salary records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Salary;