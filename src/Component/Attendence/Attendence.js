import React, { useEffect, useState } from "react";

const Attenddence = () => {
    const [classNamedata, setclassNameData] = useState([])
    const [teacherData,setteacherData]=useState([])
     const [studentData,setStudentData]=useState([])
     const [classAttendence,setClassAttendence]=useState('')
     const [teacherAttendence,setTeacherAttendence]=useState('')
     const [attenddencedate,setAttenddencedate]=useState('')
     const [attendanceMark,setAttendanceMark]=useState([]);
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
                console.log(result);
            })
            .catch((err) => console.log(err));
    }


    function getStudentData() {
        fetch("http://localhost:5000/api/student/")
        .then((responce)=>responce.json())
        .then((result)=>setStudentData(result))
    }
    function setAttendance(item, mark) {

        setAttendanceMark(prev => {

            const existingStudent = prev.find(
                attendance => attendance.studentid === item._id
            );

            // Student already exists → update
            if (existingStudent) {

                return prev.map(attendance =>
                    attendance.studentid === item._id
                        ? {
                            ...attendance,
                            student_mark: mark
                        }
                        : attendance
                );
            }

            // Student doesn't exist → add
            return [
                ...prev,
                {
                    stclass: classAttendence,
                    teacher: teacherAttendence,
                    attendencedate: attenddencedate,
                    studentid: item._id,
                    student_mark: mark
                }
            ];
        });

        console.log("@@@@@",attendanceMark)
    }

//     function setAttendance(item,mark)
//     {
//         console.log(item);
//         console.log(mark)
       
//         setAttendanceMark([
//     ...attendanceMark,
//     {
//         stclass: classAttendence,
//         teacher: teacherAttendence,
//         attendencedate: attenddencedate,
//         studentid: item._id,
//         student_mark: mark
//     }
// ]);

//         console.log("@@@@@",attendanceMark)
          
//     }
    useEffect(() => {
        getclassNamedata();
        getTeacherData();
        getStudentData();
    }, [])
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

            <button className="btn btn-success" >
                Mark All Present
            </button>
        </div>

        
        <div className="card attendance-card mb-4">
            <div className="card-body">

                <div className="row g-3">

                   
                    <div className="col-md-4">
                        <label className="form-label">className</label>
                        <select className="form-select" id="className" onChange={(e)=>setClassAttendence(e.target.value)}>
                            <option value="">Select className</option>
                            {
                                classNamedata.map((item)=>{
                                        return(
                                            <option value={item._id}>className {item.className}</option>
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
                                teacherData.map((item)=>{
                                      return(
                                        <option value={item._id}>{item.name}</option>
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
                                0
                            </div>
                            <div className="summary-label">
                                Present
                            </div>
                        </div>

                        <div className="col-4 summary-box">
                            <div className="summary-number text-danger"
                                 id="absentCount">
                                0
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
                                    return(
                                        <tr key={index}>
                                <td>{index+1}</td>
                                <td>101</td>
                                <td className="student-name">
                                    {item.name}
                                </td>
                                <td>

                                    <button
                                        className="btn btn-success btn-sm status-btn me-2"
                                        onClick={()=>setAttendance(item,'present')}>
                                        Present
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm status-btn"
                                        onClick={()=>setAttendance(item,'absent')}
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
                            >
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