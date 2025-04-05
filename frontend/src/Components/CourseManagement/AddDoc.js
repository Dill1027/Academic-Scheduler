import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AddDoc.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function AddDoc({ onClose }) {
    const [year, setYear] = useState("");
    const [course, setCourse] = useState("");
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const [lectures, setLectures] = useState(["", "", ""]);
    const [documents, setDocuments] = useState([null, null, null]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateForm = () => {
        const isAnyDocumentUploaded = documents.some(doc => doc !== null);
        if (!isAnyDocumentUploaded) {
            Swal.fire({
                icon: "error",
                title: "Document Required",
                text: "Please upload at least one document.",
                confirmButtonColor: "#d33",
            });
            return false;
        }

        const invalidLecturers = lectures.filter(lecture =>
            lecture && !/^[a-zA-Z\s.'-]+$/.test(lecture)
        );
        if (invalidLecturers.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid Lecturer Name",
                html: "Only letters, spaces, and punctuation (.'-) are allowed.",
                confirmButtonColor: "#d33",
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        let swalLoading = null;

        try {
            swalLoading = Swal.fire({
                title: "Uploading Documents",
                html: "Please wait while we upload your documents...",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            const formData = new FormData();
            formData.append("year", year);
            formData.append("course", course);
            formData.append("moduleName", moduleName);
            formData.append("description", description);

            lectures.forEach((lecture, index) => {
                if (lecture) formData.append(`lectures[${index}]`, lecture);
            });

            documents.forEach((doc) => {
                if (doc) formData.append("documents", doc);
            });

            const response = await axios.post("http://localhost:5000/api/docs/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Close loading dialog
            if (swalLoading) {
                Swal.close();
            }

            await Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Documents uploaded successfully!",
                confirmButtonColor: "#3085d6",
                timer: 2000,
                timerProgressBar: true,
            });

            // Reset form
            setYear("");
            setCourse("");
            setModuleName("");
            setDescription("");
            setLectures(["", "", ""]);
            setDocuments([null, null, null]);

            onClose(); // Close modal
        } catch (error) {
            console.error("Error uploading document:", error);
            
            // Close loading dialog if it's still open
            if (swalLoading) {
                Swal.close();
            }

            const errorMessage = error.response?.data?.message ||
                (error.request
                    ? "Network error: Could not connect to the server."
                    : "An error occurred while uploading documents.");

            await Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: errorMessage,
                confirmButtonColor: "#d33",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-doc-modal">
            <h3 className="head">
                <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                Uploading Course Requirements
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                    <label><i className="bi bi-calendar3 me-2"></i> Year</label>
                    <select 
                        className="form-control" 
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
                    <label><i className="bi bi-book me-2"></i> Specialization</label>
                    <select 
                        className="form-control" 
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
                    <label><i className="bi bi-file-earmark-text me-2"></i> Module Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={moduleName} 
                        onChange={(e) => setModuleName(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group mt-3">
                    <label><i className="bi bi-card-text me-2"></i> Description (Optional)</label>
                    <textarea 
                        className="form-control" 
                        rows="3" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>

                <div className="form-group mt-3">
                    <label><i className="bi bi-person-video3 me-2"></i> Lecturers</label>
                    {lectures.map((lecture, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder={`Lecturer ${index + 1}`}
                                value={lecture}
                                onChange={(e) => handleLectureChange(index, e.target.value)}
                            />
                            {lecture && !/^[a-zA-Z\s.'-]+$/.test(lecture) && (
                                <small className="text-danger ms-2">
                                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                    Only letters, spaces, and (.'-) allowed
                                </small>
                            )}
                        </div>
                    ))}
                </div>

                <div className="form-group mt-3">
                    <label><i className="bi bi-file-earmark-arrow-up me-2"></i> Upload Documents</label>
                    {documents.map((doc, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <input
                                type="file"
                                className="form-control me-2"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                            />
                            {doc && (
                                <span className="text-success">
                                    <i className="bi bi-check-circle-fill me-1"></i>
                                    {doc.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="addbtn form-group mt-4 d-flex justify-content-between gap-5">
                    <button 
                        type="button" 
                        className="cancel btn btn-danger" 
                        onClick={onClose} 
                        disabled={isSubmitting}
                    >
                        <i className="bi bi-x-circle me-2"></i> Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="submit btn btn-primary" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-cloud-upload me-2"></i>
                                Submit
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddDoc;