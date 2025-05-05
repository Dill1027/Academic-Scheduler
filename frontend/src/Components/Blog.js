import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Navbar/footer';
import { FaGraduationCap, FaLaptopCode, FaUsers, FaGlobe } from 'react-icons/fa';

// Convert to arrow function component with explicit name
const BlogComponent = () => {
  const sections = [
    {
      title: "Academic Excellence",
      icon: <FaGraduationCap size={40} />,
      content: "Our institution is committed to academic excellence, offering cutting-edge programs in information technology and computing. Our curriculum is regularly updated to reflect industry trends and requirements."
    },
    {
      title: "State-of-the-Art Facilities",
      icon: <FaLaptopCode size={40} />,
      content: "Students have access to modern computer labs, specialized software, and research facilities. Our infrastructure supports both practical learning and innovative research projects."
    },
    {
      title: "Expert Faculty",
      icon: <FaUsers size={40} />,
      content: "Our teaching staff includes industry experts and experienced academics who bring real-world knowledge and research expertise to the classroom."
    },
    {
      title: "Global Recognition",
      icon: <FaGlobe size={40} />,
      content: "We maintain partnerships with leading universities and tech companies worldwide, offering students international exposure and opportunities."
    }
  ];

  const programs = [
    {
      title: "Information Technology",
      description: "Core computing principles with focus on practical applications"
    },
    {
      title: "Software Engineering",
      description: "Software development lifecycle and modern programming practices"
    },
    {
      title: "Cyber Security",
      description: "Network security, ethical hacking, and digital forensics"
    },
    {
      title: "Data Science",
      description: "Data analytics, machine learning, and statistical modeling"
    }
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "80px 20px",
          background: "linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%)",
          color: "white",
          textAlign: "center"
        }}
      >
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "20px"
        }}>About Our Institution</h1>
        <p style={{
          fontSize: "1.2rem",
          maxWidth: "800px",
          margin: "0 auto"
        }}>Shaping the future of technology education</p>
      </motion.section>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 20px"
        }}
      >
        {/* Key Features Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          marginBottom: "60px"
        }}>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center"
              }}
            >
              <div style={{
                color: "#4a6baf",
                marginBottom: "20px"
              }}>{section.icon}</div>
              <h3 style={{
                fontSize: "1.5rem",
                marginBottom: "15px",
                color: "#2c3e50"
              }}>{section.title}</h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6"
              }}>{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Programs Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{
            fontSize: "2rem",
            color: "#2c3e50",
            marginBottom: "30px",
            textAlign: "center"
          }}>Our Programs</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {programs.map((program, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #eee"
                }}
              >
                <h3 style={{
                  fontSize: "1.2rem",
                  color: "#4a6baf",
                  marginBottom: "10px"
                }}>{program.title}</h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.9rem"
                }}>{program.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "60px"
        }}>
          <h2 style={{
            fontSize: "2rem",
            color: "#2c3e50",
            marginBottom: "30px",
            textAlign: "center"
          }}>Our Vision & Mission</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px"
          }}>
            <div>
              <h3 style={{
                color: "#4a6baf",
                marginBottom: "15px"
              }}>Vision</h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6"
              }}>To be a leading institution in technology education, fostering innovation and creating future tech leaders.</p>
            </div>
            <div>
              <h3 style={{
                color: "#4a6baf",
                marginBottom: "15px"
              }}>Mission</h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6"
              }}>To provide quality education that combines theoretical knowledge with practical skills, preparing students for successful careers in technology.</p>
            </div>
          </div>
        </section>
      </motion.div>
      
      <Footer />
    </div>
  );
};

// Export with component name
export default BlogComponent;
