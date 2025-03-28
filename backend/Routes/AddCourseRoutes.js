const express = require("express");
const router = express.Router();
const { addcourse } = require('../Model/CourseModel');
const { body, validationResult } = require('express-validator');

// Add course
router.post('/add', 
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

    try {
      const newCourse = new addcourse({
        year,
        course,
        moduleName,
        description,
        lectures
      });

      await newCourse.save();
      res.status(201).json({ message: 'Course added successfully!', data: newCourse });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await addcourse.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await addcourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses by year
router.get("/year/:year", async (req, res) => {
  try {
      const year = req.params.year;
      const courses = await addcourse.find({ year: year });
      res.status(200).json(courses);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Failed to fetch data" });
  }
});

// Update course
router.put("/update/:id", async (req, res) => {
  const courseId = req.params.id;
  const { year, course, moduleName, description, lectures } = req.body;

  try {
    const updatedCourse = await addcourse.findByIdAndUpdate(
      courseId,
      {
        year,
        course,
        moduleName,
        description,
        lectures
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully!', data: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
router.delete("/delete/:id", async (req, res) => {
  const courseId = req.params.id;

  try {
    const deletedCourse = await addcourse.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;