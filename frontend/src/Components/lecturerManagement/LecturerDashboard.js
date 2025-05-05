import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Navbar/footer";
import AddLectureForm from "../lecturerManagement/AddLecturerForm";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const LecturerDashboard = () => {
  const [isAddLectureOpen, setAddLectureOpen] = useState(false);
  const [genderData, setGenderData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenderDistribution = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/lecturers/gender-distribution");
        if (response.data && response.data.data) {
          const genderCount = response.data.data.reduce((acc, { _id, count }) => {
            acc[_id || 'Unknown'] = count;
            return acc;
          }, {});
          setGenderData(genderCount);
        } else {
          console.error("Invalid data format received:", response.data);
          setGenderData({});
        }
      } catch (error) {
        console.error("Error fetching gender distribution:", error);
        setGenderData({});
      } finally {
        setLoading(false);
      }
    };

    fetchGenderDistribution();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lecturers/download-report', {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lecturer-report-${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: Object.keys(genderData).map(gender => {
      // Capitalize first letter and lowercase the rest
      return gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : 'Unknown';
    }),
    datasets: [
      {
        label: "Lecturers Gender Distribution",
        data: Object.values(genderData),
        backgroundColor: [
          '#FF6384', // Pink
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal
          '#9966FF'  // Purple
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "right",
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      title: { 
        display: true, 
        text: "Gender Distribution of Lecturers",
        font: {
          size: 18
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${value}\n(${percentage}%)`;
        },
        color: "#fff",
        font: {
          weight: 'bold',
          size: 14
        },
        textAlign: 'center'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%', // Makes it a donut chart if you want
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#333",
          padding: "15px 30px",
          color: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>Lecturer Dashboard</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => navigate("/home")} style={navButtonStyle}>Home</button>
          <button onClick={() => navigate("/lectureview")} style={navButtonStyle}>Lecturers</button>
          <button onClick={() => navigate("/students")} style={navButtonStyle}>Student List</button>
          <button onClick={handleDownloadReport} style={navButtonStyle}>Lecture Details Report</button>
          <button onClick={() => navigate("/reviews")} style={navButtonStyle}>Student Reviews</button>
          <button onClick={() => navigate("/userbase")} style={{ ...navButtonStyle, backgroundColor: "#dc3545" }}>Logout</button>
        </div>
      </div>

      {/* Add New Lecture Button */}
      <div style={cardStyle}>
        <button onClick={() => setAddLectureOpen(true)} style={addButtonStyle}>Add New Lecturer</button>
      </div>

      {/* Gender Distribution Chart */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Lecturer Gender Distribution</h2>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading gender distribution data...</p>
          </div>
        ) : Object.keys(genderData).length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>No gender distribution data available</p>
          </div>
        ) : (
          <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
            <Pie 
              data={pieChartData} 
              options={pieChartOptions} 
            />
          </div>
        )}
      </div>

      {/* Modal for Add Lecturer */}
      {isAddLectureOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setAddLectureOpen(false)} style={closeButtonStyle}>×</button>
            <AddLectureForm closeModal={() => setAddLectureOpen(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Styles
const navButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  fontSize: "16px",
  '&:hover': {
    backgroundColor: "#0056b3"
  }
};

const addButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  '&:hover': {
    backgroundColor: "#218838"
  }
};

const cardStyle = {
  textAlign: "center",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "800px",
  margin: "30px auto",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  width: "90%",
  maxWidth: "700px",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#333",
  '&:hover': {
    color: "#000"
  }
};

export default LecturerDashboard;