import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Navbar/footer";
import AddLectureForm from "../lecturerManagement/AddLecturerForm";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Swal from 'sweetalert2'; // Add this import at the top

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
        const response = await axios.get("http://localhost:6001/api/lecturers/gender-distribution");
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
      // Show loading alert
      Swal.fire({
        title: 'Generating Report',
        text: 'Please wait while we generate your report...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.get('http://localhost:6001/api/lecturers/download-report', {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      // Close loading alert
      Swal.close();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lecturer-report-${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Report has been downloaded successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to download report. Please try again.',
      });
      console.error("Error downloading report:", error);
    }
  };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: Object.keys(genderData).map(gender => {
      return gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : 'Unknown';
    }),
    datasets: [
      {
        label: "Lecturers Gender Distribution",
        data: Object.values(genderData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
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
        formatter(value, context) {
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
          label(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Styles
  const navButtonStyle = {
    backgroundColor: "#3b82f6", // Modern blue color
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.1)",
    textTransform: "capitalize",
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
    backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  };

  const addButtonStyle = {
    padding: "12px 28px",
    backgroundColor: "#1a237e",
    color: "white",
    border: "none", 
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(26, 35, 126, 0.2)",
    display: "inline-flex", // Changed from flex to inline-flex
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "10px",
    minWidth: "200px", // Added minimum width
    backgroundImage: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
  };

  const cardStyle = {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "30px", // Increased padding
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "30px auto",
    display: "flex", // Added display flex
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
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
    padding: "40px", // Increased padding
    borderRadius: "16px", // Increased border radius
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Enhanced shadow
    width: "95%", // Increased width
    maxWidth: "1000px", // Increased max width
    maxHeight: "95vh", // Increased height
    overflowY: "auto",
    position: "relative"
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1a237e", // Changed to dark blue
          padding: "15px 30px",
          color: "white",
          boxShadow: "0 4px 12px rgba(26, 35, 126, 0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>Lecturer Dashboard</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button 
            onClick={() => navigate("/home")} 
            style={navButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.3)";
              e.target.style.backgroundImage = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.1)";
              e.target.style.backgroundImage = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
            }}
          >Home</button>
          <button 
            onClick={() => navigate("/lectureview")} 
            style={navButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.3)";
              e.target.style.backgroundImage = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.1)";
              e.target.style.backgroundImage = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
            }}
          >Lecturers</button>
          <button onClick={() => navigate("/students")} style={navButtonStyle}>Student List</button>
          <button onClick={handleDownloadReport} style={navButtonStyle}>Lecture Details Report</button>
          <button onClick={() => navigate("/reviews")} style={navButtonStyle}>Student Reviews</button>
          <button onClick={() => navigate("/userbase")} style={{ ...navButtonStyle, backgroundColor: "#dc3545" }}>Logout</button>
        </div>
      </div>

      {/* Add New Lecture Button */}
      <div style={cardStyle}>
        <button 
          onClick={() => setAddLectureOpen(true)} 
          style={addButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#283593";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(26, 35, 126, 0.3)";
            e.target.style.backgroundImage = "linear-gradient(135deg, #283593 0%, #1a237e 100%)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#1a237e";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(26, 35, 126, 0.2)";
            e.target.style.backgroundImage = "linear-gradient(135deg, #1a237e 0%, #283593 100%)";
          }}
        >
          Add New Lecturer
        </button>
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
            <button 
              onClick={() => setAddLectureOpen(false)} 
              style={closeButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
                e.target.style.color = "#111";
                e.target.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.color = "#666";
                e.target.style.transform = "rotate(0deg)";
              }}
            >
              ×
            </button>
            <AddLectureForm closeModal={() => setAddLectureOpen(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LecturerDashboard;