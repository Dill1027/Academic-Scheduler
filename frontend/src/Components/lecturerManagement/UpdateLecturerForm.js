import React, { useState } from 'react';
import moduleOptions from './moduleOptions';

const UpdateLecturerForm = ({ lecturer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    lecturerId: lecturer.lecturerId,
    fullName: lecturer.fullName,
    email: lecturer.email,
    phoneNumber: lecturer.phoneNumber,
    DOB: lecturer.DOB ? new Date(lecturer.DOB).toISOString().split('T')[0] : '',
    gender: lecturer.gender,
    address: lecturer.address,
    nic: lecturer.nic,
    specialization: lecturer.specialization,
    year: lecturer.year,
    modules: lecturer.modules || []
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!nicRegex.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format';
    }
    if (!formData.modules || formData.modules.length === 0) {
      newErrors.modules = 'Please select at least one module';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleChange = (module) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <div className="form-group">
        <label>Lecturer ID:</label>
        <input
          type="text"
          name="lecturerId"
          value={formData.lecturerId}
          disabled
        />
      </div>

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

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>NIC:</label>
        <input
          type="text"
          name="nic"
          value={formData.nic}
          onChange={handleChange}
          required
        />
        {errors.nic && <span className="error-message">{errors.nic}</span>}
      </div>

      <div className="form-group">
        <label>Specialization:</label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
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
        <label>Year:</label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {formData.specialization && formData.year && (
        <div className="modules-section">
          <label>Modules:</label>
          <div className="modules-grid">
            {moduleOptions[formData.specialization]?.[formData.year]?.map((module) => (
              <label key={module} className="module-checkbox">
                <input
                  type="checkbox"
                  checked={formData.modules.includes(module)}
                  onChange={() => handleModuleChange(module)}
                />
                <span>{module}</span>
              </label>
            ))}
          </div>
          {errors.modules && <span className="error-message">{errors.modules}</span>}
        </div>
      )}

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
