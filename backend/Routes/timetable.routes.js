const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

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

// Get all timetable entries
router.get('/', async (req, res) => {
  try {
    const { year, specialization, day } = req.query;
    let query = {};
    
    if (year) query.year = year;
    if (specialization) query.specialization = specialization;
    if (day) query.day = day;

    const timetable = await Timetable.find(query);
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
