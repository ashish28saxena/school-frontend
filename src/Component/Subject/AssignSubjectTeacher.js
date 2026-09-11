import React, { useEffect,useState } from "react";

import "./AddSubject.css";
const AssignSubjectTeacher=()=>{
const [classData,setClassData]=useState([])
const [subjects, setSubjects] = useState([]);
const [message, setMessage] = useState("");
      async function getClassdata() {
    await fetch("http://localhost:5000/api/class/")
        .then((response) => response.json())
        .then((result) => setClassData(result))
        .catch((error) => console.log(error));
}

  async function getSubjectData()
  {
      const response = await fetch("http://localhost:5000/api/subject");
        const result = await response.json();

        setSubjects(result.data || []);

  }

 useEffect(() => {
  getClassdata()
  getSubjectData();
  
}, []);

    return(<div>
        <div className="sub-form-wrap">
     
      
      <form className="sub-form" >
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
            <label htmlFor="className">Class</label>
            <select
              id="className"
              name="classId"
              
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


          <div className="sub-field">
            <label htmlFor="className">Subject</label>
            <select
              id="SubjectName"
              name="SubjectName"
              
            >
              {
                subjects.map((item,index)=>{
                        return(
                            <option value={item._id}>{item.name} - {item.code}</option>
                        )
                })
              }
              
              
             
            </select>
          </div>

          <div className="sub-field">
            <label htmlFor="className">Teacher</label>
            <select
              id="SubjectName"
              name="SubjectName"
              
            >
              {
                subjects.map((item,index)=>{
                        return(
                            <option value={item._id}>{item.name} - {item.code}</option>
                        )
                })
              }
              
              
             
            </select>
          </div>
        

        

        <div className="sub-form-actions">
          
          <button type="button" className="sub-btn-primary">
            Assign Teacher Subject
            
          </button>
        </div>
      </form>
    </div>
    </div>)
}

export default AssignSubjectTeacher;