import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [success, setSuccess] = useState(false);

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

    if (!studentData.registrationNumber.trim()) {
      formErrors.registrationNumber = "Registration number is required";
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

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/student", {
          ...studentData,
          status: "pending",
        });

        if (response.data.message) {
          setSuccess(true);
          setStudentData({
            studentName: "",
            registrationNumber: "",
            email: "",
            phoneNumber: "",
            specialization: "",
            groupId: "",
            password: "",
          });

          setTimeout(() => setSuccess(false), 3000);
        }
      } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        setErrors({
          submit: error.response?.data?.error || "Registration failed. Please try again.",
        });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Registration Form</h2>

      {success && <div className="alert alert-success">Student registered successfully!</div>}
      {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="studentName" className="form-label">Student Name</label>
          <input
            type="text"
            name="studentName"
            id="studentName"
            className="form-control"
            placeholder="Enter student name"
            onChange={handleChange}
            value={studentData.studentName}
          />
          {errors.studentName && <div className="text-danger">{errors.studentName}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
          <input
            type="text"
            name="registrationNumber"
            id="registrationNumber"
            className="form-control"
            placeholder="Enter registration number"
            onChange={handleChange}
            value={studentData.registrationNumber}
          />
          {errors.registrationNumber && <div className="text-danger">{errors.registrationNumber}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            placeholder="Enter email address"
            onChange={handleChange}
            value={studentData.email}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number (optional)</label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            className="form-control"
            placeholder="Enter phone number"
            onChange={handleChange}
            value={studentData.phoneNumber}
          />
          {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            placeholder="Enter password"
            onChange={handleChange}
            value={studentData.password}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="specialization" className="form-label">Specialization</label>
          <select
            name="specialization"
            id="specialization"
            className="form-select"
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
          {errors.specialization && <div className="text-danger">{errors.specialization}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="groupId" className="form-label">Group (optional)</label>
          <select
            name="groupId"
            id="groupId"
            className="form-select"
            onChange={handleChange}
            value={studentData.groupId}
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.groupName} (Members: {group.students.length})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Register Student</button>
      </form>
    </div>
  );
};

export default InsertStudent;
