import React from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';

const specializations = [
  'Information Technology',
  'Data Science',
  'Software Engineering',
  'Interactive Media',
  'Cyber Security'
];

const FilterPanel = ({ filters, setFilters, applyFilters, resetFilters, generateTimetables }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              name="year"
              value={filters.year}
              onChange={handleChange}
              label="Year"
            >
              <MenuItem value="">All Years</MenuItem>
              <MenuItem value={1}>1st Year</MenuItem>
              <MenuItem value={2}>2nd Year</MenuItem>
              <MenuItem value={3}>3rd Year</MenuItem>
              <MenuItem value={4}>4th Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Specialization</InputLabel>
            <Select
              name="specialization"
              value={filters.specialization}
              onChange={handleChange}
              label="Specialization"
            >
              <MenuItem value="">All Specializations</MenuItem>
              {specializations.map(spec => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={applyFilters}
            sx={{ mr: 2 }}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outlined" 
            onClick={resetFilters}
            sx={{ mr: 2 }}
          >
            Reset Filters
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={generateTimetables}
          >
            Generate Timetables
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterPanel;