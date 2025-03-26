const express = require("express");
const router = express.Router();
const { Docs, upload } = require('../Model/CourseModel'); // Import the Docs model and upload middleware
const { body, validationResult } = require('express-validator');

// Add document
router.post('/add', 
  upload.array('documents', 1), // Allow up to 3 files to be uploaded
  [
    body('year').notEmpty().withMessage('Year is required').isIn(["1st Year", "2nd Year", "3rd Year", "4th Year"]).withMessage('Invalid year'),
    body('moduleName').notEmpty().withMessage('Module name is required').isLength({ max: 100 }).withMessage('Module name must be at most 100 characters long'),
    body('day').notEmpty().withMessage('day is required').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required').custom((value, { req }) => value > req.body.startTime).withMessage('End time must be after start time'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, moduleName, description, lectures } = req.body;

    // Check if at least one document is uploaded
    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({ error: 'At least one document must be uploaded' });
    // }

    // Get the file paths of the uploaded documents
    const documents = req.files.map(file => file.path);

    try {
      const newDoc = new Docs({
        year,
        moduleName,
        day,
        startTime,
        endTime,
        documents
      });

      await newDoc.save();
      res.status(201).json({ message: 'Create schedule successfully!', data: newDoc });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;