import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Paper, 
  Typography, 
  styled, 
  CircularProgress,
  Box,
  Alert,
  Button
} from '@mui/material';
import { CloudDownload } from '@mui/icons-material';
import HorizontalTimetable from './HorizontalTimetable';
import { generateTimetablePDF } from '../../utils/pdfGenerator';

const TimetableCardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  position: 'relative',
  minHeight: '400px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
    '&:before': {
      transform: 'rotate(45deg) scale(2)',
      opacity: 0.1,
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0.05,
    transition: 'transform 0.6s ease, opacity 0.6s ease',
    transformOrigin: '0% 100%',
    transform: 'rotate(45deg) scale(0)',
    zIndex: 0,
  }
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px'
  }
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px'
});

const ErrorContainer = styled(Box)({
  padding: '16px',
  borderRadius: '8px',
});

const SimilarityBadge = styled('div')(({ theme, similarity }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  padding: '8px 16px',
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  opacity: similarity,
  animation: 'fadeIn 0.6s ease',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)'
    },
    to: {
      opacity: similarity,
      transform: 'translateY(0)'
    }
  }
}));

const TimetableCard = ({ timetable, filters, id }) => {
  const [currentTimetable, setCurrentTimetable] = useState(timetable);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timetableRef = React.useRef();

  useEffect(() => {
    if (timetable) {
      setCurrentTimetable(timetable);
    }
  }, [timetable]);

  const getSimilarityScore = () => {
    if (!currentTimetable || !filters) return 0;
    
    // Only return 1 for exact matches
    if (currentTimetable.year === Number(filters.year) && 
        currentTimetable.specialization === filters.specialization) {
      return 1;
    }
    return 0;
  };

  const handleDownload = async () => {
    try {
      const fileName = `timetable_${currentTimetable.year}_${currentTimetable.specialization.replace(/\s+/g, '_')}.pdf`;
      await generateTimetablePDF(timetableRef.current, fileName);
    } catch (error) {
      setError('Failed to generate PDF. Please try again.');
    }
  };

  if (!currentTimetable) {
    return (
      <TimetableCardContainer elevation={3}>
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            No timetable data available
          </Typography>
        </Box>
      </TimetableCardContainer>
    );
  }

  return (
    <TimetableCardContainer elevation={3}>
      {filters && (filters.year || filters.specialization) ? (
        <SimilarityBadge similarity={getSimilarityScore()}>
          {Math.round(getSimilarityScore() * 100)}% Match
        </SimilarityBadge>
      ) : null}

      <Box ref={timetableRef} id={id}>
        <HeaderText variant="h6">
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h5">{currentTimetable.specialization} - Year {currentTimetable.year}</Typography>
          </Box>
        </HeaderText>

        {loading ? (
          <LoadingContainer>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading timetable data...
            </Typography>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </ErrorContainer>
        ) : (
          <>
            <HorizontalTimetable timetable={currentTimetable} />
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="textSecondary">
                Last updated: {new Date(currentTimetable.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<CloudDownload />}
          onClick={handleDownload}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }
          }}
        >
          Download PDF
        </Button>
      </Box>
    </TimetableCardContainer>
  );
};

TimetableCard.propTypes = {
  timetable: PropTypes.shape({
    year: PropTypes.number,
    specialization: PropTypes.string,
    days: PropTypes.array,
    updatedAt: PropTypes.string
  }),
  filters: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    specialization: PropTypes.string
  }),
  id: PropTypes.string
};

export default TimetableCard;