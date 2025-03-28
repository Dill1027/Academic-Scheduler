const mongoose = require('mongoose');
const path = require('path');

const addcourseSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const addcourse = mongoose.model("addcourse", addcourseSchema);

module.exports = {
    addcourse
};