import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaSearch, FaFilePdf, FaUserGraduate, FaIdCard, FaEnvelope, FaPhone, FaBook, FaCalendarAlt } from 'react-icons/fa';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:6001/api/student');
        setStudents(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      searchTerm === '' ||
      (student.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = 
      !specializationFilter || 
      student.specialization === specializationFilter;
    
    const matchesYear = 
      !yearFilter || 
      (student.year?.toString() === yearFilter);
    
    return matchesSearch && matchesSpecialization && matchesYear;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title section
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Student List Report', 105, 15, { align: 'center' });
    
    // University logo or header
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('University Management System', 105, 25, { align: 'center' });
    
    // Filters and date
    let filters = [];
    if (searchTerm) filters.push(`Search: ${searchTerm}`);
    if (specializationFilter) filters.push(`Specialization: ${specializationFilter}`);
    if (yearFilter) filters.push(`Year: ${yearFilter}`);
    
    if (filters.length > 0) {
      doc.text(`Filters Applied: ${filters.join(', ')}`, 14, 35);
    }
    
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);
    
    // Table data
    const tableData = filteredStudents.map(student => [
      student.studentName || 'N/A',
      student.registrationNumber || 'N/A',
      student.email || 'N/A',
      student.phoneNumber || 'N/A',
      student.specialization || 'N/A',
      student.year ? `Year ${student.year}` : 'N/A'
    ]);
    
    // Generate table
    doc.autoTable({
      head: [
        ['Name', 'Reg Number', 'Email', 'Phone', 'Specialization', 'Year']
      ],
      body: tableData,
      startY: 55,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'left',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { top: 60 }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    doc.save('student-list-report.pdf');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading student data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center">
          <div className="flex-grow-1">{error}</div>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <FaUserGraduate className="me-2" />
              Student Directory
            </h3>
            <span className="badge bg-light text-primary fs-6">
              {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
            </span>
          </div>
        </div>

        <div className="card-body">
          <div className="row g-3 mb-4">
            {/* Search Input */}
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or registration number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Specialization Filter */}
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaBook />
                </span>
                <select 
                  onChange={(e) => setSpecializationFilter(e.target.value)} 
                  value={specializationFilter} 
                  className="form-select"
                >
                  <option value="">All Specializations</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Interactive Media">Interactive Media</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
            </div>
            
            {/* Year Filter */}
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaCalendarAlt />
                </span>
                <select 
                  onChange={(e) => setYearFilter(e.target.value)} 
                  value={yearFilter} 
                  className="form-select"
                >
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>

            {/* PDF Export Button */}
            <div className="col-md-2 d-grid">
              <button 
                onClick={generatePDF}
                className="btn btn-danger"
                disabled={filteredStudents.length === 0}
              >
                <FaFilePdf className="me-2" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>
                    <FaUserGraduate className="me-2" />
                    Student Name
                  </th>
                  <th>
                    <FaIdCard className="me-2" />
                    Reg Number
                  </th>
                  <th>
                    <FaEnvelope className="me-2" />
                    Email
                  </th>
                  <th>
                    <FaPhone className="me-2" />
                    Phone
                  </th>
                  <th>
                    <FaBook className="me-2" />
                    Specialization
                  </th>
                  <th>
                    <FaCalendarAlt className="me-2" />
                    Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="cursor-pointer" onClick={() => {/* Add click handler if needed */}}>
                      <td className="fw-semibold">{student.studentName || 'N/A'}</td>
                      <td>{student.registrationNumber || 'N/A'}</td>
                      <td>
                        <a href={`mailto:${student.email}`} className="text-decoration-none">
                          {student.email || 'N/A'}
                        </a>
                      </td>
                      <td>
                        {student.phoneNumber ? (
                          <a href={`tel:${student.phoneNumber}`} className="text-decoration-none">
                            {student.phoneNumber}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td>{student.specialization || 'N/A'}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {student.year ? `Year ${student.year}` : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="d-flex flex-column align-items-center">
                        <FaSearch className="text-muted mb-2" size={48} />
                        <h5 className="text-muted">No students found</h5>
                        <p className="text-muted">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {filteredStudents.length} of {students.length} students
            </small>
            <small className="text-muted">
              Last updated: {new Date().toLocaleString()}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;