const express = require('express');
const router = express.Router();
const Schedule = require('../Model/SchedulModel');

const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

router.post('/create', async (req, res) => {
    try {
        const { year, course, moduleName, day, lecturer, starttime, endtime, venue } = req.body;

        // Check if any field is missing
        const requiredFields = ['year', 'course', 'moduleName', 'day', 'lecturer', 'starttime', 'endtime', 'venue'];
        const missingField = requiredFields.find(field => !req.body[field]);
        
        if (missingField) {
            return res.status(400).json({ 
                message: 'All fields are required.',
                missing: missingField  // 👈 Tells you which field is missing
            });
        }

        // Validate year
        if (!["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(year)) {
            return res.status(400).json({ message: "Invalid year." });
        }

        // Validate course
        if (!["Information Technology", "Software Engineering", "Cyber Security", "Interactive Media", "Data Science"].includes(course)) {
            return res.status(400).json({ message: "Invalid course." });
        }

        // Validate day
        if (!["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)) {
            return res.status(400).json({ message: "Invalid day." });
        }

        // Validate lecturer (only letters/spaces)
        if (!/^[a-zA-Z\s]+$/.test(lecturer)) {
            return res.status(400).json({ message: "Lecturer name can only contain letters and spaces." });
        }

        // Validate time format
        if (!isValidTime(starttime) || !isValidTime(endtime)) {
            return res.status(400).json({ message: "Time must be in HH:MM (24-hour format)." });
        }

        // Validate end time > start time
        if (new Date(`2000-01-01T${endtime}`) <= new Date(`2000-01-01T${starttime}`)) {
            return res.status(400).json({ message: "End time must be after start time." });
        }

        // Save to DB
        const newSchedule = new Schedule({ year, course, moduleName, day, lecturer, starttime, endtime, venue });
        const savedSchedule = await newSchedule.save();
        
        res.status(201).json(savedSchedule);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;