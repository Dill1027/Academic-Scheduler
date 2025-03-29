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

  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Banner Section */}
      <section className="hero-banner position-relative overflow-hidden">
        <div className="hero-overlay"></div>
        <img
          src="/img/home.jpg"
          alt="Students"
          className="hero-image"
        />
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            className="hero-title"
            variants={itemVariants}
          >
            The Future Awaits You!
          </motion.h2>
          <motion.p 
            className="hero-subtitle"
            variants={itemVariants}
          >
            Plan your academic journey efficiently
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <button
              className="cta-button"
              onClick={() => navigate("/userbase")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <FaArrowRight className="ms-2" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">About Our Institution</h2>
            <div className="about-content">
              <div className="about-icon">
                <FaUniversity size={48} />
              </div>
              <p className="about-text">
                We are a leading non-state higher education institute approved by the
                University Grants Commission (UGC). We are members of the Association
                of Commonwealth Universities (ACU), as well as the International
                Association of Universities (IAU).
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Faculties Section */}
      <section className="faculties-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Faculties</h2>
            <div className="faculties-grid">
              {faculties.map((faculty, index) => (
                <motion.div 
                  key={index}
                  className="faculty-card"
                  whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="faculty-icon">
                    {faculty.icon}
                  </div>
                  <h3 className="faculty-name">{faculty.name}</h3>
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