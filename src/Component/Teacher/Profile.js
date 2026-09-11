import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

 const Profile=()=>{
    const { id } = useParams();
      const [teacherdata,setData]=useState([])
      async function getTeacherDetail()
      {
                    await fetch( `http://localhost:5000/api/teacher/edit/${id}`)
                    .then((response)=>response.json())
                    .then((result)=>setData(result.data))
      }

    useEffect(()=>{
            getTeacherDetail()
    },[])
  return (
    <>
      

      <div className="bg-light min-vh-100 py-5">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="card shadow-sm border-0">
            {/* Header */}
            <div className="card-header bg-primary text-white py-4 px-4">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                 <img
                  src={`http://localhost:5000/uploads/teacher/${teacherdata.profileImage}`}
                  alt=""
                  className="rounded-circle border border-3 border-white"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                
                <div>
                  <h3 className="mb-1">{teacherdata.firstName} {teacherdata.lastName}</h3>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-light text-primary">
                      {teacherdata.department}
                    </span>
                    <span className="badge bg-success">{(teacherdata.status)?"Acive":"In Active"}</span>
                    <span className="badge bg-secondary">{teacherdata.employmentType}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Personal Details */}
              <h5 className="text-primary border-bottom pb-2 mb-3">
                <i className="fa-solid fa-user me-2"></i>Personal Details
              </h5>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">First Name</div>
                  <div className="fw-semibold">{teacherdata.firstName} </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Last Name</div>
                  <div className="fw-semibold">{teacherdata.lastName}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Gender</div>
                  <div className="fw-semibold">{teacherdata.gender}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Date of Birth</div>
                  <div className="fw-semibold">{teacherdata.dateOfBirth &&
    new Date(teacherdata.dateOfBirth).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}</div>
                </div>
              </div>

              {/* Professional Details */}
              <h5 className="text-primary border-bottom pb-2 mb-3">
                <i className="fa-solid fa-briefcase me-2"></i>Professional
                Details
              </h5>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Employee ID</div>
                  <div className="fw-semibold">{teacherdata.employeeID}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Department</div>
                  <div className="fw-semibold">{teacherdata.department}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Qualification</div>
                  <div className="fw-semibold">{teacherdata.qualification}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Experience</div>
                  <div className="fw-semibold">{teacherdata.experience} years</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Employment Type</div>
                  <div className="fw-semibold">{teacherdata.employmentType}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Joining Date</div>
                  <div className="fw-semibold">{teacherdata.joiningDate &&
    new Date(teacherdata.joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}</div>
                </div>
              </div>

              {/* Contact & Address */}
              <h5 className="text-primary border-bottom pb-2 mb-3">
                <i className="fa-solid fa-address-card me-2"></i>Contact &amp;
                Address
              </h5>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Mobile Number</div>
                  <div className="fw-semibold">+91 {teacherdata.mobileNumber}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold">
                    {teacherdata.email}
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="text-muted small">Address</div>
                  <div className="fw-semibold">
                    {teacherdata.address}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-muted small">City</div>
                  <div className="fw-semibold">{teacherdata.city}</div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-muted small">State</div>
                  <div className="fw-semibold">{teacherdata.state}</div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="text-muted small">PIN Code</div>
                  <div className="fw-semibold">{teacherdata.PINCode}</div>
                </div>
              </div>

              {/* Account */}
              <h5 className="text-primary border-bottom pb-2 mb-3">
                <i className="fa-solid fa-lock me-2"></i>Account
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="text-muted small">Status</div>
                  <span className="badge bg-success">{(teacherdata.status)?"Acive":"In Active"}</span>
                </div>
                
              </div>
            </div>

            <div className="card-footer bg-white text-end py-3 px-4">
              <button className="btn btn-outline-primary btn-sm me-2">
                Edit Profile
              </button>
              <button className="btn btn-primary btn-sm">
                Download ID Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile