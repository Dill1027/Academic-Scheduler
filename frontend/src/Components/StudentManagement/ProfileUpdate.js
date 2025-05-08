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
    registrationNumber: "",
    year: "",
    module: "",
    status: "",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/student/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(student)
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Error updating student:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div style={errorButtonGroupStyle}>
          <button 
            style={errorButtonStyle}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button 
            style={backButtonStyle}
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerContainerStyle}>
          <button 
            style={backButtonStyle}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft style={{ marginRight: 8 }} />
            Back
          </button>
          <h2 style={headerStyle}>
            <FaUser style={{ marginRight: 10 }} />
            Update Profile
          </h2>
        </div>

        {error && (
          <div style={errorMessageStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FaUser style={iconStyle} />
              Full Name
            </label>
            <input
              type="text"
              name="studentName"
              value={student.studentName}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FaEnvelope style={iconStyle} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FaPhone style={iconStyle} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={student.phoneNumber}
              onChange={handleChange}
              style={inputStyle}
              pattern="[0-9]{10}"
              title="10-digit phone number"
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <FaBook style={iconStyle} />
              Specialization
            </label>
            <select
              name="specialization"
              value={student.specialization}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Specialization</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Interactive Media">Interactive Media</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
          
          <div style={buttonGroupStyle}>
            <button 
              type="submit" 
              style={submitButtonStyle}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader color="#fff" size={16} />
                  <span style={{ marginLeft: 8 }}>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave style={{ marginRight: 8 }} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
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
  backgroundColor: "#f5f7fa",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: "30px",
};

const headerContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "25px",
  position: "relative",
};

const headerStyle = {
  fontSize: "24px",
  color: "#2c3e50",
  fontWeight: "600",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
};

const formStyle = {
  width: "100%",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#34495e",
  fontSize: "15px",
  display: "flex",
  alignItems: "center",
};

const iconStyle = {
  marginRight: "10px",
  color: "#3498db",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "16px",
  transition: "border-color 0.3s",
};

inputStyle[":focus"] = {
  outline: "none",
  borderColor: "#3498db",
  boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "30px",
};

const submitButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "12px 25px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
};

submitButtonStyle[":hover"] = {
  backgroundColor: "#2980b9",
};

submitButtonStyle[":disabled"] = {
  backgroundColor: "#95a5a6",
  cursor: "not-allowed",
};

const backButtonStyle = {
  backgroundColor: "transparent",
  color: "#7f8c8d",
  border: "none",
  borderRadius: "6px",
  padding: "8px 15px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
  position: "absolute",
  left: "0",
};

backButtonStyle[":hover"] = {
  color: "#34495e",
  backgroundColor: "#f0f0f0",
};

const errorMessageStyle = {
  backgroundColor: "#fdecea",
  color: "#d32f2f",
  padding: "12px 15px",
  borderRadius: "6px",
  marginBottom: "20px",
  fontSize: "15px",
};

// Loading state styles
const loadingContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f5f7fa",
};

const loadingTextStyle = {
  marginTop: "20px",
  fontSize: "18px",
  color: "#7f8c8d",
};

// Error state styles
const errorContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f5f7fa",
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
  margin: "0 10px",
};

errorButtonStyle[":hover"] = {
  backgroundColor: "#b71c1c",
};

const errorButtonGroupStyle = {
  display: "flex",
  justifyContent: "center",
};

export default ProfileUpdate;