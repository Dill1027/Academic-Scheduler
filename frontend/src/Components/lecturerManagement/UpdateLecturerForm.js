import React, { useState } from 'react';

const UpdateLecturerForm = ({ lecturer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: lecturer.fullName,
    userName: lecturer.userName,
    email: lecturer.email,
    phoneNumber: lecturer.phoneNumber,
    DOB: lecturer.DOB,
    gender: lecturer.gender,
    address: lecturer.address,
    nic: lecturer.nic,
    specialization: lecturer.specialization,
    year: lecturer.year,
    modules: lecturer.modules
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      {/* Name */}
      <div className="form-group">
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Other fields - same structure as above */}
      {/* Email */}
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UpdateLecturerForm;
