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
                            onChange={(e) => setModule({...module, year: e.target.value})}
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

                {/* <div className="form-group mt-4">
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
                    </div> */}
                
                <button type="submit" className="save btn btn-primary mt-5" style={{ width:"400px" , }}>
                    Save Changes
                </button>
            </form>
            </div>
            <Footer />
        </div>
    );
}

export default EditDoc;