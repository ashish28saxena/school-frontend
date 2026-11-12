import React, { useEffect, useState } from "react";

const API = "https://school-management-backend-ochre.vercel.app/api";

function ClassTeacher() {

  const [form, setForm] = useState({
    teacherID: "",
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
    status: true
  });

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data
  const fetchDropdowns = async () => {
    try {
      const [teacherRes, classRes, sectionRes] =
        await Promise.all([
          fetch(`${API}/teacher/`),
          fetch(`${API}/class/`),
          fetch(`${API}/section/`)
        ]);

      const teacherData = await teacherRes.json();
      const classData = await classRes.json();
      const sectionData = await sectionRes.json();

      setTeachers(teacherData.data || []);
      setClasses(classData|| []);
      setSections(sectionData.data || []);

    } catch (error) {
      console.log("Dropdown Error:", error);
    }
  };

  // Fetch assigned class teacher list
  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        `${API}/assignclassteacher/`
      );

      const result = await response.json();

      setAssignments(result.data || []);

    } catch (error) {
      console.log("List Error:", error);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchAssignments();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/assignclassteacher/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong");
        return;
      }

      alert(result.message);

      setForm({
        teacherID: "",
        classId: "",
        sectionId: "",
        academicYear: "2026-27",
        status: true
      });

      fetchAssignments();

    } catch (error) {
      console.log(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete assignment
  const handleDelete = async (id) => {

    if (!window.confirm(
      "Are you sure you want to remove this class teacher assignment?"
    )) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/assignclassteacher/delete/${id}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert(result.message);
      fetchAssignments();

    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="container-fluid mt-4">

      {/* Form */}
      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            Assign Class Teacher
          </h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* Teacher */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Select Teacher *
                </label>

                <select
                  name="teacherID"
                  value={form.teacherID}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Teacher</option>

                  {teachers.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.firstName} {item.lastName}
                    </option>
                  ))}

                </select>
              </div>

              {/* Class */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Select Class *
                </label>

                <select
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Class</option>

                  {classes.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.className}
                    </option>
                  ))}

                </select>
              </div>

              {/* Section */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Select Section *
                </label>

                <select
                  name="sectionId"
                  value={form.sectionId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Section</option>

                  {sections.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.sectionName}
                    </option>
                  ))}

                </select>
              </div>

              {/* Academic Year */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Academic Year *
                </label>

                {/* <select
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                  <option value="2028-29">2028-29</option>
                </select> */}

                <select
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
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

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Status
                </label>

                <div className="form-check form-switch mt-2">

                  <input
                    type="checkbox"
                    name="status"
                    checked={form.status}
                    onChange={handleChange}
                    className="form-check-input"
                  />

                  <label className="form-check-label">
                    Active
                  </label>

                </div>
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Assign Class Teacher"}
            </button>

            <button
              type="reset"
              className="btn btn-secondary ms-2"
              onClick={() => setForm({
                teacherID: "",
                classId: "",
                sectionId: "",
                academicYear: "2026-27",
                status: true
              })}
            >
              Reset
            </button>

          </form>

        </div>
      </div>

      {/* Assignment List */}
      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">
            Assigned Class Teachers
          </h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-striped">

              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Teacher Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {assignments.length > 0 ? (

                  assignments.map((item, index) => (

                    <tr key={item._id}>

                      <td>{index + 1}</td>

                      <td>
                        {item.teacherID?.firstName}{" "}
                        {item.teacherID?.lastName}
                      </td>

                      <td>
                        {item.classId?.className}
                      </td>

                      <td>
                        {item.sectionId?.sectionName}
                      </td>

                      <td>
                        {item.academicYear}
                      </td>

                      <td>
                        <span className={
                          item.status
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }>
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="7" className="text-center">
                      No Class Teacher Assigned
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

export default ClassTeacher;