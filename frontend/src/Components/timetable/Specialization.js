import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, Typography,
  CardActionArea, CircularProgress, Box, Button,
  useTheme, useMediaQuery, Fade, Grow, Zoom
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion, isValidMotionProp } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Navbar/footer';

const AnimatedCard = motion(styled(Card, {
  shouldComponentUpdate: (props) => !isValidMotionProp(props)
})(({ theme }) => ({
  height: '220px',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
  boxShadow: theme.shadows[4],
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[12],
    '& .card-overlay': {
      opacity: 0.9
    },
    '& .card-content': {
      transform: 'translateY(-20px)'
    },
    '& .card-hover-content': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover::before': {
    opacity: 1
  }
})));

const CardOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to bottom, rgba(146, 137, 137, 0.1) 0%, rgba(0,0,0,0.7) 100%)',
  opacity: 0.7,
  transition: 'opacity 0.3s ease',
  zIndex: 1
});

const CardHoverContent = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: 0,
  right: 0,
  textAlign: 'center',
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.3s ease',
  zIndex: 2,
  color: 'rgba(255, 255, 255, 0.9)', // Changed from black to white with slight transparency
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '200px', // Set standard width
  margin: '0 auto',
  padding: '8px 16px',
  '& svg': {
    marginLeft: theme.spacing(1),
    transition: 'transform 0.3s ease'
  }
}));

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
          { id: 3, name: 'Information Systems', color: '#4895ef', icon: '📊' },
          { id: 4, name: 'Cyber Security', color: '#4cc9f0', icon: '🔒' },
          { id: 5, name: 'Data Science', color: '#3a0ca3', icon: '📈' },
          { id: 6, name: 'Interactive Media', color: '#7209b7', icon: '🎮' },
          { id: 7, name: 'Computer Systems', color: '#560bad', icon: '🖥️' },
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
    navigate(-1);
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
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 8,
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Particles Background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
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
        </Box>

        {/* Back Button */}
        <Zoom in={!loading} timeout={500}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            variant="contained"
            color="secondary"
            sx={{
              mb: 4,
              borderRadius: '50px',
              boxShadow: theme.shadows[4],
              color: 'rgba(255, 255, 255, 0.9)',
              width: '200px', // Set standard width
              height: '48px', // Set standard height
              fontSize: '1rem', // Set standard font size
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

        {/* Header */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: 6 }}>
          <Typography 
            variant={isMobile ? 'h4' : 'h2'} 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Select Specialization
          </Typography>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            align="center" 
            color="textSecondary" 
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Year {yearId}
          </Typography>
        </Box>

        {/* Specialization Cards */}
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            mt: 4,
            position: 'relative',
            zIndex: 1
          }}
        >
          {specializations.map((spec, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={spec.id}>
              <Grow in={!loading} timeout={index * 150}>
                <div>
                  <AnimatedCard
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleSpecializationSelect(spec.id)}
                    sx={{
                      background: `linear-gradient(135deg, ${spec.color} 0%, ${alpha(spec.color, 0.7)} 100%)`
                    }}
                  >
                    <CardOverlay className="card-overlay" />
                    <CardContent 
                      className="card-content"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        position: 'relative',
                        zIndex: 2,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <Typography variant="h3" component="div" gutterBottom>
                        {spec.icon}
                      </Typography>
                      <Typography 
                        variant={isMobile ? 'h6' : 'h5'} 
                        component="div" 
                        align="center"
                        sx={{ fontWeight: 600 }}
                      >
                        {spec.name}
                      </Typography>
                    </CardContent>
                    <CardHoverContent className="card-hover-content">
                      <Typography variant="body1" sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          color: '#e0e0e0'
                        }
                      }}>
                        View Timetable Options
                      </Typography>
                      <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
                    </CardHoverContent>
                  </AnimatedCard>
                </div>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default SpecializationSelection;