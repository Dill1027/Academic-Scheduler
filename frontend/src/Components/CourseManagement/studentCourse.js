import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../Navbar";
import Footer from "../Navbar/footer";
import swal from 'sweetalert';
import { BsFillPencilFill, BsPlusCircleFill, BsXCircleFill } from 'react-icons/bs';

const StudentCourse = () => {
  const [students, setStudents] = useState([]);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newModules, setNewModules] = useState(['', '', '', '', '']);
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchAllModules();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/student/student');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student data", error);
      swal("Error", "Failed to load student data.", "error");
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
      swal("Error", "Failed to load modules data.", "error");
    }
  };

  const getFilteredModules = (specialization, year) => {
    if (!specialization || !year) return [];
    const yearString = `${year}${getOrdinalSuffix(year)} Year`;
    return availableModules
      .filter(module => module.course === specialization && module.year === yearString)
      .map(module => module.moduleName);
  };

  const handleAddModuleClick = (student) => {
    setSelectedStudent(student);
    // Initialize with existing modules plus empty slots up to 5
    const initialModules = student.modules 
      ? [...student.modules, ...Array(5 - student.modules.length).fill('')].slice(0, 5)
      : ['', '', '', '', ''];
    
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
      // Filter out empty modules
      const modulesToSave = newModules
        .map(module => module.trim())
        .filter(module => module !== '');
      
      await axios.put(
        `http://localhost:5000/api/student/${selectedStudent._id}/modules`,
        { modules: modulesToSave }
      );
      
      swal("Success", "Modules saved successfully!", "success").then(() => {
        fetchStudents();
        setShowAddModuleModal(false);
      });
      
    } catch (error) {
      console.error("Error saving modules", error);
      swal("Error", error.response?.data?.error || "Failed to save modules. Please try again.", "error");
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
    return <div className="student-course__loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="student-course__container">
        <h2 className="student-course__title">Module Allocation For Students</h2>
        
        <div className="student-course__filters">
          <div className="student-course__filter-group">
            <select 
              onChange={(e) => setSpecializationFilter(e.target.value)} 
              value={specializationFilter} 
              className="student-course__filter-select"
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
              className="student-course__filter-select"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>

        <div className="student-course__table-container">
          <table className="student-course__table">
            <thead className="student-course__table-header">
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
                  <tr key={student._id} className="student-course__table-row">
                    <td className="student-course__student-name">{student.studentName}</td>
                    <td className="student-course__student-year">
                      {student.year ? `${student.year}${getOrdinalSuffix(student.year)} Year` : 'N/A'}
                    </td>
                    <td className="student-course__student-specialization">{student.specialization}</td>
                    <td className="student-course__student-modules">
                      {student.modules?.length > 0 ? (
                        <ul className="student-course__module-list">
                          {student.modules.map((module, idx) => (
                            <li key={idx} className="student-course__module-item">{module}</li>
                          ))}
                        </ul>
                      ) : <span className="student-course__no-modules">No modules assigned</span>}
                    </td>
                    <td className="student-course__actions">
                      <button 
                        className="student-course__edit-btn"
                        onClick={() => handleAddModuleClick(student)}
                      >
                        {student.modules?.length > 0 ? <><BsFillPencilFill /> Edit Modules</> : <><BsPlusCircleFill /> Add Modules</>}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="student-course__no-data-row">
                  <td colSpan="5" className="student-course__no-data">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Module Modal */}
        {showAddModuleModal && selectedStudent && (
          <div className="student-course__modal-overlay">
            <div className="student-course__modal">
              <div className="student-course__modal-content">
                <div className="student-course__modal-header">
                  <h5 className="student-course__modal-title">
                    {selectedStudent.modules?.length > 0 ? 'Edit' : 'Add'} Modules for {selectedStudent.studentName} 
                    ({selectedStudent.specialization}, {selectedStudent.year}{getOrdinalSuffix(selectedStudent.year)} Year)
                  </h5>
                  <button 
                    type="button" 
                    className="student-course__modal-close" 
                    onClick={() => setShowAddModuleModal(false)}
                  >
                    <BsXCircleFill size={24} />
                  </button>
                </div>
                <div className="student-course__modal-body">
                  <div className="student-course__available-modules">
                    <h6 className="student-course__available-modules-title">Available Modules:</h6>
                    {getFilteredModules(selectedStudent.specialization, selectedStudent.year).length > 0 ? (
                      <div className="student-course__module-buttons">
                        {getFilteredModules(selectedStudent.specialization, selectedStudent.year).map((module, idx) => (
                          <button
                            key={idx}
                            className="student-course__module-btn"
                            onClick={() => {
                              const emptyIndex = newModules.findIndex(m => m === '');
                              const indexToUpdate = emptyIndex !== -1 ? emptyIndex : newModules.length - 1;
                              handleModuleChange(indexToUpdate, module);
                            }}
                            disabled={newModules.includes(module)}
                          >
                            {module}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="student-course__no-available-modules">No modules available for this specialization/year combination</p>
                    )}
                  </div>

                  <div className="student-course__selected-modules">
                    <h6 className="student-course__selected-modules-title">Selected Modules (max 5):</h6>
                    {newModules.map((module, index) => (
                      <div className="student-course__module-select-container" key={index}>
                        <label className="student-course__module-label">Module {index + 1}</label>
                        <select
                          className="student-course__module-select"
                          value={module}
                          onChange={(e) => handleModuleChange(index, e.target.value)}
                        >
                          <option value="">Select a module</option>
                          {getFilteredModules(selectedStudent.specialization, selectedStudent.year).map((mod, idx) => (
                            <option 
                              key={idx} 
                              value={mod}
                              disabled={newModules.includes(mod) && mod !== module}
                            >
                              {mod}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="student-course__modal-footer">
                  <button 
                    type="button" 
                    className="student-course__modal-cancel" 
                    onClick={() => setShowAddModuleModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="student-course__modal-save" 
                    onClick={saveModules}
                    disabled={newModules.every(module => module.trim() === '')}
                  >
                    Save Modules
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .student-course__container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .student-course__title {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 2rem;
            font-size: 2rem;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          .student-course__filters {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          .student-course__filter-group {
            display: flex;
            gap: 1rem;
            width: 100%;
          }
          .student-course__filter-select {
            flex: 1;
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
            font-size: 1rem;
            color: #333;
            transition: border-color 0.3s;
          }
          .student-course__filter-select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
          }
          .student-course__table-container {
            overflow-x: auto;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .student-course__table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
          }
          .student-course__table-header {
            background-color: #2c3e50;
            color: white;
          }
          .student-course__table-header th {
            padding: 1rem;
            text-align: left;
            font-weight: 500;
          }
          .student-course__table-row {
            border-bottom: 1px solid #eee;
            transition: background-color 0.2s;
          }
          .student-course__table-row:hover {
            background-color: #f8f9fa;
          }
          .student-course__table-row td {
            padding: 1rem;
            vertical-align: top;
          }
          .student-course__student-name {
            font-weight: 500;
            color: #2c3e50;
          }
          .student-course__module-list {
            margin: 0;
            list-style: none;
            padding-left: 1.2rem;
          }
          .student-course__module-item {
            margin-bottom: 0.3rem;
          }
          .student-course__no-modules {
            color: #7f8c8d;
            font-style: italic;
          }
          .student-course__actions button {
            display: flex;
            align-items: center;
            gap: 0.3rem;
          }
          .student-course__edit-btn {
            padding: 0.5rem 1rem;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.2s, transform 0.2s;
          }
          .student-course__edit-btn:hover {
            background-color: #2980b9;
            transform: scale(1.03);
          }
          .student-course__no-data-row {
            background-color: white;
          }
          .student-course__no-data {
            text-align: center;
            padding: 2rem;
            color: #7f8c8d;
          }
          .student-course__loading {
            text-align: center;
            padding: 2rem;
            color: #3498db;
            font-size: 1.2rem;
          }
          /* Modal Styles */
          .student-course__modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .student-course__modal {
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-in-out;
          }
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .student-course__modal-content {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .student-course__modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .student-course__modal-title {
            margin: 0;
            color: #2c3e50;
            font-size: 1.3rem;
          }
          .student-course__modal-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #7f8c8d;
            transition: color 0.2s;
          }
          .student-course__modal-close:hover {
            color: #e74c3c;
          }
          .student-course__modal-body {
            padding: 1.5rem;
            flex-grow: 1;
            overflow-y: auto;
          }
          .student-course__available-modules {
            margin-bottom: 2rem;
          }
          .student-course__available-modules-title {
            margin-top: 0;
            margin-bottom: 1rem;
            color: #2c3e50;
            font-size: 1.1rem;
          }
          .student-course__module-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .student-course__module-btn {
            padding: 0.5rem 1rem;
            background-color: transparent;
            border: 1px solid #3498db;
            color: #3498db;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
          }
          .student-course__module-btn:hover:not(:disabled) {
            background-color: #3498db;
            color: white;
          }
          .student-course__module-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: #3498db;
            color: white;
          }
          .student-course__no-available-modules {
            color: #7f8c8d;
            font-style: italic;
          }
          .student-course__selected-modules-title {
            margin-top: 0;
            margin-bottom: 1rem;
            color: #2c3e50;
            font-size: 1.1rem;
          }
          .student-course__module-select-container {
            margin-bottom: 1rem;
          }
          .student-course__module-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #34495e;
            font-size: 0.9rem;
          }
          .student-course__module-select {
            width: 100%;
            padding: 0.7rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
            font-size: 1rem;
            color: #333;
            transition: border-color 0.3s;
          }
          .student-course__module-select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
          }
          .student-course__modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
          }
          .student-course__modal-cancel {
            padding: 0.7rem 1.5rem;
            background-color: #f8f9fa;
            color: #2c3e50;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          .student-course__modal-cancel:hover {
            background-color: #e9ecef;
          }
          .student-course__modal-save {
            padding: 0.7rem 1.5rem;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          .student-course__modal-save:hover:not(:disabled) {
            background-color: #2980b9;
          }
          .student-course__modal-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          @media (max-width: 768px) {
            .student-course__filter-group {
              flex-direction: column;
              gap: 0.5rem;
            }
            .student-course__table-header th {
              padding: 0.8rem 0.5rem;
              font-size: 0.9rem;
            }
            .student-course__table-row td {
              padding: 0.8rem 0.5rem;
              font-size: 0.9rem;
            }
            .student-course__edit-btn {
              padding: 0.4rem 0.8rem;
              font-size: 0.8rem;
            }
            .student-course__modal {
              width: 95%;
            }
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
};

export default StudentCourse;
