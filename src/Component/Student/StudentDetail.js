import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./StudentDetails.css";
const StudentDetail=()=>{
    const [data,setData]=useState([])
    const {id}=useParams();
    async function getdata()
    {
        fetch("http://localhost:5000/api/student/view/"+id)
        .then((responce)=>responce.json())
        .then((result)=>setData(result))
    }
    useEffect(()=>{
           getdata();
    },[])
    return(
        <div>
            

    <div class="container page-container">

        
        <div class="d-flex justify-content-between align-items-center action-buttons">

            <div>
                <h4 class="mb-1">Student Details</h4>
                <small class="text-muted">
                    View complete student information
                </small>
            </div>

            <div>
                <button class="btn btn-outline-secondary me-2">
                    ← Back
                </button>

                <button class="btn btn-primary">
                    Edit Student
                </button>
            </div>

        </div>


        
        <div class="profile-card">

            <div class="profile-header">

                <div class="row align-items-center">

                    <div class="col-md-2 text-center">

                        <img
                            src={`http://localhost:5000/uploads/${data.StudentPhoto}`}
                            class="student-photo"
                            alt="Student Photo"/>

                    </div>

                    <div class="col-md-7">

                        <div class="student-name">
                            {data.name}
                        </div>

                        <div class="student-info mt-2">
                            Admission No: {data.admissionNumber}
                        </div>

                        <div class="student-info">
                            Class: {data.className} &nbsp; | &nbsp; Section: A
                        </div>

                        <div class="student-info">
                            Academic Year: {data.academicYear}
                        </div>

                    </div>

                    <div class="col-md-3 text-md-end mt-3 mt-md-0">

                        <span class="status-badge">
                            Active Student
                        </span>

                    </div>

                </div>

            </div>

        </div>


        
        <div class="section-card">

            <div class="section-title">
                Personal Information
            </div>

            <div class="row g-4">

                <div class="col-md-4">
                    <div class="detail-label">Student Name</div>
                    <div class="detail-value">{data.name}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Date of Birth</div>
                    <div class="detail-value">{data.dataOfBirth}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Gender</div>
                    <div class="detail-value">{data.gender}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Blood Group</div>
                    <div class="detail-value">{data.bloodGroup}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Admission Number</div>
                    <div class="detail-value">{data.admissionNumber}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Registration Date</div>
                    <div class="detail-value">14 August 2026</div>
                </div>

            </div>

        </div>


       
        <div class="section-card">

            <div class="section-title">
                Parent / Guardian Information
            </div>

            <div class="row g-4">

                <div class="col-md-4">
                    <div class="detail-label">Father's Name</div>
                    <div class="detail-value">{data.fatherName}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Mother's Name</div>
                    <div class="detail-value">{data.motherName}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Parent Mobile</div>
                    <div class="detail-value">{data.parentMobile}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Father's Occupation</div>
                    <div class="detail-value">{data.fatherOccupation}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Mother's Occupation</div>
                    <div class="detail-value">{data.motherOccupation}</div>
                </div>

                <div class="col-md-4">
                    <div class="detail-label">Emergency Contact</div>
                    <div class="detail-value">{data.emergencyContact}</div>
                </div>

            </div>

        </div>


        
        <div class="section-card">

            <div class="section-title">
                Academic Information
            </div>

            <div class="row g-4">

                <div class="col-md-3">
                    <div class="detail-label">Class</div>
                    <div class="detail-value">{data.className}</div>
                </div>

                <div class="col-md-3">
                    <div class="detail-label">Section</div>
                    <div class="detail-value">-</div>
                </div>

                <div class="col-md-3">
                    <div class="detail-label">Academic Year</div>
                    <div class="detail-value">{data.academicYear}</div>
                </div>

                <div class="col-md-3">
                    <div class="detail-label">Roll Number</div>
                    <div class="detail-value">-</div>
                </div>

                <div class="col-md-6">
                    <div class="detail-label">Previous School</div>
                    <div class="detail-value">
                        {data.previousSchool}
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="detail-label">Previous Percentage</div>
                    <div class="detail-value">
                        -
                    </div>
                </div>

            </div>

        </div>


        
        <div class="section-card">

            <div class="section-title">
                Contact Information
            </div>

            <div class="row g-4">

                <div class="col-md-6">

                    <div class="detail-label">
                        Email Address
                    </div>

                    <div class="detail-value">
                        {data.studentEmail}
                    </div>

                </div>

                <div class="col-md-6">

                    <div class="detail-label">
                        Mobile Number
                    </div>

                    <div class="detail-value">
                        {data.emergencyContact}
                    </div>

                </div>

                <div class="col-md-12">

                    <div class="detail-label">
                        Address
                    </div>

                    <div class="detail-value">
                         {data.address}
                    </div>

                </div>

                <div class="col-md-4">

                    <div class="detail-label">
                        City
                    </div>

                    <div class="detail-value">
                        {data.city}
                    </div>

                </div>

                <div class="col-md-4">

                    <div class="detail-label">
                        State
                    </div>

                    <div class="detail-value">
                        {data.state}
                    </div>

                </div>

                <div class="col-md-4">

                    <div class="detail-label">
                        Pin Code
                    </div>

                    <div class="detail-value">
                        {data.pincode}
                    </div>

                </div>

            </div>

        </div>


       
        <div class="section-card">

            <div class="section-title">
                Student Documents
            </div>


            
            <div class="document-card">

                <div class="d-flex align-items-center">

                    <div class="document-icon">
                        📄
                    </div>

                    <div>
                        <div class="document-name">
                            Birth Certificate
                        </div>

                        <small class="text-muted">
                            {data.birthCertificate}
                        </small>
                    </div>

                </div>

                <button class="btn btn-sm btn-outline-primary">
                    View
                </button>

            </div>


            
            <div class="document-card">

                <div class="d-flex align-items-center">

                    <div class="document-icon">
                        📄
                    </div>

                    <div>
                        <div class="document-name">
                            Aadhaar Card
                        </div>

                        <small class="text-muted">
                            {data.aadhaarCard}
                        </small>
                    </div>

                </div>

                <button class="btn btn-sm btn-outline-primary">
                    View
                </button>

            </div>


            
            <div class="document-card">

                <div class="d-flex align-items-center">

                    <div class="document-icon">
                        📄
                    </div>

                    <div>
                        <div class="document-name">
                            Transfer Certificate
                        </div>

                        <small class="text-muted">
                             {data.transferCertificate}
                        </small>
                    </div>

                </div>

                <button class="btn btn-sm btn-outline-primary">
                    View
                </button>

            </div>


            
            <div class="document-card">

                <div class="d-flex align-items-center">

                    <div class="document-icon">
                        📄
                    </div>

                    <div>
                        <div class="document-name">
                            Previous Marksheet
                        </div>

                        <small class="text-muted">
                            {data.previousMarksheet}
                        </small>
                    </div>

                </div>

                <button class="btn btn-sm btn-outline-primary">
                    View
                </button>

            </div>

        </div>


       
        <div class="section-card text-end">

            <button class="btn btn-secondary me-2">
                Print
            </button>

            <button class="btn btn-primary">
                Edit Student
            </button>

        </div>

    </div>


    
        </div>
    )
}

export default StudentDetail