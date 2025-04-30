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
        const response = await axios.get("http://localhost:6001/api/docs/pending");
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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Review: Pending Student Registrations</h2>
      
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Pending Approvals ({pendingStudents.length})
          </h5>
        </div>
        
        {pendingStudents.length === 0 ? (
          <div className="card-body text-center">
            <p className="text-muted">No pending student registrations found.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {pendingStudents.map(student => (
              <div key={student._id} className="list-group-item">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5>{student.studentName}</h5>
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
                        className="btn btn-success me-2"
                      >
                        <i className="bi bi-check-circle me-1"></i> Approve
                      </button>
                      <button
                        onClick={() => handleDecision(student._id, "decline")}
                        className="btn btn-danger"
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
  );
}

export default AdminReview;