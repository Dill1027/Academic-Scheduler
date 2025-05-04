import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import Footer from '../Navbar/footer';

const StudentReview = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/student/pending');
      setPendingStudents(response.data);
    } catch (error) {
      console.error('Error fetching pending students:', error);
      if (error.response) {
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        console.error('Network Error - No response received');
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (studentId, status) => {
    try {
      await axios.patch(`http://localhost:6001/api/student/${studentId}`, { status });
      fetchPendingStudents(); // Refresh list after update
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Student Registration Reviews</h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Registration Number</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentName}</td>
                  <td>{student.registrationNumber}</td>
                  <td>{student.email}</td>
                  <td>{student.specialization}</td>
                  <td>
                    <button 
                      className="btn btn-success me-2"
                      onClick={() => handleStatusUpdate(student._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate(student._id, 'declined')}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentReview;
