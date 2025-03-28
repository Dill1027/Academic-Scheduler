import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LecturerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    faculty: "",
    email: "",
    phone: "",
    password: "",
  });

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

    if (!formData.fullName.trim()) {
      validationErrors.fullName = "Full Name is required.";
    }

    if (!formData.dob) {
      validationErrors.dob = "Date of Birth is required.";
    }

    if (!formData.faculty) {
      validationErrors.faculty = "Faculty is required.";
    }

    if (!formData.email) {
      validationErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone Number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      validationErrors.phone = "Phone Number must be 10 digits.";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(validationErrors).length === 0) {
      console.log("Lecturer Registered:", formData);
      alert("Lecturer Registration Successful!");
    }

    setErrors(validationErrors);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold">Lecturer Registration</h2>
      <form className="shadow p-4 rounded bg-light" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>

        {/* Date of Birth */}
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className={`form-control ${errors.dob ? "is-invalid" : ""}`}
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
        </div>

        {/* Faculty */}
        <div className="mb-3">
          <label className="form-label">Faculty</label>
          <select
            className={`form-control ${errors.faculty ? "is-invalid" : ""}`}
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            required
          >
            <option value="">Select Faculty</option>
            <option value="Faculty of Computing">Faculty of Computing</option>
            <option value="Faculty of Business">Faculty of Business</option>
            <option value="Faculty of Engineering">Faculty of Engineering</option>
            <option value="Faculty of Humanities & Sciences">Faculty of Humanities & Sciences</option>
          </select>
          {errors.faculty && <div className="invalid-feedback">{errors.faculty}</div>}
        </div>

        {/* Email */}
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

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        {/* Password */}
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
          Register
        </button>
      </form>
    </div>
  );
};

export default LecturerRegister;
