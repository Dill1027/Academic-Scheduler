import React, { useEffect, useState } from 'react';
import './footer.css'; // CSS file for styles

const Footer = () => {
  const [month, setMonth] = useState('');
  
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
            cell.classList.add('current-date');
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
  };

  return (
    <div className="footer">
      <footer className="footer-container text-center text-lg-start bg-dark text-muted">
        <section>
          <div className="row">
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4 mt-3" style={{ color: '#fff' }}>
                Calendar ({month})
              </h6>
              <div className="calendar-footer">
                <table id="calendar">
                  <thead>
                    <tr>
                      <th>Sun</th>
                      <th>Mon</th>
                      <th>Tue</th>
                      <th>Wed</th>
                      <th>Thu</th>
                      <th>Fri</th>
                      <th>Sat</th>
                    </tr>
                  </thead>
                  <tbody id="calendar-body">
                    {/* Calendar days will be generated dynamically */}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4 mt-3" style={{ color: '#fff' }}>
                Contact
              </h6>
              <p style={{ color: '#fff' }}>
                <i className="fas fa-home me-3">
                  <img src="/img/map.png" alt="map" />
                </i>
                Malabe, Sri Lanka
              </p>
              <p style={{ color: '#fff' }}>
                <i className="fas fa-phone me-3">
                  <img src="/img/phone.png" alt="phone" />
                </i>
                + 94 234 567 88
              </p>
              <a href="#" style={{ color: '#fff' }}>
                <i className="fas fa-phone me-3"></i>
                <i className="me-3">
                  <img src="/img/email.png" alt="email" />
                </i>
                scholar@gmail.com
              </a>
              <br />
              <a href="#" style={{ color: '#fff' }}>
                <i className="fas fa-phone me-3"></i>
                <i className="me-3">
                  <img src="/img/Facebook.png" alt="facebook" />
                </i>
                Facebook
              </a>
              <br />
              <a href="#" style={{ color: '#fff' }}>
                <i className="me-3">
                  <img src="/img/insta.png" alt="instagram" />
                </i>
                Instagram
              </a>
              <br />
              <a href="#" style={{ color: '#fff' }}>
                <i className="me-3">
                  <img src="./img/twitter.png" alt="twitter" />
                </i>
                Twitter
              </a>
            </div>
          </div>
        </section>

        <div className="text-center p-4" style={{ backgroundColor: 'rgba(255, 248, 248, 0.055)', color: '#fff' }}>
          © 2025 Copyright:
          <a className="text-reset fw-bold" href="https://mdbootstrap.com/" style={{ color: '#fff' }}>
            Scholar.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
