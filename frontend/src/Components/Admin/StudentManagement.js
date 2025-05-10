import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaUsersCog } from "react-icons/fa"; 
import Footer from "../Navbar/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import AddDoc from "../CourseManagement/AddDoc";
import Navbar from "../Navbar";

function StudentManagement() {
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardClick = (path) => {
    navigate(path);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: 'calc(100vh - 200px)'
    },
    title: {
      fontSize: '2.8rem',
      fontWeight: '700',
      color: '#1a237e',
      marginBottom: '3rem',
      textAlign: 'center',
      position: 'relative',
      paddingBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '5px',
        background: 'linear-gradient(90deg, #1976d2, #1a237e)',
        borderRadius: '25px'
      }
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      padding: '20px'
    },
    card: {
      minHeight: '220px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      overflow: 'hidden',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
      }
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
    },
    cardBody: {
      padding: '30px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: '2'
    },
    cardText: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#34495e',
      margin: '0',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    cardHoverEffect: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(52,152,219,0.1) 0%, rgba(155,89,182,0.1) 100%)',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    },
    cardHoverEffectActive: {
      opacity: '1'
    }
  };

  return (
    <div className="dashboard-container" style={{ background: '#f5f7fa' }}>
      <Navbar />
      <div style={{ marginTop: "10px", padding: '70px 0' }}>
        {/* Modal for AddDoc */}
        {showAddDocModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                className="close-button" 
                onClick={() => setShowAddDocModal(false)}
              >
                ×
              </button>
              <AddDoc onClose={() => setShowAddDocModal(false)} />
            </div>
          </div>
        )}

        <div style={styles.container}>
          <h3 style={styles.title}>Student Management</h3>
          
          <div style={styles.cardContainer}>
            {/* Student Profile Permission Card */}
            <div 
              style={{ 
                ...styles.card, 
                ...(hoveredCard === 'profile' && styles.cardHover) 
              }}
              onClick={() => handleCardClick('/adminReview')}
              onMouseEnter={() => setHoveredCard('profile')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardHoverEffect} className={hoveredCard === 'profile' ? 'active' : ''}></div>
              <div style={styles.cardBody}>
                <p style={styles.cardText}>Student Profile Permission</p>
              </div>
            </div>

            {/* View Student List Card */}
            <div 
              style={{ 
                ...styles.card, 
                ...(hoveredCard === 'list' && styles.cardHover) 
              }}
              onClick={() => handleCardClick('/studentList')}
              onMouseEnter={() => setHoveredCard('list')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardHoverEffect} className={hoveredCard === 'list' ? 'active' : ''}></div>
              <div style={styles.cardBody}>
                <p style={styles.cardText}>View Student List</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudentManagement;