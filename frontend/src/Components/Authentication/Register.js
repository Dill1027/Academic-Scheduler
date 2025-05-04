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
        "http://localhost:6001/api/auth/register",
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
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
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        "Registration failed. Please check your details and try again."
      );
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

          {/* Conditional rendering for lecturer fields */}
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

          {/* Admin code field */}
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

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: '20px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '40px',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '600',
  color: '#2c3e50',
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
  border: '1px solid #ddd',
  borderRadius: '6px',
  transition: 'border-color 0.3s',
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
  backgroundColor: '#3498db',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

submitButtonStyle[':hover'] = {
  backgroundColor: '#2980b9',
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
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: '500',
};

linkStyle[':hover'] = {
  textDecoration: 'underline',
};

export default Register;