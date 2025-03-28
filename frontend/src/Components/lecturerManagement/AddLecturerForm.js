import React, { useState } from "react";

const AddLecturerForm = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [DOB, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [nic, setNic] = useState("");
  const [faculty, setFaculty] = useState("Computing");
  const [year, setYear] = useState("1st Year");
  const [modules, setModules] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const moduleData = {
    "1st Year": ["Programming Fundamentals", "Mathematics", "Computer Systems"],
    "2nd Year": ["Data Structures", "Database Systems", "Web Development"],
    "3rd Year": ["Machine Learning", "Software Engineering", "Networking"],
    "4th Year": ["Cyber Security", "Cloud Computing", "AI & Robotics"]
  };

  const handleModuleChange = (event) => {
    const options = event.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setModules(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !phoneNumber || !DOB || !gender || !address || !nic || !year || modules.length === 0) {
      setErrorMessage("Please fill in all fields!");
      return;
    }

    const formData = {
      fullName,
      userName,
      email,
      phoneNumber,
      DOB,
      gender,
      address,
      nic,
      faculty,
      year,
      modules
    };

    try {
      const response = await fetch("http://localhost:5000/api/lecturers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for specific validation errors
        if (errorData.errors && errorData.errors.nic) {
          setErrorMessage(`NIC Error: ${errorData.errors.nic.message}`);
          return;
        }

        throw new Error("Failed to add lecturer");
      }

      const result = await response.json();
      console.log(result);

      // Set success message
      setSuccessMessage("Lecturer added successfully!");

      // Reset form fields
      setFullName("");
      setUserName("");
      setEmail("");
      setPhoneNumber("");
      setDOB("");
      setGender("");
      setAddress("");
      setNic("");
      setFaculty("Computing");
      setYear("1st Year");
      setModules([]);
      setErrorMessage(""); // Clear error message

    } catch (error) {
      console.error("Error adding lecturer:", error);
      setErrorMessage("Server error. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", backgroundColor: "white" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>➕ Add Lecturer</h2>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        {/* User Name */}
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        {/* Phone Number */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        {/* Date of Birth */}
        <input
          type="date"
          value={DOB}
          onChange={(e) => setDOB(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        {/* Gender */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        >
          <option value="">-- Select Gender --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Address */}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        {/* NIC */}
        <input
          type="text"
          placeholder="NIC"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />

        {/* Year Selection */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        >
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        {/* Module Selection */}
        <select
          multiple
          value={modules}
          onChange={handleModuleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc", height: "100px" }}
          required
        >
          {moduleData[year].map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>

        {/* Error Message */}
        {errorMessage && <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>}

        {/* Success Message */}
        {successMessage && <p style={{ color: "green", fontSize: "14px" }}>{successMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "blue", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" }}
        >
          Add Lecturer
        </button>
      </form>
    </div>
  );
};

export default AddLecturerForm;
