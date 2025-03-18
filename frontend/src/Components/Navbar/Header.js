import React from 'react';
import './stl.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
      <section className="home-section1">
        <div className="home-container1">
          <nav className="navbar-custom1">
            <div className="logo-container1">
              <div className="menu-icon1">
                <i className="fa fa-bars"></i>
              </div>
              <h3>TravelMate</h3>
            </div>
            <div className="menu-container1">
              <ul className="menu-list1">
                <li><a href="/EventManager/Dashboard">Dashboard</a></li>
                <li><a href="/EventManager/addEvent">Add Event</a></li>
                <li><a href="/EventManager/EventList">View Event</a></li>
                <li><Link to="/EventManager/report">Report</Link></li>
              </ul>
            </div>
            <div 
              className="auth-container1"
              style={{ display: 'flex', gap: '10px' }} // Inline styles for the auth container
            >
              <a 
                className="event-auth-btn1" 
                href="/scheduler/sellersignin" 
                style={{ textDecoration: 'none', padding: '10px', color: 'white' }} // Inline styles for the Log out button
              >
                Log out
              </a>
              <a 
                className="event-auth-btn1" 
                href="/EventManager/EventOProfile" 
                style={{ textDecoration: 'none', padding: '10px', color: 'white' }} // Inline styles for the Profile button
              >
                Profile
              </a>
            </div>
          </nav>
        </div>
      </section>
      <script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" 
        integrity="sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer">
      </script>
    </div>
  );
}

export default Header;
