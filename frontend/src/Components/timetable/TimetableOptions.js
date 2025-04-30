import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import {
  Container, Typography, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Tabs, Tab, Select, MenuItem, FormControl,
  InputLabel, Fade, Zoom, Button, useTheme,  // Add useTheme here
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Add this import
import { styled } from '@mui/material/styles';
import { moduleData, rooms, timeSlots, weekDays } from '../../data/timetableData';
import { keyframes } from '@emotion/react';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components with enhanced styling
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  animation: `${fadeIn} 0.5s ease-out`,
  '&:hover': {
    boxShadow: theme.shadows[6],
    transition: 'box-shadow 0.3s ease-in-out'
  }
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -theme.spacing(1),
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: theme.palette.secondary.main,
    borderRadius: '2px'
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
}));

const HeaderCell = styled(StyledTableCell)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2]
  }
}));

const TimeCell = styled(StyledTableCell)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.grey[100]}, ${theme.palette.grey[50]})`,
  fontWeight: 'bold',
  width: '120px',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  position: 'sticky',
  left: 0,
  zIndex: 5
}));

const ContentCell = styled(StyledTableCell)(({ theme, hascontent }) => ({
  '& .subject': {
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    fontSize: '0.85rem'
  },
  '& .subject-name': {
    color: theme.palette.text.primary,
    fontSize: '0.8rem',
    margin: '4px 0'
  },
  '& .room': {
    color: theme.palette.secondary.dark,
    fontSize: '0.75rem',
    backgroundColor: theme.palette.secondary.light + '40',
    padding: '2px 4px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  '& .lecturer': {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    fontSize: '0.7rem',
    marginTop: '4px'
  },
  background: hascontent ? theme.palette.primary.light + '20' : 'transparent',
  cursor: hascontent ? 'pointer' : 'default',
  '&:hover': {
    transform: hascontent ? 'scale(1.02)' : 'none',
    boxShadow: hascontent ? theme.shadows[1] : 'none',
    zIndex: hascontent ? 2 : 'auto'
  },
  animation: hascontent ? `${pulse} 1.5s infinite` : 'none'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: '4px',
    borderRadius: '2px 2px 0 0',
    background: theme.palette.secondary.main
  },
  marginBottom: theme.spacing(4)
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  color: theme.palette.text.primary,
  '&.Mui-selected': {
    color: theme.palette.secondary.dark
  },
  '&:hover': {
    color: theme.palette.secondary.main,
    opacity: 1
  }
}));

const RoomSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginBottom: theme.spacing(4),
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: theme.palette.primary.light
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
      boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.secondary.dark
  }
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  '& .MuiCircularProgress-root': {
    color: theme.palette.secondary.main,
    width: '60px !important',
    height: '60px !important'
  }
}));

const TimetableOptions = () => {
  const { yearId, specializationId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); // Add this line
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSpecName = (id) => {
    const specs = {
      1: 'Information Technology',
      2: 'Software Engineering',
      3: 'Information Systems Engineering',
      4: 'Cyber Security',
      5: 'Data Science',
      6: 'Interactive Media',
      7: 'Computer Systems & Network Engineering',
      8: 'Artificial Intelligence'
    };
    return specs[id] || 'Unknown Specialization';
  };

  const getRoomOptions = () => {
    return rooms.map(room => (
      <MenuItem key={room} value={room}>{room}</MenuItem>
    ));
  };

  const generateTimetableData = () => {
    const getModulesForYearAndSpec = (year, spec) => {
      if (year === '1') {
        return moduleData.year1.modules;
      }
      if (moduleData[`year${year}`]?.[spec]) {
        return moduleData[`year${year}`][spec];
      }
      return moduleData[`year${year}`]?.common || [];
    };

    const currentSpecName = getSpecName(Number(specializationId));
    const modules = getModulesForYearAndSpec(yearId, currentSpecName);
    
    return Array(5).fill(null).map((_, optionIndex) => ({
      id: optionIndex + 1,
      schedule: days.map(day => ({
        day,
        slots: timeSlots.map(() => {
          const random = Math.random();
          if (random > 0.6 && modules.length) {
            const module = modules[Math.floor(Math.random() * modules.length)];
            const room = rooms[Math.floor(Math.random() * rooms.length)];
            return {
              code: module.code,
              name: module.name,
              room: room,
              lecturer: module.lecturer
            };
          }
          return null;
        })
      }))
    }));
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const options = generateTimetableData();
      setOptions(options);
      setLoading(false);
    }, 1000);
  }, [yearId, specializationId]);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
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

      <Title variant="h3" gutterBottom>
        {getSpecName(Number(specializationId))} - Year {yearId}
      </Title>

      <RoomSelect>
        <InputLabel id="room-select-label">Select Room</InputLabel>
        <Select
          labelId="room-select-label"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          label="Select Room"
        >
          <MenuItem value=""><em>All Rooms</em></MenuItem>
          {getRoomOptions()}
        </Select>
      </RoomSelect>

      <StyledTabs
        value={selectedOption}
        onChange={(e, newValue) => setSelectedOption(newValue)}
        centered
        variant="scrollable"
        scrollButtons="auto"
      >
        {options.map((_, index) => (
          <StyledTab key={index} label={`Timetable Option ${index + 1}`} />
        ))}
      </StyledTabs>

      {options[selectedOption] && (
        <Zoom in={true} timeout={500}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              overflowX: 'auto',
              borderRadius: '12px',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <HeaderCell>Time</HeaderCell>
                  {days.map(day => (
                    <HeaderCell key={day}>{day}</HeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((timeSlot, timeIndex) => (
                  <TableRow key={timeSlot} hover>
                    <TimeCell>{timeSlot}</TimeCell>
                    {days.map((day, dayIndex) => {
                      const subject = options[selectedOption].schedule[dayIndex].slots[timeIndex];
                      const isSelectedRoom = selectedRoom ? subject?.room === selectedRoom : true;
                      return (
                        <ContentCell 
                          key={`${day}-${timeSlot}`}
                          hascontent={subject && isSelectedRoom ? 1 : 0}
                        >
                          {subject && isSelectedRoom && (
                            <Fade in={true} timeout={800}>
                              <Box sx={{ textAlign: 'center' }}>
                                <div className="subject">{subject.code}</div>
                                <div className="subject-name">{subject.name}</div>
                                <div className="room">{subject.room}</div>
                                <div className="lecturer">{subject.lecturer}</div>
                              </Box>
                            </Fade>
                          )}
                        </ContentCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Zoom>
      )}
    </StyledContainer>
  );
};

export default TimetableOptions;