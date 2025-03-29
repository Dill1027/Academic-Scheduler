import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {student.status === "Pending" && <p>Your profile is under review.</p>}
      {student.status === "Declined" && <p>Your registration was declined. Please contact admin.</p>}
      {student.status === "Approved" && (
        <>
          <h2>Welcome, {student.studentName}!</h2>
          <p>Faculty: {student.faculty}</p>
          <p>Year: {student.year}</p>
          <p>Email: {student.email}</p>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
