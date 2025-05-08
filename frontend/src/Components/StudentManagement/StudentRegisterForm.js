import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // <-- SweetAlert2 import

const InsertStudent = () => {
  const [studentData, setStudentData] = useState({
    studentName: "",
    registrationNumber: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    groupId: "",
    password: "",
  });

  const [groups, setGroups] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/groups")
      .then((response) => setGroups(response.data))
      .catch((error) => console.error("Error fetching groups", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!studentData.studentName.trim()) {
      formErrors.studentName = "Student name is required";
    } else if (!/^[A-Za-z\s]+$/.test(studentData.studentName)) {
      formErrors.studentName = "Student name must contain only letters.";
    }

    const regNumber = studentData.registrationNumber.trim();
    if (!regNumber) {
      formErrors.registrationNumber = "Registration number is required";
    } else {
      const yearPrefix = regNumber.substring(0, 2);
      const isValidYear = ['21', '22', '23', '24'].includes(yearPrefix);
      const isValidFormat = /^\d{8}$/.test(regNumber);

      if (!isValidYear) {
        formErrors.registrationNumber = "Registration number must start with year (21-24)";
      } else if (!isValidFormat) {
        formErrors.registrationNumber = "Registration number must be 8 digits";
      }
    }

    if (!studentData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(studentData.email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    if (studentData.phoneNumber && !/^07\d{8}$/.test(studentData.phoneNumber)) {
      formErrors.phoneNumber = "Phone number must be exactly 10 digits starting with 07.";
    }

    if (!studentData.specialization) {
      formErrors.specialization = "Specialization is required";
    }

    if (!studentData.password) {
      formErrors.password = "Password is required";
    } else if (studentData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/student", {
          ...studentData,
          status: "pending",
        });

        if (response.data.message) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful!",
            text: "Your registration has been submitted for review.",
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            navigate("/userbase");
          }, 2100);
        }
      } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        Swal.fire({
          icon: "error",
          title: "Registration Failed!",
          text: error.response?.data?.error || "Registration failed. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Student Registration
              </h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="studentName" className="form-label">
                      <i className="bi bi-person-fill me-2"></i>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      id="studentName"
                      className={`form-control ${errors.studentName ? "is-invalid" : ""}`}
                      placeholder="John Doe"
                      onChange={handleChange}
                      value={studentData.studentName}
                    />
                    {errors.studentName && (
                      <div className="invalid-feedback d-block">{errors.studentName}</div>
                    )}
                  </div>

                  {/* Registration Number */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="registrationNumber" className="form-label">
                      <i className="bi bi-card-heading me-2"></i>
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      id="registrationNumber"
                      className={`form-control ${errors.registrationNumber ? "is-invalid" : ""}`}
                      placeholder="21XXXXXX"
                      onChange={handleChange}
                      value={studentData.registrationNumber}
                    />
                    {errors.registrationNumber && (
                      <div className="invalid-feedback d-block">{errors.registrationNumber}</div>
                    )}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope-fill me-2"></i>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="student@example.com"
                      onChange={handleChange}
                      value={studentData.email}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      <i className="bi bi-telephone-fill me-2"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                      placeholder="0712345678"
                      onChange={handleChange}
                      value={studentData.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <div className="invalid-feedback d-block">{errors.phoneNumber}</div>
                    )}
                  </div>
                </div>

                {/* Password and Specialization */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••"
                      onChange={handleChange}
                      value={studentData.password}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="specialization" className="form-label">
                      <i className="bi bi-book-fill me-2"></i>
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      id="specialization"
                      className={`form-select ${errors.specialization ? "is-invalid" : ""}`}
                      onChange={handleChange}
                      value={studentData.specialization}
                    >
                      <option value="">Select Specialization</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Interactive Media">Interactive Media</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                    {errors.specialization && (
                      <div className="invalid-feedback d-block">{errors.specialization}</div>
                    )}
                  </div>
                </div>

                {/* Group Assignment */}
                <div className="mb-4">
                  <label htmlFor="groupId" className="form-label">
                    <i className="bi bi-people-fill me-2"></i>
                    Group Assignment
                  </label>
                  <select
                    name="groupId"
                    id="groupId"
                    className="form-select"
                    onChange={handleChange}
                    value={studentData.groupId}
                  >
                    <option value="">Select Group (Optional)</option>
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.groupName} (Members: {group.students?.length || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Register Student
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-muted small">
              <i className="bi bi-info-circle me-2"></i>
              Fields marked with * are required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertStudent;
