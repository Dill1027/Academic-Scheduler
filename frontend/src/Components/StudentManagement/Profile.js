import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState([]); // Store related documents
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/${id}`);
        setStudent(response.data);

        // Fetch documents based on student's year & course
        fetchDocuments(response.data.year, response.data.specialization);
      } catch (error) {
        console.error("Error fetching student:", error);
        navigate("/login"); // Redirect to login if error occurs
      }
    };

    const fetchDocuments = async (year, course) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/documents/${year}/${course}`);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
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
      <p><strong>Status:</strong> {student.status}</p>

      <h3>Related Modules & Documents</h3>
      {documents.length > 0 ? (
        <ul>
          {documents.map((doc) => (
            <li key={doc._id}>
              <strong>Module:</strong> {doc.moduleName} <br />
              <strong>Description:</strong> {doc.description} <br />
              <strong>Lectures:</strong> {doc.lectures.join(", ")} <br />
              <strong>Documents:</strong>
              <ul>
                {doc.documents.map((file, index) => (
                  <li key={index}>
                    <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No related documents found.</p>
      )}
    </div>
  );
};

export default Profile;
