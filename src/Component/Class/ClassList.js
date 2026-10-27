import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const ClassList=()=>{
    const [classdata,setClassData]=useState([]);
    const [searchItem,setSearchItem]=useState('');
    function getdata()
    {
        fetch("https://school-management-backend-ochre.vercel.app/api/class/")
        .then((responce)=>responce.json())
        .then((result)=>setClassData(result))
    }

    function filterData()
    {

    }
    function deleteClass(item)
    {
         fetch("https://school-management-backend-ochre.vercel.app/api/class/delete/"+item._id,{
            method:"Delete"
         })
         .then((responce)=>responce.json())
         .then((result)=>console.log(result))
         getdata();
    }
    useEffect(()=>{
          getdata();
    },[])
    return(
        <div>
                  <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h1>Class List</h1>
    
    <Link to="/Add-Class" className="btn btn-primary">Add Class</Link>
    
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
        <th scope="col">Class Name</th>
        <th scope="col">Class Section</th>
        <th scope="col">Edit</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
      {
        classdata.map((item, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.className}</td>
              <td>{item.classSection}</td>
              <td>
                
                <Link to={`/Edit-Class/${item._id}`} className="btn btn-primary btn-sm">Edit</Link> 
              </td>
              <td>
                <button type="button" className="btn btn-danger btn-sm" onClick={()=>deleteClass(item)}>Delete</button>
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

export default ClassList