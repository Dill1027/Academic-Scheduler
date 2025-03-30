import React, { useState, useEffect } from "react";

const LecturerDetailsView = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/lecturers/all");
        if (!response.ok) throw new Error("Failed to fetch lecturers");

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (Array.isArray(data)) {
          setLecturers(data);
        } else if (data.lecturers && Array.isArray(data.lecturers)) {
          setLecturers(data.lecturers);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        setErrorMessage("Error fetching lecturer data");
        console.error(error);
        setLecturers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLecturers();
  }, []);

  return (
    <div className="lecturer-container">
      <div className="lecturer-card">
        <h2 className="lecturer-title">Lecturer Details</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="table-wrapper">
          <table className="lecturer-table">
            <thead>
              <tr>
                {["Lecturer ID", "Full Name", "Username", "Email", "Phone Number", "Faculty", "Year", "Modules"].map(
                  (header) => (
                    <th key={header}>{header}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="loading-cell">
                    Loading...
                  </td>
                </tr>
              ) : lecturers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No lecturers available
                  </td>
                </tr>
              ) : (
                lecturers.map((lecturer) => (
                  <tr key={lecturer._id}>
                    <td>{lecturer.lecturerId}</td>
                    <td>{lecturer.fullName}</td>
                    <td>{lecturer.userName}</td>
                    <td>{lecturer.email}</td>
                    <td>{lecturer.phoneNumber}</td>
                    <td>{lecturer.faculty}</td>
                    <td>{lecturer.year}</td>
                    <td>
                      {Array.isArray(lecturer.modules) ? lecturer.modules.join(", ") : lecturer.modules}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetailsView;