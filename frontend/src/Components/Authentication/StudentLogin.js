import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/logins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("student", JSON.stringify(data.student));
        navigate(`/profile/${data.student._id}`);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FaSignInAlt style={{ marginRight: "10px" }} />
            Student Login
          </h2>
          <p style={subtitleStyle}>Please enter your credentials to access your account</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FaUser style={iconStyle} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="student@example.com"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FaLock style={iconStyle} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              required
            />
          </div>

          <div style={buttonGroupStyle}>
            <button 
              type="submit" 
              style={submitButtonStyle}
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={18} />
              ) : (
                <>
                  <FaSignInAlt style={{ marginRight: "8px" }} />
                  Login
                </>
              )}
            </button>
          </div>
        </form>

        <div style={footerStyle}>
          <p style={footerTextStyle}>
            Don't have an account?{" "}
            <a 
              href="#" 
              style={linkStyle}
              onClick={(e) => {
                e.preventDefault();
                navigate("/form");
              }}
            >
              Sign up
            </a>
          </p>
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
  backgroundColor: "#f5f7fa",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "450px",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: "40px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#2c3e50",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#7f8c8d",
  margin: "0",
};

const formStyle = {
  width: "100%",
};

const inputGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#34495e",
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
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  transition: "border-color 0.3s",
};

inputStyle[":focus"] = {
  outline: "none",
  borderColor: "#3498db",
  boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "30px",
};

const submitButtonStyle = {
  width: "100%",
  padding: "14px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  backgroundColor: "#3498db",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
};

submitButtonStyle[":hover"] = {
  backgroundColor: "#2980b9",
};

submitButtonStyle[":disabled"] = {
  backgroundColor: "#95a5a6",
  cursor: "not-allowed",
};

const errorStyle = {
  backgroundColor: "#fdecea",
  color: "#d32f2f",
  padding: "12px 15px",
  borderRadius: "6px",
  marginBottom: "20px",
  fontSize: "14px",
  textAlign: "center",
};

const footerStyle = {
  marginTop: "30px",
  textAlign: "center",
};

const footerTextStyle = {
  fontSize: "14px",
  color: "#7f8c8d",
  margin: "0",
};

const linkStyle = {
  color: "#3498db",
  textDecoration: "none",
  fontWeight: "500",
};

linkStyle[":hover"] = {
  textDecoration: "underline",
};

export default Login;