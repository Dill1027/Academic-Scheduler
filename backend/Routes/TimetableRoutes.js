const express = require('express');
const {
    createTimetable,
    getAllTimetables,
    getTimetable,
    updateTimetable,
    removeDocument,
    deleteTimetable
} = require('../TimetableController.js');
const upload = require('../Middleware/uploadMiddleware.js');

const router = express.Router();

// Create a new timetable
router.post('/add', upload.array('documents', 3), createTimetable);

// Get all timetables
router.get('/all', getAllTimetables);

// Get a single timetable
router.get('/:id', getTimetable);

// Update a timetable
router.put('/update/:id', upload.array('documents', 3), updateTimetable);

// Remove a document from timetable
router.post('/remove-document/:id', removeDocument);

// Delete a timetable
router.delete('/delete/:id', deleteTimetable);

module.exports = router;