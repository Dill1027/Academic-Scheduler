const mongoose = require('mongoose');
const path = require('path');

const scheduleSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
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
    day: {
        type: String,
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] // Only allow specific day values
    },
    lecturer: {
        type: String,
        required: true
    },
    starttime: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validate HH:MM format
            },
            message: "Invalid time format. Use HH:MM (24-hour format)."
        }
    },
    
    endtime: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validate HH:MM format
            },
            message: "Invalid time format. Use HH:MM (24-hour format)."
        }

    },
    venue: {
        type: String,
        required: true
    },
   
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
