import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const StudentList=()=>{
    const [searchItem,setSearchItem]=useState('')
    const [data,setData]=useState([]);
    async function deleteStusent(index)
    {
            let result=await fetch("https://school-management-backend-ochre.vercel.app/api/student/delete/"+index,{
                method:"DELETE"
            })
            .then((responce)=>responce.json())
            .then((result)=>console.log(result))
            getData();

    }
    function filterData(item)
    {
            
    }

    function getData()
    {
        fetch("https://school-management-backend-ochre.vercel.app/api/student/")
        .then((responce)=>responce.json())
        .then((result)=>setData(result))
    }
    useEffect(()=>{
         getData();
    },[])
    return (
        <div>
            
            <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h1>Student List</h1>
    
    <Link to="/Add-Student" className="btn btn-primary">Add Student</Link>
    
  </div>
   <div className="row mb-3">
      <div className="col-md-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search role..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <button type="button" className="btn btn-secondary" onClick={filterData}>
          Filter
        </button>
      </div>
    </div>

  <table className="table table-bordered table-hover align-middle">
    <thead className="table-light">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Class Name</th>
        <th scope="col">Gender</th>
         <th scope="col">Admission Number</th>
        <th scope="col">Date Of Birth</th>
        <th scope="col">Father Name</th>
        <th scope="col">Mother Name</th>
        <th scope="col">Parent Mobile</th>
        <th scope="col">Emergency Contact</th>
        <th scope="col">Student Photo</th>
       
        
        <th scope="col">View</th>
        
        <th scope="col">Edit</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
      {
        data.map((item, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.name}</td>
              <td>{item.className}</td>
              <td>{item.gender}</td>
              <td>{item.admissionNumber}</td>
              <td>{item.dataOfBirth}</td>
              <td>{item.fatherName}</td>
              <td>{item.motherName}</td>
              <td>{item.parentMobile}</td>
              <td>{item.emergencyContact}</td>
              <td><img width={50}
  src={`https://school-management-backend-ochre.vercel.app/uploads/${item.StudentPhoto}`}
  alt="Student"
/></td>
<td>
                
                <Link to={`/View-Student/${item._id}`} className="btn btn-primary btn-sm">View</Link> 
              </td>
              <td>
                
                <Link to={`/Edit-Role/${item._id}`} className="btn btn-primary btn-sm">Edit</Link> 
              </td>
              <td>
                <button type="button" className="btn btn-danger btn-sm" onClick={()=>deleteStusent(item._id)}>Delete</button>
              </td>
            </tr>
          )
        })
      }
    </tbody>
  </table>
</div>
        </div>
    )
}

export default StudentList