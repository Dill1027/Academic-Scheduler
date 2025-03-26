import React from "react";
import { Route, Routes } from "react-router-dom"; // Updated to react-router-dom
import Home from "./Components/Home/Home";
import './App.css'

//Academic scheduler-----------------------------
// import Header from "./Components/Navbar/Header";
// import Footer from "./Components/Navbar/footer";
import Coursed from "./Components/CourseManagement/coursedash";
import AddDoc from "./Components/CourseManagement/AddDoc";
import StudentCourse from  "./Components/CourseManagement/studentCourse";
import FirstYear from "./Components/CourseManagement/firstYear";
import EditDoc from "./Components/CourseManagement/UpdateCourse";
import Second from "./Components/CourseManagement/secondYear";
import Third from "./Components/CourseManagement/ThirdYear";
import Fourth from "./Components/CourseManagement/fourthYear";

// Timetable Management
import TimetableForm from "./Components/TimetableManagement/TimetableForm";
import TimetableList from "./Components/TimetableManagement/TimetableList";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />

          {/*Academic scheduler */}
          {/* <Route path="/header" element={<Header />} /> */}
          {/* <Route path="/footer" element={<Footer />} /> */}
          <Route path="/course" element={<Coursed />} />
          <Route path="/AddDoc" element={<AddDoc />} />
          <Route path="/StudentCourse" element={<StudentCourse />} />
          <Route path="/first" element={<FirstYear />} />
          <Route path="/second" element={<Second />} />
          <Route path="/Third" element={<Third />} />
          <Route path="/Fourth" element={<Fourth />} />
          <Route path="/edit/:id" element={<EditDoc />} />
          
          {/*Timetable Management */}
          <Route path="/timetable" element={<TimetableForm />} />
          <Route path="/timetableform" element={<TimetableForm />} />
          <Route path="/timetableform/:id" element={<TimetableForm />} />
          <Route path="/timetablelist" element={<TimetableList />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
