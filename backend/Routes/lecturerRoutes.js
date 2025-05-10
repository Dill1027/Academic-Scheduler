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
        const doc = new PDFDocument({ 
            margin: 50,
            size: 'A4',
            bufferPages: true,
            font: 'Helvetica'
        });
        
        // Pipe the PDF to the response
        doc.pipe(res);

        // === Color Palette ===
        const colors = {
            primary: '#2c3e50',
            secondary: '#3498db',
            accent: '#e74c3c',
            lightGray: '#f5f5f5',
            darkGray: '#333',
            mediumGray: '#999',
            white: '#ffffff'
        };

        // === Helper Functions ===
        const drawRoundedRect = (x, y, width, height, radius, fill, stroke) => {
            doc
                .roundedRect(x, y, width, height, radius)
                .fillAndStroke(fill, stroke);
        };

        const drawGradientHeader = (yPos, title) => {
            // Gradient background
            const gradient = doc.linearGradient(50, yPos, 550, yPos + 30);
            gradient.stop(0, colors.primary);
            gradient.stop(1, colors.secondary);
            
            doc
                .fill(gradient)
                .rect(50, yPos, 500, 30)
                .fill();
            
            // Header text
            doc
                .fillColor(colors.white)
                .fontSize(16)
                .font('Helvetica-Bold')
                .text(title, 50, yPos + 8, {
                    width: 500,
                    align: 'center'
                });
            
            return yPos + 40;
        };

        // === Cover Page ===
        // Background gradient
        const coverGradient = doc.linearGradient(0, 0, 0, 600);
        coverGradient.stop(0, colors.primary);
        coverGradient.stop(1, colors.secondary);
        doc.rect(0, 0, 612, 792).fill(coverGradient);

        // Institute logo/name
        doc
            .fillColor(colors.white)
            .fontSize(36)
            .font('Helvetica-Bold')
            .text('INSTITUTE OF', 0, 200, {
                width: 612,
                align: 'center'
            })
            .text('HIGHER EDUCATION', 0, 240, {
                width: 612,
                align: 'center'
            });

        // Report title
        doc
            .fontSize(24)
            .text('Lecturer Management Report', 0, 320, {
                width: 612,
                align: 'center'
            });

        // Report details
        doc
            .fontSize(14)
            .text(`Generated on: ${new Date().toLocaleDateString()}`, 0, 380, {
                width: 612,
                align: 'center'
            })
            .text(`Total Lecturers: ${lecturers.length}`, 0, 400, {
                width: 612,
                align: 'center'
            });

        // Footer note
        doc
            .fontSize(10)
            .text('Confidential Report - For Internal Use Only', 0, 750, {
                width: 612,
                align: 'center'
            });

        doc.addPage();

        // === Table of Contents ===
        let yPos = drawGradientHeader(50, 'Table of Contents');
        
        doc
            .fillColor(colors.darkGray)
            .fontSize(12);
        
        ['Executive Summary', 'Lecturer Details', 'Appendices'].forEach((item, i) => {
            doc
                .text(`• ${item}`, 70, yPos + (i * 20))
                .text(`${i+1}`, 500, yPos + (i * 20), {
                    width: 50,
                    align: 'right'
                });
        });

        doc.addPage();

        // === Executive Summary ===
        yPos = drawGradientHeader(50, 'Executive Summary');

        // Summary card with shadow effect
        doc
            .fillColor(colors.lightGray)
            .rect(55, yPos, 490, 100)
            .fill()
            .fillColor(colors.primary)
            .strokeColor(colors.mediumGray)
            .rect(50, yPos-5, 500, 110)
            .fillAndStroke(colors.white, colors.mediumGray);

        // Summary content
        doc
            .fillColor(colors.darkGray)
            .fontSize(11)
            .text(`Total Lecturers: ${lecturers.length}`, 70, yPos + 15)
            .text(`Report Period: ${new Date().getFullYear()}`, 70, yPos + 35);

        // Gender Distribution
        const genderCount = await Lecturer.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        doc
            .font('Helvetica-Bold')
            .text('Gender Distribution:', 300, yPos + 15)
            .font('Helvetica');
        
        genderCount.forEach((gender, i) => {
            doc
                .fillColor(colors.primary)
                .text(`${gender._id}:`, 300, yPos + 35 + (i * 15))
                .fillColor(colors.accent)
                .text(`${gender.count} (${Math.round((gender.count / lecturers.length) * 100)}%)`, 370, yPos + 35 + (i * 15));
        });

        yPos += 120;

        // Statistics card
        drawRoundedRect(50, yPos, 500, 80, 5, colors.lightGray, colors.mediumGray);
        
        doc
            .fillColor(colors.primary)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Key Statistics', 60, yPos + 10);
        
        // Add some sample statistics (you can replace with real data)
        doc
            .fillColor(colors.darkGray)
            .fontSize(10)
            .text('• Average years of service: 4.2', 60, yPos + 30)
            .text('• Most common specialization: Computer Science', 60, yPos + 50)
            .text('• New lecturers this year: 12', 300, yPos + 30);

        doc.addPage();

        // === Lecturer Details ===
        yPos = drawGradientHeader(50, 'Lecturer Details');

        // Lecturer cards
        lecturers.forEach((lecturer, index) => {
            // Check if we need a new page
            if (yPos > 650) {
                doc.addPage();
                yPos = drawGradientHeader(50, 'Lecturer Details (Continued)');
            }

            // Card with shadow
            doc
                .fillColor(colors.white)
                .rect(55, yPos, 490, 130)
                .fill()
                .fillColor(colors.lightGray)
                .rect(50, yPos-5, 500, 140)
                .fillAndStroke(colors.white, colors.mediumGray);

            // Card header
            doc
                .fillColor(colors.primary)
                .fontSize(12)
                .font('Helvetica-Bold')
                .text(`Lecturer #${index + 1}: ${lecturer.lecturerId}`, 60, yPos + 10);

            // Name with accent color
            doc
                .fillColor(colors.secondary)
                .fontSize(16)
                .text(lecturer.fullName, 60, yPos + 30);

            // Two-column details
            doc
                .fillColor(colors.darkGray)
                .fontSize(10);

            // Left column
            doc
                .text(`Email: ${lecturer.email}`, 60, yPos + 55)
                .text(`Phone: ${lecturer.phoneNumber}`, 60, yPos + 75)
                .text(`Gender: ${lecturer.gender}`, 60, yPos + 95);

            // Right column
            doc
                .text(`Specialization: ${lecturer.specialization}`, 300, yPos + 55)
                .text(`Modules: ${lecturer.modules.join(', ')}`, 300, yPos + 75)
                .text(`Joined: ${lecturer.createdAt.toLocaleDateString()}`, 300, yPos + 95);

            yPos += 150;
        });

        // === Final Page with Signature ===
        doc.addPage();
        yPos = 100;

        // Conclusion section
        doc
            .fillColor(colors.primary)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Report Conclusion', 50, yPos, {
                underline: true
            });

        doc
            .fillColor(colors.darkGray)
            .fontSize(11)
            .text('This report provides a comprehensive overview of all lecturers currently registered in the system. ', 50, yPos + 30, {
                width: 500,
                lineGap: 5
            })
            .text('The data reflects the most up-to-date information available and should be used for official purposes only.', 50, yPos + 60, {
                width: 500
            });

        // Signature area
        yPos = 600;
        doc
            .fillColor(colors.mediumGray)
            .fontSize(10)
            .text('Prepared by:', 100, yPos);

        // Signature line
        doc
            .moveTo(100, yPos + 30)
            .lineTo(300, yPos + 30)
            .strokeColor(colors.primary)
            .stroke();

        doc
            .text('Authorized Signature', 100, yPos + 35, {
                width: 200,
                align: 'center'
            });

        // Date
        doc
            .text('Date:', 350, yPos)
            .moveTo(350, yPos + 30)
            .lineTo(450, yPos + 30)
            .stroke();

        // Footer
        doc
            .fillColor(colors.mediumGray)
            .fontSize(8)
            .text('© Institute of Higher Education - Confidential Document', 50, 780, {
                width: 500,
                align: 'center'
            });

        doc.end();

    } catch (error) {
        console.error("Error generating report:", error);
        errorResponse(res, 500, "Error generating report", error);
    }
});

module.exports = router;