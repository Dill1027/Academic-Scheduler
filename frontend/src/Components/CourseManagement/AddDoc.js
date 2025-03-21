import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Header from "../Navbar/Header";
import Footer from "../Navbar/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddDoc.css";

function AddDoc() {
    const navigate = useNavigate();
    const [year, setYear] = useState("");
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const [lectures, setLectures] = useState(["", "", ""]); // Fixed 3 lecture fields
    const [documents, setDocuments] = useState([null, null, null]); // Fixed 3 document fields

    // Handle lecture name change
    const handleLectureChange = (index, value) => {
        const updatedLectures = [...lectures];
        updatedLectures[index] = value;
        setLectures(updatedLectures);
    };

    // Handle file selection
    const handleDocumentChange = (index, file) => {
        const updatedDocs = [...documents];
        updatedDocs[index] = file;
        setDocuments(updatedDocs);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if at least one document is uploaded
        const isAnyDocumentUploaded = documents.some(doc => doc !== null);
        if (!isAnyDocumentUploaded) {
            alert("Please upload at least one document.");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append("year", year);
        formData.append("moduleName", moduleName);
        formData.append("description", description);

        // Append lectures
        lectures.forEach((lecture, index) => {
            if (lecture) formData.append(`lectures[${index}]`, lecture);
        });

        // Append documents
        documents.forEach((doc, index) => {
            if (doc) formData.append("documents", doc); // Use the same key for all files
        });

        try {
            // Send POST request to the backend
            const response = await axios.post("http://localhost:8081/api/docs/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Handle success
            alert("Document uploaded successfully!");
            console.log(response.data);

            // Reset form fields
            setYear("");
            setModuleName("");
            setDescription("");
            setLectures(["", "", ""]);
            setDocuments([null, null, null]);

            // Reload the page
            navigate(0);
        } catch (error) {
            // Handle error
            console.error("Error uploading document:", error);
            if (error.response) {
                // Server responded with an error
                alert("Error uploading document: " + error.response.data.message);
            } else if (error.request) {
                // No response from the server
                alert("Network error: Could not connect to the server.");
            } else {
                // Other errors
                alert("Error: " + error.message);
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="Add" style={{ marginTop: "100px", padding: "50px 100px" }}>
                <h3 className='head'>Uploading Course Requirements</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-5">
                        <label>Year</label>
                        <select
                            className="form-control"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>

                    <div className="form-group mt-4">
                        <label>Module Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="moduleName"
                            value={moduleName}
                            onChange={(e) => setModuleName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label>Description (Optional)</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Fixed 3 Lecture Fields */}
                    <div className="form-group mt-4">
                        <label>Lecturers</label>
                        {lectures.map((lecture, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder={`Lecturer ${index + 1}`}
                                    name="lecture"
                                    value={lecture}
                                    onChange={(e) => handleLectureChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Fixed 3 Document Upload Fields */}
                    <div className="form-group mt-4">
                        <label>Upload Documents (PDF, Word, or Images)</label>
                        {documents.map((doc, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="file"
                                    className="form-control me-2"
                                    accept=".pdf,.doc,.docx,image/*"
                                    onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                        Submit
                    </button>
                </form>
            </div>
            <Footer/>
        </div>
    );
}

export default AddDoc;