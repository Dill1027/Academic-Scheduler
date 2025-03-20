import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Navbar/Header";
import "./first.css"; // Add your custom CSS here

function First() {
    const [data, setData] = useState([]); // Stores all 1st Year modules
    const [filteredData, setFilteredData] = useState([]); // Stores filtered modules based on search
    const [searchQuery, setSearchQuery] = useState(""); // Stores the search query
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        const query = e.target.value;
        setSearchQuery(query);

        // Filter modules based on the search query
        const filtered = data.filter((item) =>
            item.moduleName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Handle document download with the real file name
    const handleDownload = (doc, originalName) => {
        const link = document.createElement("a");
        link.href = `http://localhost:8081/uploads/${doc}`;
        link.download = originalName; // Set the original file name for download
        link.click();
    };

    // Handle module update
    const handleUpdate = (id) => {
        // Redirect to the update page or open a modal for updating the module
        console.log("Update module with ID:", id);
        // Add your update logic here
    };

    // Handle module deletion
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            try {
                await axios.delete(`http://localhost:8081/api/docs/${id}`);
                alert("Module deleted successfully!");
                fetchData(); // Refresh the data after deletion
            } catch (error) {
                console.error("Error deleting module:", error);
                alert("Failed to delete module. Please try again.");
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="fetch-data-container" style={{ marginTop: "100px", padding: "50px 100px" }}>
                <h2>1st Year Modules</h2>

                {/* Search Bar */}
                <div className="form-group mb-4">
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

                <div className="data-list">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <div key={index} className="data-item card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">{item.moduleName}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text">
                                        <strong>Lectures:</strong>
                                        {item.lectures.map((lecture, idx) => (
                                            <div key={idx}>{lecture}</div> // Display each lecture on a new line
                                        ))}
                                    </p>
                                    <p className="card-text">
                                        <strong>Documents:</strong>
                                        {item.documents.map((doc, idx) => {
                                            // Extract the original file name from the stored file name
                                            const originalName = doc.split("-").slice(1).join("-");
                                            return (
                                                <div key={idx}>
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
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => handleUpdate(item._id)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No modules found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default First;