const express = require("express");
const router = express.Router();
const { schedule, upload } = require('../Model/CourseModel');
const { body, validationResult } = require('express-validator');

// Add document
router.post('/add', 
  upload.array('documents', 3),
  [
    body('year').notEmpty().withMessage('Year is required').isIn(["1st Year", "2nd Year", "3rd Year", "4th Year"]).withMessage('Invalid year'),
    body('course').notEmpty().withMessage('Specialization is required').isIn(["Information Technology", "Software Engineering", "Cyber Security", "Interactive Media", "Data Science"]).withMessage('Invalid Specialization'),
    body('moduleName').notEmpty().withMessage('Module name is required').isLength({ max: 100 }).withMessage('Module name must be at most 100 characters long'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be at most 500 characters long'),
    body('lectures').isArray({ min: 1, max: 5 }).withMessage('You must provide between 1 and 5 lectures'),
    body('lectures.*').notEmpty().withMessage('Lecture name cannot be empty').isLength({ max: 100 }).withMessage('Lecture name must be at most 100 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, course, moduleName, description, lectures } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one document must be uploaded' });
    }

    const documents = req.files.map(file => file.path);

    try {
      const newSchedule = new schedule({
        year,
        course,
        moduleName,
        description,
        lectures,
        documents
      });

      await newSchedule.save();
      res.status(201).json({ message: 'Document uploaded successfully!', data: newSchedule });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all documents
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one document by ID
router.get("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get documents by year
router.get("/year/:year", async (req, res) => {
  try {
      const year = req.params.year;
      const data = await Schedule.find({ year: year });
      res.status(200).json(data);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Failed to fetch data" });
  }
});

// Update document
router.put("/update/:id", upload.array('documents', 3), async (req, res) => {
  const scheduleId = req.params.id;
  const { year, course, moduleName, description, lectures } = req.body;

  try {
    const updatedSchedule = await Schedule.findById(scheduleId);
    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    updatedSchedule.year = year || updatedSchedule.year;
    updatedSchedule.course = course || updatedSchedule.course;
    updatedSchedule.moduleName = moduleName || updatedSchedule.moduleName;
    updatedSchedule.description = description || updatedSchedule.description;
    updatedSchedule.lectures = lectures || updatedSchedule.lectures;

    if (req.files && req.files.length > 0) {
      updatedSchedule.documents = req.files.map(file => file.path);
    }

    await updatedSchedule.save();
    res.json({ message: 'Schedule updated successfully!', data: updatedSchedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete("/delete/:id", async (req, res) => {
  const scheduleId = req.params.id;

  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);
    if (!deletedSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;