const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

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
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images (JPEG, JPG, PNG, GIF), PDFs, and Word documents (DOC, DOCX) are allowed!');
    }
}

const ScheduleSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
    },
    course: {
        type: String,
        required: true,
        enum: ["Information Technology", "Software Engineering", "Cyber Security", "Interactive Media", "Data Science"]
    },
    moduleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    lectures: {
        type: [String],
        required: false,
        validate: {
            validator: function (v) {
                return v.length <= 5;
            },
            message: 'Maximum of 5 lectures allowed!'
        }
    },
    documents: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 3;
            },
            message: 'Maximum of 3 documents allowed!'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Mongoose model - changed variable name to Schedule
const schedule = mongoose.model("schedule", ScheduleSchema);

module.exports = {
    schedule,  // Changed from 'schedule' to 'Schedule'
    upload
};