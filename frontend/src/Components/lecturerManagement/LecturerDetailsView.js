import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateLecturerForm from "./UpdateLecturerForm";
import "./LecturerDetailsView.css";

const LecturerDetailsView = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/lecturers/all");
        setLecturers(response.data.data || []);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching lecturers:", error);
        setErrorMessage("Failed to load lecturers. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const filteredLecturers = useMemo(() => {
    if (!searchTerm) return lecturers;
    const lowercaseSearch = searchTerm.toLowerCase();
    return lecturers.filter(lecturer => 
      lecturer.lecturerId.toLowerCase().includes(lowercaseSearch) ||
      lecturer.fullName.toLowerCase().includes(lowercaseSearch)
    );
  }, [lecturers, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecturer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/lecturers/${id}`);
        setLecturers(prev => prev.filter(lecturer => lecturer._id !== id));
        toast.success("Lecturer deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete lecturer");
      }
    }
  };

  const handleUpdate = (lecturer) => {
    setEditingLecturer(lecturer);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/lecturers/${editingLecturer._id}`,
        updatedData
      );

      setLecturers(prev =>
        prev.map(lecturer =>
          lecturer._id === editingLecturer._id ? response.data.data : lecturer
        )
      );

      setShowUpdateModal(false);
      setEditingLecturer(null);
      toast.success("Lecturer updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update lecturer");
    }
  };

  return (
    <div className="lecturer-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="lecturer-card">
        <h2 className="lecturer-title">Lecturer Management</h2>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")} 
              className="clear-search-button"
            >
              ×
            </button>
          )}
        </div>

        <div className="lecturer-grid">
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : filteredLecturers.length === 0 ? (
            <div className="no-results">No lecturers found</div>
          ) : (
            filteredLecturers.map((lecturer) => (
              <div key={lecturer._id} className="lecturer-item">
                <div className="lecturer-info">
                  <div className="lecturer-header">
                    <h3>{lecturer.fullName}</h3>
                    <span className="lecturer-badge">{lecturer.lecturerId}</span>
                  </div>
                  <div className="lecturer-details">
                    <div className="detail-group">
                      <i className="bi bi-person"></i>
                      <span>Username: {lecturer.userName}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-envelope"></i>
                      <a href={`mailto:${lecturer.email}`}>{lecturer.email}</a>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-telephone"></i>
                      <a href={`tel:${lecturer.phoneNumber}`}>{lecturer.phoneNumber}</a>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-calendar-date"></i>
                      <span>DOB: {new Date(lecturer.DOB).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-gender-ambiguous"></i>
                      <span>Gender: {lecturer.gender}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-book"></i>
                      <span>Specialization: {lecturer.specialization}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-calendar"></i>
                      <span>Year: {lecturer.year}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-journal-text"></i>
                      <span>Modules: {Array.isArray(lecturer.modules) ? lecturer.modules.join(", ") : lecturer.modules}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-geo-alt"></i>
                      <span>Address: {lecturer.address}</span>
                    </div>
                    <div className="detail-group">
                      <i className="bi bi-person-vcard"></i>
                      <span>NIC: {lecturer.nic}</span>
                    </div>
                  </div>
                </div>
                <div className="lecturer-actions"> 
                  <button 
                    onClick={() => handleUpdate(lecturer)} 
                    className="btn edit-btn"
                  >
                    <i className="bi bi-pencil-square"></i>
                    <span>Update</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(lecturer._id)} 
                    className="btn delete-btn"
                  >
                    <i className="bi bi-trash"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Lecturer</h2>
            <UpdateLecturerForm
              lecturer={editingLecturer}
              onSubmit={handleUpdateSubmit}
              onCancel={() => {
                setShowUpdateModal(false);
                setEditingLecturer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDetailsView;