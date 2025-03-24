import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TimetableForm.css';
import backgroundVideo from '../assets/background.mp4'; // Add your video in the `assets` folder

const TimetableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [year, setYear] = useState('');
    const [moduleName, setModuleName] = useState('');
    const [description, setDescription] = useState('');
    const [schedule, setSchedule] = useState([{ day: '', startTime: '', endTime: '' }]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/api/timetables/${id}`).then((response) => {
                const timetable = response.data;
                setYear(timetable.year);
                setModuleName(timetable.moduleName);
                setDescription(timetable.description);
                setSchedule(timetable.schedule);
            });
        }
    }, [id]);

    const handleScheduleChange = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const handleAddDay = () => {
        if (schedule.length < 7) {
            setSchedule([...schedule, { day: '', startTime: '', endTime: '' }]);
        }
    };

    const handleFileChange = (e) => {
        setDocuments([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('year', year);
        formData.append('moduleName', moduleName);
        formData.append('description', description);
        formData.append('schedule', JSON.stringify(schedule));
        documents.forEach((file) => formData.append('documents', file));

        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/timetables/update/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('http://localhost:5000/api/timetables/add', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="video-container">
            <video autoPlay loop muted className="background-video">
                <source src={backgroundVideo} type="video/mp4" />
            </video>
            <form className="timetable-form" onSubmit={handleSubmit}>
                <select className="form-input" value={year} onChange={(e) => setYear(e.target.value)} required>
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Module Name"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    required
                />
                <textarea
                    className="form-input"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {schedule.map((day, index) => (
                    <div key={index} className="schedule-item">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Day"
                            value={day.day}
                            onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            className="form-input"
                            value={day.startTime}
                            onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            className="form-input"
                            value={day.endTime}
                            onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" className="add-day-btn" onClick={handleAddDay}>Add Day</button>
                <input type="file" className="file-input" multiple onChange={handleFileChange} />
                <button type="submit" className="submit-btn">{id ? 'Update' : 'Submit'}</button>
            </form>
        </div>
    );
};

export default TimetableForm;
