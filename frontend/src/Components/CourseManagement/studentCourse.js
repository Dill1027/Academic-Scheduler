import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentCourse = () => {
  const [students, setStudents] = useState([]);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newModules, setNewModules] = useState(['', '', '', '', '']);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/student');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student data", error);
    }
  };

  const filteredStudents = students.filter(student => {
    let matchesSpecialization = !specializationFilter || student.specialization === specializationFilter;
    let matchesYear = !yearFilter || (student.year ? student.year.toString() === yearFilter : false);
    return matchesSpecialization && matchesYear;
  });

  const handleAddModuleClick = (student) => {
    setSelectedStudent(student);
    const existingModules = student.modules || [];
    setNewModules([...existingModules, ...Array(5 - existingModules.length).fill('')].slice(0, 5));
    setShowAddModuleModal(true);
  };

  const handleModuleChange = (index, value) => {
    setNewModules(prevModules => {
      const updatedModules = [...prevModules];
      updatedModules[index] = value;
      return updatedModules;
    });
  };

  const saveModules = async () => {
    try {
      const modulesToSave = newModules.filter(module => module.trim() !== '');
      await axios.put(`http://localhost:5000/api/student/${selectedStudent._id}/modules`, { modules: modulesToSave });
      fetchStudents();
      setShowAddModuleModal(false);
    } catch (error) {
      console.error("Error saving modules", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student List</h2>
      <div className="d-flex justify-content-between mb-4">
        <div className="d-flex gap-3">
          <select onChange={(e) => setSpecializationFilter(e.target.value)} value={specializationFilter} className="form-select">
            <option value="">All Specializations</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Interactive Media">Interactive Media</option>
            <option value="Data Science">Data Science</option>
          </select>

          <select onChange={(e) => setYearFilter(e.target.value)} value={yearFilter} className="form-select">
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Student Name</th>
              <th>Year</th>
              <th>Specialization</th>
              <th>Modules</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.studentName}</td>
                <td>{student.year || 'N/A'}</td>
                <td>{student.specialization}</td>
                <td>
                  {student.modules?.length > 0 ? (
                    <ul>
                      {student.modules.map((module, idx) => (
                        <li key={idx}>{module}</li>
                      ))}
                    </ul>
                  ) : 'No modules assigned'}
                </td>
                <td>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddModuleClick(student)}
                    disabled={student.modules?.length >= 5}
                  >
                    {student.modules?.length > 0 ? 'Edit Modules' : 'Add Modules'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModuleModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Modules for {selectedStudent?.studentName}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModuleModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>You can add up to 5 modules:</p>
                {newModules.map((module, index) => (
                  <div className="mb-3" key={index}>
                    <label className="form-label">Module {index + 1}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={module}
                      onChange={(e) => handleModuleChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModuleModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveModules}>
                  Save Modules
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourse;
