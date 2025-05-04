import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FiDownload, FiRotateCw, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import Navbar from "../Navbar";
import Footer from "../Navbar/footer";

const MySwal = withReactContent(Swal);

const OrganizedCoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const showErrorToast = (message) => {
    MySwal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#f8d7da',
      color: '#721c24',
      iconColor: '#dc3545'
    });
  };

  const showSuccessToast = (message) => {
    MySwal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#d4edda',
      color: '#155724',
      iconColor: '#28a745'
    });
  };

  const showLoadingAlert = () => {
    MySwal.fire({
      title: 'Generating Report',
      html: 'Please wait while we prepare your PDF report...',
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      }
    });
  };

  const fetchAllCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/docs', {
        withCredentials: true
      });
      setCourses(response.data);
      showSuccessToast('Courses loaded successfully');
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again.");
      showErrorToast('Failed to fetch courses');
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

  const generatePDFReport = async () => {
    if (courses.length === 0) {
      showErrorToast('No courses available to generate report');
      return;
    }

    setIsGeneratingPDF(true);
    showLoadingAlert();

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      
      // Header background
      doc.setFillColor(44, 62, 80);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Institution Header with icon
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('ACADEMIC SCHEDULER', pageWidth / 2, 20, { align: 'center' });
      
      // Report Title
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('COURSE MODULES REPORT', pageWidth / 2, 30, { align: 'center' });
      
      // Report Details
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text(`Generated on: ${date}`, pageWidth / 2, 37, { align: 'center' });

      // Prepare data
      const grouped = groupCourses();
      const tableData = [];
      
      Object.entries(grouped).forEach(([year, coursesData]) => {
        Object.entries(coursesData).forEach(([courseName, modules]) => {
          tableData.push([year, courseName, modules.join(', ')]);
        });
      });

      // Main table with alternating row colors
      doc.autoTable({
        head: [['Year', 'Course', 'Modules']],
        body: tableData,
        startY: 50,
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle',
          lineColor: [200, 200, 200],
          lineWidth: 0.2,
          textColor: [60, 60, 60],
          fillColor: [255, 255, 255]
        },
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: 255,
          fontStyle: 'bold',
          lineWidth: 0.3
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 20, fontStyle: 'bold' },
          1: { cellWidth: 40 },
          2: { cellWidth: 'auto' }
        },
        margin: { left: 15, right: 15 },
        tableLineColor: [100, 100, 100],
        tableLineWidth: 0.3,
        didDrawCell: (data) => {
          // Add subtle highlight to first column cells
          if (data.column.index === 0) {
            doc.setFillColor(240, 248, 255);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        }
      });

      // Signature section
      const finalY = doc.lastAutoTable.finalY + 20;
      
      // Divider line
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.5);
      doc.line(40, finalY, pageWidth - 40, finalY);
      
      // Signature labels with icons
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Prepared by: Academic Scheduler', 50, finalY + 10);
      doc.text('Approved by: Department Head', pageWidth - 60, finalY + 10);
      
      // Signature lines
      doc.setDrawColor(100, 100, 100);
      doc.line(50, finalY + 20, 100, finalY + 20);
      doc.line(pageWidth - 100, finalY + 20, pageWidth - 50, finalY + 20);
      
      // Dates
      doc.setFontSize(8);
      doc.text('Date:', 50, finalY + 30);
      doc.text('Date:', pageWidth - 60, finalY + 30);

      // Watermark
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.setFont('helvetica', 'italic');
      doc.text('ACADEMIC', pageWidth / 2, doc.internal.pageSize.getHeight() / 2, { angle: 45, align: 'center' });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`© ${new Date().getFullYear()} Academic Scheduler. All rights reserved.`, 
        pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

      // Save the PDF
      await new Promise(resolve => setTimeout(resolve, 500));
      doc.save(`Course_Modules_Report_${date.replace(/\//g, '-')}.pdf`);
      
      showSuccessToast('PDF report generated successfully!');
    } catch (err) {
      console.error("Error generating PDF:", err);
      showErrorToast('Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
      MySwal.close();
    }
  };

  const groupedCourses = groupCourses();

  return (
    <div>
      <Navbar />
      <div className="organized-courses-container">
        <div className="header-section">
          <div className="title-wrapper">
            <FaGraduationCap className="header-icon" />
            <h2>Course Report</h2>
          </div>
          <button 
            onClick={generatePDFReport}
            className="generate-report-btn"
            disabled={isLoading || courses.length === 0 || isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <FiRotateCw className="spin-animation" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FiDownload />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
        
        {isLoading ? (
          <div className="status-message loading">
            <FiRotateCw className="spin-animation" />
            <span>Loading courses...</span>
          </div>
        ) : error ? (
          <div className="status-message error">
            <FiAlertTriangle />
            <span>{error}</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="status-message no-data">
            <FiInfo />
            <span>No courses found</span>
          </div>
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
                    <tr key={`${year}-${courseName}`} className="hover-animation">
                      {index === 0 && (
                        <td rowSpan={Object.keys(coursesData).length} className="year-cell">
                          <FaChalkboardTeacher className="year-icon" />
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
      </div>

      <style>
        {`
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
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .title-wrapper {
            display: flex;
            align-items: center;
            gap: 0.8rem;
          }

          .header-icon {
            font-size: 2rem;
            color: rgba(94, 112, 85, 0.87);
          }

          h2 {
            color: #2c3e50;
            margin: 0;
            font-size: 1.8rem;
            font-weight: 600;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }

          .generate-report-btn {
            background: linear-gradient(to right, rgba(94, 112, 85, 0.87), #5e7055);
            color: white;
            border: none;
            padding: 0.8rem 1.8rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }

          .generate-report-btn:hover:not(:disabled) {
            background: linear-gradient(to right, #5e7055, rgba(94, 112, 85, 0.87));
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }

          .generate-report-btn:active:not(:disabled) {
            transform: translateY(0);
          }

          .generate-report-btn:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            opacity: 0.7;
          }

          .spin-animation {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .status-message {
            text-align: center;
            padding: 2rem;
            font-size: 1.1rem;
            border-radius: 12px;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .loading {
            color: #3498db;
            background-color: rgba(52, 152, 219, 0.1);
            border: 1px dashed #3498db;
          }

          .error {
            color: #e74c3c;
            background-color: rgba(231, 76, 60, 0.1);
            border: 1px dashed #e74c3c;
          }

          .no-data {
            color: #7f8c8d;
            background-color: rgba(127, 140, 141, 0.1);
            border: 1px dashed #7f8c8d;
          }

          .table-wrapper {
            overflow-x: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            background-color: white;
            margin: 1.5rem 0;
            border: 1px solid #e0e0e0;
          }

          .courses-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            min-width: 600px;
            border-radius: 12px;
            overflow: hidden;
          }

          .courses-table th {
            background: linear-gradient(to right, #2c3e50, #4a6491);
            color: white;
            padding: 1.2rem;
            text-align: left;
            font-weight: 600;
            font-size: 1rem;
            position: sticky;
            top: 0;
          }

          .courses-table td {
            padding: 1rem;
            border-bottom: 1px solid #ecf0f1;
            vertical-align: top;
            font-size: 0.95rem;
            transition: all 0.2s ease;
          }

          .courses-table tr:last-child td {
            border-bottom: none;
          }

          .hover-animation:hover {
            transform: translateX(5px);
            box-shadow: 5px 0 15px -5px rgba(0,0,0,0.1);
          }

          .year-cell {
            width: 120px;
            font-weight: 600;
            color: #3498db;
            background-color: #f8fbff;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .year-icon {
            color: #5e7055;
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

          /* Zebra striping */
          .courses-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .header-section {
              flex-direction: column;
              align-items: flex-start;
              padding: 1rem;
            }

            h2 {
              font-size: 1.5rem;
            }

            .generate-report-btn {
              width: 100%;
              justify-content: center;
            }

            .courses-table th,
            .courses-table td {
              padding: 0.8rem;
            }

            .year-cell {
              width: 90px;
            }

            .course-cell {
              width: 150px;
            }
          }

          @media (max-width: 480px) {
            .organized-courses-container {
              padding: 0 0.5rem;
            }

            .courses-table th,
            .courses-table td {
              padding: 0.6rem;
              font-size: 0.85rem;
            }

            .year-cell {
              width: 80px;
            }
          }
        `}
      </style>
      <Footer />
    </div>
  );
};

export default OrganizedCoursesTable;