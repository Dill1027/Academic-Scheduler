const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Lecturer = require("../Model/lecturerModel");
const User = require("../Model/User");
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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

// Generate and download lecturer report
router.get("/download-report", async (req, res) => {
    try {
        // Set CORS headers explicitly for this route
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=lecturers-report.pdf');
        
        // Fetch all lecturers from database (without passwords)
        const lecturers = await Lecturer.find().select('-password').sort({ createdAt: -1 });
        
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });
        
        // Pipe the PDF to the response
        doc.pipe(res);
        
        // Add title and header
        doc.fontSize(20)
           .text('Lecturer Details Report', { align: 'center' })
           .moveDown(0.5);
        
        doc.fontSize(10)
           .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' })
           .moveDown(2);
        
        // Add summary section
        doc.fontSize(14)
           .text('Summary', { underline: true })
           .moveDown(0.5);
        
        doc.fontSize(12)
           .text(`Total Lecturers: ${lecturers.length}`)
           .moveDown(1);
        
        // Add gender distribution
        const genderCount = await Lecturer.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);
        
        doc.text('Gender Distribution:', { underline: true })
           .moveDown(0.5);
        
        genderCount.forEach(gender => {
            doc.text(`${gender._id}: ${gender.count} (${Math.round((gender.count / lecturers.length) * 100)}%)`);
        });
        
        doc.moveDown(2);
        
        // Add detailed lecturer information
        doc.fontSize(14)
           .text('Lecturer Details', { underline: true })
           .moveDown(1);
        
        // Add table headers
        const tableHeaders = ['No.', 'ID', 'Name', 'Email', 'Phone', 'Specialization'];
        const columnWidths = [30, 60, 120, 150, 80, 100];
        let y = doc.y;
        
        // Draw table headers
        doc.font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
            doc.text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                width: columnWidths[i],
                align: 'left'
            });
        });
        doc.font('Helvetica');
        
        // Draw horizontal line
        y += 20;
        doc.moveTo(50, y).lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), y).stroke();
        y += 10;
        
        // Add lecturer data rows
        lecturers.forEach((lecturer, index) => {
            if (y > 700) { // Add new page if we're at the bottom
                doc.addPage();
                y = 50;
                
                // Redraw headers on new page
                doc.font('Helvetica-Bold');
                tableHeaders.forEach((header, i) => {
                    doc.text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                        width: columnWidths[i],
                        align: 'left'
                    });
                });
                doc.font('Helvetica');
                y += 30;
            }
            
            const rowData = [
                (index + 1).toString(),
                lecturer.lecturerId,
                lecturer.fullName,
                lecturer.email,
                lecturer.phoneNumber,
                lecturer.specialization
            ];
            
            // Draw row data
            rowData.forEach((data, i) => {
                doc.text(data, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                    width: columnWidths[i],
                    align: 'left'
                });
            });
            
            y += 20;
            
            // Add horizontal line between rows
            doc.moveTo(50, y).lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), y).stroke();
            y += 10;
        });
        
        // Finalize the PDF
        doc.end();
        
    } catch (error) {
        console.error("Error generating report:", error);
        errorResponse(res, 500, "Error generating report", error);
    }
});

module.exports = router;