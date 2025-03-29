import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaUserPlus } from "react-icons/fa";

const LoginSelection = () => {
  const navigate = useNavigate();

  // Login options with icons from react-icons
  const loginOptions = [
    {
      name: "New Student",
      icon: <FaUserPlus size={48} />,
      registerPath: "/form",
      showLogin: false,
      showRegister: true,
      color: "#4dabf7"
    },
    {
      name: "Current Student",
      icon: <FaUserGraduate size={48} />,
      loginPath: "/login",
      showLogin: true,
      showRegister: false,
      color: "#37b24d"
    },
    {
      name: "Lecturer",
      icon: <FaChalkboardTeacher size={48} />,
      loginPath: "/login",
      showLogin: true,
      showRegister: false,
      color: "#f59f00"
    },
    {
      name: "Admin",
      icon: <FaUserShield size={48} />,
      loginPath: "/login",  // Using same login path for now
      registerPath: "/register",  // Using same register path for now
      showLogin: true,
      showRegister: true,
      color: "#e64980"
    }
  ];

  return (
    <div className="container text-center py-5">
      <h2 className="fw-bold text-primary mb-4">Select Your Login</h2>
      <div className="row justify-content-center">
        {loginOptions.map((option, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div 
              className="card shadow p-3 text-center cursor-pointer"
              style={{ 
                borderTop: `4px solid ${option.color}`,
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = ""}
            >
              <div 
                className="mx-auto mb-3" 
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${option.color}, ${lightenColor(option.color, 20)})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}
              >
                {option.icon}
              </div>
              <h5 className="fw-bold">{option.name}</h5>

              {option.showLogin && (
                <button
                  className="btn btn-primary mt-2 w-100"
                  onClick={() => navigate(option.loginPath)}
                  style={{
                    background: option.color,
                    border: "none",
                    padding: "8px 0",
                    fontWeight: "500"
                  }}
                >
                  Login
                </button>
              )}

              {option.showRegister && (
                <button
                  className="btn btn-outline-secondary mt-2 w-100"
                  onClick={() => navigate(option.registerPath)}
                  style={{
                    color: option.color,
                    borderColor: option.color,
                    padding: "8px 0",
                    fontWeight: "500"
                  }}
                >
                  Register
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to lighten colors
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
}

export default LoginSelection;