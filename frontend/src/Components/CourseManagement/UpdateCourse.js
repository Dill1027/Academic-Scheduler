import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
            await axios.put(`http://localhost:8081/api/docs/update/${id}`, module);
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
            <h2>Edit Module: {module.moduleName}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
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
                {/* Add more fields as needed */}
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditDoc;