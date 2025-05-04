import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { GitHub } from '@mui/icons-material';
import './TeamContact.css';

const TeamContact = () => {
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(null);

  const teamMembers = [
    {
        name: "AHM Prabhat Dilshan Abeysinghe",
        role: "Head of Academic Affairs",
        email: "prabhathdilshan2001@gmail.com",
        phone: "+94 76 57 99 580",
        github: "https://github.com/Dill1027",
        image: "https://avatars.githubusercontent.com/Dill1027"
      },
      {
        name: "Dilshani Dissanayake",
        role: "System Administrator",
        email: "dilshani.dissanayake@gmail.com",
        phone: "+94 71 234 5679", 
        github: "https://github.com/Dilshani16",
        image: "https://avatars.githubusercontent.com/Dilshani16"
      },
      {
        name: "Dilki Hewage",
        role: "Database Administrator",
        email: "dilki.hewage@gmail.com",
        phone: "+94 71 234 5680",
        github: "https://github.com/dilkihewage",
        image: "https://avatars.githubusercontent.com/dilkihewage"
      },
      {
        name: "Praweena Nuwangee",
        role: "Security Specialist",
        email: "praweena.nuwangee@gmail.com",
        phone: "+94 71 234 5681",
        github: "https://github.com/praweenanuwangee",
        image: "https://avatars.githubusercontent.com/praweenanuwangee"
      }
  ];

  return (
    <div className="team-container">
      <div className="particles-background" id="tsparticles"></div>
      
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="header-content">
        <h1 className="team-title">Meet Our Team</h1>
        <p className="team-subtitle">Get in touch with our academic leadership team</p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="member-card">
            <div className="card-inner">
              <div className="card-front">
                <img src={member.image} alt={member.name} className="member-image" />
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>
              <div className="card-back">
                <div className="contact-info">
                  <a 
                    href={`mailto:${member.email}`} 
                    className="contact-link email-link"
                    onMouseEnter={() => setShowEmail(index)}
                    onMouseLeave={() => setShowEmail(null)}
                  >
                    <FaEnvelope /> 
                    {showEmail === index ? member.email : 'Email'}
                  </a>
                  <a href={`tel:${member.phone}`} className="contact-link">
                    <FaPhone /> Call
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <GitHub /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamContact;