import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  styled,
  keyframes,
  css
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Particle animation for background
const particleAnim = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
`;

// Floating animation
const floatAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Gradient pulse animation
const gradientPulse = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Custom particles component
const Particles = ({ count = 20 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 15 + 5;
        const posX = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              left: `${posX}%`,
              bottom: '-100px',
              animation: `${particleAnim} ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              filter: 'blur(1px)',
              zIndex: 0
            }}
          />
        );
      })}
    </>
  );
};

// Ultra-advanced styled components
const FilterPanelContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '24px',
  background: `
    linear-gradient(
      145deg, 
      rgba(255, 255, 255, 0.9), 
      rgba(245, 245, 245, 0.9)
    )`,
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8),
    inset -2px -2px 4px rgba(0, 0, 0, 0.05)
  `,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(12px) saturate(180%)',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: `
      linear-gradient(
        90deg, 
        ${theme.palette.primary.main}, 
        ${theme.palette.secondary.main}, 
        ${theme.palette.primary.main}
      )`,
    backgroundSize: '200% 200%',
    animation: `${gradientPulse} 8s ease infinite`,
    zIndex: 2
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(
        circle at 20% 80%,
        rgba(${theme.palette.primary.main.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.05) 0%, 
        transparent 70%
      )`,
    zIndex: -1
  }
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.8rem',
  background: `
    linear-gradient(
      135deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.secondary.main}
    )`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  animation: `${floatAnim} 6s ease-in-out infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -12,
    left: 0,
    width: '60px',
    height: '4px',
    background: `
      linear-gradient(
        90deg, 
        ${theme.palette.primary.main}, 
        ${theme.palette.secondary.main}
      )`,
    borderRadius: '4px',
    transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    transformOrigin: 'left center'
  },
  '&:hover:after': {
    width: '100%',
    transform: 'scaleX(1.1)'
  }
}));

const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px 32px',
  fontWeight: 700,
  textTransform: 'none',
  letterSpacing: '0.8px',
  transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1,
  transformStyle: 'preserve-3d',
  perspective: '1000px',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    clipPath: 'circle(0% at 50% 50%)',
    transition: 'clip-path 0.8s ease-out',
    zIndex: -1
  },
  '&:hover:before': {
    clipPath: 'circle(100% at 50% 50%)'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    background: `linear-gradient(45deg, transparent 33%, rgba(255, 255, 255, 0.1) 33%, rgba(255, 255, 255, 0.1) 66%, transparent 66%)`,
    backgroundSize: '6px 6px',
    transform: 'rotate(45deg) translateZ(-1px)',
    opacity: 0,
    transition: 'opacity 0.6s ease',
    animation: 'none'
  },
  '&:hover:after': {
    opacity: 0.3,
    animation: `${keyframes`
      0% { background-position: 0 0; }
      100% { background-position: 6px 6px; }
    `} 1s linear infinite`
  },
  '&.MuiButton-contained': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.2)`,
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: `0 12px 24px -6px ${theme.palette.primary.main}80, 0 6px 12px -4px rgba(0, 0, 0, 0.2)`,
    },
    '&:active': {
      transform: 'translateY(1px) scale(0.98)'
    }
  },
  '&.MuiButton-outlined': {
    borderWidth: '2px',
    borderColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderColor: theme.palette.grey[400],
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '16px',
  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  '& .MuiSelect-select': {
    padding: '14px 32px 14px 16px',
    backdropFilter: 'blur(4px)',
    background: 'rgba(255, 255, 255, 0.7) !important'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.1) !important',
    transition: 'all 0.4s ease'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: `${theme.palette.primary.light} !important`,
    boxShadow: `0 0 0 4px ${theme.palette.primary.light}20`
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: `${theme.palette.primary.main} !important`,
    boxShadow: `0 0 0 4px ${theme.palette.primary.light}40`,
    borderWidth: '2px'
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  '&:hover': {
    background: `${theme.palette.primary.light}15 !important`,
    transform: 'translateX(4px)'
  },
  '&.Mui-selected': {
    background: `${theme.palette.primary.light}30 !important`,
    fontWeight: 600,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      background: theme.palette.primary.main,
      borderRadius: '0 4px 4px 0'
    }
  }
}));

const specializations = [
  'Information Technology',
  'Data Science',
  'Software Engineering',
  'Interactive Media',
  'Cyber Security'
];

const FilterPanel = ({ filters, setFilters, applyFilters, resetFilters }) => {
  const handleYearChange = (year) => {
    const newFilters = {
      ...filters,
      year: Number(year),
      specialization: "" // Reset specialization when year changes
    };
    setFilters(newFilters);
    applyFilters(newFilters); // Apply filters immediately
  };

  const handleSpecializationChange = (specialization) => {
    const newFilters = {
      ...filters,
      specialization
    };
    setFilters(newFilters);
    applyFilters(newFilters); // Apply filters immediately
  };

  return (
    <FilterPanelContainer elevation={0}>
      <FilterTitle variant="h5">Select Timetable</FilterTitle>
      
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          1. Select Year
        </Typography>
        <Box display="flex" gap={2}>
          {[1, 2, 3, 4].map((year) => (
            <Button
              key={year}
              variant={filters.year === year ? "contained" : "outlined"}
              onClick={() => handleYearChange(year)}
              sx={{ minWidth: '100px' }}
            >
              Year {year}
            </Button>
          ))}
        </Box>

        <Typography variant="subtitle1" fontWeight={600} mt={4} mb={2}>
          2. Select Specialization
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={filters.specialization === spec ? "contained" : "outlined"}
              onClick={() => handleSpecializationChange(spec)}
              sx={{ 
                minWidth: '200px',
                opacity: !filters.year ? 0.7 : 1,
                pointerEvents: !filters.year ? 'none' : 'auto'
              }}
            >
              {spec}
            </Button>
          ))}
        </Box>
      </Box>

      {(filters.year || filters.specialization) && (
        <Box display="flex" gap={2} mt={4}>
          <Button variant="outlined" onClick={resetFilters}>
            Reset
          </Button>
        </Box>
      )}
    </FilterPanelContainer>
  );
};

export default FilterPanel;