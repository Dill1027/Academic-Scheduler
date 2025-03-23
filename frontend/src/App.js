import React from "react";
import { Route, Routes } from "react-router";
import Home from "./Components/Home/Home";
import './App.css'


//Acdemic sheduler-----------------------------
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


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />

          {/*Academic sheduler */}

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

          
          

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
