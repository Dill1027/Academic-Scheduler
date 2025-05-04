import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaUserShield } from "react-icons/fa";

const LoginSelection = () => {
  const navigate = useNavigate();

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesLoaded = async (container) => {
    // Optional callback when particles are loaded
  };

  const loginOptions = [
    {
      name: "New Student",
      icon: <FaUserGraduate size={50} />,
      registerPath: "/form",
      showLogin: false,
      showRegister: true,
      color: "#4e79a7"
    },
    {
      name: "Current Student",
      icon: <FaUserGraduate size={50} style={{ color: "#f28e2b" }} />,
      loginPath: "/studentlogin",
      registerPath: "/register",
      showLogin: true,
      showRegister: false,
      color: "#f28e2b"
    },
    {
      name: "Lecturer",
      icon: <FaChalkboardTeacher size={50} />,
      loginPath: "/login",
      showLogin: true,
      showRegister: false,
      color: "#e15759"
    },
    {
      name: "Admin",
      icon: <FaUserShield size={50} />,
      loginPath: "/login",
      registerPath: "/register",
      showLogin: true,
      showRegister: true,
      color: "#76b7b2"
    },
  ];

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a237e, #283593, #3949ab)',
      overflow: 'hidden',
      padding: '20px',
      color: 'white'
    }}>
      {/* Particles Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
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
                value: 40
              },
              opacity: {
                value: 0.5
              },
              shape: {
                type: "circle"
              },
              size: {
                value: { min: 1, max: 3 }
              }
            },
            detectRetina: true
          }}
        />
      </div>

      <div className="container text-center py-5" style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 
          className="fw-bold mb-4"
          style={{
            position: 'relative',
            display: 'inline-block',
            paddingBottom: '10px',
            color: 'white',
            fontSize: '2.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Select Your Login
          <span style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, white, transparent)',
            backgroundSize: '200% 100%',
            animation: 'shine 3s infinite'
          }}></span>
        </motion.h2>

        <div className="row justify-content-center">
          {loginOptions.map((option, index) => (
            <motion.div 
              key={index} 
              className="col-md-3 col-sm-6 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <motion.div 
                className="card p-3 text-center"
                style={{
                  background: `rgba(255, 255, 255, 0.1)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${option.color}`,
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  minHeight: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: `0 15px 30px ${option.color}40`
                }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${option.color} 0%, ${option.color}80 100%)`,
                  borderRadius: '50%',
                  padding: '15px',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 15px ${option.color}80`
                }}>
                  <div style={{
                    color: 'white',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}>
                    {option.icon}
                  </div>
                </div>
                
                <h5 className="fw-bold" style={{ 
                  color: 'white',
                  position: 'relative',
                  display: 'inline-block',
                  paddingBottom: '5px',
                  marginTop: '15px',
                  fontSize: '1.5rem',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}>
                  {option.name}
                  <span style={{
                    content: '',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    background: 'white',
                    transition: 'width 0.3s ease'
                  }}></span>
                </h5>

                <div style={{ marginTop: 'auto' }}>
                  {option.showLogin && (
                    <motion.button
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        zIndex: 1,
                        background: `linear-gradient(45deg, ${option.color}, ${option.color}80)`,
                        color: 'white',
                        width: '100%',
                        padding: '12px',
                        marginTop: '15px',
                        fontSize: '1.1rem'
                      }}
                      whileHover={{ 
                        y: -3, 
                        boxShadow: `0 5px 15px ${option.color}40`,
                        scale: 1.03
                      }}
                      onClick={() => navigate(option.loginPath)}
                    >
                      Login
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.3s ease',
                        zIndex: -1
                      }}></span>
                    </motion.button>
                  )}

                  {option.showRegister && (
                    <motion.button
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        zIndex: 1,
                        background: `linear-gradient(45deg, ${option.color}, ${option.color}80)`,
                        color: 'white',
                        width: '100%',
                        padding: '12px',
                        marginTop: '15px',
                        fontSize: '1.1rem'
                      }}
                      whileHover={{ 
                        y: -3, 
                        boxShadow: `0 5px 15px ${option.color}40`,
                        scale: 1.03
                      }}
                      onClick={() => navigate(option.registerPath)}
                    >
                      Register
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.3s ease',
                        zIndex: -1
                      }}></span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes shine {
            0% {
              background-position: -100% 0;
            }
            100% {
              background-position: 100% 0;
            }
          }

          .card:hover::before {
            opacity: 1;
          }

          .card:hover .icon-container {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 0.3);
          }

          .card:hover img {
            transform: rotate(5deg);
          }

          .card:hover h5 span {
            width: 50%;
          }

          button:hover span {
            transform: translateX(0);
          }

          @media (max-width: 768px) {
            .card {
              margin-bottom: 20px;
              min-height: 300px;
            }
            
            .icon-container {
              width: 100px;
              height: 100px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginSelection;