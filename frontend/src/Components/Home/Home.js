import React from "react";
import { Link } from "react-router-dom";
import { FaUserCheck, FaUsers, FaBoxOpen, FaShoppingCart, FaTruck } from "react-icons/fa"; // Added new icons
import BackIm from "./img/bk.jpg";

function Home() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", margin: "0", padding: "0", backgroundColor: "#f9f9f9" }}>
      {/* Header Section */}
      <header style={headerStyle}>
        <h1 style={{ margin: "0", fontSize: "24px" }}>Apparel Manufacturing Management System</h1>
      </header>

      {/* Main Content */}
      <div style={{ padding: "30px 5%", textAlign: "center" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "40px" }}>
          <img src={BackIm} alt="Background" style={imageStyle} />
          <p style={welcomeText}>Welcome to the Apparel Manufacturing Management System!</p>
        </div>

        {/* Dashboard Overview */}
        <div>
          <h2 style={sectionHeading}>Quick Overview</h2>
          <div style={dashboardContainer}>
            {/* Attendance Card */}
            <div style={cardStyle}>
              <FaUserCheck size={40} style={iconStyle} />
              <h3>Attendance</h3>
              <p><strong>Total Present:</strong> 120</p>
              <p><strong>Total Absent:</strong> 8</p>
              <Link to="/AttendanceDash" style={linkStyle}>View Details</Link>
            </div>

            {/* Employees Card */}
            <div style={cardStyle}>
              <FaUsers size={40} style={iconStyle} />
              <h3>Employees</h3>
              <p><strong>Total Employees:</strong> 50</p>
              <Link to="/employeeDash" style={linkStyle}>View Details</Link>
            </div>

            {/* Inventory Card */}
            <div style={cardStyle}>
              <FaBoxOpen size={40} style={iconStyle} />
              <h3>Inventory</h3>
              <p><strong>Items Available:</strong> 200</p>
              <Link to="/inventoryDash" style={linkStyle}>View Details</Link>
            </div>

            {/* Orders Card */}
            <div style={cardStyle}>
              <FaShoppingCart size={40} style={iconStyle} />
              <h3>Orders</h3>
              <p><strong>New Orders Today:</strong> 10</p>
              <p><strong>Total Orders:</strong> 500</p>
              <Link to="/orderDash" style={linkStyle}>View Details</Link>
            </div>

            {/* Suppliers Card */}
            <div style={cardStyle}>
              <FaTruck size={40} style={iconStyle} />
              <h3>Suppliers</h3>
              <p><strong>Total Suppliers:</strong> 20</p>
              <p><strong>Active Suppliers:</strong> 15</p>
              <Link to="/SupplierDash" style={linkStyle}>View Details</Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{ marginTop: "50px", textAlign: "left", maxWidth: "600px", margin: "auto" }}>
          <h2 style={sectionHeading}>Recent Activity</h2>
          <div style={activityContainer}>
            <p>✔ Attendance marked for 15 employees today.</p>
            <p>✔ 10 new orders placed today.</p>
            <p>✔ 5 items added to inventory.</p>
            <p>✔ 2 new suppliers added.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        <p>© 2025 Apparel Manufacturing Management System</p>
      </footer>
    </div>
  );
}

// Styles
const headerStyle = {
  backgroundColor: "#4f55c3",
  color: "white",
  padding: "15px 20px",
  textAlign: "center",
  fontSize: "20px",
  fontWeight: "600",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
};

const imageStyle = {
  width: "100%",
  maxWidth: "800px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
};

const welcomeText = {
  fontSize: "24px",
  fontWeight: "600",
  marginTop: "20px",
  color: "#333",
};

const sectionHeading = {
  fontSize: "26px",
  marginBottom: "20px",
  color: "#4f55c3",
  fontWeight: "700",
};

const dashboardContainer = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "white",
  color: "#333",
  padding: "20px",
  borderRadius: "10px",
  width: "270px",
  textAlign: "center",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
};

const iconStyle = {
  color: "#4f55c3",
  marginBottom: "10px",
};

const linkStyle = {
  display: "inline-block",
  marginTop: "15px",
  color: "white",
  textDecoration: "none",
  backgroundColor: "#4f55c3",
  padding: "8px 15px",
  borderRadius: "5px",
  fontSize: "14px",
  fontWeight: "600",
  transition: "background 0.3s",
};

const activityContainer = {
  backgroundColor: "#f4f4f4",
  padding: "15px",
  borderRadius: "8px",
  fontSize: "18px",
  color: "#333",
};

const footerStyle = {
  marginTop: "50px",
  backgroundColor: "#4f55c3",
  color: "white",
  padding: "15px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "500",
};

export default Home;
