import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const moduleOptions = {
    "1st Year": ["Mathematics", "Programming Fundamentals", "Database Systems", "Computer Networks"],
    "2nd Year": ["Data Structures", "Operating Systems", "Software Engineering", "Web Development"],
    "3rd Year": ["Machine Learning", "Cloud Computing", "Cyber Security", "Mobile App Development"],
    "4th Year": ["Artificial Intelligence", "Big Data Analytics", "Blockchain Technology", "Advanced Web Tech"]
};

const AddLectureForm = () => {
    const navigate = useNavigate();  // Initialize useNavigate

    const [lecturer, setLecturer] = useState({
        lecturerId: "",
        fullName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        DOB: "",
        gender: "",
        address: "",
        nic: "",
        faculty: "Computing", // Default
        year: "",
        modules: []
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        setLecturer({ ...lecturer, [e.target.name]: e.target.value });
    };

    // Handle module selection (checkbox)
    const handleModuleChange = (module) => {
        setLecturer((prevState) => {
            const updatedModules = prevState.modules.includes(module)
                ? prevState.modules.filter((m) => m !== module)
                : [...prevState.modules, module];

            return { ...prevState, modules: updatedModules };
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/lecturers/add", lecturer);
            setMessage(response.data.message);
            setLecturer({
                lecturerId: "",
                fullName: "",
                userName: "",
                email: "",
                phoneNumber: "",
                DOB: "",
                gender: "",
                address: "",
                nic: "",
                faculty: "Computing",
                year: "",
                modules: []
            });

            // Redirect to the "Lecture Details" page after successful form submission
            navigate("/lecturerDetails");  // Adjust the URL according to your route
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    const formContainerStyle = {
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    };

    const labelStyle = {
        display: "block",
        margin: "10px 0 5px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        boxSizing: "border-box"
    };

    const selectStyle = {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        boxSizing: "border-box"
    };

    const checkboxContainerStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease"
    };

    const buttonHoverStyle = {
        backgroundColor: "#45a049"
    };

    const messageStyle = {
        color: "green",
        fontSize: "14px",
        marginBottom: "15px"
    };

    const errorStyle = {
        color: "red",
        fontSize: "14px",
        marginBottom: "15px"
    };

    return (
        <div style={formContainerStyle}>
            <h2>Add New Lecturer</h2>

            {message && <p style={messageStyle}>{message}</p>}
            {error && <p style={errorStyle}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Lecturer ID:</label>
                <input
                    type="text"
                    name="lecturerId"
                    value={lecturer.lecturerId}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={lecturer.fullName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Username:</label>
                <input
                    type="text"
                    name="userName"
                    value={lecturer.userName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={lecturer.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={lecturer.phoneNumber}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Date of Birth:</label>
                <input
                    type="date"
                    name="DOB"
                    value={lecturer.DOB}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Gender:</label>
                <select
                    name="gender"
                    value={lecturer.gender}
                    onChange={handleChange}
                    required
                    style={selectStyle}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label style={labelStyle}>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={lecturer.address}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>NIC:</label>
                <input
                    type="text"
                    name="nic"
                    value={lecturer.nic}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Faculty:</label>
                <input
                    type="text"
                    name="faculty"
                    value={lecturer.faculty}
                    readOnly
                    style={inputStyle}
                />

                <label style={labelStyle}>Year:</label>
                <select
                    name="year"
                    value={lecturer.year}
                    onChange={handleChange}
                    required
                    style={selectStyle}
                >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>

                {lecturer.year && (
                    <>
                        <label style={labelStyle}>Modules:</label>
                        <div style={checkboxContainerStyle}>
                            {moduleOptions[lecturer.year]?.map((module) => (
                                <label key={module}>
                                    <input
                                        type="checkbox"
                                        value={module}
                                        checked={lecturer.modules.includes(module)}
                                        onChange={() => handleModuleChange(module)}
                                    />
                                    {module}
                                </label>
                            ))}
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    Add Lecturer
                </button>
            </form>
        </div>
    );
};

export default AddLectureForm;
