import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams(); // Get student ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No student ID provided.");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/student/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError("Error fetching student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!student) return <p>No student data available.</p>;

  return (
    <div>
      <h2>Welcome, {student.studentName}!</h2>
      <p>Specialization: {student.specialization}</p>
      <p>Year: {student.year}</p>
      <p>Email: {student.email}</p>
    </div>
  );
};

export default Profile;
