import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Components/Home";

import Profile from "./Components/StudentManagement/Profile";
import StudentRegisterForm from "./Components/StudentManagement/StudentRegisterForm";
import CurrentStudent from "./Components/Authentication/CurrentStudent";
import Register from "./Components/Authentication/Register";
import Login from "./Components/Authentication/Login";
import Dashboard from "./Components/Authentication/Dashboard";
import UserBaseLogin from "./Components/Authentication/UserBaseLogin";
import AdminReview from "./Components/Admin/AdminReview";
import StudentDashboard from "./Components/StudentManagement/StudentDashboard";
import LecturerRegisterForm from "./Components/Authentication/LectureRegisterForm";
import StudentList from "./Components/StudentManagement/StudentList";

//lecturer managmnet 
import AddLecturerForm from  "./Components/lecturerManagement/AddLecturerForm";
import LecturerDetails from "./Components/lecturerManagement/LecturerDetails";
import UpdateLecturer from "./Components/lecturerManagement/UpdateLecturer";



import './App.css';

// Academic Scheduler Components
import Coursed from "./Components/CourseManagement/coursedash";
import AddDoc from "./Components/CourseManagement/AddDoc";
import StudentCourse from "./Components/CourseManagement/studentCourse";
import FirstYear from "./Components/CourseManagement/firstYear";
import EditDoc from "./Components/CourseManagement/UpdateCourse";
import Second from "./Components/CourseManagement/secondYear";
import Third from "./Components/CourseManagement/ThirdYear";
import Fourth from "./Components/CourseManagement/fourthYear";
import AdminDashboard from "./Components/Admin/AdminDashboard";




function App() {
  return (
    <>
      {/* Navbar should be outside of Routes */}

      <Routes>
        <Route path="/login"element={<Login/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} /> 
        <Route path="/form" element={<StudentRegisterForm />} />
        <Route path="/currentform" element={<CurrentStudent />} />
        <Route path="/lecturerform" element={<LecturerRegisterForm/>} />
        <Route path="/studentList" element={<StudentList/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/userbase" element={<UserBaseLogin/>} />
        <Route path="/adminReview" element={<AdminReview/>} />
        <Route path="/dashboardd" element={<StudentDashboard/>} />
        <Route path="/adminDashboard" element={<AdminDashboard/>} />


       {/* Lecturer Routes*/}
        <Route path="/addLecturer" element={<AddLecturerForm />}/>
        <Route path="/lecturerDetails" element={<LecturerDetails />} />
        <Route path="/lecturers/update/:id" component={UpdateLecturer} />


         {/* Academic Scheduler Routes */}
        <Route path="/course" element={<Coursed />} />
        <Route path="/AddDoc" element={<AddDoc />} />
        <Route path="/StudentCourse" element={<StudentCourse />} />
        <Route path="/first" element={<FirstYear />} />
        <Route path="/second" element={<Second />} />
        <Route path="/Third" element={<Third />} />
        <Route path="/Fourth" element={<Fourth />} />
        <Route path="/edit/:id" element={<EditDoc />} />
      </Routes>

       {/* Footer should also be outside of Routes */}
    </>
    
  );
}

export default App;
