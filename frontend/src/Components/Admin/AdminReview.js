import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function AdminReview() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch only pending students
  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/student/pending");
        setPendingStudents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, []);

  const handleDecision = async (studentId, decision) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: decision === "accept" 
        ? "This will approve the student's registration."
        : "This will permanently delete the student's registration.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed'
    });

    if (result.isConfirmed) {
      try {
        if (decision === "accept") {
          await axios.patch(`http://localhost:5000/api/student/${studentId}`, { 
            status: "approved" 
          });
          Swal.fire(
            'Approved!',
            'Student registration has been approved.',
            'success'
          );
        } else {
          await axios.delete(`http://localhost:5000/api/student/${studentId}`);
          Swal.fire(
            'Deleted!',
            'Student registration has been declined and removed.',
            'success'
          );
        }
        
        // Update UI by removing the processed student
        setPendingStudents(prev => prev.filter(student => student._id !== studentId));
      } catch (error) {
        console.error("Error processing decision:", error);
        Swal.fire(
          'Error!',
          'There was a problem processing your request.',
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading pending student registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="container mt-5">
        <h2 style={headerStyle}>Admin Review: Pending Student Registrations</h2>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h5 className="mb-0">
              Pending Approvals ({pendingStudents.length})
            </h5>
          </div>
          
          {pendingStudents.length === 0 ? (
            <div style={emptyMessageStyle}>
              <p>No pending student registrations found.</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {pendingStudents.map(student => (
                <div key={student._id} style={listItemStyle}>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 style={studentNameStyle}>{student.studentName}</h5>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Email:</strong> {student.email}</p>
                          <p className="mb-1"><strong>Reg No:</strong> {student.registrationNumber}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Specialization:</strong> {student.specialization}</p>
                          <p className="mb-1"><strong>Year:</strong> {student.year || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="btn-group">
                        <button
                          onClick={() => handleDecision(student._id, "accept")}
                          style={approveButtonStyle}
                        >
                          <i className="bi bi-check-circle me-1"></i> Approve
                        </button>
                        <button
                          onClick={() => handleDecision(student._id, "decline")}
                          style={declineButtonStyle}
                        >
                          <i className="bi bi-x-circle me-1"></i> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  padding: "20px",
};

const headerStyle = {
  color: "#1976d2",
  textAlign: "center",
  marginBottom: "2rem",
  fontSize: "2rem",
  fontWeight: "600",
};

const cardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "15px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  overflow: "hidden",
};

const cardHeaderStyle = {
  background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
  color: "white",
  padding: "1rem 1.5rem",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const listItemStyle = {
  padding: "1.5rem",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(66, 165, 245, 0.05)",
  },
};

const studentNameStyle = {
  color: "#1976d2",
  marginBottom: "1rem",
  fontSize: "1.2rem",
  fontWeight: "600",
};

const approveButtonStyle = {
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#388e3c",
    transform: "translateY(-2px)",
  },
};

const declineButtonStyle = {
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#d32f2f",
    transform: "translateY(-2px)",
  },
};

const emptyMessageStyle = {
  padding: "2rem",
  textAlign: "center",
  color: "#7f8c8d",
  fontSize: "1.1rem",
};

export default AdminReview;