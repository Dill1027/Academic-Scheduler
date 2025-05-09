import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaBook, FaIdCard, FaCalendarAlt, FaTasks, FaCheckCircle, FaEdit } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Profile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Student not found" : "Failed to fetch student data");
        }

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError(error.message || "Unable to connect to the server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <ClipLoader color="#1E88E5" size={50} />
        <p style={loadingTextStyle}>Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <h2 style={errorHeaderStyle}>Error Loading Profile</h2>
        <p style={errorTextStyle}>{error}</p>
        <button 
          style={errorButtonStyle}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={notFoundContainerStyle}>
        <h2 style={notFoundHeaderStyle}>Student Not Found</h2>
        <p style={notFoundTextStyle}>The requested student profile could not be found.</p>
        <button 
          style={notFoundButtonStyle}
          onClick={() => navigate("/students")}
        >
          Back to Students List
        </button>
      </div>
    );
  }

  const statusColor = student.status === "approved" ? "#4CAF50" : student.status === "pending" ? "#FFC107" : "#F44336";

  return (
    <div style={containerStyle}>
      <div style={profileCardStyle}>
        <div style={profileHeaderStyle}>
          <div style={avatarStyle}>
            <FaUser size={48} color="#fff" />
          </div>
          <h2 style={nameStyle}>{student.studentName}</h2>
          <div style={{...statusStyle, backgroundColor: statusColor}}>
            {student.status.toUpperCase()}
          </div>
        </div>

        <div style={detailsContainerStyle}>
          <div style={detailSectionStyle}>
            <h3 style={sectionHeaderStyle}><FaUser style={iconStyle} /> Personal Information</h3>
            <div style={detailItemStyle}>
              <span style={labelStyle}><FaIdCard style={iconStyle} /> Registration Number:</span>
              <span style={valueStyle}>{student.registrationNumber}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}><FaEnvelope style={iconStyle} /> Email:</span>
              <span style={valueStyle}>{student.email}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}><FaCalendarAlt style={iconStyle} /> Year:</span>
              <span style={valueStyle}>Year {student.year}</span>
            </div>
          </div>

          <div style={detailSectionStyle}>
            <h3 style={sectionHeaderStyle}><FaBook style={iconStyle} /> Academic Information</h3>
            <div style={detailItemStyle}>
              <span style={labelStyle}>Specialization:</span>
              <span style={valueStyle}>{student.specialization}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={labelStyle}><FaTasks style={iconStyle} /> Module:</span>
              <span style={valueStyle}>{student.modules || "Not assigned"}</span>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button 
              style={editButtonStyle}
              onClick={() => navigate(`/profileUpdate/${student._id}`)}
            >
              <FaEdit style={{ marginRight: 8 }} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center", 
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  padding: "20px",
};

const profileCardStyle = {
  width: "100%",
  maxWidth: "800px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "15px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
  overflow: "hidden",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
};

const profileHeaderStyle = {
  background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
  color: "white",
  padding: "30px",
  textAlign: "center",
  position: "relative",
};

const avatarStyle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto 15px",
  border: "3px solid rgba(255, 255, 255, 0.3)",
};

const nameStyle = {
  fontSize: "28px",
  fontWeight: "600",
  margin: "10px 0 5px",
};

const statusStyle = {
  display: "inline-block",
  padding: "5px 15px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "10px",
  color: "white",
};

const detailsContainerStyle = {
  padding: "30px",
};

const detailSectionStyle = {
  marginBottom: "30px",
};

const sectionHeaderStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #eee",
  display: "flex",
  alignItems: "center",
};

const detailItemStyle = {
  display: "flex",
  marginBottom: "15px",
  alignItems: "center",
};

const labelStyle = {
  fontWeight: "600",
  color: "#555",
  width: "200px",
  display: "flex",
  alignItems: "center",
};

const valueStyle = {
  color: "#333",
  flex: 1,
};

const iconStyle = {
  marginRight: "10px",
  color: "#1E88E5",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "30px",
};

const editButtonStyle = {
  backgroundColor: "#42a5f5",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 25px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(66, 165, 245, 0.2)",
};

editButtonStyle[":hover"] = {
  backgroundColor: "#1565C0",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

// Loading state styles
const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f8f9fa",
};

const loadingTextStyle = {
  marginTop: "20px",
  fontSize: "18px",
  color: "#555",
};

// Error state styles
const errorContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f8f9fa",
  padding: "20px",
  textAlign: "center",
};

const errorHeaderStyle = {
  fontSize: "24px",
  color: "#d32f2f",
  marginBottom: "15px",
};

const errorTextStyle = {
  fontSize: "16px",
  color: "#555",
  marginBottom: "25px",
  maxWidth: "500px",
};

const errorButtonStyle = {
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "12px 25px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

errorButtonStyle[":hover"] = {
  backgroundColor: "#b71c1c",
};

// Not found state styles
const notFoundContainerStyle = {
  ...errorContainerStyle,
};

const notFoundHeaderStyle = {
  ...errorHeaderStyle,
  color: "#1E88E5",
};

const notFoundTextStyle = {
  ...errorTextStyle,
};

const notFoundButtonStyle = {
  ...errorButtonStyle,
  backgroundColor: "#1E88E5",
};

notFoundButtonStyle[":hover"] = {
  backgroundColor: "#1565C0",
};

export default Profile;