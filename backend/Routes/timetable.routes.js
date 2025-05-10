const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const {
  generateTimetables,
  getAllTimetables,
  getFilteredTimetables
} = require('../Controllers/timetable.controller');

// Controller-based routes
router.post('/generate', generateTimetables);
router.get('/filtered', getFilteredTimetables);
router.get('/filter', getFilteredTimetables); // Alias for backward compatibility

// Get all timetable entries - use the controller method
router.get('/', getAllTimetables);

// Direct model-based routes
// Create a new timetable entry
router.post('/', async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.status(201).json(timetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific timetable entry
router.get('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable entry not found' });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a timetable entry
router.put('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!timetable) return res.status(404).json({ message: 'Timetable entry not found' });
    res.json(timetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a timetable entry
router.delete('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable entry not found' });
    res.json({ message: 'Timetable entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
