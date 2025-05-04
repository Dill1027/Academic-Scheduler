import React, { useState, useEffect, useMemo } from "react";
import "./LecturerDetailsView.css";

const LecturerDetailsView = () => {
  const [lecturers, setLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        
        const response = await fetch("http://localhost:5000/api/lecturers/all");
        if (!response.ok) throw new Error("Failed to fetch lecturers");

        const result = await response.json();
        console.log("Full API Response:", result);

        let lecturersData = [];
        
        if (Array.isArray(result)) {
          lecturersData = result;
        } else if (result.data && Array.isArray(result.data)) {
          lecturersData = result.data;
        } else if (result.lecturers && Array.isArray(result.lecturers)) {
          lecturersData = result.lecturers;
        } else {
          throw new Error("Unexpected API response format");
        }

        const formattedLecturers = lecturersData.map(lecturer => ({
          ...lecturer,
          modules: Array.isArray(lecturer.modules) ? lecturer.modules : [],
          DOB: lecturer.DOB ? new Date(lecturer.DOB).toLocaleDateString() : 'N/A',
          createdAt: lecturer.createdAt ? new Date(lecturer.createdAt).toLocaleString() : 'N/A',
          updatedAt: lecturer.updatedAt ? new Date(lecturer.updatedAt).toLocaleString() : 'N/A'
        }));

        setLecturers(formattedLecturers);
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Failed to load lecturer data. Please try again later.");
        setLecturers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredLecturers = useMemo(() => {
    if (!searchTerm) return lecturers;
    
    const term = searchTerm.toLowerCase();
    return lecturers.filter(lecturer => 
      lecturer.lecturerId.toLowerCase().includes(term) ||
      lecturer.fullName.toLowerCase().includes(term)
    );
  }, [lecturers, searchTerm]);

  const sortedLecturers = useMemo(() => {
    if (!sortConfig.key) return filteredLecturers;

    return [...filteredLecturers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredLecturers, sortConfig]);

  const tableHeaders = [
    { key: 'lecturerId', label: 'Lecturer ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'userName', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'nic', label: 'NIC' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'year', label: 'Year' },
    { key: 'modules', label: 'Modules' },
    { key: 'DOB', label: 'Date of Birth' },
    { key: 'gender', label: 'Gender' },
    { key: 'address', label: 'Address' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' }
  ];

  return (
    <div className="lecturer-container">
      <div className="lecturer-card">
        <h2 className="lecturer-title">Lecturer Details</h2>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {/* Search Bar */}
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

        <div className="table-container">
          <div className="table-scroll">
            <table className="lecturer-table">
              <thead>
                <tr>
                  {tableHeaders.map(header => (
                    <th 
                      key={header.key}
                      onClick={() => requestSort(header.key)}
                      className={sortConfig.key === header.key ? `sort-${sortConfig.direction}` : ''}
                    >
                      {header.label}
                      {sortConfig.key === header.key && (
                        <span className="sort-icon">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="loading-cell">
                      <div className="loading-spinner"></div>
                      Loading lecturer data...
                    </td>
                  </tr>
                ) : sortedLecturers.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="empty-cell">
                      {searchTerm ? "No matching lecturers found" : "No lecturers found in the system"}
                    </td>
                  </tr>
                ) : (
                  sortedLecturers.map((lecturer) => (
                    <tr key={lecturer._id || lecturer.lecturerId}>
                      <td>{lecturer.lecturerId}</td>
                      <td>{lecturer.fullName}</td>
                      <td>{lecturer.userName}</td>
                      <td>{lecturer.email}</td>
                      <td>{lecturer.phoneNumber}</td>
                      <td>{lecturer.nic || '-'}</td>
                      <td>{lecturer.specialization || lecturer.faculty || '-'}</td>
                      <td>{lecturer.year || '-'}</td>
                      <td>{lecturer.modules?.join(", ") || '-'}</td>
                      <td>{lecturer.DOB}</td>
                      <td>{lecturer.gender || '-'}</td>
                      <td>{lecturer.address || '-'}</td>
                      <td>{lecturer.createdAt}</td>
                      <td>{lecturer.updatedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetailsView;