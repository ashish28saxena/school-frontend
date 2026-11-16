
import './App.css';
import TodoList from './Component/Todo/TodoList';
import QuotesList from './Component/Quotes/QuotesList';
import ParentList from './Component/Parent/ParentList';
import CounterContext from './Context/Counter/CounterContext';
import { useState } from 'react';
import CounterWatch from './Component/CounterWatch/CounterWatch';
 import UserList from './Component/User/UserList';
import Login from './Component/Auth/Login';
import Header from './Component/Comman/Header';
import { Routes, Route} from "react-router-dom";
import Home from './Component/Home';
import RoleList from './Component/Role/RoleList';
import AddRole from './Component/Role/AddRole';
import AddUser from './Component/User/AddUser';
import AddClass from './Component/Class/AddClass';
import ClassList from './Component/Class/ClassList';
import StudentList from './Component/Student/StudentList';
import AddStudent from './Component/Student/AddStudent';
import StudentDetail from './Component/Student/StudentDetail';
import Attenddence from './Component/Attendence/Attendence';
import AddendenceList from './Component/Attendence/AddendenceList';
import AddTeacher from './Component/Teacher/AddTeacher';
import Profile from './Component/Teacher/Profile';
import AssignSubject from './Component/Teacher/AssignSubject';
import AssignClassTeacher from './Component/Teacher/AssignClassTeacher';
import Salary from './Component/Teacher/Salary';
import AssignClass from './Component/Teacher/AssignClass';
import TeacherAttendance from './Component/Teacher/TeacherAttendance';
import AddSubject from './Component/Subject/AddSubject';
import SubjectList from './Component/Subject/SubjectList';
import AssignSubjectTeacher from "./Component/Subject/AssignSubjectTeacher";
import TeacherList from "./Component/Teacher/TeacherList";
import AssignSubjectList from "./Component/Teacher/AssignSubjectList";
import AssignClassList from "./Component/Teacher/AssignClassList";
import StudentAttendance from "./Component/Student/StudentAttendance";
import Section from "./Component/Section/Section";
import ClassTeacher from "./Component/Teacher/ClassTeacher";
import AssignStudent from "./Component/Student/AssignStudent"
import SubjectManagement from "./Component/Subject/SubjectManagement";
import TimetableManagement from "./Component/Timetable/TimetableManagement";
import WeeklyTimetable from "./Component/Timetable/WeeklyTimetable";
import TeacherTimetable from "./Component/Timetable/TeacherTimetable";
import StudentTimetable from "./Component/Timetable/StudentTimetable";
import ExamMaster from "./Component/Exam/ExamMaster";
import ExamSchedule from "./Component/Exam/ExamSchedule";
import MarksEntry from "./Component/Exam/MarksEntry";
import ExamResult from "./Component/Exam/ExamResult";
import ReportCard from "./Component/Exam/ReportCard";
import AdmitCard from "./Component/Exam/AdmitCard";
import FeeStructure from "./Component/Fee/FeeStructure";
import FeeCollection from "./Component/Fee/FeeCollection";
import FeeReceipt from "./Component/Fee/FeeReceipt";
import FeeDueReport from "./Component/Fee/FeeDueReport";
import FeeDiscount from "./Component/Fee/FeeDiscount";
import FeeInstallment from "./Component/Fee/FeeInstallment";
import StudentIdCard from "./Component/Student/StudentIdCard";
import Library from "./Component/Library/Library";

function App() {
  const [count,setCount]=useState(0)
  return (
    <div className="App">
      
      
      {/* <TodoList/>
      <QuotesList/> */}
      <CounterContext.Provider value={{count,setCount}}>
          {/* <ParentList/>
          <CounterWatch/>
          <UserList/> */}
          <Header/>
          
      </CounterContext.Provider>

      <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/todo" element={<TodoList />} />
                                <Route path="/user" element={<UserList />} />
                                <Route path="/parent" element={<ParentList />} />
                                <Route path="/counterwatch" element={<CounterWatch />} />
                                 <Route path="/login" element={<Login />} />
                                 <Route path="/quotesList" element={<QuotesList />} />
                                 <Route path="/Role" element={<RoleList />} />
                                 <Route path="/Add-Role" element={<AddRole />} />
                                 <Route path="/Edit-Role/:id" element={<AddRole />} />

                                 <Route path="/Add-User" element={<AddUser />} />
                                 <Route path="/Edit-User/:id" element={<AddUser />} />

                                 <Route path="/Class-List" element={<ClassList />} /> 
                                 <Route path="/Add-Class" element={<AddClass />} />
                                 <Route path="/Edit-Class/:id" element={<AddClass />} />

                                 <Route path="/Student-List" element={<StudentList />} /> 
                                 <Route path="/Add-Student" element={<AddStudent />} />
                                 <Route path="/Edit-Student/:id" element={<AddStudent />} />
                                  <Route path="/View-Student/:id" element={<StudentDetail />} />
                                  <Route path="/Attenddence-list" element={<Attenddence />} />
                                  <Route path="/Attenddence-student-list" element={<AddendenceList />} />
                                  <Route path="/Add-Teacher" element={<AddTeacher />} />
                                   <Route path="/Teacher-Profile/:id" element={<Profile />} />
                                   <Route path="/Assign-Subject" element={<AssignSubject />} />
                                   <Route path="/Assign-Subject-List" element={<AssignSubjectList />} />

                                   
                                   <Route path="/Assign-Class-Teacher" element={<AssignClassTeacher />} />
                                   <Route path="/Teacher-Salary" element={<Salary />} />
                                   <Route path="/Assign-Class" element={<AssignClass />} />
                                   <Route path="/Teacher-Attendance" element={<TeacherAttendance />} />
                                   <Route path="/Add-Subject" element={<AddSubject />} />
                                   <Route path="/Subject-List" element={<SubjectList />} />
                                   <Route path="/Add-Subject/:id" element={<AddSubject />} />
                                   <Route path="/Assign-Subject-Teacher" element={<AssignSubjectTeacher />} />
                                   <Route path="/Teacher-List" element={<TeacherList />} />
                                   <Route path="/Add-Teacher/:id" element={<AddTeacher />} />
                                   <Route path="/Edit-Assign-Subject/:id" element={<AssignSubject />} />
                                   <Route path="/Assign-Class-List" element={<AssignClassList />} />
                                   <Route path="/Edit-Assign-Class/:id" element={<AssignClassTeacher />} />
                                   <Route path="/Student-Attendance" element={<StudentAttendance />} />
                                   <Route path="/Add-Section" element={<Section />} />
                                   <Route path="/Class-Teacher" element={<ClassTeacher />} />
                                   <Route path="/Assign-Students" element={<AssignStudent />} />
                                   <Route path="/subject-management" element={<SubjectManagement />}/>
                                   <Route path="/timetable-management" element={<TimetableManagement />} />
                                   <Route path="/Weekly-timetable-management" element={<WeeklyTimetable />} />
                                   <Route path="/Teacher-timetable-management" element={<TeacherTimetable />} />
                                   <Route path="/Student-timetable-management" element={<StudentTimetable />} />
                                   <Route path="/exam-master" element={<ExamMaster />} />
                                  <Route  path="/exam-schedule" element={<ExamSchedule />} />
                                  <Route path="/marks-entry" element={<MarksEntry />} />
                                  <Route path="/exam-result" element={<ExamResult />} />
                                  <Route path="/report-card/:studentId" element={<ReportCard />} />
                                  <Route path="/admit-card" element={<AdmitCard />} />
                                   <Route path="/fee-structure" element={<FeeStructure />} />
                                   <Route path="/fee-collection" element={<FeeCollection />} />
                                   <Route path="/fee-receipt" element={<FeeReceipt />} />
                                    <Route path="/fee-due-report" element={<FeeDueReport />} />
                                    <Route path="/fee-discount" element={<FeeDiscount />} />
                                    <Route path="/fee-installment" element={<FeeInstallment />} />
                                    <Route path="/student-id-card" element={<StudentIdCard />} /> 
                                    <Route path="/library" element={<Library />} />
                                  
                                  
                                 
                            </Routes>
              
        
      
    </div> 
  );
}

export default App;
