import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Home/SideBar";
import Header from "../Navbar/Header";
import Footer from "../Navbar/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import './coursed.css';
import { Link } from 'react-router-dom';

function StudentCourse() {


  return (
    <div>
      <div className="main_function ">
        <div>
          <Header />

          <div style={{ marginTop: "20px" , padding:'125px' }}>

          </div>
          
        </div>

      </div>
    </div>
  );
}

export default StudentCourse;
