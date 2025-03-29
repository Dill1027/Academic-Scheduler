import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "scrolled" : ""}`}
      data-bs-theme="dark"
    >
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <span className="logo-text">Academic</span>
          <span className="logo-highlight">Scheduler</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className={`navbar-toggler ${isMenuOpen ? "collapsed" : ""}`}
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Navbar Items */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">
            <NavItem to="/" text="Home" />
            <NavItem to="/students" text="Students" />
            <NavItem to="/lecturers" text="Lecturers" />
            <NavItem to="/courses" text="Courses" />
            <NavItem to="/timetable" text="Timetable" />
          </ul>

          {/* Search and Auth Section */}
          <div className="d-flex align-items-center">
            <SearchBar />
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Reusable Nav Item Component
const NavItem = ({ to, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <li className="nav-item">
      <Link 
        className={`nav-link ${isActive ? "active" : ""}`}
        to={to}
      >
        {text}
        <span className="nav-link-underline"></span>
      </Link>
    </li>
  );
};

// Search Bar Component
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`search-container ${isFocused ? "focused" : ""}`}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-input"
      />
      <button className="search-button">
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

// Authentication Buttons Component
const AuthButtons = () => {
  return (
    <div className="auth-buttons">
      <Link to="/login" className="btn btn-outline-light btn-login">
        Login
      </Link>
      <Link to="/register" className="btn btn-primary btn-register">
        Register
      </Link>
    </div>
  );
};

export default Navbar;