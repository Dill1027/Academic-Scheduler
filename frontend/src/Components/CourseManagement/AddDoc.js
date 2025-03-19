import { useState } from "react";
import axios from "axios";
import Header from "../Navbar/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddDoc.css";

function AddDoc() {
    const [year, setYear] = useState("");
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const [lectures, setLectures] = useState([""]);
    const [documents, setDocuments] = useState([]);

    // Add a new lecture field
    const addLectureField = () => {
        if (lectures.length < 6) {
            setLectures([...lectures, ""]);
        }
    };

    // Remove a lecture field
    const removeLectureField = (index) => {
        setLectures(lectures.filter((_, i) => i !== index));
    };

    // Handle lecture name change
    const handleLectureChange = (index, value) => {
        const updatedLectures = [...lectures];
        updatedLectures[index] = value;
        setLectures(updatedLectures);
    };

    // Add a new document field
    const addDocumentField = () => {
        if (documents.length < 5) {
            setDocuments([...documents, null]);
        }
    };

    // Remove a document field
    const removeDocumentField = (index) => {
        setDocuments(documents.filter((_, i) => i !== index));
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
        const formData = new FormData();
        formData.append("year", year);
        formData.append("moduleName", moduleName);
        formData.append("description", description);
        lectures.forEach((lecture, index) => {
            formData.append(`lectures[${index}]`, lecture);
        });
        documents.forEach((doc, index) => {
            if (doc) formData.append("documents", doc);
        });

        try {
            const response = await axios.post("http://localhost:5000/api/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Document uploaded successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading document:", error);
        }
    };

    return (
        <div>
            <Header />
            <div class="Add" style={{ marginTop: "100px", padding: "50px 100px" }}>
            <h3 class='head'>Uploading Course Requirements</h3>
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

                    {/* Lecture Fields */}
                    <div className="form-group mt-4">
                        <label>Lectures</label>
                        {lectures.map((lecture, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder={`Lecture ${index + 1}`}
                                    name="lecture"
                                    value={lecture}
                                    onChange={(e) => handleLectureChange(index, e.target.value)}
                                    required
                                />
                                {lectures.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeLectureField(index)}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        {lectures.length < 6 && (
                            <button type="button" className="btn btn-info mt-2" onClick={addLectureField}>
                                + Add Lecture
                            </button>
                        )}
                    </div>

                    {/* Document Upload Fields */}
                    <div className="form-group mt-4">
                        <label>Upload Documents</label>
                        {documents.map((doc, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="form-control me-2"
                                    onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeDocumentField(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {documents.length < 5 && (
                            <button type="button" className=" doc btn btn-success mt-2" onClick={addDocumentField}>
                                + Add Document
                            </button>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddDoc;
