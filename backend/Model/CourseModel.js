const mongoose = require('mongoose');
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

// Mongoose schema for the AddDoc model
const docSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"] // Only allow specific year values
    },
    course: {
        type: String,
        required: true,
        enum: ["Information Technology", "Software Engineering", "Cyber Security", "Interactive Media", "Data Science"] // Only allow specific course values
    },
    moduleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false // Optional field
    },
    lectures: {
        type: [String], // Array of lecture names
        required: false,
        validate: {
            validator: function (v) {
                return v.length <= 3; // Ensure no more than 3 lectures are added
            },
            message: 'Maximum of 3 lectures allowed!'
        }
    },
    documents: {
        type: [String], // Array of file paths (stored in the 'uploads' directory)
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 3; // Ensure no more than 3 documents are uploaded
            },
            message: 'Maximum of 3 documents allowed!'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    }
});

// Create the Mongoose model
const Docs = mongoose.model("Docs", docSchema);

module.exports = {
    Docs,
    upload
};