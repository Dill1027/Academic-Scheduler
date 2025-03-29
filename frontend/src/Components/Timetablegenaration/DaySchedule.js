import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DaySchedule = ({ day, slots }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              <strong>{day}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Room</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slots.map((slot, index) => (
            <TableRow key={index}>
              <TableCell>{slot.time}</TableCell>
              <TableCell>{slot.subject}</TableCell>
              <TableCell>{slot.room}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DaySchedule;