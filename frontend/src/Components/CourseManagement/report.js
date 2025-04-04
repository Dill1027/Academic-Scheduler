import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navbar from "../Navbar";
import Footer from "../Navbar/footer";

const OrganizedCoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/docs');
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const groupCourses = () => {
    const yearOrder = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    const grouped = {};
    
    yearOrder.forEach(year => {
      grouped[year] = {};
    });

    courses.forEach(course => {
      if (!grouped[course.year][course.course]) {
        grouped[course.year][course.course] = [];
      }
      grouped[course.year][course.course].push(course.moduleName);
    });

    return grouped;
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    
    // Page border
    doc.setDrawColor(100, 100, 100);
    doc.rect(margin, margin, pageWidth - margin*2, doc.internal.pageSize.getHeight() - margin*2);
    
    // Institution Header
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('ACADEMIC SCHEDULER', pageWidth / 2, 20, { align: 'center' });
    
    // Report Title
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text('COURSE MODULES REPORT', pageWidth / 2, 30, { align: 'center' });
    
    // Report Details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, pageWidth / 2, 37, { align: 'center' });

    // Prepare data
    const grouped = groupCourses();
    const tableData = [];
    
    Object.entries(grouped).forEach(([year, coursesData]) => {
      Object.entries(coursesData).forEach(([courseName, modules]) => {
        tableData.push([year, courseName, modules.join(', ')]);
      });
    });

    // Main table
    doc.autoTable({
      head: [['Year', 'Course', 'Modules']],
      body: tableData,
      startY: 45,
      styles: {
        cellPadding: 4,
        fontSize: 10,
        valign: 'middle',
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
        textColor: [60, 60, 60]
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: 'bold',
        lineWidth: 0.3
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold' },
        1: { cellWidth: 40 },
        2: { cellWidth: 'auto' }
      },
      margin: { left: 15, right: 15 },
      tableLineColor: [100, 100, 100],
      tableLineWidth: 0.3
    });

    // Signature section
    const finalY = doc.lastAutoTable.finalY + 20;
    
    // Divider line
    doc.setDrawColor(150, 150, 150);
    doc.line(40, finalY, pageWidth - 40, finalY);
    
    // Signature labels
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Prepared by:', 50, finalY + 10);
    doc.text('Approved by:', pageWidth - 60, finalY + 10);
    
    // Signature lines
    doc.setDrawColor(100, 100, 100);
    doc.line(50, finalY + 20, 100, finalY + 20);
    doc.line(pageWidth - 100, finalY + 20, pageWidth - 50, finalY + 20);
    
    // Dates
    doc.setFontSize(8);
    doc.text('Date:', 50, finalY + 30);
    doc.text('Date:', pageWidth - 60, finalY + 30);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`© ${new Date().getFullYear()} Academic Institute Name. All rights reserved.`, 
      pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

    doc.save(`Course_Modules_Report_${date.replace(/\//g, '-')}.pdf`);
  };

  const groupedCourses = groupCourses();

  return (
    <div>
        <Navbar />
    <div className="organized-courses-container">
       
      <div className="header-section">
         <h2>Course Report</h2>
        <button 
          onClick={generatePDFReport}
          className="generate-report-btn mt-3 mb-3"
          disabled={isLoading || courses.length === 0}
        >
          Generate Report
        </button>

       
      </div>
      
      {isLoading ? (
        <div className="status-message loading">Loading courses...</div>
      ) : error ? (
        <div className="status-message error">{error}</div>
      ) : courses.length === 0 ? (
        <div className="status-message no-data">No courses found</div>
      ) : (
        <div className="table-wrapper">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Course</th>
                <th>Modules</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedCourses).map(([year, coursesData]) => (
                Object.entries(coursesData).map(([courseName, modules], index) => (
                  <tr key={`${year}-${courseName}`}>
                    {index === 0 && (
                      <td rowSpan={Object.keys(coursesData).length} className="year-cell">
                        {year}
                      </td>
                    )}
                    <td className="course-cell">{courseName}</td>
                    <td className="modules-cell">
                      {modules.join(', ')}
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .organized-courses-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-header {
          color: #2c3e50;
          margin: 0;
          font-size: 1.8rem;
        }

        .generate-report-btn {
          background-color:rgba(94, 112, 85, 0.87);
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .generate-report-btn:hover:not(:disabled) {
          background-color: #1a252f;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .generate-report-btn:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .status-message {
          text-align: center;
          padding: 2rem;
          font-size: 1.1rem;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .loading {
          color: #3498db;
          background-color: #ebf5fb;
        }

        .error {
          color: #e74c3c;
          background-color: #fdedec;
        }

        .no-data {
          color: #7f8c8d;
          background-color: #f8f9f9;
        }

        .table-wrapper {
          overflow-x: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          background-color: white;
        }

        .courses-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .courses-table th {
          background-color: #2c3e50;
          color: white;
          padding: 1.2rem;
          text-align: left;
          font-weight: 600;
          font-size: 1rem;
        }

        .courses-table td {
          padding: 1rem;
          border-bottom: 1px solid #ecf0f1;
          vertical-align: top;
          font-size: 0.95rem;
        }

        .courses-table tr:hover {
          background-color: #f8f9fa;
        }

        .year-cell {
          width: 100px;
          font-weight: 600;
          color: #3498db;
          background-color: #f0f8ff;
        }

        .course-cell {
          width: 200px;
          font-weight: 500;
          color: #2c3e50;
        }

        .modules-cell {
          min-width: 300px;
          color: #34495e;
        }

        @media (max-width: 768px) {
          .header-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .table-header {
            font-size: 1.5rem;
          }

          .generate-report-btn {
            width: 100%;
            justify-content: center;
          }

          .courses-table th,
          .courses-table td {
            padding: 0.9rem 0.7rem;
          }

          .year-cell {
            width: 80px;
          }

          .course-cell {
            width: 150px;
          }
        }
      `}</style>
    </div>
    <Footer />
    </div>
  );
};

export default OrganizedCoursesTable;