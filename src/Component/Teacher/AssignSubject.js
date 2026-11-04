
import React, { useState,useEffect } from "react";
const API = "http://localhost:5000";

function AssignSubject() {

  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    status: true
  });
  const [message, setMessage] = useState("");
    const [teacherData, setTeacherData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
 
  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });


    
    console.log("@@@@@@@@@@@",form)
   
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      teacherID: form.teacherId,
      classId: form.classId,
      sectionId: form.sectionId,
      subjectId: form.subjectId,
      status: form.status
    };

    console.log("Submit Data:", payload);

    const response = await fetch(
      "http://localhost:5000/api/assignsubject/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    console.log("API Response:", result);

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
      subjectId: "",
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

   async function getSubjectData(classId) {
         const response = await fetch(`${API}/api/subject/`+classId);
         const result = await response.json();
         setSubjectData(result.data || []); 
  }

  useEffect(()=>{ 
         getTeacher();
         getClassData();
         getSectionData();
         //getSubjectData();
  },[])

  return (
    <div className="container mt-4">

      <div className="card shadow-sm">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Assign Subject to Teacher</h4>
        </div>
        {message && (
    <div className="success-message">
      ✓ {message}
    </div>
  )}
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
                 onChange={(e) => {
                      handleChange(e);
                      getSubjectData(e.target.value);
                  }}
                  className="form-select"
                  required
                >
                  <option value="">Select Class</option>
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
                  <option value="">Select Section</option>
                  {
                    sectionData.map((item)=>{
                        return(
                          <option value={item._id}>{item.sectionName}</option>
                        )
                    })
                  }
                  
                  
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
                  {
                    subjectData.map((item)=>{
                        return(
                          <option value={item._id}>{item.name} </option>
                        )
                    })
                  }
                  
                  
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
