import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateLecturer = () => {
    const { id } = useParams(); // This gets the id parameter from the URL
    const navigate = useNavigate(); // Use useNavigate for redirection

    const [lecturer, setLecturer] = useState({
        fullName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        DOB: '',
        gender: '',
        address: '',
        nic: '',
        faculty: '',
        year: '',
        modules: [],
        photo: null,
    });

    const [modules, setModules] = useState([]);
    const [error, setError] = useState('');

    // Fetch lecturer data on page load
    useEffect(() => {
        axios.get('/api/lecturers/${id}')
            .then(response => {
                if (response.data) {
                    setLecturer(response.data);
                    setModules(response.data.modules);
                } else {
                    setError('Lecturer not found'); // In case no lecturer is found
                }
            })
            .catch(err => {
                setError('Failed to fetch lecturer data'); // More generic error message
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLecturer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleModuleChange = (e) => {
        const { value } = e.target;
        setModules(value.split(','));
    };

    const handleFileChange = (e) => {
        setLecturer(prevState => ({
            ...prevState,
            photo: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullName', lecturer.fullName);
        formData.append('userName', lecturer.userName);
        formData.append('email', lecturer.email);
        formData.append('phoneNumber', lecturer.phoneNumber);
        formData.append('DOB', lecturer.DOB);
        formData.append('gender', lecturer.gender);
        formData.append('address', lecturer.address);
        formData.append('nic', lecturer.nic);
        formData.append('faculty', lecturer.faculty);
        formData.append('year', lecturer.year);
        formData.append('modules', JSON.stringify(modules));
        if (lecturer.photo) {
            formData.append('photo', lecturer.photo);
        }

        try {
            await axios.put(`/api/lecturers/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/lecturers'); // Use navigate() instead of history.push()
        } catch (err) {
            setError('Update failed'); // Show error if update fails
        }
    };

    return (
        <div>
            <h2>Update Lecturer</h2>
            {error && <p>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={lecturer.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="userName"
                        value={lecturer.userName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={lecturer.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={lecturer.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="DOB"
                        value={lecturer.DOB}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={lecturer.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={lecturer.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>NIC:</label>
                    <input
                        type="text"
                        name="nic"
                        value={lecturer.nic}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Faculty:</label>
                    <input
                        type="text"
                        name="faculty"
                        value={lecturer.faculty}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Year:</label>
                    <input
                        type="number"
                        name="year"
                        value={lecturer.year}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Modules (comma-separated):</label>
                    <input
                        type="text"
                        name="modules"
                        value={modules.join(',')}
                        onChange={handleModuleChange}
                        required
                    />
                </div>
                <div>
                    <label>Profile Photo:</label>
                    <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <button type="submit">Update Lecturer</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateLecturer;
