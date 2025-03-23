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
        <div>
            <h1>Timetable List</h1>
            {timetables.map((timetable) => (
                <div key={timetable._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                    <h3>{timetable.moduleName}</h3>
                    <p><strong>Year:</strong> {timetable.year}</p>
                    <p><strong>Description:</strong> {timetable.description}</p>
                    <div>
                        <strong>Schedule:</strong>
                        {timetable.schedule.map((day, index) => (
                            <div key={index}>
                                <p>{day.day}: {day.startTime} - {day.endTime}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <strong>Documents:</strong>
                        {timetable.documents && timetable.documents.map((doc, index) => (
                            <div key={index}>
                                <a
                                    href={`http://localhost:5000/uploads/${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Document {index + 1}
                                </a>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => handleDelete(timetable._id)}
                        style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TimetableList;