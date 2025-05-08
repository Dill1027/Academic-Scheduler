import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { FaSearch } from 'react-icons/fa'; // Add this import

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#002147" }}>
      <div className="container-fluid">
        {/* Toggle Button for Mobile View */}
        <button 
          className="navbar-toggler text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/studentManagement">Student</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/lecturerDashbord">Lecturer</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/course">Course</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/timetable">Time Table</Link>
            </li>
          </ul>

          {/* Search Bar & Login Button */}
          <div className="d-flex align-items-center">
            <div className="search-container">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  className="search-input" 
                  type="search" 
                  placeholder="Search..." 
                  aria-label="Search"
                />
              </div>
            </div>
            <Link to="/login" className="btn login-btn ms-3">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
