import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaUniversity, FaGraduationCap, FaBook, FaLaptopCode } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Navbar/footer";

const Home = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const faculties = [
    { name: "Information Technology", icon: <FaLaptopCode size={32} /> },
    { name: "Software Engineering", icon: <FaLaptopCode size={32} /> },
    { name: "Interactive Media", icon: <FaLaptopCode size={32} /> },
    { name: "Cyber Security", icon: <FaLaptopCode size={32} /> },
    { name: "Data Science", icon: <FaLaptopCode size={32} /> },
    { name: "Information Systems Engineering", icon: <FaLaptopCode size={32} /> },
    { name: "Computer Systems & Network Engineering", icon: <FaLaptopCode size={32} /> },
    { name: "Artificial Intelligence", icon: <FaLaptopCode size={32} /> }
  ];

  const stats = [
    { value: "5000+", label: "Students", icon: <FaGraduationCap size={24} /> },
    { value: "200+", label: "Courses", icon: <FaBook size={24} /> },
    { value: "50+", label: "Lecturers", icon: <FaUniversity size={24} /> }
  ];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      backgroundColor: "#f8f9fa",
      color: "#333",
      lineHeight: 1.6,
      scrollBehavior: "smooth"
    }}>
      <Navbar />
      
      {/* Hero Banner Section with Parallax Effect */}
      <section style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        maxHeight: "1200px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        isolation: "isolate"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(74,107,175,0.85) 0%, rgba(23,42,85,0.9) 100%)",
          zIndex: 1,
          mixBlendMode: "multiply"
        }}></div>
        
        {/* Animated Background Elements */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background: "url('/img/home.jpg') center/cover no-repeat",
          backgroundAttachment: "fixed",
          filter: "brightness(0.7)",
          transform: "translateZ(0)"
        }}></div>
        
        {/* Floating Circles */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 2,
          animation: "float 8s ease-in-out infinite"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 2,
          animation: "float 10s ease-in-out infinite 2s"
        }}></div>
        
        <motion.div 
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            color: "white",
            padding: "0 20px",
            maxWidth: "1200px",
            margin: "0 auto",
            backdropFilter: "blur(2px)"
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 800,
              marginBottom: "1.5rem",
              background: "linear-gradient(90deg, #ffffff, #e0e0e0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.2,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            variants={itemVariants}
          >
            Shape Your <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>Digital Future</span>
          </motion.h2>
          <motion.p 
            style={{
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              marginBottom: "2.5rem",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: 0.9,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)"
            }}
            variants={itemVariants}
          >
            Innovative education for the next generation of tech leaders and digital creators
          </motion.p>
          
          <motion.div 
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}
            variants={itemVariants}
          >
            <motion.button
              style={{
                padding: "16px 36px",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                boxShadow: "0 4px 15px rgba(42, 74, 138, 0.4)",
                position: "relative",
                overflow: "hidden",
                zIndex: 1
              }}
              onClick={() => navigate("/userbase")}
              whileHover={{ 
                transform: "translateY(-3px)",
                boxShadow: "0 7px 20px rgba(42, 74, 138, 0.5)"
              }}
              whileTap={{ 
                transform: "translateY(1px)",
                boxShadow: "0 2px 10px rgba(42, 74, 138, 0.4)"
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>
                Get Started <FaArrowRight style={{ marginLeft: "8px" }} />
              </span>
              <span style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #2a4a8a 0%, #4a6baf 100%)",
                opacity: 0,
                transition: "opacity 0.3s ease",
                zIndex: 1
              }}></span>
            </motion.button>
            
            <motion.button
              style={{
                padding: "16px 36px",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "transparent",
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "50px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.3s ease",
                backdropFilter: "blur(5px)"
              }}
              whileHover={{ 
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.5)"
              }}
              whileTap={{ 
                transform: "scale(0.98)"
              }}
              onClick={() => navigate("/blog")}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3
          }}
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div style={{
            width: "24px",
            height: "40px",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.5)",
            position: "relative"
          }}>
            <div style={{
              width: "4px",
              height: "8px",
              borderRadius: "2px",
              background: "white",
              position: "absolute",
              top: "6px",
              left: "50%",
              transform: "translateX(-50%)"
            }}></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)"
        }}></div>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 1
        }}>
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "40px",
              alignItems: "center"
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <div key={index} style={{
                textAlign: "center",
                padding: "30px 20px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "16px",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px"
                }}>
                  <div style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white"
                  }}>
                    {stat.icon}
                  </div>
                  <motion.div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      margin: 0,
                      background: "linear-gradient(90deg, #ffffff, #e0e0e0)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent"
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <p style={{
                    fontSize: "1.2rem",
                    margin: 0,
                    opacity: 0.9,
                    fontWeight: 500
                  }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section with Modern Card */}
      <section style={{
        padding: "100px 0",
        background: "#fff",
        position: "relative"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              textAlign: "center",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: "60px",
              color: "#2c3e50",
              position: "relative",
              display: "inline-block"
            }}>
              <span style={{
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                background: "linear-gradient(90deg, #4a6baf, #2a4a8a)",
                borderRadius: "2px"
              }}></span>
              About Our Institution
            </h2>
            
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "60px",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <motion.div 
                style={{
                  flex: "1 1 500px",
                  position: "relative",
                  perspective: "1000px"
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{
                  background: "linear-gradient(145deg, #ffffff, #f5f7fa)",
                  borderRadius: "20px",
                  padding: "40px",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  transformStyle: "preserve-3d",
                  transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(74,107,175,0.1) 0%, rgba(74,107,175,0) 70%)",
                    zIndex: 0
                  }}></div>
                  <div style={{
                    position: "relative",
                    zIndex: 1
                  }}>
                    <div style={{
                      backgroundColor: "#4a6baf",
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 30px",
                      color: "white",
                      boxShadow: "0 10px 20px rgba(74,107,175,0.3)"
                    }}>
                      <FaUniversity size={48} />
                    </div>
                    <p style={{
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      textAlign: "center",
                      color: "#4a5568",
                      marginBottom: "30px"
                    }}>
                      We are a leading non-state higher education institute approved by the
                      University Grants Commission (UGC). We are members of the Association
                      of Commonwealth Universities (ACU), as well as the International
                      Association of Universities (IAU).
                    </p>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                      flexWrap: "wrap"
                    }}>
                      <button style={{
                        padding: "12px 24px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                      }}>
                        Our History
                      </button>
                      <button 
                        style={{
                          padding: "12px 24px",
                          fontSize: "1rem",
                          fontWeight: 600,
                          background: "transparent",
                          color: "#4a6baf",
                          border: "2px solid #4a6baf",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                        onClick={() => navigate('/team-contact')}
                      >
                        Meet Our Team
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div style={{
                flex: "1 1 500px",
                position: "relative"
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px"
                }}>
                  <motion.div 
                    style={{
                      background: "linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%)",
                      borderRadius: "16px",
                      padding: "30px",
                      color: "white",
                      boxShadow: "0 10px 15px rgba(42,74,138,0.2)",
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      margin: "0 0 10px 0"
                    }}>Mission</h3>
                    <p style={{
                      margin: 0,
                      opacity: 0.9,
                      fontSize: "0.95rem"
                    }}>To provide transformative education that empowers students to excel in the digital age.</p>
                  </motion.div>
                  
                  <motion.div 
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "30px",
                      color: "#2c3e50",
                      boxShadow: "0 10px 15px rgba(0,0,0,0.05)",
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "1px solid rgba(0,0,0,0.05)"
                    }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      margin: "0 0 10px 0",
                      color: "#4a6baf"
                    }}>Vision</h3>
                    <p style={{
                      margin: 0,
                      opacity: 0.9,
                      fontSize: "0.95rem"
                    }}>To be a global leader in technology education and research.</p>
                  </motion.div>
                  
                  <motion.div 
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "30px",
                      color: "#2c3e50",
                      boxShadow: "0 10px 15px rgba(0,0,0,0.05)",
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "1px solid rgba(0,0,0,0.05)"
                    }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      margin: "0 0 10px 0",
                      color: "#4a6baf"
                    }}>Values</h3>
                    <p style={{
                      margin: 0,
                      opacity: 0.9,
                      fontSize: "0.95rem"
                    }}>Innovation, Integrity, Excellence, Collaboration, Diversity</p>
                  </motion.div>
                  
                  <motion.div 
                    style={{
                      background: "linear-gradient(135deg, #2a4a8a 0%, #4a6baf 100%)",
                      borderRadius: "16px",
                      padding: "30px",
                      color: "white",
                      boxShadow: "0 10px 15px rgba(42,74,138,0.2)",
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      margin: "0 0 10px 0"
                    }}>Approach</h3>
                    <p style={{
                      margin: 0,
                      opacity: 0.9,
                      fontSize: "0.95rem"
                    }}>Hands-on learning with industry-aligned curriculum and expert faculty.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Faculties Section with Hover Effects */}
      <section style={{
        padding: "100px 0",
        background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100px",
          background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          zIndex: 1
        }}></div>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 2
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              textAlign: "center",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: "60px",
              color: "#2c3e50",
              position: "relative"
            }}>
              <span style={{
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                background: "linear-gradient(90deg, #4a6baf, #2a4a8a)",
                borderRadius: "2px"
              }}></span>
              Our Specializations
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px"
            }}>
              {faculties.map((faculty, index) => (
                <motion.div 
                  key={index}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "40px 30px",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.03)",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 1
                  }}
                  whileHover={{ 
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "5px",
                    background: "linear-gradient(90deg, #4a6baf, #2a4a8a)"
                  }}></div>
                  
                  <div style={{
                    backgroundColor: "rgba(74,107,175,0.1)",
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                    color: "#4a6baf",
                    transition: "all 0.3s ease"
                  }}>
                    {faculty.icon}
                  </div>
                  
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    margin: "0 0 15px 0",
                    color: "#2c3e50",
                    position: "relative",
                    display: "inline-block"
                  }}>
                    {faculty.name}
                    <span style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: "0",
                      width: "40px",
                      height: "3px",
                      background: "#4a6baf",
                      transition: "all 0.3s ease"
                    }}></span>
                  </h3>
                  
                  <p style={{
                    fontSize: "1rem",
                    color: "#718096",
                    marginBottom: "25px",
                    lineHeight: 1.6
                  }}>
                    Comprehensive program covering all aspects of {faculty.name.toLowerCase()} with industry-standard practices.
                  </p>
                  
                  <button style={{
                    padding: "10px 20px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: "transparent",
                    color: "#4a6baf",
                    border: "2px solid rgba(74,107,175,0.3)",
                    borderRadius: "50px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    Explore Program
                    <FaArrowRight size={14} />
                  </button>
                  
                  <div style={{
                    position: "absolute",
                    bottom: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(74,107,175,0.05) 0%, rgba(74,107,175,0) 70%)",
                    transition: "all 0.5s ease",
                    zIndex: -1
                  }}></div>
                </motion.div>
              ))}
            </div>
            
            <div style={{
              textAlign: "center",
              marginTop: "60px"
            }}>
              <button style={{
                padding: "16px 36px",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 20px rgba(74,107,175,0.3)",
                position: "relative",
                overflow: "hidden"
              }}>
                <span style={{ position: "relative", zIndex: 2 }}>
                  View All Programs
                </span>
                <span style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #2a4a8a 0%, #4a6baf 100%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  zIndex: 1
                }}></span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "100px 20px",
        background: "linear-gradient(135deg, #2c3e50 0%, #4a6baf 100%)",
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "url('/img/pattern.png')",
          opacity: 0.05,
          zIndex: 0
        }}></div>
        
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}>
          <motion.h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: "20px",
              lineHeight: 1.3
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          
          <motion.p
            style={{
              fontSize: "1.2rem",
              marginBottom: "40px",
              opacity: 0.9
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of students who have transformed their careers with our cutting-edge programs.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            <button style={{
              padding: "16px 36px",
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "white",
              color: "#2c3e50",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
            onClick={() => navigate("/login")}
            >
              Apply Now
            </button>
            
            <button style={{
              padding: "16px 36px",
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "transparent",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "50px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.3s ease",
              backdropFilter: "blur(5px)"
            }}>
              Contact Admissions
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      {/* Global Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @media (max-width: 768px) {
          .hero-content h2 {
            font-size: 2.5rem !important;
          }
          
          .hero-content p {
            font-size: 1.2rem !important;
          }
          
          .stats-container {
            flex-direction: column !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;