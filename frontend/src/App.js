import React from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { CssBaseline, Typography, Box, Button, Paper } from "@mui/material";
import { ArrowBack, CloudDownload } from "@mui/icons-material";

// Authentication Components
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
import StudentLogin from "./Components/Authentication/StudentLogin";
import ProfileUpdate from "./Components/StudentManagement/ProfileUpdate";

// Lecturer Management Components 
import AddLecturerForm from "./Components/lecturerManagement/AddLecturerForm";
import LecturerDetails from "./Components/lecturerManagement/LecturerDetails";
import UpdateLecturer from "./Components/lecturerManagement/UpdateLecturer";
import LecturerDashboard from "./Components/lecturerManagement/LecturerDashboard";
import LecturerDetailsView from "./Components/lecturerManagement/LecturerDetailsView";

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
import StudentManagement from "./Components/Admin/StudentManagement";
import Coursereport from "./Components/CourseManagement/report";

// Timetable Components
import YearSelection from './Components/timetable/YearSelection';
import TimetableOptions from './Components/timetable/TimetableOptions';
import Specialization from './Components/timetable/Specialization';
import StudentReview from './Components/StudentManagement/StudentReview';

// About Contact Components
import TeamContact from "./Components/AboutContact/TeamContact";
import Blog from './Components/Blog/Blog';  // Update import path

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/form" element={<StudentRegisterForm />} />
        <Route path="/currentform" element={<CurrentStudent />} />
        <Route path="/lecturerform" element={<LecturerRegisterForm />} />
        <Route path="/studentList" element={<StudentList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userbase" element={<UserBaseLogin />} />
        <Route path="/adminReview" element={<AdminReview />} />
        <Route path="/dashboardd" element={<StudentDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/studentManagement" element={<StudentManagement />} />
        <Route path="/profileUpdate/:id" element={<ProfileUpdate />} />

        {/* Student Management Routes */}
        <Route path="/students" element={<StudentList />} />
        <Route path="/reviews" element={<StudentReview />} />

        {/* Lecturer Routes */}
        <Route path="/addLecturer" element={<AddLecturerForm />} />
        <Route path="/lecturerDetails" element={<LecturerDetails />} />
        <Route path="/lecturers/update/:id" element={<UpdateLecturer />} />
        <Route path="/lecturerDashbord" element={<LecturerDashboard />} />
        <Route path="/lectureview" element={<LecturerDetailsView />} />

        {/* Academic Scheduler Routes */}
        <Route path="/course" element={<Coursed />} />
        <Route path="/AddDoc" element={<AddDoc />} />
        <Route path="/StudentCourse" element={<StudentCourse />} />
        <Route path="/first" element={<FirstYear />} />
        <Route path="/second" element={<Second />} />
        <Route path="/Third" element={<Third />} />
        <Route path="/Fourth" element={<Fourth />} />
        <Route path="/coursereport" element={<Coursereport />} />
        <Route path="/edit/:id" element={<EditDoc />} />

        {/* Timetable Routes */}
        <Route path="/timetable" element={<YearSelection />} />
        <Route path="/timetable/view/:year/:specialization" element={<TimetableOptions />} />

        {/* Specialization Route */}
        <Route path="/specializations/:id" element={<Specialization />} />

        {/* About Contact Route */}
        <Route path="/team-contact" element={<TeamContact />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
