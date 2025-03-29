import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentCourse = () => {
  const [students, setStudents] = useState([]);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/student');
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students by specialization
  const filteredStudents = students.filter(student => {
    if (specializationFilter) {
      return student.specialization === specializationFilter;
    }
    return true;
  });

  // Handle add module button click
  const handleAddModuleClick = (student) => {
    setSelectedStudent(student);
    fetchAvailableModules(student.year, student.specialization);
    setShowModal(true);
  };

  // Fetch modules based on student's year and specialization
  const fetchAvailableModules = async (year, specialization) => {
    try {
      const response = await axios.get('http://localhost:5000/api/students/available-modules', {
        params: { year, specialization }
      });
      setAvailableModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Handle module submission
  const handleAddModule = async () => {
    if (!selectedModule || !selectedStudent) return;

    try {
      await axios.post(`http://localhost:5000/api/students/${selectedStudent._id}/add-module`, {
        moduleId: selectedModule
      });
      
      // Update local state
      setStudents(students.map(student => {
        if (student._id === selectedStudent._id) {
          return {
            ...student,
            modules: [...(student.modules || []), { moduleName: selectedModule }]
          };
        }
        return student;
      }));
      
      setShowModal(false);
      setSelectedModule('');
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student List</h2>
      
      <div className="d-flex justify-content-between mb-4">
        <select 
          onChange={(e) => setSpecializationFilter(e.target.value)} 
          value={specializationFilter} 
          className="form-select w-25"
        >
          <option value="">All Specializations</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Interactive Media">Interactive Media</option>
          <option value="Data Science">Data Science</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
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
                  <td>{student.year}</td>
                  <td>{student.specialization}</td>
                  <td>
                    {student.modules && student.modules.length > 0 ? (
                      <ul className="list-unstyled">
                        {student.modules.map((module, idx) => (
                          <li key={idx}>{module.moduleName}</li>
                        ))}
                      </ul>
                    ) : 'No modules assigned'}
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddModuleClick(student)}
                    >
                      Add Module
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Module Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Module to {selectedStudent?.studentName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <>
              <div className="mb-3">
                <p><strong>Year:</strong> {selectedStudent.year}</p>
                <p><strong>Specialization:</strong> {selectedStudent.specialization}</p>
              </div>
              
              <Form.Group controlId="moduleSelect">
                <Form.Label>Select Module</Form.Label>
                <Form.Select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  <option value="">Select a module</option>
                  {availableModules.map((module) => (
                    <option key={module._id} value={module._id}>
                      {module.moduleName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddModule}>
            Add Module
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentCourse;