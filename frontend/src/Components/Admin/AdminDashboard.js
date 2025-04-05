import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaCog } from "react-icons/fa";

function AdminDashboard() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const dashboardCards = [
        {
            title: "Lecturer Management",
            description: "Manage lecturer details, subjects, and schedules",
            icon: <FaChalkboardTeacher size={40} />,
            color: "linear-gradient(135deg, #3f51b5, #2196f3)",
            path: "/lecturerDashbord"
        },
        {
            title: "Student Management",
            description: "Manage student details, enrollments, and records",
            icon: <FaUserGraduate size={40} />,
            color: "linear-gradient(135deg, #4caf50, #8bc34a)",
            path: "/studentManagement"
        },
        {
            title: "Module Management",
            description: "Manage subjects, schedules, and curriculum",
            icon: <FaBook size={40} />,
            color: "linear-gradient(135deg, #ff9800, #ffc107)",
            path: "/course"
        },
        {
            title: "System Settings",
            description: "Configure system preferences and settings",
            icon: <FaCog size={40} />,
            color: "linear-gradient(135deg, #9c27b0, #e91e63)",
            path: "/settings"
        }
    ];

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Admin Dashboard</h2>
                <p style={subtitleStyle}>Manage all aspects of the education system</p>
            </div>
            
            <div style={cardsContainerStyle}>
                {dashboardCards.map((card, index) => (
                    <div 
                        key={index} 
                        style={{...cardStyle, background: card.color}}
                        onClick={() => handleNavigation(card.path)}
                    >
                        <div style={cardIconStyle}>
                            {card.icon}
                        </div>
                        <h3 style={cardTitleStyle}>{card.title}</h3>
                        <p style={cardTextStyle}>{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '50px'
};

const titleStyle = {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '10px',
    fontWeight: '600'
};

const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    margin: '0'
};

const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    padding: '10px'
};

const cardStyle = {
    borderRadius: '12px',
    padding: '30px 20px',
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
};

cardStyle[':hover'] = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
};

const cardIconStyle = {
    marginBottom: '20px',
    opacity: '0.9'
};

const cardTitleStyle = {
    fontSize: '1.3rem',
    margin: '0 0 10px 0',
    fontWeight: '500'
};

const cardTextStyle = {
    fontSize: '0.95rem',
    margin: '0',
    opacity: '0.9'
};

export default AdminDashboard;