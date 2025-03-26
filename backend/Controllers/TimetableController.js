const Timetable = require('../Model/TimetablesModel.js');
const fs = require('fs');
const path = require('path');

// Helper function to validate time slots
const validateTimeSlots = (schedule) => {
    for (const slot of schedule) {
        if (slot.startTime >= slot.endTime) {
            return false;
        }
    }
    return true;
};

// Create a new timetable
const createTimetable = async (req, res) => {
    try {
        const { year, moduleName, description, schedule } = req.body;
        
        // Parse schedule if it's a string (from FormData)
        const parsedSchedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
        
        // Validate time slots
        if (!validateTimeSlots(parsedSchedule)) {
            return res.status(400).json({ error: 'End time must be after start time for all schedule entries' });
        }
        
        // Handle file uploads
        let documents = [];
        if (req.files && req.files.documents) {
            const files = Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents];
            
            // Validate file count
            if (files.length > 3) {
                return res.status(400).json({ error: 'Maximum 3 files allowed' });
            }
            
            // Process each file
            for (const file of files) {
                // Validate file type
                const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!validTypes.includes(file.mimetype)) {
                    return res.status(400).json({ error: 'Only PDF and Word documents are allowed' });
                }
                
                // Validate file size (10MB max)
                if (file.size > 10 * 1024 * 1024) {
                    return res.status(400).json({ error: 'Files must be smaller than 10MB' });
                }
                
                // Save file
                const uploadDir = path.join(__dirname, '../../uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const filename = `${Date.now()}-${file.name}`;
                const filePath = path.join(uploadDir, filename);
                await file.mv(filePath);
                
                documents.push(filename);
            }
        }
        
        // Create new timetable
        const newTimetable = new Timetable({
            year,
            moduleName,
            description,
            schedule: parsedSchedule,
            documents
        });
        
        await newTimetable.save();
        
        res.status(201).json({
            message: 'Timetable created successfully',
            timetable: newTimetable
        });
    } catch (error) {
        console.error('Error creating timetable:', error);
        res.status(500).json({ error: 'Server error while creating timetable' });
    }
};

// Get all timetables
const getAllTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find().sort({ createdAt: -1 });
        res.status(200).json(timetables);
    } catch (error) {
        console.error('Error fetching timetables:', error);
        res.status(500).json({ error: 'Server error while fetching timetables' });
    }
};

// Get a single timetable
const getTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        
        if (!timetable) {
            return res.status(404).json({ error: 'Timetable not found' });
        }
        
        res.status(200).json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ error: 'Server error while fetching timetable' });
    }
};

// Update a timetable
const updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, moduleName, description, schedule, existingDocuments } = req.body;
        
        // Parse schedule if it's a string (from FormData)
        const parsedSchedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
        
        // Validate time slots
        if (!validateTimeSlots(parsedSchedule)) {
            return res.status(400).json({ error: 'End time must be after start time for all schedule entries' });
        }
        
        // Find the existing timetable
        const timetable = await Timetable.findById(id);
        if (!timetable) {
            return res.status(404).json({ error: 'Timetable not found' });
        }
        
        // Handle existing documents
        let documents = [];
        if (existingDocuments) {
            const parsedExisting = typeof existingDocuments === 'string' ? JSON.parse(existingDocuments) : existingDocuments;
            documents = [...parsedExisting];
        }
        
        // Handle new file uploads
        if (req.files && req.files.documents) {
            const files = Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents];
            
            // Validate total file count
            if (files.length + documents.length > 3) {
                return res.status(400).json({ error: 'Maximum 3 files allowed in total' });
            }
            
            // Process each file
            for (const file of files) {
                // Validate file type
                const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!validTypes.includes(file.mimetype)) {
                    return res.status(400).json({ error: 'Only PDF and Word documents are allowed' });
                }
                
                // Validate file size (10MB max)
                if (file.size > 10 * 1024 * 1024) {
                    return res.status(400).json({ error: 'Files must be smaller than 10MB' });
                }
                
                // Save file
                const uploadDir = path.join(__dirname, '../../uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const filename = `${Date.now()}-${file.name}`;
                const filePath = path.join(uploadDir, filename);
                await file.mv(filePath);
                
                documents.push(filename);
            }
        }
        
        // Update timetable
        timetable.year = year;
        timetable.moduleName = moduleName;
        timetable.description = description;
        timetable.schedule = parsedSchedule;
        timetable.documents = documents;
        
        await timetable.save();
        
        res.status(200).json({
            message: 'Timetable updated successfully',
            timetable
        });
    } catch (error) {
        console.error('Error updating timetable:', error);
        res.status(500).json({ error: 'Server error while updating timetable' });
    }
};

// Remove a document from timetable
const removeDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { documentName } = req.body;
        
        // Find the timetable
        const timetable = await Timetable.findById(id);
        if (!timetable) {
            return res.status(404).json({ error: 'Timetable not found' });
        }
        
        // Check if document exists
        if (!timetable.documents.includes(documentName)) {
            return res.status(404).json({ error: 'Document not found in timetable' });
        }
        
        // Remove document from array
        timetable.documents = timetable.documents.filter(doc => doc !== documentName);
        await timetable.save();
        
        // Delete the file from server
        const filePath = path.join(__dirname, '../../uploads', documentName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.status(200).json({
            message: 'Document removed successfully',
            timetable
        });
    } catch (error) {
        console.error('Error removing document:', error);
        res.status(500).json({ error: 'Server error while removing document' });
    }
};

// Delete a timetable
const deleteTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndDelete(req.params.id);
        
        if (!timetable) {
            return res.status(404).json({ error: 'Timetable not found' });
        }
        
        // Delete associated documents
        for (const doc of timetable.documents) {
            const filePath = path.join(__dirname, '../../uploads', doc);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        res.status(200).json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        console.error('Error deleting timetable:', error);
        res.status(500).json({ error: 'Server error while deleting timetable' });
    }
};

module.exports = {
    createTimetable,
    getAllTimetables,
    getTimetable,
    updateTimetable,
    removeDocument,
    deleteTimetable
};