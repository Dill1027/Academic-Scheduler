import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimetableList = () => {
    const [timetables, setTimetables] = useState([]);

    // Fetch all timetables on component mount
    useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/timetables/all');
            setTimetables(response.data);
        } catch (error) {
            console.error('Error fetching timetables:', error);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/timetables/delete/${id}`);
            if (response.data.message === 'Timetable deleted successfully') {
                // Remove the deleted timetable from the UI
                setTimetables(timetables.filter((timetable) => timetable._id !== id));
                alert('Timetable deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting timetable:', error);
            alert('Failed to delete timetable');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Timetable List</h1>
            {timetables.map((timetable) => (
                <div key={timetable._id} className="card mb-3">
                    <div className="card-body">
                        <h3 className="card-title">{timetable.moduleName}</h3>
                        <p className="card-text"><strong>Year:</strong> {timetable.year}</p>
                        <p className="card-text"><strong>Description:</strong> {timetable.description}</p>
                        <div className="mb-3">
                            <strong>Schedule:</strong>
                            {timetable.schedule.map((day, index) => (
                                <div key={index} className="ml-3">
                                    <p className="mb-1">{day.day}: {day.startTime} - {day.endTime}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <strong>Documents:</strong>
                            {timetable.documents && timetable.documents.map((doc, index) => (
                                <div key={index} className="ml-3">
                                    <a
                                        href={`http://localhost:5000/uploads/${doc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-link"
                                    >
                                        Document {index + 1}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleDelete(timetable._id)}
                            className="btn btn-danger"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimetableList;