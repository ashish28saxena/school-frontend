import React, { useEffect, useState } from "react";

const AddendenceList = () => {
    const [classNamedata, setclassNameData] = useState([])

    const [studentData, setStudentData] = useState([])
    const [classAttendence, setClassAttendence] = useState('')
    const [teacherAttendence, setTeacherAttendence] = useState('')
    const [attenddencedate, setAttenddencedate] = useState('')
    const [attendanceMark, setAttendanceMark] = useState([]);
    const [presentStudent, setPresentStudent] = useState(0)
    const [absentStudent, setAbsentStudent] = useState(0)
    function getclassNamedata() {
        fetch("https://school-management-backend-ochre.vercel.app/api/class/")
            .then((responce) => responce.json())
            .then((result) => setclassNameData(result))
    }



    async function searchData() {
        await fetch(
            `https://school-management-backend-ochre.vercel.app/api/attendence/get/${classAttendence}/${attenddencedate}`
        )
            .then((response) => response.json())
            .then((result) => {
                if (result?.data?.length > 0) {
                    const attendance = result.data[0];
                    setStudentData(
                        attendance.studentAttendence.map((item) => ({
                            studentId: item.studentId._id,
                            studentName: item.studentId.name,
                            studentMark: item.student_mark,

                            classId: attendance.classId._id,
                            className: attendance.classId.className,
                            classSection: attendance.classId.classSection,

                            teacherId: attendance.teacherId._id,
                            teacherName: attendance.teacherId.name,

                            attendanceDate: attendance.attendenceDate,
                        })) || []
                    );
                } else {
                    setStudentData([]);
                    setPresentStudent(0);
                    setAbsentStudent(0);
                }
            })

        const presentCount = studentData.filter(
            (item) => item.studentMark === "Present"
        ).length;

        // Absent count
        const absentCount = studentData.filter(
            (item) => item.studentMark === "Absent"
        ).length;

        setPresentStudent(presentCount);
        setAbsentStudent(absentCount);


    }

    



    useEffect(() => {
        getclassNamedata();
        const presentCount = studentData.filter(
        item => item.studentMark === "Present"
    ).length;

    const absentCount = studentData.filter(
        item => item.studentMark === "Absent"
    ).length;

    setPresentStudent(presentCount);
    setAbsentStudent(absentCount);





    }, [studentData])
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


                </div>


                <div className="card attendance-card mb-4">
                    <div className="card-body">

                        <div className="row g-3">


                            <div className="col-md-4">
                                <label className="form-label">className</label>
                                <select className="form-select" id="className" onChange={(e) => setClassAttendence(e.target.value)}>
                                    <option value="">Select className</option>
                                    {
                                        classNamedata.map((item, index) => {
                                            return (
                                                <option value={item._id} key={index}>className {item.className}</option>
                                            )
                                        })
                                    }


                                </select>
                            </div>





                            <div className="col-md-4">
                                <label className="form-label">Attendance Date</label>
                                <input type="date" className="form-control" id="attendanceDate" onChange={(e) => setAttenddencedate(e.target.value)} />
                            </div>

                            <div className="col-md-4">
                                <button onClick={searchData}>Click Me</button>
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
                                        <th>Attendance Date</th>
                                        <th>Class</th>
                                        <th>Student Name</th>
                                        <th>Attendance</th>
                                    </tr>
                                </thead>

                                <tbody id="studentTable">
                                    {
                                        studentData.map((item, index) => {



                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>101</td>
                                                    <td>{new Date(item.attendanceDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                                                    <td>{item.className}</td>
                                                    <td className="student-name">
                                                        {item.studentName}
                                                    </td>
                                                    <td>

                                                        <button
    className={`btn btn-sm status-btn me-2 ${
        item?.studentMark === "Present"
            ? "btn-success"
            : "btn-danger"
    }`}
>
    {item?.studentMark}
</button>



                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }






                                </tbody>

                            </table>

                        </div>





                    </div>

                </div>

            </div>



        </div>
    )
}
export default AddendenceList