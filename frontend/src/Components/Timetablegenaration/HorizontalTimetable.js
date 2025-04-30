import React from 'react';
import PropTypes from 'prop-types';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  styled 
} from '@mui/material';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  margin: '24px 0',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
  }
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '1rem',
  padding: '16px',
  textAlign: 'center',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`
  }
}));

const TimeCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  fontWeight: 600,
  padding: '16px',
  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
  width: '120px',
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.grey[200]
  }
}));

const DayCell = styled(TableCell)(({ theme }) => ({
  padding: '16px',
  textAlign: 'center',
  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  cursor: 'default',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  }
}));

const SubjectText = styled('div')(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: '4px',
  fontSize: '0.95rem'
}));

const VenuText = styled('div')(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.secondary.main,
  fontWeight: 500
}));

const LecturerText = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  marginTop: '4px'
}));

const HorizontalTimetable = ({ timetable }) => {
  // Standard time slots
  const timeSlots = [
    '08:30-10:30',
    '10:30-12:30',
    '13:30-15:30',
    '15:30-17:30',
    '17:30-19:30'
  ];

  // Days of the week in order
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div>
      <Typography variant="h4" align="center" sx={{ 
        mb: 4,
        fontWeight: 700,
        color: 'primary.main',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '4px',
          backgroundColor: 'primary.main',
          borderRadius: '2px'
        }
      }}>
        {timetable.specialization} Timetable
      </Typography>
      
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>Time</HeaderCell>
              {days.map(day => (
                <HeaderCell key={day}>{day}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map(time => (
              <TableRow key={time} hover>
                <TimeCell>{time}</TimeCell>
                {days.map(day => {
                  // Find the day data
                  const dayData = timetable.days.find(d => d.day === day);
                  // Find the slot for this time
                  const slot = dayData?.slots.find(s => s.time === time);
                  
                  return (
                    <DayCell key={`${day}-${time}`}>
                      {slot ? (
                        <>
                          <SubjectText>{slot.subject}</SubjectText>
                          <VenuText>{slot.venu}</VenuText>
                          {slot.lecturer && <LecturerText>{slot.lecturer}</LecturerText>}
                        </>
                      ) : (
                        <div style={{ color: '#aaa' }}>-</div>
                      )}
                    </DayCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </div>
  );
};
HorizontalTimetable.propTypes = {
  timetable: PropTypes.shape({
    specialization: PropTypes.string.isRequired,
    days: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.string.isRequired,
        slots: PropTypes.arrayOf(
          PropTypes.shape({
            time: PropTypes.string.isRequired,
            subject: PropTypes.string,
            venu: PropTypes.string,
            lecturer: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
};

export default HorizontalTimetable;