import React, { useEffect, useState } from "react";

const Attenddence = () => {
    const [classNamedata, setclassNameData] = useState([])
    const [teacherData,setteacherData]=useState([])
     const [studentData,setStudentData]=useState([])
     const [classAttendence,setClassAttendence]=useState('')
     const [teacherAttendence,setTeacherAttendence]=useState('')
     const [attenddencedate,setAttenddencedate]=useState('')
     const [attendanceMark,setAttendanceMark]=useState([]);
     const [presentStudent,setPresentStudent]=useState(0)
      const [absentStudent,setAbsentStudent]=useState(0)
    function getclassNamedata() {
        fetch("http://localhost:5000/api/class/")
            .then((responce) => responce.json())
            .then((result) => setclassNameData(result))
    }

    function getTeacherData() {
        fetch("http://localhost:5000/api/user/userList")
            .then((res) => res.json())
            .then((result) => {
                setteacherData(result);
                
            })
            .catch((err) => console.log(err));
    }


    async function getStudentData(val) {
        setClassAttendence(val);
        await fetch("http://localhost:5000/api/student/search?q="+val)
        .then((responce)=>responce.json())
        .then((result)=>setStudentData(result))
    }
function setAttendance(item, mark) {

    setAttendanceMark(prev => {

        const studentList = prev.studentAttendence || [];

        const existingStudent = studentList.find(
            attendance => attendance.studentId === item._id
        );

        let updatedStudentAttendence;

        // Student already exists → update
        if (existingStudent) {

            updatedStudentAttendence = studentList.map(
                attendance =>
                    attendance.studentId === item._id
                        ? {
                            ...attendance,
                            student_mark: mark
                        }
                        : attendance
            );

        } else {

            // Student doesn't exist → add
            updatedStudentAttendence = [
                ...studentList,
                {
                    studentId: item._id,
                    student_mark: mark
                }
            ];
        }

        return {
            ...prev,
            classId: classAttendence,
            teacherId: teacherAttendence,
            attendenceDate: attenddencedate,
            studentAttendence: updatedStudentAttendence
        };

    });
}

   async function submitAttendence() {
    // Check all required fields
    if (
        classAttendence === "" ||
        teacherAttendence === "" ||
        attenddencedate === ""
    ) {
        console.log("Please select all fields");
        return;
    }

    // Check all students are marked
    if (
        studentData.length !==
        (attendanceMark.studentAttendence?.length || 0)
    ) {
        console.log("Please select all student");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/attendence/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(attendanceMark),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.log(result.message || "Attendance submission failed");
            return;
        }

        console.log("Attendance submitted successfully", result);

    } catch (error) {
        console.error("Error:", error);
    }
}

    async function markAllPresent() {
           setAttendanceMark(prev => ({
        ...prev,
        classId: classAttendence,
        teacherId: teacherAttendence,
        attendenceDate: attenddencedate,

        studentAttendence: studentData.map(item => ({
            studentId: item._id,
            student_mark: "Present"
        }))
    }));
    }


    useEffect(() => {
        getclassNamedata();
        getTeacherData();
       
        const studentList = attendanceMark.studentAttendence || [];

    const present = studentList.filter(
        student => student.student_mark === "Present"
    ).length;

    const absent = studentList.filter(
        student => student.student_mark === "Absent"
    ).length;

    setPresentStudent(present);
    setAbsentStudent(absent);
    }, [attendanceMark.studentAttendence])
    return (
        <div>
            

            


      

    <div className="container page-container">

        
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 className="page-title mb-1">Student Attendance</h3>
                <p className="text-muted mb-0">
                    Mark today's attendance for students
                </p>
            </div>

            <button className="btn btn-success" onClick={markAllPresent}>
                Mark All Present
            </button>
        </div>

        
        <div className="card attendance-card mb-4">
            <div className="card-body">

                <div className="row g-3">

                   
                    <div className="col-md-4">
                        <label className="form-label">className</label>
                        <select className="form-select" id="className" onChange={(e) => {
    getStudentData(e.target.value);
    
  }}>
                            <option value="">Select className</option>
                            {
                                classNamedata.map((item,index)=>{
                                        return(
                                            <option value={item._id} key={index}>className {item.className}</option>
                                        )
                                })
                            }
                            
                            
                        </select>
                    </div>

                    
                    <div className="col-md-4">
                        <label className="form-label">Teacher</label>
                        <select className="form-select" id="section" onChange={(e)=>setTeacherAttendence(e.target.value)}>
                            <option value="">Select Teacher</option>
                            {
                                teacherData.map((item,index)=>{
                                      return(
                                        <option value={item._id} key={index}>{item.name}</option>
                                      )
                                })
                            }
                            
                            
                        </select>
                    </div>

                    
                    <div className="col-md-4">
                        <label className="form-label">Attendance Date</label>
                        <input type="date" className="form-control" id="attendanceDate" onChange={(e)=>setAttenddencedate(e.target.value)}/>
                    </div>

                </div>

            </div>
        </div>


        
        <div className="card attendance-card">

            <div className="card-body">

                
                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">
                        Student List
                    </h5>

                    <div >
                        <input type="text"
                               className="form-control"
                               id="searchStudent"
                               placeholder="Search student..."
                               />
                    </div>

                </div>


                
                <div className="attendance-summary mb-4">

                    <div className="row">

                        <div className="col-4 summary-box">
                            <div className="summary-number" id="totalStudents">
                                {studentData.length}
                            </div>
                            <div className="summary-label">
                                Total Students
                            </div>
                        </div>

                        <div className="col-4 summary-box">
                            <div className="summary-number text-success"
                                 id="presentCount">
                                {presentStudent}
                            </div>
                            <div className="summary-label">
                                Present
                            </div>
                        </div>

                        <div className="col-4 summary-box">
                            <div className="summary-number text-danger"
                                 id="absentCount">
                                {absentStudent}
                            </div>
                            <div className="summary-label">
                                Absent
                            </div>
                        </div>

                    </div>

                </div>


                
                <div className="table-responsive">

                    <table className="table table-hover align-middle">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>

                        <tbody id="studentTable">
                            {
                                studentData.map((item,index)=>{
                                    const attendance = attendanceMark.studentAttendence?.find(
            attendance => attendance.studentId === item._id
        );
       
       
                                    return(
                                        <tr key={index}>
                                <td>{index+1}</td>
                                <td>101</td>
                                <td className="student-name">
                                    {item.name}
                                </td>
                                <td>

                                    <button
                        className={`btn btn-sm status-btn me-2 ${
                            attendance?.student_mark === "Present"
                                ? "btn-success"
                                : "btn-outline-success"
                        }`}
                        onClick={() => setAttendance(item, "Present")}
                    >
                        Present
                    </button>

                                    <button
                        className={`btn btn-sm status-btn ${
                            attendance?.student_mark === "Absent"
                                ? "btn-danger"
                                : "btn-outline-danger"
                        }`}
                        onClick={() => setAttendance(item, "Absent")}
                    >
                        Absent
                    </button>

                                </td>
                            </tr>
                                    )
                                })
                            }

                            


                            

                        </tbody>

                    </table>

                </div>


                
                <div className="text-end mt-4">

                    <button className="btn btn-primary px-4"
                            onClick={submitAttendence}>
                        Submit Attendance
                    </button>

                </div>

            </div>

        </div>

    </div>



        </div>
    )
}
export default Attenddence