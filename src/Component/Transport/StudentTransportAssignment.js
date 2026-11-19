
import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api/transport";
const CLASS_API = "https://school-management-backend-ochre.vercel.app/api/class";
const ASSIGN_STUDENT_API = "https://school-management-backend-ochre.vercel.app/api/assignstudent";

const initialForm = {
  classId: "",
  assignStudentId: "",
  studentId: "",
  routeId: "",
  pickupPointId: "",
  monthlyFee: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  remarks: "",
};

const getId = (value) =>
  typeof value === "object" && value !== null ? value._id : value || "";

const StudentTransportAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const request = async (url, options = {}) => {
    const response = await fetch(url.startsWith("http") ? url : `${API}${url}`, {
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

  // Fetch classes and routes
  const loadDropdowns = async () => {
    try {
      const [classRes, routeRes] = await Promise.all([
        request(CLASS_API),
        request("/routes"),
      ]);

      setClasses(classRes || []);
      setRoutes(routeRes.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch students according to selected class
  const fetchStudents = async (selectedClassId) => {
    setStudents([]);

    if (!selectedClassId) return;

    try {
      const result = await request(
        `${ASSIGN_STUDENT_API}?classId=${selectedClassId}`
      );

      setStudents(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch student transport assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const result = await request("/student-transports");
      setAssignments(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropdowns();
    fetchAssignments();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;

    setForm((prev) => ({
      ...prev,
      classId: selectedClassId,
      assignStudentId: "",
      studentId: "",
    }));

    await fetchStudents(selectedClassId);
  };

  const handleStudentChange = (e) => {
    const selectedAssignmentId = e.target.value;

    const selected = students.find(
      (item) => item._id === selectedAssignmentId
    );

    setForm((prev) => ({
      ...prev,
      assignStudentId: selectedAssignmentId,
      studentId: getId(selected?.studentId),
    }));
  };

  const handleRouteChange = (e) => {
    setForm((prev) => ({
      ...prev,
      routeId: e.target.value,
      pickupPointId: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectedRoute = routes.find(
    (route) => route._id === form.routeId
  );

  const pickupPoints = selectedRoute?.pickupPoints || [];

  const resetForm = () => {
    setForm(initialForm);
    setStudents([]);
    setEditId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.classId ||
      !form.assignStudentId ||
      !form.studentId ||
      !form.routeId ||
      !form.pickupPointId ||
      !form.startDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (
      form.endDate &&
      form.endDate < form.startDate
    ) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    if (form.monthlyFee !== "" && Number(form.monthlyFee) < 0) {
      setError("Monthly fee cannot be negative.");
      return;
    }

    const payload = {
      assignStudentId: form.assignStudentId,
      studentId: form.studentId,
      routeId: form.routeId,
      pickupPointId: form.pickupPointId,
      monthlyFee: Number(form.monthlyFee || 0),
      startDate: form.startDate,
      endDate: form.endDate || null,
      remarks: form.remarks,
    };

    try {
      const url = editId
        ? `/student-transport/update/${editId}`
        : "/student-transport/submit";

      const result = await request(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(
        result.message ||
          (editId
            ? "Student transport assignment updated successfully."
            : "Student transport assigned successfully.")
      );

      resetForm();
      fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    setError("");
    setSuccess("");

    try {
      const result = await request(`/student-transport/${id}`);
      const item = result.data;

      if (!item) {
        throw new Error("Assignment not found.");
      }

      const studentId = getId(item.studentId);
      const assignStudentId = getId(item.assignStudentId);
      const routeId = getId(item.routeId);

      // Load the class and student dropdowns for this assignment.
      const assignedStudent = item.assignStudentId;
      const classId = getId(assignedStudent?.classId);

      setForm({
        classId,
        assignStudentId,
        studentId,
        routeId,
        pickupPointId: getId(item.pickupPointId),
        monthlyFee: item.monthlyFee ?? "",
        startDate: item.startDate
          ? new Date(item.startDate).toISOString().slice(0, 10)
          : "",
        endDate: item.endDate
          ? new Date(item.endDate).toISOString().slice(0, 10)
          : "",
        remarks: item.remarks || "",
      });

      if (classId) {
        await fetchStudents(classId);
      }

      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student transport assignment?"
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const result = await request(`/student-transport/delete/${id}`, {
        method: "DELETE",
      });

      setSuccess(result.message || "Assignment deleted successfully.");

      if (editId === id) {
        resetForm();
      }

      fetchAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredAssignments = assignments.filter((item) => {
    const student = item.studentId || {};
    const route = item.routeId || {};

    const studentName = `${student.firstName || ""} ${
      student.lastName || ""
    }`;

    const searchText = `
      ${studentName}
      ${route.routeName || ""}
      ${route.routeCode || ""}
      ${item.monthlyFee || ""}
    `.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const getPickupPointName = (item) => {
    const route = item.routeId;
    const pickupPointId = getId(item.pickupPointId);

    return (
      route?.pickupPoints?.find(
        (point) => point._id === pickupPointId
      )?.pointName || "-"
    );
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Student Transport Assignment</h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={fetchAssignments}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      {/* Assignment Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            {editId
              ? "Update Student Transport"
              : "Assign Transport to Student"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Select Class <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  value={form.classId}
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

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Select Student <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  value={form.assignStudentId}
                  onChange={handleStudentChange}
                  disabled={!form.classId}
                  required
                >
                  <option value="">Select Student</option>

                  {students.map((item) => {
                    const student = item.studentId || {};

                    return (
                      <option key={item._id} value={item._id}>
                        {student.name}
                        {item.rollNumber
                          ? ` - Roll No: ${item.rollNumber}`
                          : ""}
                      </option>
                    );
                  })}
                </select>

                {form.classId && students.length === 0 && (
                  <small className="text-muted">
                    No students found in this class.
                  </small>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Select Route <span className="text-danger">*</span>
                </label>

                <select
                  name="routeId"
                  className="form-select"
                  value={form.routeId}
                  onChange={handleRouteChange}
                  required
                >
                  <option value="">Select Route</option>

                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} ({route.routeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Pickup Point <span className="text-danger">*</span>
                </label>

                <select
                  name="pickupPointId"
                  className="form-select"
                  value={form.pickupPointId}
                  onChange={handleChange}
                  disabled={!form.routeId}
                  required
                >
                  <option value="">Select Pickup Point</option>

                  {pickupPoints.map((point) => (
                    <option key={point._id} value={point._id}>
                      {point.pointName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Monthly Fee (₹)</label>

                <input
                  type="number"
                  name="monthlyFee"
                  className="form-control"
                  min="0"
                  value={form.monthlyFee}
                  onChange={handleChange}
                  placeholder="Enter monthly fee"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>

                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">End Date</label>

                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate}
                />
              </div>

              <div className="col-md-8 mb-3">
                <label className="form-label">Remarks</label>

                <textarea
                  name="remarks"
                  className="form-control"
                  rows="2"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {editId ? "Update Assignment" : "Assign Transport"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Reset
            </button>
          </form>
        </div>
      </div>

      {/* Assignment List */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Student Transport List</h5>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search student, route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Sr. No.</th>
                  <th>Student Name</th>
                  <th>Route</th>
                  <th>Pickup Point</th>
                  <th>Monthly Fee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Loading assignments...
                    </td>
                  </tr>
                ) : filteredAssignments.length > 0 ? (
                  filteredAssignments.map((item, index) => {
                    const student = item.studentId || {};
                    const route = item.routeId || {};

                    return (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        <td>
                          {student.firstName || ""}{" "}
                          {student.lastName || ""}
                        </td>

                        <td>{route.routeName || "-"}</td>

                        <td>{getPickupPointName(item)}</td>

                        <td>
                          ₹{Number(item.monthlyFee || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          {item.startDate
                            ? new Date(item.startDate).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td>
                          {item.endDate
                            ? new Date(item.endDate).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td>{item.remarks || "-"}</td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(item._id)}
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
                    <td colSpan="9" className="text-center">
                      No student transport assignments found.
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

export default StudentTransportAssignment;
