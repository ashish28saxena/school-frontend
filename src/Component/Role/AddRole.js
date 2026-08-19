import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
const AddRole=()=>{
    const { id } = useParams(); 
    const [role,setRole]=useState('');
    useEffect(()=>{
            if(id)
            {
               getData(); 
            }
    },[])

    function getData()
    {
        fetch("http://localhost:5000/api/role/Edit/"+id)
        .then((responce)=>responce.json())
        .then((result)=>setRole(result.name))
    }
    
    function submitData()
    {
          if(id)
          {
            fetch("http://localhost:5000/api/role/update/"+id,{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    rolename:role
                })

            })
            .then((responce)=>responce.json())
            .then((result)=>console.log(result))

          }else{
            fetch("http://localhost:5000/api/role/submit",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    rolename:role
                })

            })
            .then((responce)=>responce.json())
            .then((result)=>console.log(result))
          }
    }
    return (
        <div>
            
            <h1 > {id?"this is update Role page":"this is add Role page"} </h1>

            <form>
  <div class="form-group">
    <label for="exampleInputEmail1">Role</label>
    <input type="text" class="form-control"  placeholder="Enter Role" value={role} onChange={(e)=>setRole(e.target.value)}/>
    
  </div>
  
  <br></br>
  <button type="button" class="btn btn-primary" onClick={submitData}>{(id)?"Update":"Submit"}</button>
</form>
        </div>
    )
}

export default AddRole;