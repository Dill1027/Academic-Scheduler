import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaBook, FaSave, FaArrowLeft } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const ProfileUpdate = () => {
  const { id } = useParams();
  const [student, setStudent] = useState({
    studentName: "",
    email: "",
    specialization: "",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:6001/api/student/${id}`);
        if (!response.ok) throw new Error("Failed to fetch student data");
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:6001/api/student/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      if (!response.ok) throw new Error("Failed to update student");
      navigate(`/profile/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Profile</h2>
      {/* Add your form JSX here */}
    </div>
  );
};

export default ProfileUpdate;