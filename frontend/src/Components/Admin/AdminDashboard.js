import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function AdminDashboard() {
    const navigate = useNavigate();

    const particlesInit = async (engine) => {
        await loadFull(engine);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const dashboardCards = [
        {
            title: "Lecturer Management",
            description: "Manage lecturer details, subjects, and schedules",
            icon: <FaChalkboardTeacher size={40} />,
            color: "linear-gradient(135deg, #3498db, #2c3e50)",
            hoverColor: "linear-gradient(135deg, #2c3e50, #3498db)",
            path: "/lecturerDashbord"
        },
        {
            title: "Student Management",
            description: "Manage student details, enrollments, and records",
            icon: <FaUserGraduate size={40} />,
            color: "linear-gradient(135deg, #2ecc71, #27ae60)",
            hoverColor: "linear-gradient(135deg, #27ae60, #2ecc71)",
            path: "/studentManagement"
        },
        {
            title: "Module Management",
            description: "Manage subjects, schedules, and curriculum",
            icon: <FaBook size={40} />,
            color: "linear-gradient(135deg, #f39c12, #e74c3c)",
            hoverColor: "linear-gradient(135deg, #e74c3c, #f39c12)",
            path: "/course"
        },
        {
            title: "Timetable Management",
            description: "Create and manage class schedules and timetables",
            icon: <FaCog size={40} />,
            color: "linear-gradient(135deg, #9b59b6, #8e44ad)",
            hoverColor: "linear-gradient(135deg, #8e44ad, #9b59b6)",
            path: "/timetable"
        }
    ];

    return (
        <div style={containerStyle}>
            {/* Particles Background */}
            <div style={particlesContainer}>
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={{
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: "repulse"
                                }
                            }
                        },
                        particles: {
                            color: {
                                value: "#ffffff"
                            },
                            links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.3,
                                width: 1
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: "bounce",
                                random: true,
                                speed: 1,
                                straight: false
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800
                                },
                                value: 60  // Increased number of particles
                            },
                            opacity: {
                                value: 0.7  // Increased opacity
                            },
                            shape: {
                                type: "circle"
                            },
                            size: {
                                value: { min: 1, max: 5 }  // Increased size range
                            }
                        },
                        detectRetina: true,
                        background: {
                            color: "#0a192f"  // Dark blue background for particles
                        }
                    }}
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={headerStyle}
            >
                <h2 style={titleStyle}>Admin Dashboard</h2>
                <p style={subtitleStyle}>Manage all aspects of the education system</p>
            </motion.div>
            
            <div style={cardsContainerStyle}>
                {dashboardCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div 
                            className="dashboard-card"
                            style={{
                                ...cardStyle, 
                                background: card.color,
                                '--hover-color': card.hoverColor
                            }}
                            onClick={() => handleNavigation(card.path)}
                        >
                            <div style={cardIconStyle}>
                                {card.icon}
                            </div>
                            <h3 style={cardTitleStyle}>{card.title}</h3>
                            <p style={cardTextStyle}>{card.description}</p>
                            <div style={cardHoverStyle}>
                                <span>View Details</span>
                                <div style={arrowIcon}>&rarr;</div>
                            </div>
                            <div style={cardOverlayStyle}></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* For animations to work, we need to inject the keyframes */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .dashboard-card {
                    background-size: 200% 200%;
                    animation: gradientShift 8s ease infinite;
                }
                
                .dashboard-card:hover {
                    background: var(--hover-color) !important;
                    background-size: 200% 200%;
                    animation: gradientShift 8s ease infinite;
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    minHeight: '100vh',
    zIndex: 1,
    background: 'linear-gradient(135deg, #0a192f, #172a45)' // Added dark gradient background
};

const particlesContainer = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundColor: 'transparent'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '50px',
    position: 'relative',
    zIndex: 1
};

const titleStyle = {
    fontSize: '3rem',
    color: '#ffffff',
    marginBottom: '15px',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    background: 'linear-gradient(90deg, #64ffda, #a8ff78)', // Changed to teal-green gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
};

const subtitleStyle = {
    fontSize: '1.3rem',
    color: 'rgba(255,255,255,0.8)',
    margin: '0',
    fontWeight: '300'
};

const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    padding: '20px',
    position: 'relative',
    zIndex: 1
};

const cardStyle = {
    borderRadius: '16px',
    padding: '30px 25px',
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1
};

const cardOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
    opacity: 0.6,
    transition: 'opacity 0.3s ease',
    zIndex: -1
};

const cardHoverStyle = {
    position: 'absolute',
    bottom: '20px',
    left: 0,
    right: 0,
    textAlign: 'center',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease',
    zIndex: 2,
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '200px',
    margin: '0 auto',
    padding: '8px 16px',
    fontSize: '1rem',
    fontWeight: '500'
};

const arrowIcon = {
    marginLeft: '8px',
    transition: 'transform 0.3s ease'
};

const cardIconStyle = {
    marginBottom: '20px',
    opacity: '0.9',
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
};

const cardTitleStyle = {
    fontSize: '1.5rem',
    margin: '0 0 15px 0',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const cardTextStyle = {
    fontSize: '1rem',
    margin: '0',
    opacity: '0.9',
    transition: 'all 0.3s ease',
    marginBottom: '15px'
};

export default AdminDashboard;