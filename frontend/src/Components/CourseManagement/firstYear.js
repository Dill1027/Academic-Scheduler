import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Navbar/Header";
import Footer from "../Navbar/footer";
import "./first.css"; // Add your custom CSS here
import { Link } from 'react-router-dom';

function First() {
    const [data, setData] = useState([]); // Stores all 1st Year modules
    const [filteredData, setFilteredData] = useState([]); // Stores filtered modules based on search
    const [searchQuery, setSearchQuery] = useState(""); // Stores the search query
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeCard, setActiveCard] = useState(null); // Tracks which card is clicked

    // Fetch 1st Year data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data for 1st Year
    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:8081/api/docs/year/1st Year`);
            setData(response.data);
            setFilteredData(response.data); // Initialize filtered data with all 1st Year modules
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter modules based on the search query (search in both moduleName and course)
        const filtered = data.filter((item) =>
            (item.moduleName && item.moduleName.toLowerCase().includes(query)) || 
            (item.course && item.course.toLowerCase().includes(query))
        );
        setFilteredData(filtered);
    };

    // Group modules by course
    const groupByCourse = (modules) => {
        return modules.reduce((acc, module) => {
            const course = module.course || "Uncategorized"; // Default to "Uncategorized" if no course
            if (!acc[course]) {
                acc[course] = [];
            }
            acc[course].push(module);
            return acc;
        }, {});
    };

    // Handle document download with the real file name
    const handleDownload = (doc, originalName) => {
        const link = document.createElement("a");
        link.href = `http://localhost:8081/uploads/${doc}`;
        link.download = originalName; // Set the original file name for download
        link.click();
    };

    // Handle module deletion
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            try {
                await axios.delete(`http://localhost:8081/api/docs/delete/${id}`);
                alert("Module deleted successfully!");
                fetchData(); // Refresh the data after deletion
            } catch (error) {
                console.error("Error deleting module:", error);
                alert("Failed to delete module. Please try again.");
            }
        }
    };

    // Toggle buttons visibility when a card is clicked
    const handleCardClick = (id) => {
        if (activeCard === id) {
            setActiveCard(null); // Hide buttons if the same card is clicked again
        } else {
            setActiveCard(id); // Show buttons for the clicked card
        }
    };

    // Group filtered data by course
    const groupedData = groupByCourse(filteredData);

    return (
        <div className="dashboard-container">
            <Header />
            <div className="left-section" style={{ marginTop: "90px" }}>
                <div className="main-1 mt-5">
                    <h3 style={{marginLeft:"50px"}}>1st Year Modules</h3>
                    <hr />

                    {/* Search Bar */}
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
                                    <h2 >{course}</h2>
                                    </div>
                                    <hr />
                                    {groupedData[course].map((item, index) => (
                                        <div
                                            key={index}
                                            className="firstcard data-item card mb-3"
                                            onClick={() => handleCardClick(item._id)} // Handle card click
                                            style={{ cursor: "pointer" }} // Change cursor to pointer
                                        >
                                            <div className="main card-body">
                                                <h5 className="mini1 card-title">{item.moduleName}</h5>
                                                <p className="des1 card-text mt-3">{item.description}</p>
                                                <p className="des card-text">
                                                    <strong className="name">Lectures:</strong>
                                                    {item.lectures.map((lecture, idx) => (
                                                        <div className="lec" key={idx}>{lecture}</div> // Display each lecture on a new line
                                                    ))}
                                                </p>
                                                <p className="des card-text">
                                                    <strong className="name">Documents:</strong>
                                                    {item.documents.map((doc, idx) => {
                                                        // Extract the original file name from the stored file name
                                                        const originalName = doc.split("-").slice(1).join("-");
                                                        return (
                                                            <div key={idx} className="lec d-flex gap-4">
                                                                <a
                                                                    href={`http://localhost:8081/uploads/${doc}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block"
                                                                >
                                                                    {originalName}
                                                                </a>
                                                                <button
                                                                    className="btn btn-link"
                                                                    onClick={() => handleDownload(doc, originalName)}
                                                                >
                                                                    Download
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </p>
                                                {/* Update and Delete Buttons */}
                                                {activeCard === item._id && ( // Show buttons only if the card is clicked
                                                    <div className="edit mt-3 d-flex gap-2">
                                                        <Link to={`/edit/${item._id}`}>
                                                            <button className="btn btn-primary event-button">Edit</button>
                                                        </Link>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleDelete(item._id)}
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
        </div>
    );
}

export default First;