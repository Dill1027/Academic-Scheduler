import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Tabs, Tab, Select, MenuItem, FormControl,
  InputLabel, Fade, Zoom, Button, useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GetAppIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { moduleData, rooms, timeSlots, weekDays } from '../../data/timetableData';
import { keyframes } from '@emotion/react';
import { generateTimetablesForYearSpec, getFilteredTimetables } from '../../services/timetableApi';
import Navbar from '../Navbar';
import Footer from '../Navbar/footer';
import { generateTimetablePDF } from '../../utils/pdfGenerator';
import Swal from 'sweetalert2';

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
  const theme = useTheme();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [timetableData, setTimetableData] = useState([]);
  const [regenerating, setRegenerating] = useState(false);
  const timetableRef = React.useRef(null);

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

  const processTimetableData = (backendData) => {
    if (!backendData || !backendData.length) {
      console.log('No timetable data available, using mock data');
      return generateMockTimetableData();
    }

    try {
      console.log('Processing timetable data:', backendData);
      
      return backendData.map((timetable, optionIndex) => {
        const schedule = days.map((dayName, dayIndex) => {
          const dayData = timetable.days?.find(d => d?.day === dayName) || { slots: [] };
          
          return {
            day: dayName,
            slots: timeSlots.map((timeSlot, timeIndex) => {
              const apiTimeFormat = timeSlot.replace(/ /g, '');
              
              const foundSlot = dayData.slots?.find(s => {
                return s?.time === apiTimeFormat || 
                       s?.time === timeSlot || 
                       (s?.time?.startsWith(timeSlot.split(' - ')[0]) && 
                        s?.time?.endsWith(timeSlot.split(' - ')[1]));
              });
              
              if (foundSlot) {
                return {
                  code: foundSlot.code || timetable.moduleCode || 'Unknown',
                  name: foundSlot.subject || 'Unknown Subject',
                  room: foundSlot.venu || foundSlot.room || rooms[Math.floor(Math.random() * rooms.length)],
                  lecturer: foundSlot.lecturer || 'Unknown Lecturer'
                };
              }
              
              if (optionIndex === 0 && timeIndex % 2 === dayIndex % 2) {
                const module = moduleData.year1.modules[Math.floor(Math.random() * moduleData.year1.modules.length)];
                return {
                  code: module.code,
                  name: module.name,
                  room: rooms[Math.floor(Math.random() * rooms.length)],
                  lecturer: module.lecturer
                };
              }
              
              return null;
            })
          };
        });
        
        return {
          id: optionIndex + 1,
          schedule
        };
      });
    } catch (err) {
      console.error('Error processing timetable data:', err);
      setError(`Error processing timetable data: ${err.message}`);
      return generateMockTimetableData();
    }
  };

  const generateMockTimetableData = () => {
    try {
      const getModulesForYearAndSpec = (year, spec) => {
        if (year === '1') {
          return moduleData.year1.modules;
        }
        if (moduleData[`year${year}`]?.[spec]) {
          return moduleData[`year${year}`][spec];
        }
        if (moduleData[`year${year}`]?.common) {
          return moduleData[`year${year}`].common;
        }
        return moduleData.year1.modules;
      };

      const currentSpecName = getSpecName(Number(specializationId));
      
      let modules = getModulesForYearAndSpec(yearId, currentSpecName);
      
      if (!modules || modules.length === 0) {
        console.warn(`No modules found for Year ${yearId}, Specialization: ${currentSpecName}`);
        modules = [
          { code: 'CS101', name: 'Introduction to Computing', lecturer: 'Dr. Smith' },
          { code: 'CS102', name: 'Programming Fundamentals', lecturer: 'Prof. Johnson' },
          { code: 'CS103', name: 'Database Systems', lecturer: 'Dr. Williams' },
          { code: 'CS104', name: 'Web Development', lecturer: 'Prof. Brown' },
          { code: 'CS105', name: 'Computer Networks', lecturer: 'Dr. Davis' }
        ];
      }
      
      return Array(3).fill(null).map((_, optionIndex) => ({
        id: optionIndex + 1,
        schedule: days.map((day, dayIndex) => ({
          day,
          slots: timeSlots.map((time, timeIndex) => {
            const shouldCreateClass = 
              (timeIndex + dayIndex + optionIndex) % 3 === 0 || 
              (dayIndex * 2 + timeIndex) % 4 === optionIndex % 4;
              
            if (shouldCreateClass && modules.length) {
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
    } catch (error) {
      console.error('Error generating mock data:', error);
      
      return Array(3).fill(null).map((_, optionIndex) => ({
        id: optionIndex + 1,
        schedule: days.map((day, dayIndex) => ({
          day,
          slots: timeSlots.map((time, timeIndex) => {
            if ((timeIndex + dayIndex) % 3 === optionIndex % 3) {
              return {
                code: `CS${100 + timeIndex + dayIndex}`,
                name: `Course ${timeIndex + 1}`,
                room: `Room ${String.fromCharCode(65 + timeIndex % 6)}`,
                lecturer: `Dr. ${String.fromCharCode(65 + (timeIndex + dayIndex) % 26)}`
              };
            }
            return null;
          })
        }))
      }));
    }
  };

  const handleRegenerateTimetables = async () => {
    Swal.fire({
      title: 'Regenerate Timetables?',
      text: 'This will create new timetable options and replace the current ones. Are you sure you want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: 'Yes, regenerate!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setRegenerating(true);
          const specName = getSpecName(Number(specializationId));
          
          const result = await generateTimetablesForYearSpec(yearId, encodeURIComponent(specName));
          
          if (!result.success) {
            throw new Error(result.error || 'Failed to regenerate timetables');
          }
          
          console.log('New timetables generated:', result.data);
          
          const processedData = processTimetableData(result.data);
          setOptions(processedData);
          setTimetableData(result.data);
          setSelectedOption(0);
          
          setError(null);
          
          Swal.fire({
            title: 'Success!',
            text: 'Timetables have been regenerated successfully.',
            icon: 'success',
            confirmButtonColor: theme.palette.primary.main
          });
          
        } catch (err) {
          console.error('Failed to regenerate timetables:', err);
          setError(`Failed to regenerate timetables: ${err.message}`);
          
          const mockData = generateMockTimetableData();
          setOptions(mockData);
          
          Swal.fire({
            title: 'Error',
            text: `Failed to regenerate timetables: ${err.message}`,
            icon: 'error',
            confirmButtonColor: theme.palette.primary.main
          });
        } finally {
          setRegenerating(false);
        }
      }
    });
  };

  const handleDownloadPDF = () => {
    if (timetableRef.current) {
      const specName = getSpecName(Number(specializationId));
      const fileName = `timetable_year${yearId}_${specName.replace(/\s+/g, '_')}_option${selectedOption + 1}.pdf`;
      generateTimetablePDF(timetableRef.current, fileName);
    }
  };

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const specName = getSpecName(Number(specializationId));
        console.log(`Fetching timetables for Year ${yearId}, Specialization: ${specName}`);
        
        let result = await getFilteredTimetables({
          year: Number(yearId),
          specialization: specName
        });

        console.log('API response:', result);
        
        if (!result.data || result.data.length === 0) {
          console.log('No timetables found. Generating new ones...');
          result = await generateTimetablesForYearSpec(yearId, encodeURIComponent(specName));
        }

        if (result.error) {
          throw new Error(result.error);
        }

        console.log('Timetable data received:', result.data);
        
        if (!result.data || result.data.length === 0) {
          console.log('No timetable data available after generation, using mock data.');
          const mockData = generateMockTimetableData();
          setOptions(mockData);
        } else {
          const processedData = processTimetableData(result.data);
          setOptions(processedData);
          setTimetableData(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch timetable data:', err);
        setError(`Failed to load timetable: ${err.message}`);
        
        const mockData = generateMockTimetableData();
        setOptions(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableData();
  }, [yearId, specializationId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <StyledContainer maxWidth="xl">
          <Zoom in={true} timeout={500}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/specializations/${yearId}`)}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRegenerateTimetables}
                disabled={regenerating}
                sx={{
                  borderRadius: '8px',
                  height: '56px'
                }}
              >
                {regenerating ? 'Generating...' : 'Regenerate Timetables'}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<GetAppIcon />}
                onClick={handleDownloadPDF}
                sx={{
                  borderRadius: '8px',
                  height: '56px'
                }}
              >
                Download PDF
              </Button>
            </Box>
          </Box>

          <StyledTabs
            value={selectedOption}
            onChange={(e, newValue) => setSelectedOption(newValue)}
            centered
            variant="scrollable"
            scrollButtons="auto"
          >
            {options.map((option, index) => (
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
                ref={timetableRef}
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
                          const schedule = options[selectedOption]?.schedule || [];
                          const daySchedule = schedule[dayIndex] || { slots: [] };
                          const subject = daySchedule.slots?.[timeIndex];
                          
                          const isSelectedRoom = !selectedRoom || (subject?.room === selectedRoom);
                          
                          return (
                            <ContentCell 
                              key={`${day}-${timeSlot}`}
                              hascontent={subject && isSelectedRoom ? 1 : 0}
                            >
                              {subject && isSelectedRoom && (
                                <Fade in={true} timeout={800}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <div className="subject">{subject.code || 'N/A'}</div>
                                    <div className="subject-name">{subject.name || 'Unknown Subject'}</div>
                                    <div className="room">{subject.room || 'No Room'}</div>
                                    <div className="lecturer">{subject.lecturer || 'No Lecturer'}</div>
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
      </Container>
      <Footer />
    </>
  );
};

export default TimetableOptions;