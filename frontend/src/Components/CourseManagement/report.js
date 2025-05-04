import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../Navbar';

const Coursereport = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:6001/api/docs');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    // Add PDF generation logic
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Course Report</h2>
        {/* Add your report UI here */}
      </div>
    </div>
  );
};

export default Coursereport;