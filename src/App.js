
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
                                  
                                  
                                 
                            </Routes>
              
        
      
    </div> 
  );
}

export default App;
