const mongoose = require("mongoose");

const LecturerSchema = new mongoose.Schema({
    lecturerId: {
        type: String,
        required: [true, "Lecturer ID is required"],
        unique: true
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required"]
    },
    userName: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Invalid email format"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone Number is required"],
        match: [/^\d{10}$/, "Invalid phone number format"]
    },
    DOB: {
        type: Date,
        required: [true, "Date of Birth is required"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    nic: {
        type: String,
        required: [true, "NIC is required"],
        unique: true,
        match: [/^(\d{9}[vV]|\d{12})$/, "Invalid NIC format"]
    },
    specialization: {
        type: String,
        required: [true, "Specialization is required"],
        enum: ["Software Engineering", "Information Technology", "Data Science", "Cyber Security", "Interactive Media"]
    },
    year: {
        type: String,
        required: [true, "Year is required"],
        enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
    },
    modules: [{
        type: String,
        required: [true, "At least one module must be selected"]
    }]
}, { timestamps: true });

module.exports = mongoose.model("Lecturer", LecturerSchema);
