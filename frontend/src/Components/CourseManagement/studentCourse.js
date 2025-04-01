import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentCourse = () => {
  const [students, setStudents] = useState([]);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newModules, setNewModules] = useState(['', '', '', '', '']);
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredModules, setFilteredModules] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchAllModules();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/student');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllModules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/docs');
      setAvailableModules(response.data);
    } catch (error) {
      console.error("Error fetching modules data", error);
    }
  };

  const getFilteredModules = (specialization, year) => {
    if (!specialization || !year) return [];
    
    // Convert year format (e.g., "1" to "1st Year")
    const yearString = `${year}${getOrdinalSuffix(year)} Year`;
    
    return availableModules.filter(module => 
      module.course === specialization && module.year === yearString
    ).map(module => module.moduleName);
  };

  const handleAddModuleClick = (student) => {
    setSelectedStudent(student);
    
    // Get modules relevant to this student's specialization and year
    const relevantModules = getFilteredModules(student.specialization, student.year);
    setFilteredModules(relevantModules);
    
    // Initialize with existing modules plus empty slots up to 5
    const existingModules = student.modules || [];
    const initialModules = [...existingModules, ...Array(5 - existingModules.length).fill('')].slice(0, 5);
    
    setNewModules(initialModules);
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
    if (!selectedStudent || !selectedStudent._id) return;
    
    try {
      const modulesToSave = newModules
        .map(module => module.trim())
        .filter(module => module !== '');
      
      await axios.put(`http://localhost:5000/api/student/${selectedStudent._id}/modules`, { 
        modules: modulesToSave 
      });
      
      fetchStudents();
      setShowAddModuleModal(false);
    } catch (error) {
      console.error("Error saving modules", error);
    }
  };

  const getOrdinalSuffix = (num) => {
    if (!num) return '';
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const filteredStudents = students.filter(student => {
    const matchesSpecialization = !specializationFilter || 
      student.specialization === specializationFilter;
    
    const matchesYear = !yearFilter || 
      (student.year ? student.year.toString() === yearFilter : false);
    
    return matchesSpecialization && matchesYear;
  });

  if (isLoading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student List</h2>
      
      <div className="d-flex justify-content-between mb-4">
        <div className="d-flex gap-3">
          <select 
            onChange={(e) => setSpecializationFilter(e.target.value)} 
            value={specializationFilter} 
            className="form-select"
          >
            <option value="">All Specializations</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Interactive Media">Interactive Media</option>
            <option value="Data Science">Data Science</option>
          </select>

          <select 
            onChange={(e) => setYearFilter(e.target.value)} 
            value={yearFilter} 
            className="form-select"
          >
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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentName}</td>
                  <td>{student.year ? `${student.year}${getOrdinalSuffix(student.year)} Year` : 'N/A'}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Module Modal */}
      {showAddModuleModal && selectedStudent && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Add Modules for {selectedStudent.studentName} 
                  ({selectedStudent.specialization}, {selectedStudent.year}{getOrdinalSuffix(selectedStudent.year)} Year)
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModuleModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h6>Available Modules:</h6>
                  {filteredModules.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {filteredModules.map((module, idx) => (
                        <button
                          key={idx}
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            // Find first empty slot or replace the last one
                            const emptyIndex = newModules.findIndex(m => m === '');
                            const indexToUpdate = emptyIndex !== -1 ? emptyIndex : newModules.length - 1;
                            handleModuleChange(indexToUpdate, module);
                          }}
                        >
                          {module}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No modules available for this specialization/year combination</p>
                  )}
                </div>

                <div className="mb-3">
                  <h6>Selected Modules (max 5):</h6>
                  {newModules.map((module, index) => (
                    <div className="mb-3" key={index}>
                      <label className="form-label">Module {index + 1}</label>
                      <select
                        className="form-select"
                        value={module}
                        onChange={(e) => handleModuleChange(index, e.target.value)}
                      >
                        <option value="">Select a module</option>
                        {filteredModules.map((mod, idx) => (
                          <option key={idx} value={mod}>{mod}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModuleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={saveModules}
                  disabled={!newModules.some(module => module.trim() !== '')}
                >
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