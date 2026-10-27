import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const AddClass=()=>{
    const { id } =useParams();
    const[className,setClassName]=useState('');
    const[classSection,setClassSection]=useState('');
    function submitData()
    {
          if(id)
           {
              fetch("https://school-management-backend-ochre.vercel.app/api/class/update/"+id,{
                method:"PUT",
                headers:{
                   "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "className":className,
                    "classSection":classSection
                })
              })

              .then((responce)=>responce.json())
              .then((result)=>console.log(result))

           }else{
                fetch("https://school-management-backend-ochre.vercel.app/api/class/submit",{
                method:"POST",
                headers:{
                   "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "className":className,
                    "classSection":classSection
                })
              })

              .then((responce)=>responce.json())
              .then((result)=>console.log(result))
           }
    }

    function getEditClassData()
    {
           fetch("https://school-management-backend-ochre.vercel.app/api/class/edit/"+id)
           .then((responce)=>responce.json())
           .then((result)=>{
            setClassName(result.className);
            setClassSection(result.classSection)
           })
    }
    useEffect(()=>{
           if(id)
           {
            getEditClassData();
           }
    },[])
    return(
        <div>
            <h1>this is Add Class Form </h1>
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Class Name</label>
                    <input type="text" class="form-control" placeholder="Enter Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />

                </div>

                <br></br>
                <div class="form-group">
                    <label for="exampleInputEmail1">Class Section</label>
                    <input type="text" class="form-control" placeholder="Enter Class Section" value={classSection} onChange={(e) => setClassSection(e.target.value)} />

                </div>

                <br></br>
                <button type="button" class="btn btn-primary" onClick={submitData}>{(id) ? "Update" : "Submit"}</button>
            </form>
        </div>
    )
}

export default AddClass;