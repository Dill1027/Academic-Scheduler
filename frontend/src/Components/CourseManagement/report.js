import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../Navbar';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FiDownload, FiRotateCw, FiAlertTriangle } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const Coursereport = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCourses();
  }, []);

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

  const showErrorToast = (message) => {
    MySwal.fire({
      icon: 'error',
      title: 'Error!',
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
        {/* Add your report UI here */}
      </div>
    </div>
  );
};

export default Coursereport;