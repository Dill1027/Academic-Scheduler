import React, { useState, useEffect } from "react";

const LecturerDetailsView = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/api/lecturers/all");
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

  return (
    <div className="lecturer-container">
      <div className="lecturer-card">
        <h2 className="lecturer-title">Lecturer Details</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="table-wrapper">
          <table className="lecturer-table">
            <thead>
              <tr>
                {['Lecturer ID', 'Full Name', 'Username', 'Email', 'Phone Number', 'Faculty', 'Year', 'Modules']
                  .map(header => (
                    <th key={header}>
                      {header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" className="loading-cell">Loading...</td></tr>
              ) : lecturers.length === 0 ? (
                <tr><td colSpan="8" className="empty-cell">No lecturers available</td></tr>
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

      <style jsx>{`
        .lecturer-container {
          display: flex;
          justify-content: center;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }
        
        .lecturer-card {
          max-width: 1200px;
          width: 100%;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .lecturer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .lecturer-title {
          text-align: center;
          color: #2C3E50;
          margin-bottom: 1.5rem;
          font-size: 2rem;
          font-weight: 600;
          position: relative;
          padding-bottom: 0.5rem;
        }
        
        .lecturer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #3498db, #2ecc71);
          border-radius: 2px;
        }
        
        .error-message {
          color: #e74c3c;
          text-align: center;
          padding: 0.5rem;
          background: rgba(231, 76, 60, 0.1);
          border-radius: 4px;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .table-wrapper {
          overflow-x: auto;
          border-radius: 8px;
          margin-top: 1.5rem;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        }
        
        .lecturer-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 0.95rem;
        }
        
        .lecturer-table thead {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .lecturer-table th {
          padding: 1rem;
          text-align: center;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
          position: relative;
        }
        
        .lecturer-table th:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 60%;
          width: 1px;
          background: rgba(255, 255, 255, 0.3);
        }
        
        .lecturer-table tr {
          transition: all 0.2s ease;
        }
        
        .lecturer-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        .lecturer-table tr:hover {
          background-color: #e9f7fe;
          transform: scale(1.005);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .lecturer-table td {
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
          transition: all 0.2s ease;
        }
        
        .loading-cell, .empty-cell {
          padding: 1.5rem;
          text-align: center;
          font-style: italic;
          color: #7f8c8d;
          background: #f8f9fa;
        }
        
        @media (max-width: 768px) {
          .lecturer-card {
            padding: 1rem;
          }
          
          .lecturer-table th, 
          .lecturer-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .lecturer-container {
            padding: 1rem;
          }
          
          .lecturer-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LecturerDetailsView;