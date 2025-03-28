import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [facultyFilter, setFacultyFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/student')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error("Error fetching student data", error);
      });
  }, []);

  const filteredStudents = students.filter(student => {
    if (facultyFilter) {
      return student.faculty === facultyFilter;
    }
    return true;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student List</h2>
      
      <div className="d-flex justify-content-between mb-4">
        <select 
          onChange={(e) => setFacultyFilter(e.target.value)} 
          value={facultyFilter} 
          className="form-select w-25"
        >
          <option value="">Select Faculty</option>
          <option value="Computing">Computing</option>
          <option value="Business">Business</option>
          <option value="Engineering">Engineering</option>
          <option value="Humanities">Humanities</option>
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
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.studentName}</td>
                <td>{student.registrationNumber}</td>
                <td>{student.email}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
