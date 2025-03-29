const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Student = require("../Model/Student");
const Group = require("../Model/Groups");

// Test route
router.get("/test", (req, res) => res.send("Student routes working"));

// Register a new student with "pending" status
router.post("/", async (req, res) => {
    try {
        const { studentName, registrationNumber, email, phoneNumber, specialization, groupId, password } = req.body;

        if (!registrationNumber) {
            return res.status(400).json({ error: "Registration number is required." });
        }

        const existingStudent = await Student.findOne({ registrationNumber });
        if (existingStudent) {
            return res.status(400).json({ error: "Student with this registration number already exists." });
        }

        let year;
        if (registrationNumber.startsWith("21")) year = 4;
        else if (registrationNumber.startsWith("22")) year = 3;
        else if (registrationNumber.startsWith("23")) year = 2;
        else if (registrationNumber.startsWith("24")) year = 1;
        else return res.status(400).json({ error: "Invalid registration number format." });

        if (groupId) {
            if (!mongoose.Types.ObjectId.isValid(groupId)) {
                return res.status(400).json({ error: "Invalid group ID format." });
            }
            const group = await Group.findById(groupId);
            if (!group) return res.status(400).json({ error: "Group not found." });
            if (group.students.length >= 60) {
                return res.status(400).json({ error: "Group is full. Please choose another group." });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            studentName,
            registrationNumber,
            email,
            phoneNumber,
            specialization,
            year,
            group: groupId || null,
            password: hashedPassword,
            status: "pending", // Add status field
        });

        await newStudent.save();
        res.status(201).json({ message: "Student submitted for review." });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Server error, try again." });
    }
});

// Fetch students (filter by status if provided)
router.get("/student", async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const students = await Student.find(query);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Error fetching students." });
    }
});

// Admin updates student status (approve/decline)
router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "declined"].includes(status)) {
            return res.status(400).json({ error: "Invalid status update." });
        }

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.json({ message: "Student status updated successfully!", updatedStudent });
    } catch (error) {
        res.status(500).json({ error: "Error updating student status." });
    }
});

// Student Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ error: "Invalid email or password." });
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password." });

        // Check status
        if (student.status !== "Approved") {
            return res.status(403).json({ message: "Your account is not approved yet." });
        }
        
        res.json({ message: "Login successful", student });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Retrieve all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(400).json({ message: "No students found" });
    }
});

// Retrieve a single student by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid student ID format." });
        }
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: "Error retrieving student" });
    }
});

// Update student details
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid student ID format." });
        }
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Update successful", updatedStudent });
    } catch (error) {
        res.status(400).json({ message: "Update failed" });
    }
});

// Delete student
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid student ID format." });
        }
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Cannot be deleted" });
    }
});

// Fetch dashboard data for the logged-in student
router.get('/dashboard', async (req, res) => {
    try {
        const studentId = req.user.id; // Assuming you have authentication middleware to get user ID
        const student = await Student.findById(studentId);
        
        // Return student's schedule, assignments, exams, and announcements
        res.json({
            schedule: student.schedule,
            assignments: student.assignments,
            exams: student.exams,
            announcements: student.announcements
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});

/////////////////////////////////

// Get approved students with their modules
router.get("/approved/with-modules", async (req, res) => {
    try {
        const students = await Student.find({ status: "approved" })
            .populate('modules', 'moduleName -_id') // Only populate module names
            .select('studentName year specialization modules');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Error fetching approved students" });
    }
});


// Get modules filtered by year and specialization
router.get("/available-modules", async (req, res) => {
    try {
        const { year, specialization } = req.query;
        
        if (!year || !specialization) {
            return res.status(400).json({ error: "Year and specialization are required" });
        }

        const modules = await Docs.find({ 
            year: `${year} Year`, 
            course: specialization 
        }).select('moduleName -_id');

        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: "Error fetching modules" });
    }
});

// Add module to student
router.post("/:id/add-module", async (req, res) => {
    try {
        const { id } = req.params;
        const { moduleId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Check if module exists
        const module = await Docs.findById(moduleId);
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }

        // Check if student already has this module
        if (student.modules.includes(moduleId)) {
            return res.status(400).json({ error: "Module already assigned" });
        }

        student.modules.push(moduleId);
        await student.save();

        res.json({ message: "Module added successfully", student });
    } catch (error) {
        res.status(500).json({ error: "Error adding module" });
    }





    router.post("/:id/add-module", async (req, res) => {
        try {
            const { id } = req.params;
            const { moduleId } = req.body;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid student ID" });
            }
    
            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }
    
            // Check if student already has 5 modules
            if (student.modules.length >= 5) {
                return res.status(400).json({ error: "Maximum of 5 modules allowed per student" });
            }
    
            // Rest of your existing code...
        } catch (error) {
            res.status(500).json({ error: "Error adding module" });
        }
    });
});

module.exports = router;
