import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "../Navbar";
import Footer from "../Navbar/footer";
import "./first.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function Fourth() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeCard, setActiveCard] = useState(null);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentModule, setCurrentModule] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // SweetAlert configuration
    const showAlert = (icon, title, text) => {
        const icons = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info',
            question: 'question'
        };
        
        return Swal.fire({
            icon: icons[icon] || 'info',
            title: title,
            text: text,
            showConfirmButton: true,
            timer: icon === 'success' ? 2000 : undefined,
            timerProgressBar: icon === 'success',
            confirmButtonColor: '#3085d6',
        });
    };

    const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancel',
        });
    };

    // Add base URL
    const BASE_URL = 'http://localhost:5000';

    // Fetch 1st Year data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${BASE_URL}/api/docs/year/4th Year`);
            // Ensure all arrays exist and are properly initialized
            const processedData = response.data.map(module => ({
                ...module,
                lectures: module.lectures || [],
                documents: module.documents || []
            }));
            setData(processedData);
            setFilteredData(processedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data. Please try again.");
            showAlert('error', 'Error', 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = data.filter((item) =>
            (item.moduleName && item.moduleName.toLowerCase().includes(query)) || 
            (item.course && item.course.toLowerCase().includes(query))
        );
        setFilteredData(filtered);
    };

    const groupByCourse = (modules) => {
        return modules.reduce((acc, module) => {
            const course = module.course || "Uncategorized";
            if (!acc[course]) {
                acc[course] = [];
            }
            acc[course].push(module);
            return acc;
        }, {});
    };

    const handleDownload = (doc, originalName, e) => {
        e.stopPropagation();
        if (!doc) return;
        const link = document.createElement("a");
        link.href = `${BASE_URL}/uploads/${doc}`;
        link.download = originalName || "document";
        link.click();
        showAlert('success', 'Download Started', 'Your file download has started.');
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        const result = await showConfirmDialog(
            'Are you sure?',
            'You won\'t be able to revert this!',
            'Yes, delete it!'
        );
        
        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/docs/delete/${id}`);
                showAlert('success', 'Deleted!', 'Module has been deleted.');
                fetchData();
            } catch (error) {
                console.error("Error deleting module:", error);
                showAlert('error', 'Error', 'Failed to delete module. Please try again.');
            }
        }
    };

    const handleCardClick = (id) => {
        if (activeCard === id) {
            setActiveCard(null);
        } else {
            setActiveCard(id);
        }
    };

    const handleEditClick = (module, e) => {
        e.stopPropagation();
        setCurrentModule({
            ...module,
            lectures: [...(module.lectures || [])],
            documents: [...(module.documents || [])]
        });
        setShowModal(true);
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setCurrentModule(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLectureChange = (index, value) => {
        const updatedLectures = [...(currentModule.lectures || [])];
        updatedLectures[index] = value;
        setCurrentModule(prev => ({
            ...prev,
            lectures: updatedLectures
        }));
    };

    const handleDocumentChange = (index, file) => {
        const updatedDocuments = [...(currentModule.documents || [])];
        updatedDocuments[index] = file;
        setCurrentModule(prev => ({
            ...prev,
            documents: updatedDocuments
        }));
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append("year", currentModule.year);
            formData.append("course", currentModule.course);
            formData.append("moduleName", currentModule.moduleName);
            formData.append("description", currentModule.description);

            (currentModule.lectures || []).forEach((lecture, index) => {
                formData.append(`lectures[${index}]`, lecture);
            });

            (currentModule.documents || []).forEach((doc, index) => {
                if (doc instanceof File) {
                    formData.append(`documents[${index}]`, doc);
                } else if (doc) {
                    formData.append(`existingDocuments[${index}]`, doc);
                }
            });

            await axios.put(`${BASE_URL}/api/docs/update/${currentModule._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            showAlert('success', 'Success!', 'Module updated successfully!');
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error updating module:", error);
            showAlert('error', 'Error', error.response?.data?.message || 'Failed to update module. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const groupedData = groupByCourse(filteredData);

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="left-section" style={{ marginTop: "25px" }}>
                <div className="main-1 mt-5">
                    <h3 style={{marginLeft:"50px"}}>
                        <i className="bi bi-book me-2"></i>
                        4th Year Courses & Modules
                    </h3>
                    <hr />

                    <div className="search form-group mb-4 mt-5">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search modules..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading modules...</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    <div className="data-list mt-5">
                        {Object.keys(groupedData).length > 0 ? (
                            Object.keys(groupedData).map((course, courseIndex) => (
                                <div key={courseIndex} className="course-group mb-5">
                                    <div className="course-title">
                                        <h2>
                                            <i className="bi bi-mortarboard me-2"></i>
                                            {course}
                                        </h2>
                                    </div>
                                    <hr />
                                    {groupedData[course].map((item, index) => (
                                        <div
                                            key={index}
                                            className="firstcard data-item card mb-3"
                                            onClick={() => handleCardClick(item._id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="main card-body">
                                                <h5 className="mini1 card-title">
                                                    <i className="bi bi-file-earmark-text me-2"></i>
                                                    {item.moduleName}
                                                </h5>
                                                {item.description && (
                                                    <p className="des1 card-text mt-3">
                                                        <i className="bi bi-card-text me-2"></i>
                                                        {item.description}
                                                    </p>
                                                )}
                                                {(item.lectures || []).length > 0 && (
                                                    <p className="des card-text">
                                                        <strong className="name">
                                                            <i className="bi bi-person-video3 me-2"></i>
                                                            Lecturers:
                                                        </strong>
                                                        {(item.lectures || []).map((lecture, idx) => (
                                                            <div className="lec" key={idx}>
                                                                {lecture}
                                                            </div>
                                                        ))}
                                                    </p>
                                                )}
                                                {(item.documents || []).length > 0 && (
                                                    <p className="des card-text">
                                                        <strong className="name">
                                                            <i className="bi bi-file-earmark-arrow-down me-2"></i>
                                                            Documents:
                                                        </strong>
                                                        {(item.documents || []).map((doc, idx) => {
                                                            if (!doc) return null;
                                                            const originalName = typeof doc === 'string' 
                                                                ? doc.split("-").slice(1).join("-") 
                                                                : doc.name || "Document";
                                                            
                                                            return (
                                                                <div key={idx} className="lec d-flex gap-4 align-items-center">
                                                                    <a
                                                                        href={`${BASE_URL}/uploads/${doc}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="d-block"
                                                                    >
                                                                        {originalName}
                                                                    </a>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={(e) => handleDownload(doc, originalName, e)}
                                                                    >
                                                                        <i className="bi bi-download me-1"></i>
                                                                        Download
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </p>
                                                )}
                                                {activeCard === item._id && (
                                                    <div className="edit mt-3 d-flex gap-2">
                                                        <button 
                                                            className="btn btn-primary event-button"
                                                            onClick={(e) => handleEditClick(item, e)}
                                                        >
                                                            <i className="bi bi-pencil-square me-2"></i>
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={(e) => handleDelete(item._id, e)}
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : !loading && (
                            <div className="text-center py-5">
                                <i className="bi bi-folder-x" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                                <p className="mt-3">No modules found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>
                        <i className="bi bi-pencil-square me-2"></i>
                        Edit Module: {currentModule?.moduleName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentModule && (
                        <Form onSubmit={handleModalSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="bi bi-calendar3 me-2"></i>
                                            Year
                                        </Form.Label>
                                        <Form.Select
                                            name="year"
                                            value={currentModule.year}
                                            onChange={handleModalChange}
                                            required
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <i className="bi bi-book me-2"></i>
                                            Specialization
                                        </Form.Label>
                                        <Form.Select
                                            name="course"
                                            value={currentModule.course}
                                            onChange={handleModalChange}
                                            required
                                        >
                                            <option value="">Select Specialization</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Software Engineering">Software Engineering</option>
                                            <option value="Cyber Security">Cyber Security</option>
                                            <option value="Interactive Media">Interactive Media</option>
                                            <option value="Data Science">Data Science</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-file-earmark-text me-2"></i>
                                    Module Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="moduleName"
                                    value={currentModule.moduleName}
                                    onChange={handleModalChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-card-text me-2"></i>
                                    Description
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={currentModule.description}
                                    onChange={handleModalChange}
                                    rows={3}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-person-video3 me-2"></i>
                                    Lecturers
                                </Form.Label>
                                {(currentModule.lectures || []).map((lecture, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Lecturer ${index + 1}`}
                                                value={lecture}
                                                onChange={(e) => handleLectureChange(index, e.target.value)}
                                            />
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => {
                                                    const updatedLectures = (currentModule.lectures || []).filter((_, i) => i !== index);
                                                    setCurrentModule(prev => ({
                                                        ...prev,
                                                        lectures: updatedLectures
                                                    }));
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline-primary"
                                    className="w-100"
                                    onClick={() => {
                                        setCurrentModule(prev => ({
                                            ...prev,
                                            lectures: [...(prev.lectures || []), ""]
                                        }));
                                    }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Lecturer
                                </Button>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-file-earmark-arrow-up me-2"></i>
                                    Documents
                                </Form.Label>
                                {(currentModule.documents || []).map((doc, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            {doc instanceof File ? (
                                                <>
                                                    <i className="bi bi-file-earmark me-2"></i>
                                                    <span>{doc.name}</span>
                                                </>
                                            ) : doc ? (
                                                <>
                                                    <a
                                                        href={`${BASE_URL}/uploads/${doc}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="me-2"
                                                    >
                                                        <i className="bi bi-file-earmark me-2"></i>
                                                        {typeof doc === 'string' ? doc.split("-").slice(1).join("-") : "Document"}
                                                    </a>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Form.Control
                                                type="file"
                                                className="flex-grow-1"
                                                accept=".pdf,.doc,.docx,image/*"
                                                onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                                            />
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => {
                                                    const updatedDocuments = (currentModule.documents || []).filter((_, i) => i !== index);
                                                    setCurrentModule(prev => ({
                                                        ...prev,
                                                        documents: updatedDocuments
                                                    }));
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline-primary"
                                    className="w-100"
                                    onClick={() => {
                                        setCurrentModule(prev => ({
                                            ...prev,
                                            documents: [...(prev.documents || []), null]
                                        }));
                                    }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Document
                                </Button>
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setShowModal(false)}
                                >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cancel
                                </Button>
                                <Button 
                                    variant="primary" 
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Fourth;