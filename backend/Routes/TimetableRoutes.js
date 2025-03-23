const express = require('express');
const Timetable = require('../models/Timetable');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, JPG, PNG, GIF), PDFs, and Word documents (DOC, DOCX) are allowed!'));
        }
    }
});

// Create a new timetable
router.post('/add', upload.array('documents', 3), async (req, res) => {
    try {
        const { year, moduleName, description, schedule } = req.body;
        const documents = req.files ? req.files.map(file => file.filename) : [];

        const newTimetable = new Timetable({
            year,
            moduleName,
            description,
            schedule: JSON.parse(schedule),
            documents
        });

        await newTimetable.save();
        res.status(201).send(newTimetable);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get all timetables
router.get('/all', async (req, res) => {
    try {
        const timetables = await Timetable.find();
        res.send(timetables);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a single timetable by ID
router.get('/:id', async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        if (!timetable) {
            return res.status(404).send({ error: 'Timetable not found' });
        }
        res.send(timetable);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update a timetable by ID
router.put('/update/:id', upload.array('documents', 3), async (req, res) => {
    try {
        const { year, moduleName, description, schedule } = req.body;
        const documents = req.files ? req.files.map(file => file.filename) : [];

        const updatedTimetable = {
            year,
            moduleName,
            description,
            schedule: JSON.parse(schedule),
            documents
        };

        const timetable = await Timetable.findByIdAndUpdate(req.params.id, updatedTimetable, { new: true });
        if (!timetable) {
            return res.status(404).send({ error: 'Timetable not found' });
        }
        res.send(timetable);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Delete a timetable by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndDelete(req.params.id);
        if (!timetable) {
            return res.status(404).send({ error: 'Timetable not found' });
        }

        // Delete associated files from the uploads directory
        if (timetable.documents && timetable.documents.length > 0) {
            timetable.documents.forEach((file) => {
                const filePath = path.join(__dirname, '../../frontend/public/uploads', file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete the file
                }
            });
        }

        res.send({ message: 'Timetable deleted successfully', deletedTimetable: timetable });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;