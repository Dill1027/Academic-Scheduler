import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moduleOptions from "./moduleOptions";
import "./AddLectureForm.css";

const AddLectureForm = ({ closeModal }) => {
    const navigate = useNavigate();

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
        specialization: "",
        year: "",
        modules: []
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLecturer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleModuleChange = (module) => {
        setLecturer(prev => ({
            ...prev,
            modules: prev.modules.includes(module)
                ? prev.modules.filter(m => m !== module)
                : [...prev.modules, module]
        }));
    };

    const validateForm = () => {
        // NIC validation (Sri Lankan format)
        const nicRegex = /^(\d{9}[vV]|\d{12})$/;
        if (!nicRegex.test(lecturer.nic)) {
            return "Invalid NIC format (e.g., 123456789V or 123456789012)";
        }

        // Phone number validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(lecturer.phoneNumber)) {
            return "Phone number must be 10 digits";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lecturer.email)) {
            return "Invalid email format";
        }

        // Required fields
        const requiredFields = [
            'lecturerId', 'fullName', 'userName', 'email', 
            'phoneNumber', 'DOB', 'gender', 'address', 
            'nic', 'specialization', 'year'
        ];
        
        for (const field of requiredFields) {
            if (!lecturer[field]) {
                return `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
            }
        }

        // Modules validation
        if (lecturer.modules.length === 0) {
            return "At least one module must be selected";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Submitting lecturer data:", lecturer);

            const response = await axios.post(
                "http://localhost:5001/api/lecturers/add", 
                {
                    ...lecturer,
                    DOB: lecturer.DOB // Keep as string, backend will convert
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setMessage("Lecturer added successfully!");
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
                    specialization: "",
                    year: "",
                    modules: []
                });

                setTimeout(() => {
                    if (closeModal) closeModal();
                    navigate("/lecturerDetails");
                }, 1500);
            } else {
                setError(response.data.message || "Failed to add lecturer");
            }
        } catch (err) {
            console.error("Full error:", err);
            if (err.response) {
                setError(err.response.data.message || "Failed to add lecturer");
            } else if (err.request) {
                setError("No response from server. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Lecturer</h2>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Lecturer ID:</label>
                <input
                    type="text"
                    name="lecturerId"
                    value={lecturer.lecturerId}
                    onChange={handleChange}
                    required
                />

                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={lecturer.fullName}
                    onChange={handleChange}
                    required
                />

                <label>Username:</label>
                <input
                    type="text"
                    name="userName"
                    value={lecturer.userName}
                    onChange={handleChange}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={lecturer.email}
                    onChange={handleChange}
                    required
                />

                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={lecturer.phoneNumber}
                    onChange={handleChange}
                    required
                    pattern="\d{10}"
                    title="Please enter exactly 10 digits"
                />

                <label>Date of Birth:</label>
                <input
                    type="date"
                    name="DOB"
                    value={lecturer.DOB}
                    onChange={handleChange}
                    required
                />

                <label>Gender:</label>
                <select
                    name="gender"
                    value={lecturer.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={lecturer.address}
                    onChange={handleChange}
                    required
                />

                <label>NIC:</label>
                <input
                    type="text"
                    name="nic"
                    value={lecturer.nic}
                    onChange={handleChange}
                    required
                    pattern="(\d{9}[vV]|\d{12})"
                    title="Enter valid NIC (e.g., 123456789V or 123456789012)"
                />

                <label>Specialization:</label>
                <select
                    name="specialization"
                    value={lecturer.specialization}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Specialization</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Interactive Media">Interactive Media</option>
                </select>

                <label>Year:</label>
                <select
                    name="year"
                    value={lecturer.year}
                    onChange={handleChange}
                    required
                    disabled={!lecturer.specialization}
                >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>

                {lecturer.specialization && lecturer.year && (
                    <>
                        <label>Modules:</label>
                        <div className="checkbox-container">
                            {moduleOptions[lecturer.specialization]?.[lecturer.year]?.map((module) => (
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
                    disabled={isSubmitting}
                    className={isSubmitting ? "submitting" : ""}
                >
                    {isSubmitting ? "Adding..." : "Add Lecturer"}
                </button>
            </form>
        </div>
    );
};

export default AddLectureForm;