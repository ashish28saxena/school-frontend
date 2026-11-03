import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
const initialValues = {
  studentName: "",
  dataOfBirth: "",
  gender: "",
  bloodGroup: "",
  fatherName: "",
  motherName: "",
  fatherOccupation: "",
  motherOccupation: "",
  parentMobile: "",
  admissionNumber: "",
  className: "",
  section: "",
  academicYear: "2026-27",
  previousSchool: "",
  studentEmail: "",
  emergencyContact: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  isconfirm: false,
};

const initialFiles = {
  StudentPhoto: null,
  birthCertificate: null,
  aadhaarCard: null,
  transferCertificate: null,
  previousMarksheet: null,
};

const MB = 1024 * 1024;
const nameRegex = /^[A-Za-z][A-Za-z .'-]{1,49}$/;
const mobileRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API = "http://localhost:5000/api";

const normalizeYear = (y) => {
  // "2026-2027" -> "2026-27"
  if (!y) return "2026-27";
  const m = /^(\d{4})-(\d{4})$/.exec(y);
  return m ? `${m[1]}-${m[2].slice(2)}` : y;
};

const AddStudent = () => {
  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState(initialFiles);
  const [fileKey, setFileKey] = useState(0); // file inputs ko reset karne ke liye
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [classData, setClassData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const genderData = ["Male", "Female", "Other"];
  const bloodGroupData = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [sectionData,setSectionData] =useState([])
  const [existingFiles, setExistingFiles] = useState({});



  const topRef = useRef(null);
const { id } = useParams();          // 1. sabse pehle
  const isEdit = Boolean(id);  
  useEffect(() => {
      if (id) {
    fetch(`${API}/student/view/${id}`)
      .then((res) => res.json())
      .then((result) => {
        const s = result.data || result; // agar response { data: {...} } mein aaye to bhi chale

        setValues({
          studentName: s.name || "",
          dataOfBirth: s.dataOfBirth ? String(s.dataOfBirth).split("T")[0] : "",
          gender: s.gender || "",
          bloodGroup: s.bloodGroup || "",
          fatherName: s.fatherName || "",
          motherName: s.motherName || "",
          fatherOccupation: s.fatherOccupation || "",
          motherOccupation: s.motherOccupation || "",
          parentMobile: s.parentMobile || "",
          admissionNumber: s.admissionNumber || "",
          className: s.className?._id || s.className || "",
          section: s.sectionName?._id || s.sectionName || "",
          academicYear: normalizeYear(s.academicYear),
          previousSchool: s.previousSchool || "",
          studentEmail: s.studentEmail || "",
          emergencyContact: s.emergencyContact || "",
          address: s.address || "",
          city: s.city || "",
          state: s.state || "",
          pincode: s.pincode || "",
          isconfirm: s.isconfirm === true || s.isconfirm === "true",
        });

        setExistingFiles({
          StudentPhoto: s.StudentPhoto,
          birthCertificate: s.birthCertificate,
          aadhaarCard: s.aadhaarCard,
          transferCertificate: s.transferCertificate,
          previousMarksheet: s.previousMarksheet,
        });
      })
      .catch((error) => {
        console.error("Student fetch error:", error);
        setMessage({ type: "danger", text: "Student data load nahi ho paya." });
      });
  }
    fetch("http://localhost:5000/api/class/")
      .then((res) => res.json())
      .then((result) => setClassData(Array.isArray(result) ? result : []))
      .catch(() => setClassData([]));

    
fetch("http://localhost:5000/api/section/")
  .then((res) => res.json())
  .then((result) => {
    setSectionData(
      Array.isArray(result.data) ? result.data : []
    );
  })
  .catch((error) => {
    console.error("Section API Error:", error);
    setSectionData([]);
  });


    fetch("https://csc.sidsworld.co.in/api/states/101")
      .then((res) => res.json())
      .then((result) => setStateData(result.states || []))
      .catch(() => setStateData([]));
  }, []);

  // ---------- handlers ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = (e) => {
    const { name, files: picked } = e.target;
    setFiles((prev) => ({ ...prev, [name]: picked[0] || null }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---------- validation ----------
  const validateFile = (file, { image = false, maxMB = 5 } = {}) => {
    if (!file) return "";
    const allowed = image
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type))
      return image ? "Only JPG, PNG or WEBP image allowed." : "Only PDF, JPG or PNG allowed.";
    if (file.size > maxMB * MB) return `File size must be less than ${maxMB} MB.`;
    return "";
  };

  const validate = () => {
    const e = {};
    const v = values;

    if (!v.studentName.trim()) e.studentName = "Please enter student name.";
    else if (!nameRegex.test(v.studentName.trim())) e.studentName = "Enter a valid name (letters only).";

    if (!v.dataOfBirth) e.dataOfBirth = "Please select date of birth.";
    else {
      const dob = new Date(v.dataOfBirth);
      const today = new Date();
      if (dob > today) e.dataOfBirth = "Date of birth cannot be in the future.";
      else {
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 2 || age > 25) e.dataOfBirth = "Please enter a valid date of birth.";
      }
    }

    if (!v.gender) e.gender = "Please select gender.";

    if (!v.fatherName.trim()) e.fatherName = "Please enter father's name.";
    else if (!nameRegex.test(v.fatherName.trim())) e.fatherName = "Enter a valid name (letters only).";

    if (!v.motherName.trim()) e.motherName = "Please enter mother's name.";
    else if (!nameRegex.test(v.motherName.trim())) e.motherName = "Enter a valid name (letters only).";

    if (!v.parentMobile.trim()) e.parentMobile = "Please enter parent mobile number.";
    else if (!mobileRegex.test(v.parentMobile.trim())) e.parentMobile = "Enter a valid 10-digit mobile number.";

    if (!v.className) e.className = "Please select class.";
    if (!v.section) e.section = "Please select section.";

    if (v.studentEmail.trim() && !emailRegex.test(v.studentEmail.trim()))
      e.studentEmail = "Enter a valid email address.";

    if (v.emergencyContact.trim() && !mobileRegex.test(v.emergencyContact.trim()))
      e.emergencyContact = "Enter a valid 10-digit mobile number.";

    if (!v.address.trim()) e.address = "Please enter address.";
    else if (v.address.trim().length < 10) e.address = "Address is too short (min 10 characters).";

    if (v.pincode.trim() && !pincodeRegex.test(v.pincode.trim()))
      e.pincode = "Pin code must be 6 digits.";

    const photoErr = validateFile(files.StudentPhoto, { image: true, maxMB: 2 });
    if (photoErr) e.StudentPhoto = photoErr;
    ["birthCertificate", "aadhaarCard", "transferCertificate", "previousMarksheet"].forEach((k) => {
      const err = validateFile(files[k]);
      if (err) e[k] = err;
    });

    if (!v.isconfirm) e.isconfirm = "Please confirm the declaration before submitting.";

    return e;
  };

  // ---------- reset ----------
  const resetForm = () => {
    setValues(initialValues);
    setFiles(initialFiles);
    setErrors({});
    setFileKey((k) => k + 1);
  };

  // ---------- submit ----------
  const submitdata = async () => {
    setMessage({ type: "", text: "" });

    const foundErrors = validate();
    setErrors(foundErrors);

    if (Object.keys(foundErrors).length > 0) {
      setMessage({ type: "danger", text: "Please fix the highlighted errors and try again." });
      setTimeout(() => {
        const first = document.querySelector(".is-invalid");
        if (first) {
          first.scrollIntoView({ behavior: "smooth", block: "center" });
          first.focus && first.focus();
        }
      }, 50);
      return;
    }

    const formData = new FormData();
    formData.append("name", values.studentName.trim());
    formData.append("dataOfBirth", values.dataOfBirth);
    formData.append("gender", values.gender);
    formData.append("bloodGroup", values.bloodGroup);
    formData.append("fatherName", values.fatherName.trim());
    formData.append("motherName", values.motherName.trim());
    formData.append("fatherOccupation", values.fatherOccupation.trim());
    formData.append("motherOccupation", values.motherOccupation.trim());
    formData.append("parentMobile", values.parentMobile.trim());
    formData.append("admissionNumber", values.admissionNumber.trim());
    formData.append("className", values.className);
    formData.append("sectionName", values.section);
    formData.append("academicYear", values.academicYear);
    formData.append("previousSchool", values.previousSchool.trim());
    formData.append("studentEmail", values.studentEmail.trim());
    formData.append("emergencyContact", values.emergencyContact.trim());
    formData.append("address", values.address.trim());
    formData.append("city", values.city.trim());
    formData.append("state", values.state);
    formData.append("pincode", values.pincode.trim());
    formData.append("isconfirm", values.isconfirm);

    // sirf wahi files bhejo jo select hui hain
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
  setLoading(true);

  // id hai to update API, warna submit API
  const url = isEdit
    ? `${API}/student/update/${id}`
    : `${API}/student/submit`;
  const method = isEdit ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    body: formData,
  });
  const result = await response.json().catch(() => ({}));

  if (response.ok) {
    setMessage({
      type: "success",
      text:
        result.message ||
        (isEdit ? "Student updated successfully!" : "Student registered successfully!"),
    });
    if (!isEdit) resetForm(); // edit mein form data rehne do
  } else {
    setMessage({ type: "danger", text: result.message || "Something went wrong!" });
  }
} catch (err) {
      setMessage({ type: "danger", text: "Server se connect nahi ho pa raha. Please try again." });
    } finally {
      setLoading(false);
      topRef.current && topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ---------- small helpers ----------
  const cls = (name, base = "form-control") => `${base} ${errors[name] ? "is-invalid" : ""}`;
  const Err = ({ name }) =>
    errors[name] ? <div className="invalid-feedback d-block">{errors[name]}</div> : null;

  return (
    <>
      <style>{`
        .submit-btn { min-width: 190px; padding: 10px 28px; font-weight: 600; letter-spacing: .3px;
          border-radius: 10px; border: none; color: #fff;
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          box-shadow: 0 6px 16px rgba(37, 99, 235, .35);
          transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(37, 99, 235, .45); color:#fff; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }
        .reset-btn { min-width: 120px; padding: 10px 24px; font-weight: 600; border-radius: 10px; }
        .form-message { border-radius: 10px; font-weight: 500; }
      `}</style>

      <div className="container form-container" ref={topRef}>
        <div className="card">
          <div className="card-header text-center">
            <h2 className="mb-1">Student Registration Form</h2>
            <p className="mb-0">School Admission Registration</p>
          </div>

          <div className="card-body p-4">
            {message.text && (
              <div
                className={`alert alert-${message.type} form-message d-flex justify-content-between align-items-center`}
                role="alert"
              >
                <span>
                  {message.type === "success" ? "✓ " : "⚠ "}
                  {message.text}
                </span>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setMessage({ type: "", text: "" })}
                ></button>
              </div>
            )}

            {/* 1. Student Information */}
            <div className="section-title">1. Student Information</div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Student Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  className={cls("studentName")}
                  placeholder="Enter student name"
                  value={values.studentName}
                  onChange={handleChange}
                />
                <Err name="studentName" />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Date of Birth <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dataOfBirth"
                  className={cls("dataOfBirth")}
                  max={new Date().toISOString().split("T")[0]}
                  value={values.dataOfBirth}
                  onChange={handleChange}
                />
                <Err name="dataOfBirth" />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Gender <span className="required">*</span>
                </label>
                <select
                  name="gender"
                  className={cls("gender", "form-select")}
                  value={values.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  {genderData.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Err name="gender" />
              </div>

              <div className="col-md-4">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={values.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroupData.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Student Photo</label>
                <input
                  key={`photo-${fileKey}`}
                  type="file"
                  name="StudentPhoto"
                  accept="image/*"
                  className={cls("StudentPhoto")}
                  onChange={handleFile}
                />
                <Err name="StudentPhoto" />
              </div>
            </div>

            <hr className="my-4" />

            {/* 2. Parent Information */}
            <div className="section-title">2. Parent / Guardian Information</div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Father's Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  className={cls("fatherName")}
                  placeholder="Enter father's name"
                  value={values.fatherName}
                  onChange={handleChange}
                />
                <Err name="fatherName" />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Mother's Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  className={cls("motherName")}
                  placeholder="Enter mother's name"
                  value={values.motherName}
                  onChange={handleChange}
                />
                <Err name="motherName" />
              </div>

              <div className="col-md-4">
                <label className="form-label">Father's Occupation</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  className="form-control"
                  placeholder="Enter occupation"
                  value={values.fatherOccupation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mother's Occupation</label>
                <input
                  type="text"
                  name="motherOccupation"
                  className="form-control"
                  placeholder="Enter occupation"
                  value={values.motherOccupation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Parent Mobile <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="parentMobile"
                  maxLength={10}
                  className={cls("parentMobile")}
                  placeholder="Enter 10-digit mobile number"
                  value={values.parentMobile}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    handleChange(e);
                  }}
                />
                <Err name="parentMobile" />
              </div>
            </div>

            <hr className="my-4" />

            {/* 3. Academic Information */}
            <div className="section-title">3. Academic Information</div>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Admission Number</label>
                <input
                  type="text"
                  name="admissionNumber"
                  className="form-control"
                  placeholder="Enter admission number"
                  value={values.admissionNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Class <span className="required">*</span>
                </label>
                <select
                  name="className"
                  className={cls("className", "form-select")}
                  value={values.className}
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>
                  {classData.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.className}
                    </option>
                  ))}
                </select>
                <Err name="className" />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Section <span className="required">*</span>
                </label>
                <select
                  name="section"
                  className={cls("section", "form-select")}
                  value={values.section}
                  onChange={handleChange}
                >
                  <option value="">Select Section</option>
                   {sectionData.map((section) => (
    <option key={section._id} value={section._id}>
      {section.sectionName}
    </option>
  ))}
                </select>
                <Err name="section" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Academic Year</label>
                <select
                  name="academicYear"
                  className="form-select"
                  value={values.academicYear}
                  onChange={handleChange}
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                  <option value="2028-29">2028-29</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Previous School</label>
                <input
                  type="text"
                  name="previousSchool"
                  className="form-control"
                  placeholder="Enter previous school"
                  value={values.previousSchool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr className="my-4" />

            {/* 4. Contact Information */}
            <div className="section-title">4. Contact Information</div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="studentEmail"
                  className={cls("studentEmail")}
                  placeholder="student@example.com"
                  value={values.studentEmail}
                  onChange={handleChange}
                />
                <Err name="studentEmail" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  maxLength={10}
                  className={cls("emergencyContact")}
                  placeholder="Emergency contact number"
                  value={values.emergencyContact}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    handleChange(e);
                  }}
                />
                <Err name="emergencyContact" />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  name="address"
                  className={cls("address")}
                  rows="3"
                  placeholder="Enter complete address"
                  value={values.address}
                  onChange={handleChange}
                ></textarea>
                <Err name="address" />
              </div>

              <div className="col-md-4">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="Enter city"
                  value={values.city}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">State</label>
                <select
                  name="state"
                  className="form-select"
                  value={values.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {stateData.map((item, i) => (
                    <option key={item.id || i} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Pin Code</label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  className={cls("pincode")}
                  placeholder="Enter 6-digit pin code"
                  value={values.pincode}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    handleChange(e);
                  }}
                />
                <Err name="pincode" />
              </div>
            </div>

            <hr className="my-4" />

            {/* 5. Documents */}
            <div className="section-title">5. Documents</div>
            <p className="text-muted small mb-2">PDF, JPG or PNG — max 5 MB each.</p>
            <div className="row g-3">
              {[
                ["birthCertificate", "Birth Certificate"],
                ["aadhaarCard", "Aadhaar Card"],
                ["transferCertificate", "Transfer Certificate"],
                ["previousMarksheet", "Previous Marksheet"],
              ].map(([name, label]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    key={`${name}-${fileKey}`}
                    type="file"
                    name={name}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={cls(name)}
                    onChange={handleFile}
                  />
                  <Err name={name} />
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Declaration */}
            <div className="form-check mb-4">
              <input
                className={`form-check-input ${errors.isconfirm ? "is-invalid" : ""}`}
                type="checkbox"
                id="declaration"
                name="isconfirm"
                checked={values.isconfirm}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="declaration">
                I confirm that the information provided above is correct and complete.
              </label>
              <Err name="isconfirm" />
            </div>

            {/* Buttons */}
            <div className="text-center">
              <button
                type="button"
                className="btn btn-outline-secondary reset-btn me-3"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>

              <button
                type="button"
                className="btn submit-btn"
                onClick={submitdata}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  (id)?"update Register Student":"Register Student"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudent;