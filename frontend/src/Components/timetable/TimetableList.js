import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Typography, Box, CircularProgress, Alert,
  Container, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Delete, Edit, Refresh, Add, Schedule } from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { getTimetableByYearAndSpec, generateTimetablesForYearSpec } from '../../services/timetableApi';
import Navbar from '../Navbar';
import Footer from '../Navbar/footer';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'white !important',
  fontWeight: '600 !important',
  fontSize: '1rem !important',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const RefreshButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '50px',
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 500,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5),
  borderRadius: '12px',
  backgroundColor: 'rgba(67, 97, 238, 0.05)',
  border: '1px dashed rgba(67, 97, 238, 0.3)',
  marginTop: theme.spacing(4)
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: '50px',
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(67, 97, 238, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(67, 97, 238, 0.3)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.3s ease'
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginRight: theme.spacing(2)
}));

const TimetableList = () => {
  const { yearId, specializationId } = useParams();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [year, setYear] = useState(yearId || '');
  const [specialization, setSpecialization] = useState(specializationId || '');
  
  const specializations = [
    { id: 1, name: 'Information Technology' },
    { id: 2, name: 'Software Engineering' },
    { id: 3, name: 'Information Systems Engineering' },
    { id: 4, name: 'Cyber Security' },
    { id: 5, name: 'Data Science' },
    { id: 6, name: 'Interactive Media' },
    { id: 7, name: 'Computer Systems & Network Engineering' },
    { id: 8, name: 'Artificial Intelligence' }
  ];

  const years = [1, 2, 3, 4];
  
  const getSpecName = (id) => {
    const spec = specializations.find(s => s.id === Number(id));
    return spec ? spec.name : 'Unknown';
  };

  const processTimetableData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    let processedEntries = [];
    
    data.forEach((timetable, tIndex) => {
      const tYear = timetable.year;
      const tSpec = timetable.specialization;
      const moduleCode = timetable.moduleCode || `TT${tIndex + 1}`;
      
      if (timetable.days && Array.isArray(timetable.days)) {
        timetable.days.forEach(day => {
          if (day.slots && Array.isArray(day.slots)) {
            day.slots.forEach(slot => {
              if (slot) {
                const timeParts = slot.time.split('-');
                processedEntries.push({
                  _id: `${tIndex}-${day.day}-${slot.time}`,
                  year: tYear,
                  specialization: tSpec,
                  lecture: slot.lecturer,
                  module: slot.subject,
                  day: day.day,
                  startTime: timeParts[0],
                  endTime: timeParts[1] || '',
                  venue: slot.venu || 'TBD'
                });
              }
            });
          }
        });
      }
    });
    
    return processedEntries;
  };

  const fetchTimetable = async () => {
    if (!year || !specialization) {
      setTimetable([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const specName = getSpecName(specialization);
      
      const response = await getTimetableByYearAndSpec(year, specName);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch timetable data');
      }
      
      const processedData = processTimetableData(response.data);
      setTimetable(processedData);
      setError(null);
    } catch (error) {
      setError('Failed to fetch timetable data. Please try again.');
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [year, specialization]);

  const handleGenerateTimetables = async () => {
    if (!year || !specialization) {
      setError('Please select both year and specialization before generating timetables.');
      return;
    }
    
    try {
      setGenerating(true);
      const specName = getSpecName(specialization);
      
      const response = await generateTimetablesForYearSpec(year, encodeURIComponent(specName));
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate timetables');
      }
      
      const processedData = processTimetableData(response.data);
      setTimetable(processedData);
      setError(null);
    } catch (error) {
      setError(`Failed to generate timetable: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleViewOptions = () => {
    if (year && specialization) {
      navigate(`/timetable-options/${year}/${specialization}`);
    } else {
      setError('Please select both year and specialization first.');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 5 }} className="fade-in">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Timetable Details
          </Typography>
          <Box display="flex" alignItems="center">
            <RefreshButton
              variant="outlined"
              color="primary"
              startIcon={<Refresh />}
              onClick={fetchTimetable}
              disabled={loading || !year || !specialization}
            >
              Refresh
            </RefreshButton>
            
            <GenerateButton
              variant="contained"
              color="primary"
              startIcon={<Schedule />}
              onClick={handleViewOptions}
              disabled={!year || !specialization}
            >
              View Timetable Options
            </GenerateButton>
          </Box>
        </Box>

        <Box 
          sx={{
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            boxShadow: 1,
            mb: 4
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter Timetable
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={2}>
            <StyledFormControl>
              <InputLabel id="year-select-label">Academic Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={year}
                label="Academic Year"
                onChange={(e) => setYear(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a year</em>
                </MenuItem>
                {years.map(y => (
                  <MenuItem key={y} value={y}>Year {y}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            
            <StyledFormControl>
              <InputLabel id="spec-select-label">Specialization</InputLabel>
              <Select
                labelId="spec-select-label"
                value={specialization}
                label="Specialization"
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a specialization</em>
                </MenuItem>
                {specializations.map(spec => (
                  <MenuItem key={spec.id} value={spec.id}>{spec.name}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            
            <GenerateButton
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={handleGenerateTimetables}
              disabled={generating || !year || !specialization}
            >
              {generating ? 'Generating...' : 'Generate Timetables'}
            </GenerateButton>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {timetable.length === 0 ? (
              <EmptyState>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No timetable entries found
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  {year && specialization
                    ? 'Try generating timetables with the "Generate Timetables" button above.'
                    : 'Please select a year and specialization to view or generate timetables.'}
                </Typography>
                {year && specialization && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleGenerateTimetables}
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Generate Timetables'}
                  </Button>
                )}
              </EmptyState>
            ) : (
              <StyledTableContainer component={Paper}>
                <Table aria-label="timetable entries" stickyHeader>
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableCell>Year</StyledTableCell>
                      <StyledTableCell>Specialization</StyledTableCell>
                      <StyledTableCell>Lecturer</StyledTableCell>
                      <StyledTableCell>Module</StyledTableCell>
                      <StyledTableCell>Day</StyledTableCell>
                      <StyledTableCell>Start Time</StyledTableCell>
                      <StyledTableCell>End Time</StyledTableCell>
                      <StyledTableCell>Venue</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {timetable.map((entry) => (
                      <StyledTableRow key={entry._id}>
                        <TableCell>{entry.year}</TableCell>
                        <TableCell>{entry.specialization}</TableCell>
                        <TableCell>{entry.lecture}</TableCell>
                        <TableCell>{entry.module}</TableCell>
                        <TableCell>{entry.day}</TableCell>
                        <TableCell>{entry.startTime}</TableCell>
                        <TableCell>{entry.endTime}</TableCell>
                        <TableCell>{entry.venue}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default TimetableList;