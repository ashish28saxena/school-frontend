import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const UserList=()=>{
    const [data,setData]=useState([])
    const [searchTerm,setSearchTerm]=useState("")
    function getData() {
  fetch("http://localhost:5000/api/user/userList")
    .then((res) => res.json())
    .then((result) => {
      setData(result);
      console.log(result);
    })
    .catch((err) => console.log(err));
}
function filterData()
{

}

function changeSatus(item)
{
       fetch("http://localhost:5000/api/user/userSubmit/"+item._id,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                
                status:(item.status=="Active")?"Inactive":"Active"
            })
        })
        .then((responce)=>responce.json())
        .then((result)=>console.log("data"+result.message))
        getData();
}

function deleteUser(index)
{
     fetch("http://localhost:5000/api/user/userDelete/"+index,{
      method:"DELETE"
     })
     .then((res)=>res.json())
     getData();
}
    useEffect(()=>{
          getData();
    },[])
    return (
          <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h1>User List</h1>
    
    <Link to="/Add-User" className="btn btn-primary">Add User</Link>
    
  </div>
   <div className="row mb-3">
      <div className="col-md-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search user..."
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
       <th scope="col">Name</th> 
       <th scope="col">Email</th>
       <th scope="col">Gender</th>
      <th scope="col">Phone Number</th>
      <th scope="col">Role</th>
      <th scope="col">Status</th>
      <th scope="col">Edit</th>
      <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
       {
         data.map((item,index)=>{
             return(
                     <tr>
                     <th scope="row">{index+1}</th>
                    <td>{item.name}</td>
                     <td>{item.email}</td>
                     <td>{item.gender}</td>
                     <td>{item.phoneNumber}</td>
                    <td>{item.roleId?.name || "-"}</td>
                    <td><button type="button" className={(item.status=="Active")?"btn btn-success":"btn btn-danger"} onClick={()=>changeSatus(item)}>{item.status}</button></td>
                    <td><Link to={`/Edit-User/${item._id}`} className="btn btn-primary btn-sm">Edit</Link></td>
                    <td><button type="button" className="btn btn-danger btn-sm" onClick={()=>deleteUser(item._id)}>Delete</button></td>
                    </tr>
            )
                
        })
     }
    </tbody>
  </table>
</div>
//         <div>
//             <table className="table">
//   <thead>
//     <tr>
//       <th scope="col">#</th>
//       <th scope="col">Name</th>
//       <th scope="col">Email</th>
//       <th scope="col">Gender</th>
//       <th scope="col">Phone Number</th>
//       <th scope="col">Role</th>
//     </tr>
//   </thead>
//   <tbody>
//     {
//         data.map((item,index)=>{
//             return(
//                     <tr>
//                     <th scope="row">{index+1}</th>
//                     <td>{item.name}</td>
//                     <td>{item.email}</td>
//                     <td>{item.gender}</td>
//                     <td>{item.phoneNumber}</td>
//                     <td>{item.roleId.name}</td>
//                     </tr>
//             )
                
//         })
//     }
    
   
//   </tbody>
// </table>
//         </div>
    )
}

export default UserList;