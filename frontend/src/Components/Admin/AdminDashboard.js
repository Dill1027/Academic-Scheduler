import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <div className="row">
                {/* Lecturer Management */}
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3" onClick={() => handleNavigation("/lecturers")}>
                        <div className="card-body text-center">
                            <h5 className="card-title">Lecturer Management</h5>
                            <p className="card-text">Manage lecturer details, subjects, and schedules.</p>
                        </div>
                    </div>
                </div>

                {/* Student Management */}
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3" onClick={() => handleNavigation("/students")}>
                        <div className="card-body text-center">
                            <h5 className="card-title">Student Management</h5>
                            <p className="card-text">Manage student details, enrollments, and records.</p>
                        </div>
                    </div>
                </div>

                {/* Module Management */}
                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3" onClick={() => handleNavigation("/modules")}>
                        <div className="card-body text-center">
                            <h5 className="card-title">Module Management</h5>
                            <p className="card-text">Manage subjects, schedules, and curriculum.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
