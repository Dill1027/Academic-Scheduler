import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const [month, setMonth] = useState('');
  const [currentYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    generateCalendar();
  }, []);

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    // Set month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ];
    setMonth(monthNames[currentMonth]);

    const calendarBody = document.getElementById('calendar-body');
    if (calendarBody) {
      calendarBody.innerHTML = ''; // Clear previous content

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      let date = 1;
      for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
          const cell = document.createElement('td');

          if (i === 0 && j < firstDay) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
          } else if (date > daysInMonth) {
            break;
          } else {
            cell.textContent = date;

            // Highlight current date
            if (date === currentDate) {
              cell.style.backgroundColor = '#4CAF50';
              cell.style.color = 'white';
              cell.style.borderRadius = '50%';
              cell.style.width = '24px';
              cell.style.height = '24px';
              cell.style.display = 'inline-flex';
              cell.style.justifyContent = 'center';
              cell.style.alignItems = 'center';
            }

            row.appendChild(cell);
            date++;
          }
        }

        calendarBody.appendChild(row);

        // Stop adding rows if dates are finished
        if (date > daysInMonth) {
          break;
        }
      }
    }
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <div style={footerGridStyle}>
          {/* Calendar Section */}
          <div style={footerColumnStyle}>
            <h4 style={footerHeadingStyle}>
              Calendar ({month})
            </h4>
            <div style={calendarContainerStyle}>
              <table style={calendarStyle}>
                <thead>
                  <tr>
                    <th style={calendarHeaderStyle}>Sun</th>
                    <th style={calendarHeaderStyle}>Mon</th>
                    <th style={calendarHeaderStyle}>Tue</th>
                    <th style={calendarHeaderStyle}>Wed</th>
                    <th style={calendarHeaderStyle}>Thu</th>
                    <th style={calendarHeaderStyle}>Fri</th>
                    <th style={calendarHeaderStyle}>Sat</th>
                  </tr>
                </thead>
                <tbody id="calendar-body" style={calendarBodyStyle}>
                  {/* Calendar days will be generated dynamically */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Section */}
          <div style={footerColumnStyle}>
            <h4 style={footerHeadingStyle}>
              Contact Us
            </h4>
            <div style={contactInfoStyle}>
              <div style={contactItemStyle}>
                <FaMapMarkerAlt style={contactIconStyle} />
                <span>Malabe, Sri Lanka</span>
              </div>
              <div style={contactItemStyle}>
                <FaPhone style={contactIconStyle} />
                <span>+94 234 567 88</span>
              </div>
              <div style={contactItemStyle}>
                <FaEnvelope style={contactIconStyle} />
                <span>scholar@gmail.com</span>
              </div>
            </div>

            <h4 style={{...footerHeadingStyle, marginTop: '20px'}}>
              Follow Us
            </h4>
            <div style={socialLinksStyle}>
              <a href="#" style={socialLinkStyle}>
                <FaFacebook size={20} />
              </a>
              <a href="#" style={socialLinkStyle}>
                <FaInstagram size={20} />
              </a>
              <a href="#" style={socialLinkStyle}>
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div style={copyrightStyle}>
          © {currentYear} Copyright: 
          <a href="/" style={copyrightLinkStyle}>Scholar.com</a>
        </div>
      </div>
    </footer>
  );
};

// Styles
const footerStyle = {
  backgroundColor: '#2c3e50',
  color: '#ecf0f1',
  padding: '40px 0 0',
  marginTop: 'auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const footerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px'
};

const footerGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '40px',
  marginBottom: '40px'
};

const footerColumnStyle = {
  padding: '0 15px'
};

const footerHeadingStyle = {
  color: '#fff',
  fontSize: '1.2rem',
  marginBottom: '20px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const calendarContainerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '15px',
  backdropFilter: 'blur(5px)'
};

const calendarStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const calendarHeaderStyle = {
  padding: '8px',
  textAlign: 'center',
  fontSize: '0.8rem',
  color: '#bdc3c7',
  fontWeight: '500'
};

const calendarBodyStyle = {
  textAlign: 'center'
};

const calendarBodyStyleTD = {
  padding: '8px',
  fontSize: '0.9rem',
  position: 'relative'
};

const contactInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.95rem'
};

const contactIconStyle = {
  color: '#3498db',
  minWidth: '20px'
};

const socialLinksStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '10px'
};

const socialLinkStyle = {
  color: '#bdc3c7',
  transition: 'color 0.3s',
  ':hover': {
    color: '#3498db'
  }
};

const copyrightStyle = {
  textAlign: 'center',
  padding: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  fontSize: '0.9rem',
  color: '#bdc3c7'
};

const copyrightLinkStyle = {
  color: '#3498db',
  marginLeft: '5px',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline'
  }
};

export default Footer;