import React from "react";
import { Route, Routes } from "react-router-dom";  // Import from 'react-router-dom'
import Home from "./Components/Home/Home";
import "./App.css";

// Academic Scheduler Components
import Coursed from "./Components/CourseManagement/coursedash";
import AddDoc from "./Components/CourseManagement/AddDoc";
import StudentCourse from "./Components/CourseManagement/studentCourse";
import FirstYear from "./Components/CourseManagement/firstYear";
import EditDoc from "./Components/CourseManagement/UpdateCourse";
import Second from "./Components/CourseManagement/secondYear";
import Third from "./Components/CourseManagement/ThirdYear";
import Fourth from "./Components/CourseManagement/fourthYear";


//lecturer managmnet 
import AddLecturerForm from  "./Components/lecturerManagement/AddLecturerForm";
import LecturerDetails from "./Components/lecturerManagement/LecturerDetails";
import UpdateLecturer from "./Components/lecturerManagement/UpdateLecturer";
function App() {
  return (
    <div>
      <Routes>
        {/* Home Route */}
        <Route path="/home" element={<Home />} />

        {/* Academic Scheduler Routes */}
        <Route path="/course" element={<Coursed />} />
        <Route path="/AddDoc" element={<AddDoc />} />
        <Route path="/StudentCourse" element={<StudentCourse />} />
        <Route path="/first" element={<FirstYear />} />
        <Route path="/second" element={<Second />} />
        <Route path="/third" element={<Third />} />
        <Route path="/fourth" element={<Fourth />} />
        <Route path="/edit/:id" element={<EditDoc />} />

        {/* Lecturer Routes*/}
        <Route path="/addLecturer" element={<AddLecturerForm />}/>
        <Route path="/lecturerDetails" element={<LecturerDetails />} />
        <Route path="/lecturers/update/:id" component={UpdateLecturer} />

      </Routes>
    </div>
  );
}

export default App;
