import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Validate Email Format
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.email) {
      validationErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(validationErrors).length === 0) {
      console.log("User Logged In:", formData);
      alert("Login Successful!");
    }

    setErrors(validationErrors);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold">Login</h2>
      <form className="shadow p-4 rounded bg-light" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
