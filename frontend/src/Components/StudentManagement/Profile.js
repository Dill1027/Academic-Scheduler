import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/student/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        navigate("/login"); // Redirect to login if unauthorized
      }
    };

    fetchStudent();
  }, [id, navigate]);

  if (!student) return <p>Loading student data...</p>;

  return (
    <div>
      <h2>Student Profile</h2>
      <p><strong>Name:</strong> {student.studentName}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Specialization:</strong> {student.specialization}</p>
      <p><strong>Registration Number:</strong> {student.registrationNumber}</p>
      <p><strong>Year:</strong> {student.year}</p>
      <p><strong>Module:</strong> {student.module || "Not assigned"}</p>
      <p><strong>Status:</strong> {student.status}</p>
    </div>
  );
};

export default Profile;
