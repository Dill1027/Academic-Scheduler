import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import DaySchedule from './DaySchedule';

const TimetableCard = ({ timetable }) => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {timetable.specialization} - Year {timetable.year} (Module: {timetable.moduleCode})
      </Typography>
      
      <Grid container spacing={3}>
        {timetable.days.map((day, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DaySchedule day={day.day} slots={day.slots} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TimetableCard;