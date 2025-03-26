import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TimetableList.css';
import Header from '../Navbar/Header';
import Footer from '../Navbar/footer';
import { FaEdit, FaTrash, FaFileDownload, FaPlus, FaSearch } from 'react-icons/fa';

const TimetableList = () => {
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const API_URL = 'http://localhost:5000';

    // Fetch all timetables on component mount
    useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/timetables/all`);
            setTimetables(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching timetables:', error);
            setError('Failed to load timetables. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        // Confirm before deleting
        if (!window.confirm('Are you sure you want to delete this timetable?')) {
            return;
        }
        
        try {
            const response = await axios.delete(`${API_URL}/api/timetables/delete/${id}`);
            if (response.data.message === 'Timetable deleted successfully') {
                // Remove the deleted timetable from the UI
                setTimetables(timetables.filter((timetable) => timetable._id !== id));
                setSuccess('Timetable deleted successfully');
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting timetable:', error);
            setError('Failed to delete timetable. Please try again.');
            
            // Clear error message after 3 seconds
            setTimeout(() => setError(''), 3000);
        }
    };
    
    // Filter timetables based on search term
    const filteredTimetables = timetables.filter(timetable => {
        const searchLower = searchTerm.toLowerCase();
        return (
            timetable.moduleName.toLowerCase().includes(searchLower) ||
            timetable.year.toLowerCase().includes(searchLower) ||
            timetable.description?.toLowerCase().includes(searchLower)
        );
    });
    
    // Format time for better display
    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        // Simple format conversion from 24h to 12h time
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <>
            <Header />
            <div className="timetable-container">
                <div className="timetable-header">
                    <h2>Timetable Management</h2>
                    <div className="action-bar">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search timetables..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link to="/timetableform" className="add-button">
                            <FaPlus /> Create New Timetable
                        </Link>
                    </div>
                </div>
                
                {/* Success and Error Messages */}
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                
                {/* Loading State */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading timetables...</p>
                    </div>
                ) : filteredTimetables.length === 0 ? (
                    <div className="empty-state">
                        <p>
                            {searchTerm 
                                ? `No timetables found matching "${searchTerm}"`
                                : "No timetables available. Create your first timetable to get started."}
                        </p>
                        <Link to="/timetableform" className="btn btn-primary">
                            <FaPlus /> Create Timetable
                        </Link>
                    </div>
                ) : (
                    <div className="timetable-grid">
                        {filteredTimetables.map((timetable) => (
                            <div key={timetable._id} className="timetable-card">
                                <div className="card-header">
                                    <h3>{timetable.moduleName}</h3>
                                    <span className={`year-badge ${timetable.year?.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {timetable.year}
                                    </span>
                                </div>
                                
                                {timetable.description && (
                                    <p className="description">{timetable.description}</p>
                                )}
                                
                                <div className="schedule-section">
                                    <h4>Schedule</h4>
                                    <ul className="schedule-list">
                                        {timetable.schedule?.map((item, index) => (
                                            <li key={index}>
                                                <span className="day">{item.day}</span>
                                                <span className="time">
                                                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {timetable.documents && timetable.documents.length > 0 && (
                                    <div className="documents-section">
                                        <h4>Documents</h4>
                                        <ul className="document-list">
                                            {timetable.documents.map((doc, index) => (
                                                <li key={index}>
                                                    <a 
                                                        href={`${API_URL}/uploads/${doc}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="document-link"
                                                    >
                                                        <FaFileDownload /> Document {index + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="card-footer">
                                    <span className="created-date">
                                        Created: {new Date(timetable.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="card-actions">
                                        <Link to={`/timetableform/${timetable._id}`} className="btn btn-edit">
                                            <FaEdit /> Edit
                                        </Link>
                                        <button onClick={() => handleDelete(timetable._id)} className="btn btn-delete">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default TimetableList;