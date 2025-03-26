const express = require("express");
const router = express.Router();
const { Docs } = require('../Model/CourseModel');
const { body, validationResult } = require('express-validator');

// Add schedule
router.post('/add', 
  [
    body('year').notEmpty().withMessage('Year is required').isIn(["1st Year", "2nd Year", "3rd Year", "4th Year"]).withMessage('Invalid year'),
    body('moduleName').notEmpty().withMessage('Module name is required').isLength({ max: 100 }).withMessage('Module name must be at most 100 characters long'),
    body('day').notEmpty().withMessage('Day is required').isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).withMessage('Invalid day'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Additional validation for endTime > startTime
    if (req.body.endTime <= req.body.startTime) {
      return res.status(400).json({
        errors: [{
          msg: 'End time must be after start time',
          param: 'endTime',
          location: 'body'
        }]
      });
    }

    const { year, moduleName, day, startTime, endTime } = req.body;

    try {
      const newSchedule = new Docs({
        year,
        moduleName,
        day,         
        startTime,    
        endTime      
      });

      await newSchedule.save();
      res.status(201).json({ 
        success: true,
        message: 'Schedule created successfully!', 
        data: newSchedule 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }
);

// Get all schedules
router.get("/", async (req, res) => {
    try {
        const schedules = await Docs.find(); 
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get one schedule
router.get("/:id", async (req, res) => {
    try {
        const schedule = await Docs.findById(req.params.id); 
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve schedule
router.put('/approve/:id', async (req, res) => {
    try {
      const schedule = await Docs.findById(req.params.id);
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
  
      schedule.isApproved = true;
      await schedule.save();
  
      res.status(200).json({ message: 'Schedule approved', schedule });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Get approved schedules
router.get('/approved/all', async (req, res) => {
    try {
      const schedules = await Docs.find({ isApproved: true });
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Update schedule
router.put("/update/:id", async (req, res) => {
    const scheduleId = req.params.id;
    const { year, moduleName, day, startTime, endTime } = req.body;

    // Validate endTime > startTime
    if (endTime <= startTime) {
      return res.status(400).json({
        error: "End time must be after start time"
      });
    }

    try {
        const updatedSchedule = await Docs.findByIdAndUpdate(scheduleId, {
            year,
            moduleName,
            day,
            startTime,
            endTime
        }, { new: true });

        if (!updatedSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        res.json({ message: "Schedule updated successfully", updatedSchedule });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete schedule
router.delete("/delete/:id", async (req, res) => {
    const scheduleId = req.params.id;

    try {
        const deletedSchedule = await Docs.findByIdAndDelete(scheduleId);

        if (!deletedSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;