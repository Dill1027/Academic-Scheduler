import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    schedule: [],
    assignments: [],
    exams: [],
    announcements: []
  });

  useEffect(() => {
    axios.get('http://localhost:6001/api/student/dashboard')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data', error);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container my-4">
        <h2 style={headerStyle}>Welcome to Your Dashboard</h2>

        {/* Class Schedule Section */}
        <section className="mb-4">
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={sectionHeaderStyle}>Class Schedule</h3>
            </div>
            <ul className="list-group list-group-flush">
              {dashboardData.schedule.length === 0 ? (
                <li style={listItemStyle}>No classes scheduled.</li>
              ) : (
                dashboardData.schedule.map((item, index) => (
                  <li key={index} style={listItemStyle}>
                    <strong style={itemTitleStyle}>{item.courseName}</strong>
                    <div style={timeStyle}>
                      {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
                    </div>
                    <div style={infoStyle}>
                      Instructor: {item.instructor} | Location: {item.location}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Upcoming Assignments Section */}
        <section className="mb-4">
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={sectionHeaderStyle}>Upcoming Assignments</h3>
            </div>
            <ul className="list-group list-group-flush">
              {dashboardData.assignments.length === 0 ? (
                <li style={listItemStyle}>No upcoming assignments.</li>
              ) : (
                dashboardData.assignments.map((assignment, index) => (
                  <li key={index} style={listItemStyle}>
                    <strong style={itemTitleStyle}>{assignment.title}</strong>
                    <div style={timeStyle}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <p>{assignment.description}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Upcoming Exams Section */}
        <section className="mb-4">
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={sectionHeaderStyle}>Upcoming Exams</h3>
            </div>
            <ul className="list-group list-group-flush">
              {dashboardData.exams.length === 0 ? (
                <li style={listItemStyle}>No upcoming exams.</li>
              ) : (
                dashboardData.exams.map((exam, index) => (
                  <li key={index} style={listItemStyle}>
                    <strong style={itemTitleStyle}>{exam.title}</strong>
                    <div style={timeStyle}>
                      Date: {new Date(exam.date).toLocaleDateString()}
                    </div>
                    <div style={infoStyle}>
                      Location: {exam.location}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="mb-4">
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={sectionHeaderStyle}>Announcements</h3>
            </div>
            <ul className="list-group list-group-flush">
              {dashboardData.announcements.length === 0 ? (
                <li style={listItemStyle}>No new announcements.</li>
              ) : (
                dashboardData.announcements.map((announcement, index) => (
                  <li key={index} style={listItemStyle}>
                    <strong style={itemTitleStyle}>{announcement.title}</strong>
                    <div style={timeStyle}>
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                    <p>{announcement.description}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  padding: '20px 0',
};

const headerStyle = {
  color: '#1976d2',
  textAlign: 'center',
  marginBottom: '2rem',
  fontSize: '2.5rem',
  fontWeight: '600',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
};

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
  color: 'white',
  padding: '1rem 1.5rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
};

const sectionHeaderStyle = {
  margin: '0',
  fontSize: '1.5rem',
  fontWeight: '500',
};

const listItemStyle = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
};

const itemTitleStyle = {
  color: '#1976d2',
  fontSize: '1.1rem',
  display: 'block',
  marginBottom: '0.5rem',
};

const timeStyle = {
  color: '#666',
  fontSize: '0.9rem',
  marginBottom: '0.25rem',
};

const infoStyle = {
  color: '#666',
  fontSize: '0.9rem',
};

export default Dashboard;
