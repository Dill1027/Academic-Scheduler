import React, { useState, useEffect } from "react";

const LecturerDetails = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingLecturer, setEditingLecturer] = useState(null); // For holding the lecturer to be edited
  const [formData, setFormData] = useState({}); // For the form fields

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/lecturers/all");
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
    // Find the lecturer by ID and set the form data to its current values
    const lecturerToUpdate = lecturers.find(lecturer => lecturer._id === lecturerId);
    setEditingLecturer(lecturerToUpdate);
    setFormData(lecturerToUpdate);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure 'modules' is an array before sending the request
    const formattedFormData = { 
      ...formData,
      modules: Array.isArray(formData.modules) ? formData.modules : formData.modules.split(",").map(item => item.trim()) 
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/lecturers/${editingLecturer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedFormData)
      });
  
      if (!response.ok) throw new Error("Failed to update lecturer");
  
      const updatedLecturer = await response.json();
  
      setLecturers(lecturers.map((lecturer) =>
        lecturer._id === updatedLecturer._id ? updatedLecturer : lecturer
      ));
  
      setEditingLecturer(null); // Close the update form
    } catch (error) {
      setErrorMessage("Error updating lecturer");
      console.error(error);
    }
  };
  

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <h2>Lecturer Details</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              {['Lecturer ID', 'Full Name', 'Username', 'Email', 'Phone Number', 'Faculty', 'Year', 
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
              <tr><TableCell colSpan="13">Loading...</TableCell></tr>
            ) : lecturers.length === 0 ? (
              <tr><TableCell colSpan="13">No lecturers available</TableCell></tr>
            ) : (
              lecturers.map((lecturer) => (
                <tr key={lecturer._id}>
                  <TableCell>{lecturer.lecturerId}</TableCell> {/* Lecturer ID */}
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

        {/* Update Lecturer Form */}
        {editingLecturer && (
          <div style={{ marginTop: "20px" }}>
            <h3>Update Lecturer</h3>
            <form onSubmit={handleFormSubmit}>
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Username:
                <input
                  type="text"
                  name="userName"
                  value={formData.userName || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Faculty:
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Year:
                <input
                  type="text"
                  name="year"
                  value={formData.year || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Modules:
                <input
                  type="text"
                  name="modules"
                  value={formData.modules || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Gender:
                <input
                  type="text"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label>
                NIC:
                <input
                  type="text"
                  name="nic"
                  value={formData.nic || ""}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerDetails;
