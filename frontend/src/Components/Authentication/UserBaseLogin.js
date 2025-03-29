import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginSelection = () => {
  const navigate = useNavigate();

  // Login options with conditions
  const loginOptions = [
    {
      name: "New Student",
      icon: "/icons/newStudent.png",
      registerPath: "/form", // Removed loginPath
      showLogin: false, // Hide login button
      showRegister: true,
    },
    {
      name: "Current Student",
      icon: "/icons/currentStudent.jpeg",
      loginPath: "/studentlogin",
      registerPath: "/register",
      showLogin: true,
      showRegister: false,
    },
    {
      name: "Lecturer",
      icon: "/icons/lect.png",
      loginPath: "/login",
      showLogin: true,
      showRegister: false, // Hide register button
    },
    {
      name: "Admin",
      icon: "/icons/admin.png",
      loginPath: "/login",
      registerPath: "/register",
      showLogin: true,
      showRegister: true,
    },
  ];

  return (
    <div className="container text-center py-5">
      <h2 className="fw-bold text-primary mb-4">Select Your Login</h2>
      <div className="row justify-content-center">
        {loginOptions.map((option, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div className="card shadow p-3 text-center cursor-pointer">
              <img src={option.icon} alt={option.name} className="img-fluid w-50 mx-auto mb-3" />
              <h5 className="fw-bold">{option.name}</h5>

              {/* Show Login button only if enabled */}
              {option.showLogin && (
                <button
                  className="btn btn-primary mt-2 w-100"
                  onClick={() => navigate(option.loginPath)}
                >
                  Login
                </button>
              )}

              {/* Show Register button only if enabled */}
              {option.showRegister && (
                <button
                  className="btn btn-secondary mt-2 w-100"
                  onClick={() => navigate(option.registerPath)}
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

export default LoginSelection;
