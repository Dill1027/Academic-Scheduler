import React, { useState, useEffect } from "react";
import "./LecturerDetails.css"; // Import the CSS file

const LecturerDetails = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/lecturers/all"); // Changed from 6001 to 5000

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);
        
        const lecturersData = result.data || result;
        
        if (Array.isArray(lecturersData)) {
          setLecturers(lecturersData);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (error) {
        setErrorMessage("Error fetching lecturer data: " + error.message);
        setLecturers([]);
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const TableCell = ({ children, colSpan }) => (
    <td 
      colSpan={colSpan}
      className="table-cell"
    >
      {children || '-'}
    </td>
  );

  return (
    <div className="lecturer-container">
      <div className="lecturer-card">
        <h2 className="lecturer-title">Lecturer Details</h2>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div className="table-container">
          <table className="lecturer-table">
            <thead>
              <tr className="table-header">
                {['Lecturer ID', 'Full Name', 'Username', 'Email', 'Phone', 'Specialization', 'Year', 
                  'Modules', 'DOB', 'Gender', 'Address', 'NIC'].map(header => (
                  <th 
                    key={header} 
                    className="table-header-cell"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <TableCell colSpan="12">
                    <div className="loading-spinner"></div>
                    <span>Loading lecturers...</span>
                  </TableCell>
                </tr>
              ) : lecturers.length === 0 ? (
                <tr>
                  <TableCell colSpan="12" className="empty-message">
                    No lecturers available
                  </TableCell>
                </tr>
              ) : (
                lecturers.map((lecturer) => (
                  <tr key={lecturer._id} className="table-row">
                    <TableCell>{lecturer.lecturerId}</TableCell>
                    <TableCell>{lecturer.fullName}</TableCell>
                    <TableCell>{lecturer.userName}</TableCell>
                    <TableCell>{lecturer.email}</TableCell>
                    <TableCell>{lecturer.phoneNumber}</TableCell>
                    <TableCell>{lecturer.specialization || lecturer.faculty || '-'}</TableCell>
                    <TableCell>{lecturer.year}</TableCell>
                    <TableCell>
                      {Array.isArray(lecturer.modules) 
                        ? lecturer.modules.join(", ") 
                        : lecturer.modules || '-'}
                    </TableCell>
                    <TableCell>
                      {lecturer.DOB ? new Date(lecturer.DOB).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{lecturer.gender || '-'}</TableCell>
                    <TableCell>{lecturer.address || '-'}</TableCell>
                    <TableCell>{lecturer.nic || '-'}</TableCell>
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

export default LecturerDetails;