import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
  }
}));

const StyledTable = styled(Table)({
  minWidth: 250,
});

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  fontWeight: 600,
  textAlign: 'center',
  padding: '12px 16px'
}));

const StyledSubHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  fontWeight: 600,
  borderBottom: `2px solid ${theme.palette.divider}`
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:nth-of-type(1)': { fontWeight: 500 },
  '&:nth-of-type(2)': { color: theme.palette.secondary.main }
}));

const DaySchedule = ({ day, slots }) => {
  return (
    <StyledTableContainer component={Paper}>
      <StyledTable size="small">
        <TableHead>
          <TableRow>
            <StyledHeaderCell colSpan={3}>
              {day}
            </StyledHeaderCell>
          </TableRow>
          <TableRow>
            <StyledSubHeaderCell>Time</StyledSubHeaderCell>
            <StyledSubHeaderCell>Subject</StyledSubHeaderCell>
            <StyledSubHeaderCell>Venue</StyledSubHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slots.map((slot, index) => (
            <TableRow key={index} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <StyledBodyCell>{slot.time}</StyledBodyCell>
              <StyledBodyCell>{slot.subject}</StyledBodyCell>
              <StyledBodyCell>{slot.venu}</StyledBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default DaySchedule;