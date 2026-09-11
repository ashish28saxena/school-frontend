import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import "./AddSubject.css";

function AddSubject() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
  name: "",
  code: "",
  classId: "",
  subjectType: "",
  status: true,
});

  const [classData,setClassData]=useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Subject saved:", form);
    if(id)
    {
      await fetch("http://localhost:5000/api/subject/update/"+id,{
         method: "PUT",
         headers: {
        "Content-Type": "application/json"
    },
         body: JSON.stringify(form)
    })
     .then((response)=>response.json())
    .then((response1)=>{
      setMessage(response1.message || "Something went wrong!");
    })
    }else{
        await fetch("http://localhost:5000/api/subject/submit",{
         method: "POST",
         headers: {
        "Content-Type": "application/json"
    },
         body: JSON.stringify(form)
    })
    .then((response)=>response.json())
    .then((response1)=>{
      setMessage(response1.message || "Something went wrong!");
    })
    
    }
    
    
  };

  async function getClassdata() {
    await fetch("http://localhost:5000/api/class/")
        .then((response) => response.json())
        .then((result) => setClassData(result))
        .catch((error) => console.log(error));
}

async function getEditSubject() {
  try {
    if (!id) return;

    const response = await fetch(
      `http://localhost:5000/api/subject/edit/${id}`
    );

    const result = await response.json();

    console.log("Edit Subject:", result);

    setForm({
      name: result.name || "",
      code: result.code || "",
      classId: result.classId || "",
      subjectType: result.subjectType || "",
      status: result.status ?? true,
    });
  } catch (error) {
    console.error("Error fetching subject:", error);
  }
}

 useEffect(() => {
  getClassdata()
  if (id) {
    getEditSubject();
  }
}, [id]);

  return (
    <div className="sub-form-wrap">
     
      
      <form className="sub-form" onSubmit={handleSubmit}>
         {message && (
    <div className="success-message">
      ✓ {message}
    </div>
  )}
        <div className="sub-form-header">
          <h2>Add Subject</h2>
          <p>Register a new subject and assign it to a class.</p>
        </div>

        <div className="sub-field">
          <label htmlFor="subjectName">Subject Name</label>
          <input
            type="text"
            id="subjectName"
            name="name"
            placeholder="e.g. Mathematics"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub-field">
          <label htmlFor="subjectCode">Subject Code</label>
          <input
            type="text"
            id="subjectCode"
            name="code"
            placeholder="e.g. MATH101"
            value={form.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub-field-row">
          <div className="sub-field">
            <label htmlFor="subjectType">Subject Type</label>
            <select
              id="subjectType"
              name="subjectType"
              value={form.subjectType}
              onChange={handleChange}
            >
              <option value="Core">Core</option>
              <option value="Optional">Optional</option>
              
            </select>
          </div>

          <div className="sub-field">
            <label htmlFor="className">Class</label>
            <select
              id="className"
              name="classId"
              value={form.classId}
              onChange={handleChange}
            >
              {
                classData.map((item,index)=>{
                        return(
                            <option value={item._id}>Class {item.className}</option>
                        )
                })
              }
              
              
             
            </select>
          </div>
        </div>

        <div className="sub-field sub-field--status">
          <span className="sub-label-static">Status</span>
          <label className="sub-toggle">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            <span className="sub-toggle-track">
              <span className="sub-toggle-thumb"></span>
            </span>
            <span className="sub-toggle-text">
              {form.status ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        <div className="sub-form-actions">
          
          <button type="submit" className="sub-btn-primary">
             {id ? "Update Subject" : "Save Subject"}
            
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSubject;