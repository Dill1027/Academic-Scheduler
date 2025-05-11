import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaChalkboardTeacher, FaUserShield, FaUserGraduate, FaSignInAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "New Student",
    department: "",
    subject: "",
    adminCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.role === "Admin" && !formData.adminCode) {
      setError("Admin code is required for admin registration");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You can now login to your account',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          if (formData.role === "New Student" || formData.role === "Current Student") {
            navigate("/studentlogin");
          } else {
            navigate("/login");
          }
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          (err.message === 'Network Error' ? 
                            'Cannot connect to server. Please check your connection or try again later.' :
                            "Registration failed. Please check your details and try again.");
                            
      setError(errorMessage);
      
      if (err.message === 'Network Error') {
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Cannot connect to the server. This might be due to CORS issues or server being offline.',
          showConfirmButton: true
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch(formData.role) {
      case "Lecturer": return <FaChalkboardTeacher className="me-2" />;
      case "Admin": return <FaUserShield className="me-2" />;
      default: return <FaUserGraduate className="me-2" />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FaUser className="me-2" />
            Create Account
          </h2>
          <p style={subtitleStyle}>Join our community today</p>
        </div>

        {error && (
          <div style={errorStyle}>{error}</div>
        )}

        <form onSubmit={handleRegister} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="name" style={labelStyle}>
              <FaUser style={iconStyle} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              <FaEnvelope style={iconStyle} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              <FaLock style={iconStyle} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your password"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="role" style={labelStyle}>
              {getRoleIcon()}
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="New Student">New Student</option>
              <option value="Current Student">Current Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formData.role === "Lecturer" && (
            <>
              <div style={inputGroupStyle}>
                <label htmlFor="department" style={labelStyle}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Enter department"
                />
              </div>
              <div style={inputGroupStyle}>
                <label htmlFor="subject" style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Enter subject"
                />
              </div>
            </>
          )}

          {formData.role === "Admin" && (
            <div style={inputGroupStyle}>
              <label htmlFor="adminCode" style={labelStyle}>Admin Code</label>
              <input
                type="text"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter admin code"
              />
            </div>
          )}

          <div style={buttonGroupStyle}>
            <button 
              type="submit" 
              style={submitButtonStyle}
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <>
                  <FaSignInAlt style={{ marginRight: '8px' }} />
                  Register
                </>
              )}
            </button>
          </div>
        </form>

        <div style={footerStyle}>
          <p style={footerTextStyle}>
            Already have an account?{' '}
            <a 
              href="#" 
              style={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  padding: '20px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '600px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  backdropFilter: 'blur(8px)',
  padding: '40px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '600',
  color: '#1976d2',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#7f8c8d',
  margin: '0',
};

const formStyle = {
  width: '100%',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#34495e',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  marginRight: '10px',
  color: '#3498db',
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  fontSize: '16px',
  border: '1px solid #90caf9',
  borderRadius: '6px',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};

inputStyle[':focus'] = {
  outline: 'none',
  borderColor: '#3498db',
  boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
};

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '30px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
  background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
};

submitButtonStyle[':hover'] = {
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
};

submitButtonStyle[':disabled'] = {
  backgroundColor: '#95a5a6',
  cursor: 'not-allowed',
};

const errorStyle = {
  backgroundColor: '#fdecea',
  color: '#d32f2f',
  padding: '12px 15px',
  borderRadius: '6px',
  marginBottom: '20px',
  fontSize: '14px',
  textAlign: 'center',
};

const footerStyle = {
  marginTop: '30px',
  textAlign: 'center',
};

const footerTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: '0',
};

const linkStyle = {
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'all 0.3s ease',
};

linkStyle[':hover'] = {
  textDecoration: 'underline',
};

export default Register;