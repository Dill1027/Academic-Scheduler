import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCog } from "react-icons/fa";

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
            color: "linear-gradient(135deg, #3498db, #2c3e50)",
            path: "/lecturerDashbord"
        },
        {
            title: "Student Management",
            description: "Manage student details, enrollments, and records",
            icon: <FaUserGraduate size={40} />,
            color: "linear-gradient(135deg, #2ecc71, #27ae60)",
            path: "/studentManagement"
        },
        {
            title: "Module Management",
            description: "Manage subjects, schedules, and curriculum",
            icon: <FaBook size={40} />,
            color: "linear-gradient(135deg, #f39c12, #e74c3c)",
            path: "/course"
        },
        {
            title: "Timetable Management",
            description: "Create and manage class schedules and timetables",
            icon: <FaCog size={40} />,
            color: "linear-gradient(135deg, #9b59b6, #8e44ad)",
            path: "/timetable"
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

            {/* For animations to work, we need to inject the keyframes */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @media (max-width: 768px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .dashboard-title {
                        font-size: 2rem;
                    }
                }
                `}
            </style>
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