import React from 'react';

const ClassSchedule = ({ schedule }) => {
  return (
    <div className="card">
      <div className="card-header">
        Class Schedule
      </div>
      <ul className="list-group list-group-flush">
        {schedule.map((item, index) => (
          <li key={index} className="list-group-item">
            <strong>Course:</strong> {item.courseName} 
            <br />
            <strong>Instructor:</strong> {item.instructor}
            <br />
            <strong>Time:</strong> {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
            <br />
            <strong>Location:</strong> {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassSchedule;
