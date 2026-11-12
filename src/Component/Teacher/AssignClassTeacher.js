import React, { useState,useEffect }  from "react";
import { useParams } from "react-router-dom";
const API = "https://school-management-backend-ochre.vercel.app";
function AssignClassTeacher() {
const { id } = useParams(); 
  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    academicYear: "2026-27",
    status: true
  });
    const [message, setMessage] = useState("");
    const [teacherData, setTeacherData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState([]);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      teacherID: form.teacherId,
      classId: form.classId,
      sectionId: form.sectionId,
      academicYear: form.academicYear,
      status: form.status
    };

    // ID hai to Update, nahi hai to Submit
    const url = id
      ? `https://school-management-backend-ochre.vercel.app/api/assignclass/update/${id}`
      : "https://school-management-backend-ochre.vercel.app/api/assignclass/submit";

    const response = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      setMessage(result.message);

      
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

  const handleReset = () => {

    setForm({
      teacherId: "",
      classId: "",
      sectionId: "",
      academicYear: "2026-27",
      status: true
    });

  };

  async function getTeacher() {
         const response = await fetch(`${API}/api/teacher/`);
         const result = await response.json();
         setTeacherData(result.data || []);
  }

   async function getClassData() {
         const response = await fetch(`${API}/api/class/`);
         const result = await response.json();
         setClassData(result || []);
  }

  async function getSectionData() {
         const response = await fetch(`${API}/api/section/`);
         const result = await response.json();
         setSectionData(result.data || []); 
  }

    async function editAssignClassData(updateid) {
         const response = await fetch(`${API}/api/assignclass/edit/`+updateid);
         const result = await response.json();
         let result1=result.data || []; 
         
         
         setForm({
          teacherId: result1.teacherID,
          classId: result1.classId,
          sectionId: result1.sectionId,
          academicYear: result1.academicYear,
          status: result1.status
  });
         
  }

   useEffect(()=>{ 
         getTeacher();
         getClassData();
         getSectionData();
       
         if(id)
         {
           editAssignClassData(id);
         }
  },[])

  return (

    <div className="container mt-4">

      <div className="card shadow-sm">
             {message && (
    <div className="success-message">
      ✓ {message}
    </div>
  )}
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

                  {
                    teacherData.map((item)=>{
                        return(
                           <option value={item._id} >
                    {item.firstName}   {item.lastName}
                  </option>
                        )
                    })
                  }
                 

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

                  {
                    classData.map((item)=>{
                          return(
                            <option value={item._id}>Class {item.className}</option>
                          )
                    })
                  }

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

                  {
                    sectionData.map((item)=>{
                        return(
                          <option value={item._id}>{item.sectionName}</option>
                        )
                    })
                  }

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

