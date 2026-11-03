import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RoleList=()=>{
    const [data,setData]=useState([])
    const [searchTerm,setSearchTerm]=useState("")
    
    function getData()
    {
         fetch("http://localhost:5000/api/role")
           .then((result)=>result.json())
         .then((responce)=>setData(responce))
         console.log("***"+data)
    }


    function deleteRole(index)
    {
        let result=fetch("http://localhost:5000/api/role/delete/"+index,{
        method: "DELETE"
      })

      .then((responce)=>responce.json());
      getData()

    }

    function filterData()
    {
         fetch("http://localhost:5000/api/role/search?q="+searchTerm)
           .then((result)=>result.json())
         .then((responce)=>setData(responce))
    }

    useEffect(()=>{
                getData();
    },[])
    return(
        <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h1>Role List</h1>
    
    <Link to="/Add-Role" className="btn btn-primary">Role List</Link>
    
  </div>
   <div className="row mb-3">
      <div className="col-md-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        <th scope="col">Role</th>
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
              <td>
                
                <Link to={`/Edit-Role/${item._id}`} className="btn btn-primary btn-sm">Edit</Link> 
              </td>
              <td>
                <button type="button" className="btn btn-danger btn-sm" onClick={()=>deleteRole(item._id)}>Delete</button>
              </td>
            </tr>
          )
        })
      }
    </tbody>
  </table>
</div>
    )
}

export default RoleList;