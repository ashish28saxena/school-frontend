
import React, { useState } from "react";

function AssignSubject() {

  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    status: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Assignment Data:", form);

    // API call yahan karenge
  };

  const handleReset = () => {
    setForm({
      teacherId: "",
      classId: "",
      sectionId: "",
      subjectId: "",
      status: true
    });
  };

  return (
    <div className="container mt-4">

      <div className="card shadow-sm">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Assign Subject to Teacher</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* Teacher */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Teacher <span className="text-danger">*</span>
                </label>

                <select
                  name="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Teacher</option>
                  <option value="teacher1">
                    Rahul Sharma
                  </option>
                  <option value="teacher2">
                    Amit Kumar
                  </option>
                  <option value="teacher3">
                    Priya Singh
                  </option>
                </select>
              </div>

              {/* Class */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Class <span className="text-danger">*</span>
                </label>

                <select
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="class1">Class 1</option>
                  <option value="class2">Class 2</option>
                  <option value="class3">Class 3</option>
                  <option value="class4">Class 4</option>
                  <option value="class5">Class 5</option>
                  <option value="class10">Class 10</option>
                </select>
              </div>

              {/* Section */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Section <span className="text-danger">*</span>
                </label>

                <select
                  name="sectionId"
                  value={form.sectionId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Section</option>
                  <option value="sectionA">A</option>
                  <option value="sectionB">B</option>
                  <option value="sectionC">C</option>
                </select>
              </div>

              {/* Subject */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Subject <span className="text-danger">*</span>
                </label>

                <select
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="subject1">
                    Mathematics
                  </option>
                  <option value="subject2">
                    English
                  </option>
                  <option value="subject3">
                    Science
                  </option>
                  <option value="subject4">
                    Hindi
                  </option>
                  <option value="subject5">
                    Computer
                  </option>
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

            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-primary"
              >
                Assign Subject
              </button>

              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={handleReset}
              >
                Reset
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
}

export default AssignSubject;
