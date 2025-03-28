import React, { useState, useEffect } from "react";

const LecturerDetails = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/lecturers");
        if (!response.ok) throw new Error("Failed to fetch lecturers");
        const data = await response.json();
        setLecturers(data);
      } catch (error) {
        setErrorMessage("Error fetching lecturer data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const TableCell = ({ children }) => (
    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{children || '-'}</td>
  );

  const handleDelete = async (lecturerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lecturers/${lecturerId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Failed to delete lecturer");
      setLecturers(lecturers.filter(lecturer => lecturer._id !== lecturerId));
    } catch (error) {
      setErrorMessage("Error deleting lecturer");
      console.error(error);
    }
  };

  const handleUpdate = (lecturerId) => {
    // Implementation for update
    console.log(`Update lecturer with ID: ${lecturerId}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <h2>Lecturer Details</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              {['Full Name', 'Username', 'Email', 'Phone Number', 'Faculty', 'Year', 
                'Modules', 'Date of Birth', 'Gender', 'Address', 'NIC', 'Actions']
                .map(header => (
                  <th key={header} style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><TableCell colSpan="12">Loading...</TableCell></tr>
            ) : lecturers.length === 0 ? (
              <tr><TableCell colSpan="12">No lecturers available</TableCell></tr>
            ) : (
              lecturers.map((lecturer) => (
                <tr key={lecturer._id}>
                  <TableCell>{lecturer.fullName}</TableCell>
                  <TableCell>{lecturer.userName}</TableCell>
                  <TableCell>{lecturer.email}</TableCell>
                  <TableCell>{lecturer.phoneNumber}</TableCell>
                  <TableCell>{lecturer.faculty}</TableCell>
                  <TableCell>{lecturer.year}</TableCell>
                  <TableCell>
                    {Array.isArray(lecturer.modules) 
                      ? lecturer.modules.join(", ") 
                      : lecturer.modules}
                  </TableCell>
                  <TableCell>
                    {lecturer.DOB ? new Date(lecturer.DOB).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{lecturer.gender}</TableCell>
                  <TableCell>{lecturer.address}</TableCell>
                  <TableCell>{lecturer.nic}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <button onClick={() => handleUpdate(lecturer._id)}>
                      Update
                    </button>
                    <button onClick={() => handleDelete(lecturer._id)}>
                      Delete
                    </button>
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LecturerDetails;
