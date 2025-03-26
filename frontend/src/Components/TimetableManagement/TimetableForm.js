import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TimetableForm.css';
import backgroundVideo from '../../assets/video/background.mp4';
import { FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Header from '../Navbar/Header';
import Footer from '../Navbar/footer';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define time options for dropdowns
const timeOptions = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00"
];

const TimetableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [year, setYear] = useState('');
    const [moduleName, setModuleName] = useState('');
    const [description, setDescription] = useState('');
    const [schedule, setSchedule] = useState([{ day: '', startTime: '', endTime: '' }]);
    const [documents, setDocuments] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    // Fetch timetable data if editing
    useEffect(() => {
        if (id) {
            setIsLoading(true);
            axios.get(`http://localhost:5000/api/timetables/${id}`)
                .then((response) => {
                    const timetable = response.data;
                    setYear(timetable.year || '');
                    setModuleName(timetable.moduleName || '');
                    setDescription(timetable.description || '');
                    
                    // Ensure we have valid schedule data
                    if (timetable.schedule && timetable.schedule.length > 0) {
                        setSchedule(timetable.schedule);
                    } else {
                        setSchedule([{ day: '', startTime: '', endTime: '' }]);
                    }
                    
                    // Set existing documents if any
                    if (timetable.documents && timetable.documents.length > 0) {
                        setExistingDocuments(timetable.documents);
                    }
                    
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching timetable:', error);
                    setSubmitError('Failed to load timetable data. Please try again.');
                    setIsLoading(false);
                });
        }
    }, [id]);

    // Handle schedule field changes
    const handleScheduleChange = (index, field, value) => {
        setSchedule((prevSchedule) => {
            const updatedSchedule = [...prevSchedule];
            updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
            
            // Clear any errors for this field when user makes changes
            if (errors[`${field}-${index}`]) {
                setErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors[`${field}-${index}`];
                    return newErrors;
                });
            }
            
            return updatedSchedule;
        });
    };

    // Add another day/time slot
    const handleAddDay = useCallback(() => {
        setSchedule((prevSchedule) => (
            prevSchedule.length < 7 ? [...prevSchedule, { day: '', startTime: '', endTime: '' }] : prevSchedule
        ));
    }, []);
    
    // Remove a day/time slot
    const handleRemoveDay = useCallback((index) => {
        if (schedule.length > 1) {
            setSchedule(prevSchedule => prevSchedule.filter((_, i) => i !== index));
            
            // Clear any errors for this index
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[`day-${index}`];
                delete newErrors[`startTime-${index}`];
                delete newErrors[`endTime-${index}`];
                delete newErrors[`time-${index}`];
                return newErrors;
            });
        }
    }, [schedule.length]);

    // Handle file upload
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file types
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            setErrors(prev => ({
                ...prev,
                documents: "Only PDF and Word documents are allowed"
            }));
            return;
        }
        
        // Validate file size (10MB max per file)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            setErrors(prev => ({
                ...prev,
                documents: "Files must be smaller than 10MB"
            }));
            return;
        }
        
        // Validate total number of files
        if (files.length + existingDocuments.length > 3) {
            setErrors(prev => ({
                ...prev,
                documents: "Maximum 3 files allowed in total"
            }));
            return;
        }
        
        // Clear document errors and set files
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.documents;
            return newErrors;
        });
        
        setDocuments(files);
    };
    
    // Remove existing document
    const handleRemoveExistingDocument = (documentName) => {
        if (!id) return;
        
        if (window.confirm(`Are you sure you want to remove ${documentName}?`)) {
            axios.post(`http://localhost:5000/api/timetables/remove-document/${id}`, { documentName })
                .then(response => {
                    setExistingDocuments(prev => prev.filter(doc => doc !== documentName));
                    setSubmitSuccess('Document removed successfully');
                    
                    // Clear success message after 3 seconds
                    setTimeout(() => setSubmitSuccess(''), 3000);
                })
                .catch(error => {
                    console.error('Error removing document:', error);
                    setSubmitError('Failed to remove document. Please try again.');
                });
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        
        // Validate year
        if (!year) {
            newErrors.year = "Year is required";
        }
        
        // Validate module name
        if (!moduleName) {
            newErrors.moduleName = "Module name is required";
        } else if (moduleName.length < 3) {
            newErrors.moduleName = "Module name must be at least 3 characters";
        }
        
        // Validate schedule
        schedule.forEach((item, index) => {
            if (!item.day) {
                newErrors[`day-${index}`] = "Day is required";
            }
            
            if (!item.startTime) {
                newErrors[`startTime-${index}`] = "Start time is required";
            }
            
            if (!item.endTime) {
                newErrors[`endTime-${index}`] = "End time is required";
            }
            
            // Check if end time is after start time
            if (item.startTime && item.endTime) {
                if (item.startTime >= item.endTime) {
                    newErrors[`time-${index}`] = "End time must be after start time";
                }
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset submission messages
        setSubmitError('');
        setSubmitSuccess('');
        
        // Validate form
        if (!validateForm()) {
            window.scrollTo(0, 0); // Scroll to top to show errors
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Create a new FormData instance for file uploads
            const formData = new FormData();
            
            // Add text fields
            formData.append('year', year);
            formData.append('moduleName', moduleName);
            formData.append('description', description || '');
            
            // Convert schedule array to JSON string
            formData.append('schedule', JSON.stringify(schedule));
            
            // Add existing document filenames to keep them
            if (id && existingDocuments.length > 0) {
                formData.append('existingDocuments', JSON.stringify(existingDocuments));
            }
            
            // Add new document files
            if (documents.length > 0) {
                for (let i = 0; i < documents.length; i++) {
                    formData.append('documents', documents[i]);
                }
            }
            
            console.log('Submitting form data:', {
                year,
                moduleName,
                description,
                schedule,
                existingDocs: existingDocuments,
                newDocs: documents.map(d => d.name)
            });
            
            let response;
            
            if (id) {
                // Update existing timetable
                response = await axios.put(
                    `http://localhost:5000/api/timetables/update/${id}`, 
                    formData, 
                    {
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
            } else {
                // Create new timetable
                response = await axios.post(
                    'http://localhost:5000/api/timetables/add', 
                    formData, 
                    {
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
            }
            
            console.log('Server response:', response.data);
            
            // Show success message
            setSubmitSuccess(id ? 'Timetable updated successfully!' : 'Timetable created successfully!');
            
            // Redirect after success message is shown
            setTimeout(() => {
                navigate('/timetablelist');
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Extract and display detailed error message
            let errorMessage = 'Error submitting the form. Please try again.';
            
            if (error.response) {
                // The server responded with an error status
                console.error('Server error response:', error.response.data);
                errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from server');
                errorMessage = 'No response from server. Please check your connection.';
            }
            
            setSubmitError(errorMessage);
            window.scrollTo(0, 0); // Scroll to top to show error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid p-0">
                <div className="video-container">
                    <video autoPlay loop muted className="background-video">
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                    
                    <div className="form-wrapper">
                        {/* Success and Error messages */}
                        {submitSuccess && (
                            <div className="alert alert-success">
                                {submitSuccess}
                            </div>
                        )}
                        
                        {submitError && (
                            <div className="alert alert-danger">
                                <FaExclamationTriangle className="me-2" /> {submitError}
                            </div>
                        )}
                        
                        <form className="timetable-form card shadow" onSubmit={handleSubmit}>
                            <div className="card-header bg-primary text-white">
                                <h2 className="mb-0">{id ? 'Edit Timetable' : 'Create New Timetable'}</h2>
                            </div>
                            
                            <div className="card-body">
                                {/* Year Selection */}
                                <div className="form-group mb-4">
                                    <label htmlFor="year" className="form-label">Year:</label>
                                    <select 
                                        id="year"
                                        className={`form-select ${errors.year ? 'is-invalid' : ''}`}
                                        value={year} 
                                        onChange={(e) => {
                                            setYear(e.target.value);
                                            if (errors.year) {
                                                setErrors({...errors, year: null});
                                            }
                                        }} 
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                    {errors.year && <div className="invalid-feedback">{errors.year}</div>}
                                </div>
                                
                                {/* Module Name */}
                                <div className="form-group mb-4">
                                    <label htmlFor="moduleName" className="form-label">Module Name:</label>
                                    <input
                                        id="moduleName"
                                        type="text"
                                        className={`form-control ${errors.moduleName ? 'is-invalid' : ''}`}
                                        placeholder="Enter module name"
                                        value={moduleName}
                                        onChange={(e) => {
                                            setModuleName(e.target.value);
                                            if (errors.moduleName) {
                                                setErrors({...errors, moduleName: null});
                                            }
                                        }}
                                        required
                                    />
                                    {errors.moduleName && <div className="invalid-feedback">{errors.moduleName}</div>}
                                </div>
                                
                                {/* Description */}
                                <div className="form-group mb-4">
                                    <label htmlFor="description" className="form-label">Description:</label>
                                    <textarea
                                        id="description"
                                        className="form-control"
                                        placeholder="Enter description (optional)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                    />
                                </div>
                                
                                {/* Schedule */}
                                <div className="form-group mb-4">
                                    <label className="form-label">Schedule:</label>
                                    <div className="schedule-container">
                                        {schedule.map((item, index) => (
                                            <div key={index} className="schedule-item card mb-3 p-3">
                                                <div className="row">
                                                    {/* Day Selection */}
                                                    <div className="col-md-3 mb-3 mb-md-0">
                                                        <label className="form-label">Day:</label>
                                                        <select
                                                            className={`form-select ${errors[`day-${index}`] ? 'is-invalid' : ''}`}
                                                            value={item.day}
                                                            onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Day</option>
                                                            <option value="Monday">Monday</option>
                                                            <option value="Tuesday">Tuesday</option>
                                                            <option value="Wednesday">Wednesday</option>
                                                            <option value="Thursday">Thursday</option>
                                                            <option value="Friday">Friday</option>
                                                            <option value="Saturday">Saturday</option>
                                                            <option value="Sunday">Sunday</option>
                                                        </select>
                                                        {errors[`day-${index}`] && <div className="invalid-feedback">{errors[`day-${index}`]}</div>}
                                                    </div>
                                                    
                                                    {/* Start Time */}
                                                    <div className="col-md-3 mb-3 mb-md-0">
                                                        <label className="form-label">Start Time:</label>
                                                        <select
                                                            className={`form-select ${errors[`startTime-${index}`] ? 'is-invalid' : ''}`}
                                                            value={item.startTime}
                                                            onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Time</option>
                                                            {timeOptions.map(time => (
                                                                <option key={time} value={time}>{time}</option>
                                                            ))}
                                                        </select>
                                                        {errors[`startTime-${index}`] && <div className="invalid-feedback">{errors[`startTime-${index}`]}</div>}
                                                    </div>
                                                    
                                                    {/* End Time */}
                                                    <div className="col-md-3 mb-3 mb-md-0">
                                                        <label className="form-label">End Time:</label>
                                                        <select
                                                            className={`form-select ${errors[`endTime-${index}`] ? 'is-invalid' : ''}`}
                                                            value={item.endTime}
                                                            onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Time</option>
                                                            {timeOptions.map(time => (
                                                                <option key={time} value={time}>{time}</option>
                                                            ))}
                                                        </select>
                                                        {errors[`endTime-${index}`] && <div className="invalid-feedback">{errors[`endTime-${index}`]}</div>}
                                                    </div>
                                                    
                                                    {/* Remove Button */}
                                                    <div className="col-md-3 d-flex align-items-end justify-content-end">
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-danger"
                                                            onClick={() => handleRemoveDay(index)}
                                                            disabled={schedule.length <= 1}
                                                        >
                                                            <FaTrash className="me-2" /> Remove
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Time validation error */}
                                                    {errors[`time-${index}`] && (
                                                        <div className="col-12 mt-2">
                                                            <div className="alert alert-danger py-1">{errors[`time-${index}`]}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Add Day Button */}
                                        <button 
                                            type="button" 
                                            className="btn btn-success mt-2" 
                                            onClick={handleAddDay}
                                            disabled={schedule.length >= 7}
                                        >
                                            <FaPlus className="me-2" /> Add Another Day
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Document Upload */}
                                <div className="form-group mb-4">
                                    <label className="form-label">Upload Documents:</label>
                                    <input 
                                        type="file" 
                                        className={`form-control ${errors.documents ? 'is-invalid' : ''}`}
                                        multiple 
                                        onChange={handleFileChange} 
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <small className="form-text text-muted">
                                        Accepted formats: PDF, DOC, DOCX. Maximum 3 files, 10MB each.
                                    </small>
                                    {errors.documents && <div className="invalid-feedback d-block mt-2">{errors.documents}</div>}
                                    
                                    {/* Show selected files */}
                                    {documents.length > 0 && (
                                        <div className="selected-files mt-3">
                                            <h5>Selected files:</h5>
                                            <ul className="list-group">
                                                {documents.map((file, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {file.name} ({Math.round(file.size / 1024)} KB)
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => {
                                                                setDocuments(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {/* Show existing documents */}
                                    {existingDocuments.length > 0 && (
                                        <div className="existing-files mt-3">
                                            <h5>Existing documents:</h5>
                                            <ul className="list-group">
                                                {existingDocuments.map((doc, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {doc}
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleRemoveExistingDocument(doc)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Form Actions */}
                            <div className="card-footer d-flex justify-content-between">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/timetablelist')}
                                >
                                    Cancel
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Saving...
                                        </>
                                    ) : id ? 'Update Timetable' : 'Create Timetable'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TimetableForm;
