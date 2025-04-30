import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Typography, Box, CircularProgress, Alert 
} from '@mui/material';
import { Delete, Edit, Refresh } from '@mui/icons-material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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

const TimetableList = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/timetable');
      setTimetable(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to fetch timetable data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/timetable/${id}`);
      fetchTimetable();
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete timetable entry.');
    }
  };

  return (
    <Box className="fade-in">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          Timetable Entries
        </Typography>
        <RefreshButton
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchTimetable}
          disabled={loading}
        >
          Refresh
        </RefreshButton>
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
        <StyledTableContainer component={Paper}>
          <Table aria-label="timetable entries" stickyHeader>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Year</StyledTableCell>
                <StyledTableCell>Specialization</StyledTableCell>
                <StyledTableCell>Lecture</StyledTableCell>
                <StyledTableCell>Module</StyledTableCell>
                <StyledTableCell>Day</StyledTableCell>
                <StyledTableCell>Start Time</StyledTableCell>
                <StyledTableCell>End Time</StyledTableCell>
                <StyledTableCell>Venue</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
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
                  <TableCell>
                    <ActionButton
                      component={Link}
                      to={`/edit/${entry._id}`}
                      color="primary"
                      aria-label="edit"
                    >
                      <Edit />
                    </ActionButton>
                    <ActionButton
                      color="error"
                      aria-label="delete"
                      onClick={() => deleteEntry(entry._id)}
                    >
                      <Delete />
                    </ActionButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
    </Box>
  );
};

export default TimetableList;