import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Zoom } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './YearSelection.css';

const YearSelection = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const years = [
    { 
      id: 1, 
      name: "1st Year", 
      image: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60')",
      color: "rgba(41, 128, 185, 0.85)",
      gradient: "linear-gradient(135deg, #2980b9, #6dd5fa)"
    },
    { 
      id: 2, 
      name: "2nd Year", 
      image: "url('https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60')",
      color: "rgba(39, 174, 96, 0.85)",
      gradient: "linear-gradient(135deg, #27ae60, #2ecc71)"
    },
    { 
      id: 3, 
      name: "3rd Year", 
      image: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60')",
      color: "rgba(243, 156, 18, 0.85)",
      gradient: "linear-gradient(135deg, #f39c12, #f1c40f)"
    },
    { 
      id: 4, 
      name: "4th Year", 
      image: "url('https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60')",
      color: "rgba(192, 57, 43, 0.85)",
      gradient: "linear-gradient(135deg, #c0392b, #e74c3c)"
    }
  ];

  return (
    <div className="year-selection-container">
      <Zoom in={true} timeout={500}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="contained"
          color="secondary"
          sx={{
            mb: 4,
            borderRadius: '50px',
            boxShadow: theme.shadows[4],
            color: 'rgba(255, 255, 255, 0.9)',
            width: '200px',
            height: '48px',
            fontSize: '1rem',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8],
              color: '#e0e0e0',
            },
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1
          }}
        >
          Back
        </Button>
      </Zoom>

      <div className="header-wrapper">
        <h1 className="selection-title">
          <span className="title-gradient">Select Academic Year</span>
          <span className="title-shadow" aria-hidden="true">Select Academic Year</span>
        </h1>
        <div className="title-decoration"></div>
      </div>
      
      <div className="year-grid">
        {years.map((year) => (
          <div key={year.id} className="year-card-wrapper" tabIndex="0">
            <button
              className="year-card glass-morphism"
              style={{ 
                '--card-bg-image': year.image,
                '--card-overlay': year.color,
                '--card-gradient': year.gradient
              }}
              onClick={() => navigate(`/specializations/${year.id}`)}
              aria-label={`Select ${year.name}`}
            >
              <div className="year-overlay"></div>
              <div className="year-glow"></div>
              <div className="year-content">
                <h3 className="year-title">{year.name}</h3>
                <div className="year-hover-content">
                  <span className="hover-text">View Specializations</span>
                  <span className="hover-arrow">→</span>
                </div>
              </div>
              <div className="year-corner year-corner-tl"></div>
              <div className="year-corner year-corner-tr"></div>
              <div className="year-corner year-corner-bl"></div>
              <div className="year-corner year-corner-br"></div>
            </button>
          </div>
        ))}
      </div>
      
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--size': `${Math.random() * 0.5 + 0.5}rem`,
            '--delay': `${Math.random() * 5}s`,
            '--duration': `${Math.random() * 15 + 10}s`,
            '--x-start': `${Math.random() * 100}%`,
            '--x-end': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--opacity': Math.random() * 0.3 + 0.1
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default YearSelection;