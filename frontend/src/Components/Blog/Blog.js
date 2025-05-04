import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Navbar/footer';
import { FaGraduationCap, FaLaptopCode, FaUsers, FaGlobe, FaAward, FaHandshake, FaChalkboardTeacher, FaUniversity } from 'react-icons/fa';

const Blog = () => {
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

  const additionalSections = [
    {
      title: "Research Excellence",
      icon: <FaUniversity size={40} />,
      content: "Our institution prioritizes research and innovation, with dedicated research centers and funding opportunities for both faculty and students."
    },
    {
      title: "Industry Partnerships",
      icon: <FaHandshake size={40} />,
      content: "Strong collaborations with leading tech companies provide internship opportunities and industry exposure to our students."
    },
    {
      title: "Career Development",
      icon: <FaChalkboardTeacher size={40} />,
      content: "Comprehensive career services including counseling, placement assistance, and professional development workshops."
    },
    {
      title: "Achievements",
      icon: <FaAward size={40} />,
      content: "Our students and faculty have received numerous awards and recognition in national and international competitions."
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

  const achievements = [
    {
      year: "2023",
      highlights: [
        "Ranked #1 in Technology Education Excellence",
        "100% placement rate for graduating students",
        "20+ research papers published in top journals",
        "Successfully hosted International Tech Conference"
      ]
    },
    {
      year: "2022",
      highlights: [
        "Established new AI & Machine Learning Center",
        "Launched industry-sponsored research projects",
        "Received national accreditation for all programs",
        "Student startups raised $1M+ in funding"
      ]
    }
  ];

  const facilities = [
    {
      name: "Computing Labs",
      features: [
        "State-of-the-art hardware and software",
        "24/7 access for students",
        "Specialized AI and ML workstations",
        "Virtual Reality development setup"
      ]
    },
    {
      name: "Library & Resources",
      features: [
        "Digital library access",
        "Online journals and publications",
        "Study rooms and collaboration spaces",
        "Technical books and references"
      ]
    },
    {
      name: "Research Centers",
      features: [
        "Dedicated research laboratories",
        "Project development spaces",
        "Innovation hub",
        "Industry collaboration center"
      ]
    }
  ];

  return (
    <div className="institution-page">
      <Navbar />
      
      {/* Hero Section with Parallax Effect */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hero-section"
      >
        <div className="hero-content">
          <h1 className="hero-title">About Our Institution</h1>
          <p className="hero-subtitle">Shaping the future of technology education</p>
          <div className="scrolling-arrow">↓</div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="main-container"
      >
        {/* Key Features Grid */}
        <div className="features-grid">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="feature-card"
              style={{ 
                '--hue': index * 90,
                '--delay': index * 0.1 + 's'
              }}
            >
              <div className="feature-icon">{section.icon}</div>
              <h3 className="feature-title">{section.title}</h3>
              <p className="feature-content">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="features-grid">
          {additionalSections.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="feature-card"
              style={{ 
                '--hue': (index + 4) * 90,
                '--delay': index * 0.1 + 's'
              }}
            >
              <div className="feature-icon">{section.icon}</div>
              <h3 className="feature-title">{section.title}</h3>
              <p className="feature-content">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Programs Section */}
        <section className="section-container">
          <h2 className="section-title">Our Programs</h2>
          <div className="programs-grid">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="program-card"
                style={{ 
                  '--hue': index * 60 + 180,
                  '--delay': index * 0.1 + 's'
                }}
              >
                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>
                <div className="program-hover-effect"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="section-container">
          <h2 className="section-title">Recent Achievements</h2>
          <div className="achievements-container">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="achievement-card"
              >
                <h3 className="achievement-year">{achievement.year}</h3>
                <ul className="achievement-list">
                  {achievement.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="achievement-item"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Facilities Section */}
        <section className="section-container">
          <h2 className="section-title">Our Facilities</h2>
          <div className="facilities-grid">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="facility-card"
              >
                <h3 className="facility-name">{facility.name}</h3>
                <ul className="facility-features">
                  {facility.features.map((feature, i) => (
                    <li
                      key={i}
                      className="feature-item"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="facility-overlay"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="vision-mission-section">
          <h2 className="section-title">Our Vision & Mission</h2>
          <div className="vision-mission-grid">
            <div className="vision-card">
              <h3 className="vision-title">Vision</h3>
              <p className="vision-content">To be a leading institution in technology education, fostering innovation and creating future tech leaders.</p>
            </div>
            <div className="mission-card">
              <h3 className="mission-title">Mission</h3>
              <p className="mission-content">To provide quality education that combines theoretical knowledge with practical skills, preparing students for successful careers in technology.</p>
            </div>
          </div>
        </section>
      </motion.div>
      
      <Footer />

      <style jsx>{`
        .institution-page {
          background-color: #f8f9fa;
          color: #333;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
        }

        /* Hero Section */
        .hero-section {
          padding: 120px 20px;
          background: linear-gradient(135deg, #4a6baf 0%, #2a4a8a 100%);
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          animation: fadeInUp 1s ease-out;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 1px;
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          max-width: 800px;
          margin: 0 auto 30px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .scrolling-arrow {
          font-size: 2rem;
          animation: bounce 2s infinite;
          cursor: pointer;
          margin-top: 40px;
        }

        /* Main Container */
        .main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        /* Section Titles */
        .section-title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          color: #2c3e50;
          margin-bottom: 40px;
          text-align: center;
          position: relative;
          padding-bottom: 15px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #4a6baf, #2a4a8a);
          border-radius: 2px;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .feature-card {
          background: white;
          padding: 40px 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
          opacity: 0;
          animation: fadeInUp 0.5s ease-out var(--delay) forwards;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: hsl(var(--hue), 70%, 50%);
          transition: height 0.3s ease;
          z-index: -1;
        }

        .feature-card:hover::before {
          height: 100%;
        }

        .feature-card:hover {
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .feature-card:hover .feature-icon {
          color: white;
        }

        .feature-card:hover .feature-title {
          color: white;
        }

        .feature-card:hover .feature-content {
          color: rgba(255, 255, 255, 0.9);
        }

        .feature-icon {
          color: hsl(var(--hue), 70%, 50%);
          margin-bottom: 25px;
          transition: color 0.3s ease;
        }

        .feature-title {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #2c3e50;
          transition: color 0.3s ease;
        }

        .feature-content {
          color: #666;
          line-height: 1.6;
          transition: color 0.3s ease;
        }

        /* Programs Grid */
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .program-card {
          background: white;
          padding: 30px 25px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
          animation: fadeInUp 0.5s ease-out var(--delay) forwards;
        }

        .program-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, hsla(var(--hue), 70%, 50%, 0.1) 0%, transparent 100%);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .program-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .program-card:hover .program-hover-effect {
          opacity: 1;
        }

        .program-title {
          font-size: 1.2rem;
          color: hsl(var(--hue), 70%, 40%);
          margin-bottom: 10px;
        }

        .program-description {
          color: #666;
          font-size: 0.9rem;
        }

        /* Achievements */
        .achievements-container {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .achievement-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
          border-left: 5px solid #4a6baf;
        }

        .achievement-year {
          color: #4a6baf;
          margin-bottom: 15px;
          font-size: 1.3rem;
        }

        .achievement-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .achievement-item {
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          color: #666;
          position: relative;
          padding-left: 25px;
        }

        .achievement-item::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4a6baf;
          font-weight: bold;
        }

        .achievement-item:last-child {
          border-bottom: none;
        }

        /* Facilities */
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .facility-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .facility-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(74, 107, 175, 0.1) 0%, transparent 100%);
          z-index: -1;
        }

        .facility-name {
          color: #4a6baf;
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .facility-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          padding: 10px 0;
          color: #666;
          border-bottom: 1px solid #eee;
          position: relative;
          padding-left: 30px;
        }

        .feature-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-color: #4a6baf;
          border-radius: 50%;
          opacity: 0.2;
        }

        .feature-item:last-child {
          border-bottom: none;
        }

        /* Vision & Mission */
        .vision-mission-section {
          background: white;
          padding: 50px 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          margin-bottom: 60px;
          background-image: radial-gradient(circle at 10% 20%, rgba(74, 107, 175, 0.03) 0%, transparent 20%);
        }

        .vision-mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .vision-card, .mission-card {
          position: relative;
          padding: 30px;
          border-radius: 10px;
        }

        .vision-card {
          background: rgba(74, 107, 175, 0.05);
        }

        .mission-card {
          background: rgba(42, 74, 138, 0.05);
        }

        .vision-title, .mission-title {
          color: #4a6baf;
          margin-bottom: 15px;
          font-size: 1.3rem;
        }

        .vision-content, .mission-content {
          color: #666;
          line-height: 1.6;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 50vh;
            padding: 80px 20px;
          }
          
          .features-grid, .vision-mission-grid {
            grid-template-columns: 1fr;
          }
          
          .facilities-grid, .programs-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .feature-card, .program-card, .facility-card {
            padding: 25px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;