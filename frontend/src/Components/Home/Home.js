import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaBook, FaChalkboardTeacher, FaUserGraduate, FaFileAlt } from "react-icons/fa";
import BackIm from "./img/bk.jpg";
import Footer from "../Navbar/footer";
import Header from "../Navbar/Header";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <Header />

      <div className="main-content">
        <div className="welcome-section">
          <img src={BackIm} alt="Background" className="hero-image" />
          <div className="welcome-overlay">
            <h1 className="welcome-title">Academic Management System</h1>
            <p className="welcome-subtitle">Streamline your academic workflows and enhance the learning experience</p>
            <div className="welcome-buttons">
              <Link to="/timetablelist" className="primary-button">View Timetables</Link>
              <Link to="/course" className="secondary-button">Explore Courses</Link>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-heading">Quick Access</h2>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon">
                <FaCalendarAlt size={40} />
              </div>
              <div className="card-content">
                <h3>Timetable</h3>
                <p>Manage your timetables with ease</p>
                <Link to="/timetablelist" className="card-link">Go to Timetable</Link>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">
                <FaBook size={40} />
              </div>
              <div className="card-content">
                <h3>Courses</h3>
                <p>Explore available courses</p>
                <Link to="/course" className="card-link">View Courses</Link>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">
                <FaChalkboardTeacher size={40} />
              </div>
              <div className="card-content">
                <h3>Faculty</h3>
                <p>View faculty members</p>
                <Link to="/faculty" className="card-link">View Faculty</Link>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">
                <FaUserGraduate size={40} />
              </div>
              <div className="card-content">
                <h3>Students</h3>
                <p>Manage student details</p>
                <Link to="/student" className="card-link">Manage Students</Link>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">
                <FaFileAlt size={40} />
              </div>
              <div className="card-content">
                <h3>Documents</h3>
                <p>Upload and view important documents</p>
                <Link to="/documents" className="card-link">View Documents</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="activity-section">
          <h2 className="section-heading">Recent Activity</h2>
          <div className="activity-container">
            <div className="activity-item">
              <div className="activity-icon">
                <FaCalendarAlt size={20} />
              </div>
              <div className="activity-content">
                <h4>New Timetable Added</h4>
                <p>New timetables have been added for the upcoming semester.</p>
                <span className="activity-date">March 25, 2025</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <FaBook size={20} />
              </div>
              <div className="activity-content">
                <h4>New Course Available</h4>
                <p>Introduction to Machine Learning course is now available.</p>
                <span className="activity-date">March 24, 2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2 className="section-heading">System Statistics</h2>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">150</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200</div>
              <div className="stat-label">Faculty Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1500</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">300</div>
              <div className="stat-label">Documents</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
