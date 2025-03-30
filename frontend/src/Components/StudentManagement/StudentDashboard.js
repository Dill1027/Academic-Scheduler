import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap is imported

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    schedule: [],
    assignments: [],
    exams: [],
    announcements: []
  });

  // Fetch the data for the student's dashboard
  useEffect(() => {
    axios.get('http://localhost:5000/api/student/dashboard')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data', error);
      });
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Welcome to Your Dashboard</h2>

      {/* Class Schedule Section */}
      <section className="mb-4">
        <div className="card">
          <div className="card-header">
            <h3>Class Schedule</h3>
          </div>
          <ul className="list-group list-group-flush">
            {dashboardData.schedule.length === 0 ? (
              <li className="list-group-item">No classes scheduled.</li>
            ) : (
              dashboardData.schedule.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>{item.courseName}</strong> ({new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()})
                  <br />
                  <small>Instructor: {item.instructor} | Location: {item.location}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Upcoming Assignments Section */}
      <section className="mb-4">
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Assignments</h3>
          </div>
          <ul className="list-group list-group-flush">
            {dashboardData.assignments.length === 0 ? (
              <li className="list-group-item">No upcoming assignments.</li>
            ) : (
              dashboardData.assignments.map((assignment, index) => (
                <li key={index} className="list-group-item">
                  <strong>{assignment.title}</strong>
                  <br />
                  <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                  <p>{assignment.description}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Upcoming Exams Section */}
      <section className="mb-4">
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Exams</h3>
          </div>
          <ul className="list-group list-group-flush">
            {dashboardData.exams.length === 0 ? (
              <li className="list-group-item">No upcoming exams.</li>
            ) : (
              dashboardData.exams.map((exam, index) => (
                <li key={index} className="list-group-item">
                  <strong>{exam.title}</strong>
                  <br />
                  <small>Date: {new Date(exam.date).toLocaleDateString()} | Location: {exam.location}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="mb-4">
        <div className="card">
          <div className="card-header">
            <h3>Announcements</h3>
          </div>
          <ul className="list-group list-group-flush">
            {dashboardData.announcements.length === 0 ? (
              <li className="list-group-item">No new announcements.</li>
            ) : (
              dashboardData.announcements.map((announcement, index) => (
                <li key={index} className="list-group-item">
                  <strong>{announcement.title}</strong>
                  <br />
                  <small>{new Date(announcement.date).toLocaleDateString()}</small>
                  <p>{announcement.description}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
