import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, useMediaQuery, Fade, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../Navbar';
import Footer from '../Navbar/footer';

// Use the AnimatedCard, CardOverlay, and CardHoverContent components from Specialization.js
const SpecializationSelection = () => {
  const { yearId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesLoaded = async (container) => {
    // Optional callback when particles are loaded
  };

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockSpecializations = [
          { id: 1, name: 'Information Technology', color: '#4361ee', icon: '💻' },
          { id: 2, name: 'Software Engineering', color: '#3f37c9', icon: '👨‍💻' },
          { id: 3, name: 'Information Systems Engineering', color: '#4895ef', icon: '📊' },
          { id: 4, name: 'Cyber Security', color: '#4cc9f0', icon: '🔒' },
          { id: 5, name: 'Data Science', color: '#3a0ca3', icon: '📈' },
          { id: 6, name: 'Interactive Media', color: '#7209b7', icon: '🎮' },
          { id: 7, name: 'Computer Systems & Network Engineering', color: '#560bad', icon: '🖥️' },
          { id: 8, name: 'Artificial Intelligence', color: '#480ca8', icon: '🧠' }
        ];
        setSpecializations(mockSpecializations);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, [yearId]);

  const handleSpecializationSelect = (specializationId) => {
    navigate(`/timetable-options/${yearId}/${specializationId}`);
  };

  const handleGoBack = () => {
    navigate('/timetable'); // Go back to year selection
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="80vh"
          sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <Fade in={loading} timeout={500}>
            <Box textAlign="center">
              <CircularProgress size={60} thickness={4} />
              <Typography variant="h6" mt={2} color="textPrimary">
                Loading Specializations...
              </Typography>
            </Box>
          </Fade>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          py: 8,
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        {/* Particles Background */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse"
                }
              }
            },
            particles: {
              color: {
                value: alpha(theme.palette.primary.main, 0.5)
              },
              links: {
                color: alpha(theme.palette.primary.main, 0.3),
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1
              },
              move: {
                direction: "none",
                enable: true,
                outModes: "bounce",
                random: true,
                speed: 1,
                straight: false
              },
              number: {
                density: {
                  enable: true,
                  area: 800
                },
                value: 40
              },
              opacity: {
                value: 0.5
              },
              shape: {
                type: "circle"
              },
              size: {
                value: { min: 1, max: 3 }
              }
            },
            detectRetina: true
          }}
        />

        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, position: 'relative', zIndex: 10 }}>
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              onClick={handleGoBack} 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                mb: 4, 
                cursor: 'pointer',
                color: theme.palette.text.primary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateX(-3px)'
                }
              }}
            >
              <ArrowBackIcon sx={{ mr: 1 }} />
              <Typography variant="button" fontWeight={600}>
                Back to Year Selection
              </Typography>
            </Box>
          </motion.div>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Select Specialization
              </Typography>
              <Typography 
                variant="h5" 
                color="textSecondary"
                sx={{ mb: 3 }}
              >
                Year {yearId}
              </Typography>
              
              <Box sx={{
                width: '80px',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                mx: 'auto',
                borderRadius: '2px'
              }} />
            </motion.div>
          </Box>

          {/* Specialization Cards */}
          <Grid container spacing={3}>
            {specializations.map((spec, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={spec.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Box
                    onClick={() => handleSpecializationSelect(spec.id)}
                    sx={{
                      height: 200,
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      boxShadow: 3,
                      background: `linear-gradient(135deg, ${spec.color} 0%, ${alpha(spec.color, 0.7)} 100%)`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 8,
                        '& .spec-content': {
                          transform: 'translateY(-10px)'
                        },
                        '& .spec-hover': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                  >
                    {/* Decorative overlay */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.2)',
                      zIndex: 1
                    }} />
                    
                    {/* Icon and title */}
                    <Box 
                      className="spec-content"
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                        {spec.icon}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        fontWeight="bold"
                        color="white"
                        textAlign="center"
                      >
                        {spec.name}
                      </Typography>
                    </Box>
                    
                    {/* Hover content */}
                    <Box 
                      className="spec-hover"
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        width: '100%',
                        zIndex: 2,
                        opacity: 0,
                        transform: 'translateY(20px)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'white',
                          fontWeight: 600,
                          mr: 1,
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        View Timetable Options
                      </Typography>
                      <ArrowBackIcon sx={{ 
                        color: 'white', 
                        transform: 'rotate(180deg)' 
                      }} />
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default SpecializationSelection;
