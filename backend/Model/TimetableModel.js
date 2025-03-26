import mongoose from 'mongoose';
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/uploads'); // Save files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp and the original file name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb); // Validate file types
    }
});

// Function to check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    const mimetype = filetypes.test(file.mimetype); // Check MIME type

    if (mimetype && extname) {
        return cb(null, true); // Accept the file
    } else {
        cb('Error: Only images (JPEG, JPG, PNG, GIF), PDFs, and Word documents (DOC, DOCX) are allowed!');
    }
}

const timetableSchema = new mongoose.Schema({
    year: {
        type: String,
        required: [true, 'Year is required'],
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
    },
    moduleName: {
        type: String,
        required: [true, 'Module name is required'],
        trim: true,
        minlength: [3, 'Module name must be at least 3 characters']
    },

    day: {
        type: String,
        required: [true, 'Day is required'],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },

    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },

    endTime: {
        type: String,
        required: [true, 'End time is required'],
        validate: {
            validator: function(value) {
                return value > this.startTime;
            },
            message: 'End time must be after start time'
        }
    },
  
    documents: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// // Add validation for schedule array
// timetableSchema.path('schedule').validate(function(schedule) {
//     if (!schedule || schedule.length === 0) {
//         return false;
//     }
//     return true;
// }, 'At least one schedule entry is required');

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = {
    Timetable,
    upload
};