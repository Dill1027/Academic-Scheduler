import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container, Typography, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

// Lecturer Management Components
import AddLecturerForm from "./Components/lecturerManagement/AddLecturerForm";
import LecturerDetails from "./Components/lecturerManagement/LecturerDetails";
import UpdateLecturer from "./Components/lecturerManagement/UpdateLecturer";
import LecturerDashboard from "./Components/lecturerManagement/LecturerDashboard";


import './App.css';

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
import LecturerDetailsView from "./Components/lecturerManagement/LecturerDetailsView";


// Timetable Generation Components
import FilterPanel from './Components/Timetablegenaration/FilterPanel';
import TimetableCard from './Components/Timetablegenaration/TimetableCard';
import { generateTimetables, getAllTimetables, getFilteredTimetables } from './services/api';

const theme = createTheme();

function TimetableGenerator() {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    specialization: ''
  });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await getAllTimetables();
      setTimetables(response.data);
      setFilteredTimetables(response.data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const handleGenerateTimetables = async () => {
    try {
      await generateTimetables();
      fetchTimetables();
    } catch (error) {
      console.error('Error generating timetables:', error);
    }
  };

  const applyFilters = async () => {
    try {
      const response = await getFilteredTimetables(
        filters.year || null,
        filters.specialization || null
      );
      setFilteredTimetables(response.data);
    } catch (error) {
      console.error('Error filtering timetables:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      year: '',
      specialization: ''
    });
    setFilteredTimetables(timetables);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          University Timetable Generator
        </Typography>
        
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          generateTimetables={handleGenerateTimetables}
        />
        
        <Typography variant="h5" gutterBottom>
          {filteredTimetables.length} Timetables Found
        </Typography>
        
        {filteredTimetables.map((timetable, index) => (
          <TimetableCard key={index} timetable={timetable} />
        ))}
      </Box>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login/>}/>
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
        <Route path="/edit/:id" element={<EditDoc />} />

        {/* Timetable Generator Route */}
        <Route path="/timetable" element={<TimetableGenerator />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;