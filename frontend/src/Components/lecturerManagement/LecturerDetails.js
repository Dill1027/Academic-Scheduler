import React, { useState, useEffect } from "react";

const LecturerDetails = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    year: "",
    modules: "",
    DOB: "",
    gender: "",
    address: "",
    nic: ""
  });

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/api/lecturers/all");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result); // Debug log
        
        // Handle both response structures
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
      style={{
        border: "1px solid #ddd", 
        padding: "12px", 
        textAlign: "center", 
        fontFamily: "Arial, sans-serif", 
        color: "#333",
        backgroundColor: "#fafafa"
      }}
    >
      {children || '-'}
    </td>
  );

  const handleDelete = async (lecturerId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/lecturers/${lecturerId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete lecturer");
      }
      
      setLecturers(prev => prev.filter(lecturer => lecturer._id !== lecturerId));
    } catch (error) {
      setErrorMessage("Error deleting lecturer: " + error.message);
      console.error(error);
    }
  };

  const handleUpdate = (lecturer) => {
    setEditingLecturer(lecturer);
    setFormData({
      fullName: lecturer.fullName || "",
      userName: lecturer.userName || "",
      email: lecturer.email || "",
      phoneNumber: lecturer.phoneNumber || "",
      specialization: lecturer.specialization || lecturer.faculty || "",
      year: lecturer.year || "",
      modules: Array.isArray(lecturer.modules) ? lecturer.modules.join(", ") : lecturer.modules || "",
      DOB: lecturer.DOB ? new Date(lecturer.DOB).toISOString().split('T')[0] : "",
      gender: lecturer.gender || "",
      address: lecturer.address || "",
      nic: lecturer.nic || ""
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedData = {
        ...formData,
        modules: formData.modules.split(",").map(item => item.trim())
      };

      const response = await fetch(`http://localhost:5001/api/lecturers/${editingLecturer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error("Failed to update lecturer");
      }

      const updatedResult = await response.json();
      const updatedLecturer = updatedResult.data || updatedResult;
      
      setLecturers(prev => 
        prev.map(lecturer => 
          lecturer._id === editingLecturer._id ? updatedLecturer : lecturer
        )
      );
      
      setEditingLecturer(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error updating lecturer: " + error.message);
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1000px", width: "100%", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#2C3E50", marginBottom: "20px" }}>Lecturer Details</h2>
        
        {errorMessage && (
          <div style={{ 
            color: "red", 
            textAlign: "center", 
            padding: "10px", 
            marginBottom: "20px",
            backgroundColor: "#ffeeee",
            borderRadius: "4px"
          }}>
            {errorMessage}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#3498db", color: "#fff" }}>
                {['Lecturer ID', 'Full Name', 'Username', 'Email', 'Phone', 'Specialization', 'Year', 
                  'Modules', 'DOB', 'Gender', 'Address', 'NIC', 'Actions'].map(header => (
                  <th 
                    key={header} 
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center"
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <TableCell colSpan="13">Loading lecturers...</TableCell>
                </tr>
              ) : lecturers.length === 0 ? (
                <tr>
                  <TableCell colSpan="13">No lecturers available</TableCell>
                </tr>
              ) : (
                lecturers.map((lecturer) => (
                  <tr key={lecturer._id} style={{ backgroundColor: "#fff" }}>
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
                    <TableCell style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button
                        onClick={() => handleUpdate(lecturer)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#2ecc71",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lecturer._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {editingLecturer && (
          <div style={{ 
            marginTop: "30px", 
            padding: "20px", 
            backgroundColor: "#fff", 
            borderRadius: "8px", 
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Lecturer</h3>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Interactive Media">Interactive Media</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>Modules (comma separated)</label>
                  <input
                    type="text"
                    name="modules"
                    value={formData.modules}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Date of Birth</label>
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>NIC</label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setEditingLecturer(null)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#95a5a6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerDetails;