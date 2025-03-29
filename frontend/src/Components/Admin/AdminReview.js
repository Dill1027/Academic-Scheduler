import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReview = () => {
  const [pendingStudents, setPendingStudents] = useState([]);

  // Fetch only pending students
  useEffect(() => {
    axios.get("http://localhost:5001/api/student?status=pending")  // Ensure 'status=pending' is passed correctly
      .then(response => setPendingStudents(response.data))
      .catch(error => console.error("Error fetching pending students:", error));
  }, []);

  // Handle Accept or Decline
  const handleDecision = async (studentId, decision) => {
    try {
      const newStatus = decision === "accept" ? "approved" : "declined";

      // Update the student status
      await axios.patch(`http://localhost:5001/api/student/${studentId}`, { status: newStatus });

      // Filter out the student from the pending list
      setPendingStudents(pendingStudents.filter(student => student._id !== studentId));
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Review: Pending Student Registrations</h2>

      {pendingStudents.length === 0 ? (
        <p className="text-center">No pending students.</p>
      ) : (
        <div className="list-group">
          {pendingStudents.map(student => (
            <div key={student._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <div>
                <p><strong>Name:</strong> {student.studentName}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Faculty:</strong> {student.faculty}</p>
              </div>
              <div>
                <button
                  onClick={() => handleDecision(student._id, "accept")}
                  className="btn btn-success me-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecision(student._id, "decline")}
                  className="btn btn-danger"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReview;
