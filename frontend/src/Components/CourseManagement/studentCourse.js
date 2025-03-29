import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentCourse = () => {
  const [students, setStudents] = useState([]);
  const [specializationFilter, setSpecializationFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/student')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error("Error fetching student data", error);
      });
  }, []);

  const filteredStudents = students.filter(student => {
    if (specializationFilter) {
      return student.specialization === specializationFilter;
    }
    return true;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student List</h2>
      
      <div className="d-flex justify-content-between mb-4">
        <select 
          onChange={(e) => setSpecializationFilter(e.target.value)} 
          value={specializationFilter} 
          className="form-select w-25"
        >
          <option value="">Select Specialization</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Interactive Media">Interactive Media</option>
          <option value="Data Science">Data Science</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Student Name</th>
              <th>Registration Number</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.studentName}</td>
                <td>{student.registrationNumber}</td>
                <td>{student.email}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentCourse;
