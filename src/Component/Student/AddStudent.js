import React, { useEffect, useState } from "react";
const AddStudent = () => {
    const [studentName,setStudentName]=useState('')
    const [dataOfBirth,setDataOfBirth]=useState('')
    const[gender,setGender]=useState('')
    const [bloodGroup,setBloodGroup]=useState('')
    const [file, setFile] = useState(null);
    const [fatherName,setFatherName]=useState('')
    const [motherName,setMotherName]=useState('')
    const [fatherOccupation,setFatherOccupation]=useState('')
    const [motherOccupation,setMotherOccupation]=useState('')
    const [parentMobile,setParentMobile]=useState('')
    const [admissionNumber,setAdmissionNumber]=useState('')
    const [className,setClassName]=useState('')
    const [academicYear,setAcademicYear]=useState('')
    const [previousSchool,setPreviousSchool]=useState('')
    const [studentEmail,setStudentEmail]=useState('')
    const [emergencyContact,setEmergencyContact]=useState('')
    const [address,setAddress]=useState('')
    const [city,setCity]=useState('')
    const [state,setState]=useState('')
    const [pincode,setPincode]=useState('')
    const [isconfirm,setIsconfirm]=useState(false)
    const [birthCertificate, setBirthCertificate] = useState(null);
    const [aadhaarCard, setAadhaarCard] = useState(null);
    const [transferCertificate, setTransferCertificate] = useState(null);
    const [previousMarksheet, setPreviousMarksheet] = useState(null);
    
    const [classData,setClassData]=useState([])
    const [stateData,setStateData]=useState([])
    const [genderData,setGenderData]=useState(['Male','Female','Other'])
    const [bloodGroupData,setBloodGroupData]=useState(['A+','A-','B+','B-','AB+','AB-','O+','O-'])
    function getClassData()
    {
           fetch("https://school-management-backend-ochre.vercel.app/api/class/")
           .then((responce)=>responce.json())
           .then((result)=>setClassData(result))
                      
    }

    function getSateData()
    {
       fetch("https://csc.sidsworld.co.in/api/states/101")
       .then((responce)=>responce.json())
       .then((result)=>setStateData(result.states))
    }

    async function submitdata()
    {
        const formData = new FormData();
        formData.append("name", studentName);
         formData.append("dataOfBirth", dataOfBirth);
         formData.append("gender", gender);
         formData.append("StudentPhoto", file);
         formData.append("bloodGroup", bloodGroup);

         formData.append("fatherName", fatherName);
         formData.append("motherName", motherName);
         formData.append("fatherOccupation", fatherOccupation);
         formData.append("motherOccupation", motherOccupation);
         formData.append("parentMobile", parentMobile);
         formData.append("admissionNumber", admissionNumber);
         formData.append("className", className);
         formData.append("academicYear", academicYear);
         formData.append("previousSchool", previousSchool);
         formData.append("studentEmail", studentEmail);
         formData.append("emergencyContact", emergencyContact);
         formData.append("address", address);
         formData.append("city", city);


         formData.append("state", state);
         formData.append("pincode", pincode);
         formData.append("isconfirm", isconfirm);
         formData.append("birthCertificate", birthCertificate);
         formData.append("aadhaarCard", aadhaarCard);
         formData.append("transferCertificate", transferCertificate);
         formData.append("previousMarksheet", previousMarksheet);


         

        const response = await fetch("https://school-management-backend-ochre.vercel.app/api/student/submit",{
            method:"POST",
            body:formData
        })

        const result = await response.json();

console.log(result);
         
         

         

         
    }
    useEffect(()=>{
            getClassData();
            getSateData();
    },[])
    
    return (
        <>
        <div>
            
            <div className="container form-container">

                <div className="card">


                    <div className="card-header text-center">
                        <h2 className="mb-1">Student Registration Form</h2>
                        <p className="mb-0">School Admission Registration</p>
                    </div>

                    <div className="card-body p-4">




                        <div className="section-title">
                            1. Student Information
                        </div>

                        <div className="row g-3">

                            <div className="col-md-6">
                                <label className="form-label">
                                    Student Name <span className="required">*</span>
                                </label>
                                <input type="text" className="form-control" placeholder="Enter student name" value={studentName} onChange={(e)=>setStudentName(e.target.value)} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Date of Birth <span className="required">*</span>
                                </label>
                                <input type="date" className="form-control" value={dataOfBirth} onChange={(e)=>setDataOfBirth(e.target.value)} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Gender <span className="required">*</span>
                                </label>
                                    
                                <select className="form-select" onChange={(e)=>setGender(e.target.value)}>
                                    <option value="">Select Gender</option>
                                    {
                                        genderData.map((item)=>{
                                            return(
                                                        <option value={item}>{item}</option>
                                            )
                                        })
                                    }
                                    
                                    
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Blood Group</label>

                                <select className="form-select" onChange={(e)=>setBloodGroup(e.target.value)}>
                                    <option value="">Select Blood Group</option>
                                    {
                                        bloodGroupData.map((item)=>{
                                            return(
                                                        <option value={item}>{item}</option>
                                            )
                                        })
                                    }
                                    
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Student Photo</label>
                                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])}/>
                            </div>

                        </div>

                        <hr className="my-4"></hr>



                        <div className="section-title">
                            2. Parent / Guardian Information
                        </div>

                        <div className="row g-3">

                            <div className="col-md-6">
                                <label className="form-label">
                                    Father's Name <span className="required">*</span>
                                </label>
                                <input type="text" className="form-control"
                                    placeholder="Enter father's name" value={fatherName} onChange={(e)=>setFatherName(e.target.value)}/>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Mother's Name <span className="required">*</span>
                                </label>
                                <input type="text" className="form-control"
                                    placeholder="Enter mother's name" value={motherName} onChange={(e)=>setMotherName(e.target.value)} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Father's Occupation
                                </label>
                                <input type="text" className="form-control"
                                    placeholder="Enter occupation" value={fatherOccupation} onChange={(e)=>setFatherOccupation(e.target.value)}/>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Mother's Occupation
                                </label>
                                <input type="text" className="form-control"
                                    placeholder="Enter occupation" value={motherOccupation} onChange={(e)=>setMotherOccupation(e.target.value)} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Parent Mobile <span className="required">*</span>
                                </label>
                                <input type="tel" className="form-control"
                                    placeholder="Enter mobile number" value={parentMobile} onChange={(e)=>setParentMobile(e.target.value)} />
                            </div>

                        </div>

                        <hr className="my-4"></hr>



                        <div className="section-title">
                            3. Academic Information
                        </div>

                        <div className="row g-3">

                            <div className="col-md-4">
                                <label className="form-label">
                                    Admission Number
                                </label>
                                <input type="text" className="form-control"
                                    placeholder="Enter admission number" value={admissionNumber} onChange={(e)=>setAdmissionNumber(e.target.value)} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    className <span className="required">*</span>
                                </label>

                                <select className="form-select" onChange={(e)=>setClassName(e.target.value)}>
                                    <option value="">Select className</option>
                                    {
                                        classData.map((item)=>{
                                            return(
                                                <option value={item._id}>{item.className}</option>
                                            )
                                        })
                                    }
                                    
                                    
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Section <span className="required">*</span>
                                </label>

                                <select className="form-select" required>
                                    <option value="">Select Section</option>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                    <option>D</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Academic Year
                                </label>

                                <select className="form-select" value={academicYear} onChange={(e)=>setAcademicYear(e.target.value)}>
                                    <option>2026-27</option>
                                    <option>2027-28</option>
                                    <option>2028-29</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Previous School
                                </label>

                                <input type="text" className="form-control"
                                    placeholder="Enter previous school" value={previousSchool} onChange={(e)=>setPreviousSchool(e.target.value)} />
                            </div>

                        </div>

                        <hr className="my-4"></hr>



                            <div className="section-title">
                                4. Contact Information
                            </div>

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input type="email" className="form-control"
                                        placeholder="student@example.com" value={studentEmail} onChange={(e)=>setStudentEmail(e.target.value)} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Emergency Contact
                                    </label>

                                    <input type="tel" className="form-control"
                                        placeholder="Emergency contact number" value={emergencyContact} onChange={(e)=>setEmergencyContact(e.target.value)} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">
                                        Address <span className="required">*</span>
                                    </label>

                                    <textarea className="form-control" rows="3"
                                        placeholder="Enter complete address" value={address} onChange={(e)=>setAddress(e.target.value)}></textarea>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">City</label>

                                    <input type="text" className="form-control"
                                        placeholder="Enter city" value={city} onChange={(e)=>setCity(e.target.value)} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">State</label>

                                    <select className="form-select" onChange={(e)=>setState(e.target.value)} >
                                        <option value="">Select State</option>
                                        
                                        {
                                            stateData.map((item)=>{
                                                return(
                                                    <option>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Pin Code</label>

                                    <input type="text" className="form-control"
                                        placeholder="Enter pin code" value={pincode} onChange={(e)=>setPincode(e.target.value)} />
                                </div>

                            </div>

                            <hr className="my-4"></hr>



                            <div className="section-title">
                                5. Documents
                            </div>

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Birth Certificate
                                    </label>

                                    <input type="file" className="form-control" onChange={(e) => setBirthCertificate(e.target.files[0])}/>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Aadhaar Card
                                    </label>

                                    <input type="file" className="form-control" onChange={(e) => setAadhaarCard(e.target.files[0])}/>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Transfer Certificate
                                    </label>

                                    <input type="file" className="form-control" onChange={(e) => setTransferCertificate(e.target.files[0])} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Previous Marksheet
                                    </label>

                                    <input type="file" className="form-control" onChange={(e) => setPreviousMarksheet(e.target.files[0])} />
                                </div>

                            </div>

                            <hr className="my-4"></hr>



                                <div className="form-check mb-4">

                                    <input className="form-check-input" type="checkbox"
                                        id="declaration" onChange={(e)=>setIsconfirm(e.target.value)}/>

                                    <label className="form-check-label" for="declaration">
                                        I confirm that the information provided above is
                                        correct and complete.
                                    </label>

                                </div>



                                <div className="text-center">

                                    <button type="reset"
                                        className="btn btn-secondary px-4 me-2">
                                        Reset
                                    </button>

                                    <button type="button"
                                        className="btn btn-primary px-5" onClick={submitdata}>
                                        Register Student
                                    </button>

                                </div>



                            
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}

export default AddStudent