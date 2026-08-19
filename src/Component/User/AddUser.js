import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const AddUser=()=>{
    const {id} = useParams();
    const [role,setRole]=useState([]);
    const [name,setName]=useState('');
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
     const [gender,setGender]=useState('')
     const [phone,setPhone]=useState('')
    const [selectRole,setSelectRole]=useState('')
    const [statusList,setStatusList]=useState(["Active","Inactive"]);
    const [status,setStatus]=useState('');
    function getRoleData()
    {
       fetch("http://localhost:5000/api/role")
       .then((responce)=>responce.json())
       .then((reslt)=>setRole(reslt))
    }

    function getEditUser() 
    {
        fetch("http://localhost:5000/api/user/userEdit/"+id)
        .then((responce)=>responce.json())
        .then((result)=>{
            console.log("ashish",result.name)
            setName(result.name)
            setEmail(result.email)
            setGender(result.gender)
            setPhone(result.phoneNumber)
            setSelectRole(result.roleId)
    })
    }

    function submitData()
    {
        if(id)
        {
                fetch("http://localhost:5000/api/user/userSubmit/"+id,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                name:name,
                email:email,
                gender:gender,
                phoneNumber:phone,
                roleId:selectRole,
                status:status
            })
        })
        .then((responce)=>responce.json())
        .then((result)=>console.log("data"+result.message))
        }else{
                fetch("http://localhost:5000/api/user/userSubmit",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                name:name,
                email:email,
                password:password,
                gender:gender,
                phoneNumber:phone,
                roleId:selectRole,
                status:status
            })
        })
        .then((responce)=>responce.json())
        .then((result)=>console.log("data"+result.message))
        }
        
    }
    useEffect(()=>{
        getRoleData();
        if(id)
        {
            getEditUser();
        }
    },[])
    return (
        <div>
            <h1>this is user form </h1>

            <form>
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control"  placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Gender</label>
                    <div class="col-sm-10">
                        
                        <div class="dropdown form-control">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {(gender)?gender:"Select Gender" }   
                            </button>
                            <ul class="dropdown-menu">
                               
                                <li onClick={(e)=>setGender("Male")}><a class="dropdown-item" >Male</a></li>
                                <li onClick={(e)=>setGender("Female")}><a class="dropdown-item" >Female</a></li>
                                <li onClick={(e)=>setGender("Other")}><a class="dropdown-item" >Other</a></li>
                                
                                
                                
                            </ul>
                        </div>
                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Phone Number</label>
                    <div class="col-sm-10">
                        <input type="number"  class="form-control"  placeholder="Enter Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Role</label>
                    <div class="col-sm-10">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {(selectRole)?selectRole:"Select Role" }   
                            </button>
                            <ul class="dropdown-menu">
                               
                                {
                                    role.map((item)=>{
                                        return (
                                            <li onClick={(e)=>setSelectRole(item._id)}><a class="dropdown-item" >{item.name}</a></li>
                                        )
                                    })
                                }
                                
                                
                                
                            </ul>
                        </div>

                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Status</label>
                    <div class="col-sm-10">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {(status)?status:"Select Status" }   
                            </button>
                            <ul class="dropdown-menu">
                               
                                {
                                    statusList.map((item)=>{
                                        return (
                                            <li onClick={(e)=>setStatus(item)}><a class="dropdown-item" >{item}</a></li>
                                        )
                                    })
                                }
                                
                                
                                
                            </ul>
                        </div>

                    </div>
                </div>
                <br></br>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label"> </label>
                    <div class="col-sm-10">
                        <button type="button" class="btn btn-secondary" onClick={submitData}>{(id)?"Update":"Submit"}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddUser;