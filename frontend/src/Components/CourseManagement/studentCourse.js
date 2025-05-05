import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { LoadingSpinner, ErrorMessage } from '../shared/Elements';

function StudentCourse() {
    const [students, setStudents] = useState([]);
    const [availableModules, setAvailableModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedModules, setSelectedModules] = useState([]);

    useEffect(() => {
        fetchStudents();
        fetchAllModules();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [students, searchQuery, yearFilter]);

    const filterStudents = () => {
        let filtered = [...students];
        
        if (searchQuery) {
            filtered = filtered.filter(student => 
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (yearFilter) {
            filtered = filtered.filter(student => student.year === yearFilter);
        }

        setFilteredStudents(filtered);
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:6001/api/student');
            setStudents(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching student data:", error);
            setError("Failed to load student data. Please try again.");
            swal("Error", "Failed to load student data", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllModules = async () => {
        try {
            const response = await axios.get('http://localhost:6001/api/docs');
            setAvailableModules(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching modules:", error);
            setError("Failed to load modules data");
        }
    };

    const handleEditModules = (student) => {
        setSelectedStudent(student);
        setSelectedModules(student.modules || []);
        setShowEditModal(true);
    };

    const handleSaveModules = async () => {
        try {
            await axios.put(`http://localhost:6001/api/students/${selectedStudent._id}/modules`, {
                modules: selectedModules
            });
            
            setShowEditModal(false);
            fetchStudents(); // Refresh the list
            swal("Success", "Modules updated successfully", "success");
        } catch (error) {
            console.error("Error updating modules:", error);
            swal("Error", "Failed to update modules", "error");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="student-course">
            <h1 className="student-course__title">Student Module Management</h1>

            <div className="student-course__filters">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="student-course__search"
                />
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="student-course__year-filter"
                >
                    <option value="">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>

            <div className="student-course__table">
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Year</th>
                            <th>Modules</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student._id}>
                                <td>{student.studentId}</td>
                                <td>{student.name}</td>
                                <td>{student.year}</td>
                                <td>
                                    {student.modules?.join(', ') || 'No modules assigned'}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleEditModules(student)}
                                        className="student-course__edit-btn"
                                    >
                                        Edit Modules
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modules Modal */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Modules for {selectedStudent?.name}</h2>
                        <div className="available-modules">
                            {availableModules.map((module) => (
                                <label key={module._id} className="module-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedModules.includes(module.moduleName)}
                                        onChange={() => {
                                            if (selectedModules.includes(module.moduleName)) {
                                                setSelectedModules(selectedModules.filter(m => m !== module.moduleName));
                                            } else {
                                                setSelectedModules([...selectedModules, module.moduleName]);
                                            }
                                        }}
                                    />
                                    {module.moduleName}
                                </label>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button onClick={handleSaveModules}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentCourse;
