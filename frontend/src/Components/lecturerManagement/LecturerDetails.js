import React, { useState, useEffect } from "react";
import "./LecturerDetails.css"; // Import the CSS file


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
                  'Modules', 'DOB', 'Gender', 'Address', 'NIC', 'Actions'].map(header => (
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
                  <TableCell colSpan="13">
                    <div className="loading-spinner"></div>
                    <span>Loading lecturers...</span>
                  </TableCell>
                </tr>
              ) : lecturers.length === 0 ? (
                <tr>
                  <TableCell colSpan="13" className="empty-message">
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
                    <TableCell className="action-cell">
                      <button
                        onClick={() => handleUpdate(lecturer)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lecturer._id)}
                        className="delete-button"
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
          <div className="edit-form-container">
            <h3 className="edit-form-title">Edit Lecturer</h3>
            <form onSubmit={handleFormSubmit} className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleFormChange}
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

                <div className="form-group">
                  <label>Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Modules (comma separated)</label>
                  <input
                    type="text"
                    name="modules"
                    value={formData.modules}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>NIC</label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditingLecturer(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
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