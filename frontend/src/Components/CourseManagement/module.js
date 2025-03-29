/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

const module = () => {
  const [students, setStudents] = useState([]);
  const [facultyFilter, setFacultyFilter] = useState('');
  const [newModule, setNewModule] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/student')
      .then(response => {
        // Add empty modules array to each student if not present
        const studentsWithModules = response.data.map(student => ({
          ...student,
          modules: student.modules || []
        }));
        setStudents(studentsWithModules);
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

  const handleAddModule = (studentId) => {
    if (!newModule.trim()) return;
    
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student._id === studentId 
          ? { ...student, modules: [...student.modules, newModule.trim()] } 
          : student
      )
    );
    
    setNewModule('');
  };

  const handleRemoveModule = (studentId, moduleIndex) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student._id === studentId 
          ? { 
              ...student, 
              modules: student.modules.filter((_, index) => index !== moduleIndex) 
            } 
          : student
      )
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student List with Modules</h2>
      
      <div className="d-flex justify-content-between mb-4">
        <select 
          onChange={(e) => setFacultyFilter(e.target.value)} 
          value={facultyFilter} 
          className="form-select w-25"
        >
          <option value="">All Faculties</option>
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
              <th>Year</th>
              <th>Faculty</th>
              <th>Modules</th>
              <th>Add Module</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.studentName}</td>
                <td>{student.year || 'N/A'}</td>
                <td>{student.faculty}</td>
                <td>
                  {student.modules && student.modules.length > 0 ? (
                    <ul className="list-unstyled">
                      {student.modules.map((module, index) => (
                        <li key={index} className="d-flex justify-content-between align-items-center">
                          {module}
                          <button 
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => handleRemoveModule(student._id, index)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No modules assigned'
                  )}
                </td>
                <td>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Module name"
                      value={newModule}
                      onChange={(e) => setNewModule(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddModule(student._id)}
                    >
                      Add
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default module;*/