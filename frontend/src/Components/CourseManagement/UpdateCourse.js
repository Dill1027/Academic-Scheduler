import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Navbar/footer";

function EditDoc() {
    const { id } = useParams(); // Get the module ID from the URL
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch module details based on the ID
    useEffect(() => {
        const fetchModule = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/docs/${id}`);
                setModule(response.data);
            } catch (error) {
                console.error("Error fetching module:", error);
                setError("Failed to fetch module details.");
            } finally {
                setLoading(false);
            }
        };

        fetchModule();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("year", module.year);
            formData.append("course", module.course);
            formData.append("moduleName", module.moduleName);
            formData.append("description", module.description);

            // Append lectures
            module.lectures.forEach((lecture, index) => {
                formData.append(`lectures[${index}]`, lecture);
            });

            // Append documents
            module.documents.forEach((doc, index) => {
                if (doc instanceof File) {
                    formData.append(`documents[${index}]`, doc);
                } else {
                    formData.append(`existingDocuments[${index}]`, doc); // Handle existing documents
                }
            });

            await axios.put(`http://localhost:8081/api/docs/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Module updated successfully!");
        } catch (error) {
            console.error("Error updating module:", error);
            alert("Failed to update module. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!module) return <p>Module not found.</p>;

    return (
        <div>
            <Header />

            <div className="Edit-container mt-5" style={{ marginTop: "100px", padding: "50px 100px" }}>
                <h2>Edit Module: {module.moduleName}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-5">
                        <label>Year</label>
                        <select
                            className="form-control"
                            name="year"
                            value={module.year}
                            onChange={(e) => setModule({ ...module, year: e.target.value })}
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>

                    <div className="form-group mt-5">
                        <label>Specialization :</label>
                        <select
                            className="form-control"
                            name="course"
                            value={module.course}
                            onChange={(e) => setModule({ ...module, course: e.target.value })}
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

                    <div className="form-group mt-5">
                        <label>Module Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={module.moduleName}
                            onChange={(e) => setModule({ ...module, moduleName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            value={module.description}
                            onChange={(e) => setModule({ ...module, description: e.target.value })}
                        />
                    </div>

                    {/* Updated Lecturers Section */}
                    <div className="form-group mt-4">
                        <label>Lecturers</label>
                        {module.lectures.map((lecture, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder={`Lecturer ${index + 1}`}
                                    value={lecture}
                                    onChange={(e) => {
                                        const updatedLectures = [...module.lectures];
                                        updatedLectures[index] = e.target.value;
                                        setModule({ ...module, lectures: updatedLectures });
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        const updatedLectures = module.lectures.filter((_, i) => i !== index);
                                        setModule({ ...module, lectures: updatedLectures });
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary mt-2"
                            onClick={() => setModule({ ...module, lectures: [...module.lectures, ""] })}
                        >
                            Add Lecturer
                        </button>
                    </div>

                    {/* Updated Upload Documents Section */}
                    <div className="form-group mt-4">
                        <label>Upload Documents (PDF, Word, or Images)</label>
                        {module.documents.map((doc, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                {doc instanceof File || !doc ? (
                                    // Input for new file uploads
                                    <input
                                        type="file"
                                        className="form-control me-2"
                                        accept=".pdf,.doc,.docx,image/*"
                                        onChange={(e) => {
                                            const updatedDocuments = [...module.documents];
                                            updatedDocuments[index] = e.target.files[0]; // Store the new file
                                            setModule({ ...module, documents: updatedDocuments });
                                        }}
                                    />
                                ) : (
                                    // Display existing document name with a download link
                                    <div className="me-2">
                                        <a
                                            href={`http://localhost:8081/uploads/${doc}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {doc.split("-").slice(1).join("-")} {/* Display original file name */}
                                        </a>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        const updatedDocuments = module.documents.filter((_, i) => i !== index);
                                        setModule({ ...module, documents: updatedDocuments });
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary mt-2"
                            onClick={() => setModule({ ...module, documents: [...module.documents, null] })}
                        >
                            Add Document
                        </button>
                    </div>

                    <button type="submit" className="save btn btn-primary mt-5" style={{ width: "400px" }}>
                        Save Changes
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default EditDoc;