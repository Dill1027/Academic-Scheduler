const express = require("express");
const router = express.Router();
const {
  generateTimetables,
  getAllTimetables,
  getFilteredTimetables
} = require('../Controllers/timetable.controller');

router.post('/generate', generateTimetables);
router.get('/', getAllTimetables);
router.get('/filter', getFilteredTimetables);

module.exports = router;
