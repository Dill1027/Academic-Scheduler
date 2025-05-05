const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Lecturer = require("../Model/lecturerModel");
const  User = require("../Model/User");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const bcrypt = require('bcryptjs');

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
router.post("/add", upload.none(), async (req, res) => {
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
            modules,
            password
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'lecturerId', 'fullName', 'userName', 'email', 
            'phoneNumber', 'DOB', 'gender', 'address', 
            'nic', 'specialization', 'year', 'modules',
            'password'
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

        // Validate password
        if (password.length < 8) {
            return errorResponse(res, 400, "Password must be at least 8 characters");
        }

        // Check if lecturer already exists
        const existingLecturer = await Lecturer.findOne({ 
            $or: [{ nic }, { email }, { lecturerId }, { userName }] 
        });
        
        if (existingLecturer) {
            return errorResponse(res, 400, "Lecturer with this NIC, Email, ID or Username already exists");
        }

        // Validate modules
        if (!modules || (Array.isArray(modules) && modules.length === 0)) {
            return errorResponse(res, 400, "At least one module must be selected");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

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
            modules: Array.isArray(modules) ? modules : [modules],
            password: hashedPassword
        });
        const newUser = new User({
                    name: userName,
                    email,
                    password, // Store password in plain text
                    role: "Lecturer",
                });
        
                // Save both student and user
                
                
        

        // Save to database
        await newLecturer.save();
        await newUser.save();
        
        // Remove password from response
        const lecturerResponse = newLecturer.toObject();
        delete lecturerResponse.password;
        
        res.status(201).json({ 
            success: true,
            message: "Lecturer added successfully!", 
            data: lecturerResponse
        });

    } catch (error) {
        console.error("Full error:", error);
        if (error.name === 'ValidationError') {
            return errorResponse(res, 400, "Validation failed", error);
        }
        if (error.code === 11000) {
            return errorResponse(res, 400, "Duplicate key error - Lecturer with some unique field already exists");
        }
        errorResponse(res, 500, "Internal Server Error", error);
    }
});

// Get all lecturers (without passwords)
router.get("/all", async (req, res) => {
    try {
        const lecturers = await Lecturer.find().select('-password').sort({ createdAt: -1 });
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

// Get lecturer by ID (without password)
router.get("/id/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return errorResponse(res, 400, "Invalid lecturer ID format");
        }

        const lecturer = await Lecturer.findById(req.params.id).select('-password');
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

// Get lecturer by lecturerId (without password)
router.get("/lecturer-id/:lecturerId", async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ lecturerId: req.params.lecturerId }).select('-password');
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
router.put("/:id", upload.none(), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return errorResponse(res, 400, "Invalid lecturer ID format");
        }

        const updatedData = req.body;
        
        // If password is being updated, hash it
        if (updatedData.password) {
            if (updatedData.password.length < 8) {
                return errorResponse(res, 400, "Password must be at least 8 characters");
            }
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }
        
        // Ensure modules is an array
        if (updatedData.modules && typeof updatedData.modules === "string") {
            updatedData.modules = updatedData.modules.split(",").map(item => item.trim());
        }

        const updatedLecturer = await Lecturer.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        ).select('-password');

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
        if (error.code === 11000) {
            return errorResponse(res, 400, "Duplicate key error - Lecturer with some unique field already exists");
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

router.get("/download-report", async (req, res) => {
    try {
        const lecturers = await Lecturer.find().select('-password').sort({ createdAt: -1 });
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=lecturers-report.pdf');
        doc.pipe(res);

        // === Report Header ===
        doc
            .fillColor('#1F4E79')
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('INSTITUTE OF HIGHER EDUCATION', { align: 'center' })
            .moveDown(0.2)
            .fillColor('#000000')
            .fontSize(14)
            .font('Helvetica')
            .text('Lecturer Full Details Report', { align: 'center' })
            .moveDown(0.5)
            .fontSize(10)
            .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' })
            .moveDown(1.5);

        // === Summary Section ===
        doc
            .font('Helvetica-Bold')
            .fontSize(13)
            .fillColor('#1F4E79')
            .text('Summary', { underline: true })
            .moveDown(0.5);

        doc
            .font('Helvetica')
            .fontSize(11)
            .fillColor('black')
            .text(`Total Lecturers: ${lecturers.length}`)
            .moveDown(0.5);

        const genderCount = await Lecturer.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        doc.font('Helvetica-Bold').text('Gender Distribution:', { underline: true }).moveDown(0.3);
        doc.font('Helvetica');
        genderCount.forEach(gender => {
            doc.text(`${gender._id}: ${gender.count} (${Math.round((gender.count / lecturers.length) * 100)}%)`);
        });

        doc.moveDown(1.5);

        // === Lecturer Full Details Section ===
        lecturers.forEach((lecturer, index) => {
            if (doc.y > 650) {
                doc.addPage();
            }

            doc
                .fontSize(12)
                .fillColor('#1F4E79')
                .font('Helvetica-Bold')
                .text(`Lecturer ${index + 1}:`, { underline: true })
                .moveDown(0.5);

            doc.fillColor('black').font('Helvetica');

            const fields = [
                { label: "Lecturer ID", value: lecturer.lecturerId },
                { label: "Full Name", value: lecturer.fullName },
                { label: "Username", value: lecturer.userName },
                { label: "Email", value: lecturer.email },
                { label: "Phone Number", value: lecturer.phoneNumber },
                { label: "Date of Birth", value: new Date(lecturer.DOB).toLocaleDateString() },
                { label: "Gender", value: lecturer.gender },
                { label: "Address", value: lecturer.address },
                { label: "NIC", value: lecturer.nic },
                { label: "Specialization", value: lecturer.specialization },
                { label: "Year", value: lecturer.year },
                { label: "Modules", value: Array.isArray(lecturer.modules) ? lecturer.modules.join(', ') : lecturer.modules }
            ];

            fields.forEach(({ label, value }) => {
                doc
                    .font('Helvetica-Bold').text(`${label}: `, { continued: true })
                    .font('Helvetica').text(value || 'N/A');
            });

            doc.moveDown(1.2);
        });

        doc.end();

    } catch (error) {
        console.error("Error generating report:", error);
        errorResponse(res, 500, "Error generating report", error);
    }
});


module.exports = router;