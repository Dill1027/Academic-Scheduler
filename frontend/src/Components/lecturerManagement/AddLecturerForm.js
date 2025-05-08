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
        email: "",
        phoneNumber: "",
        DOB: "",
        gender: "",
        address: "",
        nic: "",
        specialization: "",
        year: "",
        modules: [],
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
        // Lecturer ID validation (must start with 'L' followed by exactly 3 digits)
        const lecturerIdRegex = /^L\d{3}$/;
        if (!lecturerIdRegex.test(lecturer.lecturerId)) {
            return "Lecturer ID must start with 'L' followed by exactly 3 digits (e.g., L123)";
        }

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

        // Password validation
        if (lecturer.password.length < 8) {
            return "Password must be at least 8 characters";
        }
        
        if (lecturer.password !== lecturer.confirmPassword) {
            return "Passwords do not match";
        }

        // Required fields
        const requiredFields = [
            'lecturerId', 'fullName', 'email', 
            'phoneNumber', 'DOB', 'gender', 'address', 
            'nic', 'specialization', 'year', 'password',
            'confirmPassword'
        ];
        
        for (const field of requiredFields) {
            if (!lecturer[field]) {
                return `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
            }
        }

        // Modules validation
        if (!lecturer.modules || lecturer.modules.length === 0) {
            return "Please select at least one module";
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
                "http://localhost:5000/api/lecturers/add", // Changed from 6001 to 5000
                {
                    ...lecturer,
                    DOB: lecturer.DOB
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setShowSuccessPopup(true);
                setLecturer({
                    lecturerId: "",
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    DOB: "",
                    gender: "",
                    address: "",
                    nic: "",
                    specialization: "",
                    year: "",
                    modules: [],
                    password: "",
                    confirmPassword: ""
                });

                setTimeout(() => {
                    setShowSuccessPopup(false);
                    if (closeModal) closeModal();
                    navigate("/lecturerDetails");
                }, 2000);
            } else {
                setError(response.data.message || "Failed to add lecturer");
            }
        } catch (err) {
            console.error("Full error:", err);
            if (err.response) {
                setError(err.response.data.message || "Failed to add lecturer");
            } else if (err.request) {
                setError("Server is not responding. Please check if the server is running.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
        if (closeModal) closeModal();
        navigate("/lecturerDetails");
    };

    return (
        <div className="form-container">
            <h2>Add New Lecturer</h2>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Lecturer ID (e.g., L123):</label>
                <input
                    type="text"
                    name="lecturerId"
                    value={lecturer.lecturerId}
                    onChange={handleChange}
                    pattern="L\d{3}"
                    title="Lecturer ID must start with 'L' followed by exactly 3 digits"
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

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={lecturer.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                />

                <label>Confirm Password:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={lecturer.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="8"
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
                    <div className="modules-section">
                        <label>Select Modules:</label>
                        <div className="modules-grid">
                            {moduleOptions[lecturer.specialization]?.[lecturer.year]?.map((module) => (
                                <label key={module} className="module-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={lecturer.modules.includes(module)}
                                        onChange={() => handleModuleChange(module)}
                                    />
                                    <span>{module}</span>
                                </label>
                            ))}
                        </div>
                        {error && error.includes("module") && (
                            <div className="error-message">{error}</div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? "submitting" : ""}
                >
                    {isSubmitting ? "Adding..." : "Add Lecturer"}
                </button>
            </form>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="success-popup-overlay">
                    <div className="success-popup">
                        <div className="success-icon">✓</div>
                        <h3>Success!</h3>
                        <p>Lecturer added successfully!</p>
                        <button onClick={closeSuccessPopup}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddLectureForm;