const express = require("express");
const router = express.Router();
const TimetableController = require("../Controllers/timetable.controller");

// Generate timetables
router.post("/generate", TimetableController.generateTimetables);

// Get all timetables
router.get("/", TimetableController.getAllTimetables);

// Get filtered timetables
router.get("/filter", TimetableController.getFilteredTimetables);

module.exports = router;
