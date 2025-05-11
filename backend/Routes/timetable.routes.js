const express = require('express');
const router = express.Router();
const timetableController = require('../Controllers/timetable.controller');

// GET all timetables
router.get('/', timetableController.getAllTimetables);

// GET filtered timetables
router.get('/filter', timetableController.getFilteredTimetables);

// POST generate timetables
router.post('/generate', timetableController.generateTimetables);

module.exports = router;
