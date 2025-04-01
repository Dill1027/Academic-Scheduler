import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaUniversity, FaGraduationCap, FaBook, FaLaptopCode } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    { name: "Cyber Security", icon: <FaLaptopCode size={32} /> },
    { name: "Data Science", icon: <FaLaptopCode size={32} /> },
    { name: "Software Engineering", icon: <FaLaptopCode size={32} /> },
    { name: "Interactive Media", icon: <FaLaptopCode size={32} /> }
  ];

  const stats = [
    { value: "5000+", label: "Students", icon: <FaGraduationCap size={24} /> },
    { value: "200+", label: "Courses", icon: <FaBook size={24} /> },
    { value: "50+", label: "Lecturers", icon: <FaUniversity size={24} /> }
  ];

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f8f9fa",
      color: "#333",
      lineHeight: 1.6
    }}>
      <Navbar />
      
      {/* Hero Banner Section */}
      <section style={{
        position: "relative",
        height: "90vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1
        }}></div>
        <img
          src="/img/home.jpg"
          alt="Students"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0
          }}
        />
        
        <motion.div 
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "white",
            padding: "0 20px",
            maxWidth: "800px"
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
            }}
            variants={itemVariants}
          >
            The Future Awaits You!
          </motion.h2>
          <motion.p 
            style={{
              fontSize: "1.5rem",
              marginBottom: "2rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
            }}
            variants={itemVariants}
          >
            Plan your academic journey efficiently
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <motion.button
              style={{
                padding: "12px 30px",
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#4a6baf",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.3s ease"
              }}
              onClick={() => navigate("/userbase")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <FaArrowRight style={{ marginLeft: "8px" }} />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: "60px 0",
        backgroundColor: "#4a6baf",
        color: "white"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <motion.div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: "30px"
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <div key={index} style={{
                textAlign: "center",
                minWidth: "200px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px"
                }}>
                  {stat.icon}
                  <h3 style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    margin: 0
                  }}>{stat.value}</h3>
                </div>
                <p style={{
                  fontSize: "1.2rem",
                  margin: 0
                }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section style={{
        padding: "80px 0",
        backgroundColor: "#fff"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "40px",
              color: "#2c3e50"
            }}>About Our Institution</h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              flexWrap: "wrap"
            }}>
              <div style={{
                flex: "1",
                minWidth: "300px"
              }}>
                <div style={{
                  backgroundColor: "#f0f4f8",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "#4a6baf"
                }}>
                  <FaUniversity size={48} />
                </div>
                <p style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  textAlign: "center"
                }}>
                  We are a leading non-state higher education institute approved by the
                  University Grants Commission (UGC). We are members of the Association
                  of Commonwealth Universities (ACU), as well as the International
                  Association of Universities (IAU).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Faculties Section */}
      <section style={{
        padding: "80px 0",
        backgroundColor: "#f8f9fa"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "40px",
              color: "#2c3e50"
            }}>Our Faculties</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px"
            }}>
              {faculties.map((faculty, index) => (
                <motion.div 
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "30px",
                    textAlign: "center",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease"
                  }}
                  whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "#4a6baf"
                  }}>
                    {faculty.icon}
                  </div>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    margin: 0,
                    color: "#2c3e50"
                  }}>{faculty.name}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;