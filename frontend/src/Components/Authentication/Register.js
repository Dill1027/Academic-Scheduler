import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'New Student',  // Default role
    department: '',
    subject: '',
    adminCode: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);

      console.log(response.data.msg);
      window.alert('Registration successful! You can now log in.');

      // Redirect based on the role after registration
      if (formData.role === 'New Student' || formData.role === 'Current Student') {
        navigate('/student-login');
      } else if (formData.role === 'Lecturer') {
        navigate('/lecturer-login');
      } else if (formData.role === 'Admin') {
        navigate('/userbases');
      }
    } catch (err) {
      console.error("Error registering", err.response?.data || err.message);
      window.alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="card p-4 shadow" onSubmit={handleRegister}>
            <h2 className="text-center mb-4">Register</h2>

            <div className="form-group mb-3">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Name" 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Email" 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Password" 
                required 
              />
            </div>

            <div className="form-group mb-3">
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className="form-control"
              >
                <option value="New Student">New Student</option>
                <option value="Current Student">Current Student</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {formData.role === 'Lecturer' && (
              <>
                <div className="form-group mb-3">
                  <input 
                    type="text" 
                    name="department" 
                    value={formData.department || ''} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="Department" 
                  />
                </div>
                <div className="form-group mb-3">
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject || ''} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="Subject" 
                  />
                </div>
              </>
            )}

            {formData.role === 'Admin' && (
              <div className="form-group mb-3">
                <input 
                  type="text" 
                  name="adminCode" 
                  value={formData.adminCode || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="Admin Code" 
                />
              </div>
            )}

            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
