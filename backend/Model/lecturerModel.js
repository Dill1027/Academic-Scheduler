const mongoose = require("mongoose");

const LecturerSchema = new mongoose.Schema({
    lecturerId: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    phoneNumber: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true,
        unique: true,
        match: [/^(\d{9}[vV]|\d{12})$/, "Invalid NIC format"] // Sri Lankan NIC validation
    },
    faculty: {
        type: String,
        required: true,
        default: "Computing", // Faculty is always "Computing"
        enum: ["Computing"] // Only Computing faculty is allowed
    },
    year: {
        type: String,
        required: true,
        enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"] // Year selection
    },
    modules: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model("lecturers", LecturerSchema);
