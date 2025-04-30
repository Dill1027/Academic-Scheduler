const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const LecturerSchema = new mongoose.Schema({
    lecturerId: {
        type: String,
        required: [true, "Lecturer ID is required"],
        unique: true,
        match: [/^L\d{3}$/, "Lecturer ID must start with 'L' followed by exactly 3 digits (e.g., L123)"]
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        minlength: [3, "Full Name must be at least 3 characters"],
        maxlength: [50, "Full Name cannot exceed 50 characters"]
    },
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [5, "Username must be at least 5 characters"],
        maxlength: [15, "Username cannot exceed 15 characters"],
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false // Don't return password in queries by default
    },
    isActive: {
        type: Boolean,
        default: false // Admin needs to activate account
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    phoneNumber: {
        type: String,
        required: [true, "Phone Number is required"],
        match: [/^(?:\+94|0)?7\d{8}$/, "Invalid phone number format. Use +947XXXXXXXX or 07XXXXXXXX"]
    },
    DOB: {
        type: Date,
        required: [true, "Date of Birth is required"],
        validate: {
            validator: function (value) {
                const ageDiff = new Date().getFullYear() - value.getFullYear();
                return ageDiff >= 18;
            },
            message: "Lecturer must be at least 18 years old"
        }
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        minlength: [5, "Address must be at least 5 characters"],
        maxlength: [100, "Address cannot exceed 100 characters"]
    },
    nic: {
        type: String,
        required: [true, "NIC is required"],
        unique: true,
        match: [/^(\d{9}[vV]|\d{12})$/, "NIC must be 9 digits followed by 'V'/'v' or 12 digits"]
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
    modules: {
        type: [String],
        validate: {
            validator: function (modules) {
                return modules.length > 0;
            },
            message: "At least one module must be selected"
        }
    }
}, { timestamps: true });

// Hash password before saving
LecturerSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
LecturerSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Lecturer", LecturerSchema);
