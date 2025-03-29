import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateLecturer = () => {
    const { id } = useParams(); // Get lecturer ID from the URL
    const [lecturer, setLecturer] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/lecturers/${id}`)
            .then((res) => {
                setLecturer(res.data);
            })
            .catch((error) => {
                console.error("Error fetching lecturer:", error);
            });
    }, [id]);

    if (!lecturer) return <div>Loading...</div>;

    return (
        <div>
            <h1>Update Lecturer</h1>
            <form>
                <label>Lecturer ID:</label>
                <input type="text" value={lecturer._id} readOnly />

                {/* Other form fields go here */}
            </form>
        </div>
    );
};

export default UpdateLecturer;
