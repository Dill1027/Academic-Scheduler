import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddDoc.css";

function AddDoc({ onClose }) {
    const [year, setYear] = useState("");
    const [course, setCourse] = useState("");
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const [lectures, setLectures] = useState(["", "", ""]);
    const [documents, setDocuments] = useState([null, null, null]);

    const handleLectureChange = (index, value) => {
        const updatedLectures = [...lectures];
        updatedLectures[index] = value;
        setLectures(updatedLectures);
    };

    const handleDocumentChange = (index, file) => {
        const updatedDocs = [...documents];
        updatedDocs[index] = file;
        setDocuments(updatedDocs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isAnyDocumentUploaded = documents.some(doc => doc !== null);
        if (!isAnyDocumentUploaded) {
            alert("Please upload at least one document.");
            return;
        }

        const formData = new FormData();
        formData.append("year", year);
        formData.append("course", course);
        formData.append("moduleName", moduleName);
        formData.append("description", description);

        lectures.forEach((lecture, index) => {
            if (lecture) formData.append(`lectures[${index}]`, lecture);
        });

        documents.forEach((doc, index) => {
            if (doc) formData.append("documents", doc);
        });

        try {
            const response = await axios.post("http://localhost:8081/api/docs/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Document uploaded successfully!");
            console.log(response.data);

            // Reset form fields
            setYear("");
            setCourse("");
            setModuleName("");
            setDescription("");
            setLectures(["", "", ""]);
            setDocuments([null, null, null]);

            // Close the modal on success
            onClose();
        } catch (error) {
            console.error("Error uploading document:", error);
            if (error.response) {
                alert("Error uploading document: " + error.response.data.message);
            } else if (error.request) {
                alert("Network error: Could not connect to the server.");
            } else {
                alert("Error: " + error.message);
            }
        }
    };

    return (
        <div className="add-doc-modal">
            <h3 className='head'>Uploading Course Requirements</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                    <label>Year</label>
                    <select
                        className="form-control"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value="">Select Year :</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label>Specialization :</label>
                    <select
                        className="form-control"
                        name="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                    >
                        <option value="">Select Specialization</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Interactive Media">Interactive Media</option>
                        <option value="Data Science">Data Science</option>
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label>Module Name :</label>
                    <input
                        type="text"
                        className="form-control"
                        name="moduleName"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mt-3">
                    <label>Description (Optional) :</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group mt-3">
                    <label>Lecturers :</label>
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

                <div className="form-group mt-3">
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

                <div className="form-group mt-4 d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddDoc;