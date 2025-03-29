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
        const response = await axios.get("http://localhost:5001/api/employees/gender-distribution");
        const genderCount = response.data.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {});

        setGenderData(genderCount);
      } catch (error) {
        console.error("Error fetching gender distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderDistribution();
  }, []);

  const pieChartData = {
    labels: Object.keys(genderData).map(gender => gender.charAt(0).toUpperCase() + gender.slice(1)),
    datasets: [
      {
        label: "Employee Gender Distribution",
        data: Object.values(genderData),
        backgroundColor: ["#FAD006", "#06402B"],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Gender Distribution of Employees" },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return `${value} (${percentage})`;
        },
        color: "#fff",
      },
    },
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
          <button onClick={() => navigate("/lectureview")} style={navButtonStyle}>Lectures</button>
          <button onClick={() => navigate("/students")} style={navButtonStyle}>Student List</button>
          <button onClick={() => navigate("/reviews")} style={navButtonStyle}>Student Reviews</button>
          <button onClick={() => navigate("/adminDashboard")} style={{ ...navButtonStyle, backgroundColor: "#dc3545" }}>Logout</button>
        </div>
      </div>

      {/* Add New Lecture Button */}
      <div style={cardStyle}>
        <button onClick={() => setAddLectureOpen(true)} style={addButtonStyle}>Add New Lecturer</button>
      </div>

      {/* Gender Distribution Chart */}
      <div style={cardStyle}>
        <h3>Gender Distribution of Lecture</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ width: "100%", height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
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
};

export default LecturerDashboard;
