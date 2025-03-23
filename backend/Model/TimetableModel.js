const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
    },
    moduleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    schedule: {
        type: [{
            day: {
                type: String,
                required: true
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }],
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 7;
            },
            message: 'Maximum of 7 days allowed!'
        }
    },
    documents: {
        type: [String],
        required: false,
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

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;