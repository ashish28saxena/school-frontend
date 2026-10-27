

import React, { useState } from "react";

function AddTeacher() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    employeeId: "",
    qualification: "",
    experience: "",
    joiningDate: "",
    department: "",
    employmentType: "",
    address: "",
    city: "",
    state: "",
    PINCode: "",
    photo: null,
    status: true,
    password:""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("firstName", form.firstName);
  formData.append("lastName", form.lastName);
  formData.append("gender", form.gender);
  formData.append("dateOfBirth", form.dateOfBirth);
  formData.append("mobileNumber", form.mobileNumber);
  formData.append("email", form.email);
  formData.append("employeeID", form.employeeID);
  formData.append("qualification", form.qualification);
  formData.append("experience", form.experience);
  formData.append("joiningDate", form.joiningDate);
  formData.append("department", form.department);
  formData.append("employmentType", form.employmentType);
  formData.append("address", form.address);
  formData.append("city", form.city);
  formData.append("state", form.state);
  formData.append("PINCode", form.PINCode);
  formData.append("status", form.status);
  formData.append("password", form.password);

  if (form.profileImage) {
    formData.append("profileImage", form.profileImage);
  }

  const response = await fetch(
    "https://school-management-backend-ochre.vercel.app/api/teacher/submit",
    {
      method: "POST",
      body: formData
    }
  );

  const result = await response.json();
  setMessage(result.message)
  //console.log(result);
};

  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      mobile: "",
      email: "",
      employeeId: "",
      qualification: "",
      experience: "",
      joiningDate: "",
      department: "",
      employmentType: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      photo: null,
      status: true,
      password:""
    });
  };

  

  return (
    <div className="container mt-4">

      <div className="card shadow-sm">

        {/* Header */}
        {message && (
    <div className="success-message">
      ✓ {message}
    </div>
  )}
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Add Teacher</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Personal Details */}
            <h5 className="mb-3">Personal Details</h5>

            <div className="row">

              {/* First Name */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  First Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter last name"
                />
              </div>

              {/* Gender */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Gender <span className="text-danger">*</span>
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* DOB */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Mobile */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Mobile Number <span className="text-danger">*</span>
                </label>

                <input
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter email"
                  required
                />
              </div>


                            <div className="col-md-4 mb-3">
                <label className="form-label">
                  Password <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Password"
                  required
                />
              </div>

                            

            </div>

            <hr />

            {/* Professional Details */}
            <h5 className="mb-3">Professional Details</h5>

            <div className="row">

              {/* Employee ID */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Employee ID <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="EMP001"
                  required
                />
              </div>

              {/* Qualification */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Qualification
                </label>

                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="B.Ed / M.Ed / M.Sc"
                />
              </div>

              {/* Experience */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Years"
                  min="0"
                />
              </div>

              {/* Joining Date */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Department */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Department
                </label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Department</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Computer">Computer</option>
                  <option value="Social Science">
                    Social Science
                  </option>
                </select>
              </div>

              {/* Employment Type */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Employment Type
                </label>

                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>

            </div>

            <hr />

            {/* Address Details */}
            <h5 className="mb-3">Address Details</h5>

            <div className="row">

              {/* Address */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter address"
                ></textarea>
              </div>

              {/* City */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter city"
                />
              </div>

              {/* State */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter state"
                />
              </div>

              {/* PIN */}
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  PIN Code
                </label>

                <input
                  type="text"
                  name="PINCode"
                  value={form.PINCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter PIN code"
                />
              </div>

            </div>

            <hr />

            {/* Other Details */}
            <h5 className="mb-3">Other Details</h5>

            <div className="row">

              {/* Photo */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Profile Photo
                </label>

                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="form-control"
                  accept="image/*"
                />

              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Status
                </label>

                <div className="form-check form-switch mt-2">

                  <input
                    type="checkbox"
                    name="status"
                    checked={form.status}
                    onChange={handleChange}
                    className="form-check-input"
                  />

                  <label className="form-check-label">
                    Active
                  </label>

                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Teacher
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary ms-2"
              >
                Reset
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
}

export default AddTeacher;

