import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Navbar/footer";
import "./first.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Third() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeCard, setActiveCard] = useState(null);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentModule, setCurrentModule] = useState(null);

    // Fetch 1st Year data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:5001/api/docs/year/3rd Year`);
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

    const handleDownload = (doc, originalName) => {
        if (!doc) return;
        const link = document.createElement("a");
        link.href = `http://localhost:5001/uploads/${doc}`;
        link.download = originalName || "document";
        link.click();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            try {
                await axios.delete(`http://localhost:5001/api/docs/delete/${id}`);
                alert("Module deleted successfully!");
                fetchData();
            } catch (error) {
                console.error("Error deleting module:", error);
                alert("Failed to delete module. Please try again.");
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

    // Open modal with module data
    const handleEditClick = (module) => {
        setCurrentModule({
            ...module,
            // Create copies of arrays to avoid direct state mutation
            lectures: [...(module.lectures || [])],
            documents: [...(module.documents || [])]
        });
        setShowModal(true);
    };

    // Handle form changes in modal
    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setCurrentModule(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle lecture changes in modal
    const handleLectureChange = (index, value) => {
        const updatedLectures = [...(currentModule.lectures || [])];
        updatedLectures[index] = value;
        setCurrentModule(prev => ({
            ...prev,
            lectures: updatedLectures
        }));
    };

    // Handle document changes in modal
    const handleDocumentChange = (index, file) => {
        const updatedDocuments = [...(currentModule.documents || [])];
        updatedDocuments[index] = file;
        setCurrentModule(prev => ({
            ...prev,
            documents: updatedDocuments
        }));
    };

    // Submit the updated module
    const handleModalSubmit = async (e) => {
        e.preventDefault();
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

            await axios.put(`http://localhost:5001/api/docs/update/${currentModule._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Module updated successfully!");
            setShowModal(false);
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error updating module:", error);
            alert("Failed to update module. Please try again.");
        }
    };

    const groupedData = groupByCourse(filteredData);

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="left-section" style={{ marginTop: "25px" }}>
                <div className="main-1 mt-5">
                    <h3 style={{marginLeft:"50px"}}>3rd Year Courses & Modules</h3>
                    <hr />

                    <div className="search form-group mb-4 mt-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search modules..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    <div className="data-list mt-5">
                        {Object.keys(groupedData).length > 0 ? (
                            Object.keys(groupedData).map((course, courseIndex) => (
                                <div key={courseIndex} className="course-group mb-5">
                                    <div className="course-title">
                                        <h2>{course}</h2>
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
                                                <h5 className="mini1 card-title">{item.moduleName}</h5>
                                                <p className="des1 card-text mt-3">{item.description}</p>
                                                <p className="des card-text">
                                                    <strong className="name">Lecturers:</strong>
                                                    {(item.lectures || []).map((lecture, idx) => (
                                                        <div className="lec" key={idx}>{lecture}</div>
                                                    ))}
                                                </p>
                                                <p className="des card-text">
                                                    <strong className="name">Documents:</strong>
                                                    {(item.documents || []).map((doc, idx) => {
                                                        if (!doc) return null;
                                                        const originalName = typeof doc === 'string' 
                                                            ? doc.split("-").slice(1).join("-") 
                                                            : doc.name || "Document";
                                                        
                                                        return (
                                                            <div key={idx} className="lec d-flex gap-4">
                                                                <a
                                                                    href={`http://localhost:5001/uploads/${doc}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block"
                                                                >
                                                                    {originalName}
                                                                </a>
                                                                <button
                                                                    className="btn btn-link"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDownload(doc, originalName);
                                                                    }}
                                                                >
                                                                    Download
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </p>
                                                {activeCard === item._id && (
                                                    <div className="edit mt-3 d-flex gap-2">
                                                        <button 
                                                            className="btn btn-primary event-button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(item);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(item._id);
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>No modules found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Module: {currentModule?.moduleName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentModule && (
                        <Form onSubmit={handleModalSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Year</Form.Label>
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

                            <Form.Group className="mb-3">
                                <Form.Label>Specialization</Form.Label>
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

                            <Form.Group className="mb-3">
                                <Form.Label>Module Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="moduleName"
                                    value={currentModule.moduleName}
                                    onChange={handleModalChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={currentModule.description}
                                    onChange={handleModalChange}
                                    rows={3}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Lecturers</Form.Label>
                                {(currentModule.lectures || []).map((lecture, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <Form.Control
                                            type="text"
                                            className="me-2"
                                            placeholder={`Lecturer ${index + 1}`}
                                            value={lecture}
                                            onChange={(e) => handleLectureChange(index, e.target.value)}
                                        />
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                const updatedLectures = (currentModule.lectures || []).filter((_, i) => i !== index);
                                                setCurrentModule(prev => ({
                                                    ...prev,
                                                    lectures: updatedLectures
                                                }));
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={() => {
                                        setCurrentModule(prev => ({
                                            ...prev,
                                            lectures: [...(prev.lectures || []), ""]
                                        }));
                                    }}
                                >
                                    Add Lecturer
                                </Button>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Documents</Form.Label>
                                {(currentModule.documents || []).map((doc, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        {doc instanceof File ? (
                                            <>
                                                <Form.Control
                                                    type="file"
                                                    className="me-2"
                                                    accept=".pdf,.doc,.docx,image/*"
                                                    onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                                                />
                                                <span>{doc.name}</span>
                                            </>
                                        ) : doc ? (
                                            <>
                                                <a
                                                    href={`http://localhost:5001/uploads/${doc}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="me-2"
                                                >
                                                    {typeof doc === 'string' ? doc.split("-").slice(1).join("-") : "Document"}
                                                </a>
                                                <Form.Control
                                                    type="file"
                                                    className="me-2"
                                                    accept=".pdf,.doc,.docx,image/*"
                                                    onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                                                />
                                            </>
                                        ) : null}
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                const updatedDocuments = (currentModule.documents || []).filter((_, i) => i !== index);
                                                setCurrentModule(prev => ({
                                                    ...prev,
                                                    documents: updatedDocuments
                                                }));
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={() => {
                                        setCurrentModule(prev => ({
                                            ...prev,
                                            documents: [...(prev.documents || []), null]
                                        }));
                                    }}
                                >
                                    Add Document
                                </Button>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="mt-3">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Third;