const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
    },
    moduleName: {
        type: String,
        required: true, 
        maxlength: [100, 'Module name must be at most 100 characters long']
    },
    day: {
        type: String,
        required: true, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
        type: String,
        required: true, 
    },
    endTime: {
        type: String,
        required: true, 
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add custom validation for endTime > startTime
timetableSchema.pre('save', function(next) {
    if (this.endTime <= this.startTime) {
        const err = new Error('End time must be after start time');
        next(err);
    } else {
        next();
    }
});

const Docs = mongoose.model('Docs', timetableSchema);

module.exports = {
    Docs
};