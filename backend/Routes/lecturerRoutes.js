const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Lecturer = require("../Model/lecturerModel");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/lecturers/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Helper function for error responses
const errorResponse = (res, status, message, error = null) => {
    return res.status(status).json({
        success: false,
        message,
        error: error?.message || null
    });
};

// Add new lecturer
router.post("/add", async (req, res) => {
    try {
        console.log("Request body:", req.body);
        
        const {
            lecturerId,
            fullName,
            userName,
            email,
            phoneNumber,
            DOB,
            gender,
            address,
            nic,
            specialization,
            year,
            modules
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'lecturerId', 'fullName', 'userName', 'email', 
            'phoneNumber', 'DOB', 'gender', 'address', 
            'nic', 'specialization', 'year', 'modules'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return errorResponse(res, 400, `Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate NIC format (Sri Lankan)
        const nicRegex = /^(\d{9}[vV]|\d{12})$/;
        if (!nicRegex.test(nic)) {
            return errorResponse(res, 400, "Invalid NIC format (e.g., 123456789V or 123456789012)");
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return errorResponse(res, 400, "Phone number must be 10 digits");
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(res, 400, "Invalid email format");
        }

        // Check if lecturer already exists
        const existingLecturer = await Lecturer.findOne({ 
            $or: [{ nic }, { email }, { lecturerId }] 
        });
        
        if (existingLecturer) {
            return errorResponse(res, 400, "Lecturer with this NIC, Email or ID already exists");
        }

        // Validate modules
        if (!modules || (Array.isArray(modules) && modules.length === 0)) {
            return errorResponse(res, 400, "At least one module must be selected");
        }

        // Create new lecturer
        const newLecturer = new Lecturer({
            lecturerId,
            fullName,
            userName,
            email,
            phoneNumber,
            DOB: new Date(DOB),
            gender,
            address,
            nic,
            specialization,
            year,
            modules: Array.isArray(modules) ? modules : [modules]
        });

        // Save to database
        await newLecturer.save();
        
        res.status(201).json({ 
            success: true,
            message: "Lecturer added successfully!", 
            data: newLecturer 
        });

    } catch (error) {
        console.error("Full error:", error);
        if (error.name === 'ValidationError') {
            return errorResponse(res, 400, "Validation failed", error);
        }
        errorResponse(res, 500, "Internal Server Error", error);
    }
});

// Get all lecturers
router.get("/all", async (req, res) => {
    try {
        const lecturers = await Lecturer.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true,
            message: lecturers.length > 0 ? "Lecturers retrieved successfully" : "No lecturers found",
            data: lecturers,
            count: lecturers.length
        });
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        errorResponse(res, 500, "Internal Server Error", error);
    }
});

// Get lecturer by ID
router.get("/id/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return errorResponse(res, 400, "Invalid lecturer ID format");
        }

        const lecturer = await Lecturer.findById(req.params.id);
        if (!lecturer) {
            return errorResponse(res, 404, "Lecturer not found");
        }

        res.status(200).json({ 
            success: true,
            data: lecturer 
        });
    } catch (error) {
        console.error("Error fetching lecturer:", error);
        errorResponse(res, 500, "Internal Server Error", error);
    }
});

// Get lecturer by lecturerId
router.get("/lecturer-id/:lecturerId", async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ lecturerId: req.params.lecturerId });
        if (!lecturer) {
            return errorResponse(res, 404, "Lecturer not found");
        }

        res.status(200).json({ 
            success: true,
            data: lecturer 
        });
    } catch (error) {
        console.error("Error fetching lecturer:", error);
        errorResponse(res, 500, "Internal Server Error", error);
    }
});

// Update lecturer
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return errorResponse(res, 400, "Invalid lecturer ID format");
        }

        const updatedData = req.body;
        
        // Ensure modules is an array
        if (updatedData.modules && typeof updatedData.modules === "string") {
            updatedData.modules = updatedData.modules.split(",").map(item => item.trim());
        }

        const updatedLecturer = await Lecturer.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedLecturer) {
            return errorResponse(res, 404, "Lecturer not found");
        }

        res.status(200).json({ 
            success: true,
            message: "Lecturer updated successfully",
            data: updatedLecturer 
        });
    } catch (error) {
        console.error("Update Error:", error);
        if (error.name === 'ValidationError') {
            return errorResponse(res, 400, "Validation failed", error);
        }
        errorResponse(res, 500, "Server error while updating lecturer", error);
    }
});

// Delete lecturer
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return errorResponse(res, 400, "Invalid lecturer ID format");
        }

        const deletedLecturer = await Lecturer.findByIdAndDelete(req.params.id);
        if (!deletedLecturer) {
            return errorResponse(res, 404, "Lecturer not found");
        }

        res.status(200).json({ 
            success: true,
            message: "Lecturer deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting lecturer:", error);
        errorResponse(res, 500, "Failed to delete lecturer", error);
    }
});

// Gender distribution for pie chart
router.get("/gender-distribution", async (req, res) => {
    try {
        const genderCount = await Lecturer.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            message: "Gender distribution retrieved",
            data: genderCount
        });
    } catch (error) {
        console.error("Error fetching gender distribution:", error);
        errorResponse(res, 500, "Error fetching gender distribution", error);
    }
});

module.exports = router;