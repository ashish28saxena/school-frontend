// import react from "react";
// const AssignClassTeacher=()=>{
//     return(
//         <div>
//             <h1>hello this is AssignClassTeacher</h1>
//         </div>
//     )
// }

// export default AssignClassTeacher;


import React, { useState } from "react";

function AssignClassTeacher() {

  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
    status: true
  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("Assign Class Data:", form);

    // API call yahan karenge

  };

  const handleReset = () => {

    setForm({
      teacherId: "",
      classId: "",
      sectionId: "",
      academicYear: "2026-27",
      status: true
    });

  };

  return (

    <div className="container mt-4">

      <div className="card shadow-sm">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            Assign Class to Teacher
          </h4>
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

                  <option value="">
                    Select Teacher
                  </option>

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

                  <option value="">
                    Select Class
                  </option>

                  <option value="class1">Class 1</option>
                  <option value="class2">Class 2</option>
                  <option value="class3">Class 3</option>
                  <option value="class4">Class 4</option>
                  <option value="class5">Class 5</option>
                  <option value="class6">Class 6</option>
                  <option value="class7">Class 7</option>
                  <option value="class8">Class 8</option>
                  <option value="class9">Class 9</option>
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

                  <option value="">
                    Select Section
                  </option>

                  <option value="sectionA">A</option>
                  <option value="sectionB">B</option>
                  <option value="sectionC">C</option>

                </select>

              </div>


              {/* Academic Year */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Academic Year
                </label>

                <select
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  className="form-select"
                >

                  <option value="2026-27">
                    2026-27
                  </option>

                  <option value="2027-28">
                    2027-28
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


            {/* Buttons */}

            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-primary"
              >
                Assign Class
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

export default AssignClassTeacher;

