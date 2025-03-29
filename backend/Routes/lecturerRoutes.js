const express = require("express");
const multer = require("multer");
const path = require("path");
const Lecturer = require("../Model/lecturerModel");

const router = express.Router();

// Multer setup for file uploads (profile photo)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/lecturers/"); // Store lecturer profile photos in uploads/lecturers/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// ✅ Route to Add a New Lecturer
router.post("/add", async (req, res) => {
    try {
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
            faculty,
            year,
            modules
        } = req.body;

        // ✅ Check if Lecturer already exists (by NIC or Email)
        const existingLecturer = await Lecturer.findOne({ $or: [{ nic }, { email }] });
        if (existingLecturer) {
            return res.status(400).json({ message: "Lecturer with this NIC or Email already exists." });
        }

        // ✅ Create a new lecturer
        const newLecturer = new Lecturer({
            lecturerId,
            fullName,
            userName,
            email,
            phoneNumber,
            DOB,
            gender,
            address,
            nic,
            faculty,
            year,
            modules
        });

        // ✅ Save to Database
        await newLecturer.save();
        res.status(201).json({ message: "Lecturer added successfully!", lecturer: newLecturer });

    } catch (error) {
        console.error("Error adding lecturer:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});




// GET all lecturers
router.get("/all", async (req, res) => {
    try {
        const lecturers = await Lecturer.find(); // Fetch all lecturers from MongoDB
        res.status(200).json(lecturers);
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
// GET a single lecturer by lecturerId
router.get("/:lecturerId", async (req, res) => {
    try {
        const { lecturerId } = req.params;
        const lecturer = await Lecturer.findOne({ lecturerId });

        if (!lecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        res.status(200).json(lecturer);
    } catch (error) {
        console.error("Error fetching lecturer:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Backend: Fetch lecturer by ID
router.get("/:id", async (req, res) => {
    try {
        const lecturer = await Lecturer.findById(req.params.id);
        if (!lecturer) {
            return res.status(404).json({ msg: "Lecturer not found" });
        }
        res.json(lecturer); // Send the lecturer data
    } catch (error) {
        console.error("Error fetching lecturer:", error);
        res.status(500).json({ msg: "Failed to fetch lecturer", error: error.message });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const lecturerId = req.params.id;
        const updatedData = req.body;

        // Ensure modules is an array
        if (typeof updatedData.modules === "string") {
            updatedData.modules = updatedData.modules.split(",").map((item) => item.trim());
        }

        const updatedLecturer = await Lecturer.findByIdAndUpdate(lecturerId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedLecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        res.status(200).json(updatedLecturer);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server error while updating lecturer" });
    }
});


// 📌 Get Lecturer by ID (For Update Form)
router.get("/:id", async (req, res) => {
    try {
        const lecturer = await Lecturer.findById(req.params.id);
        if (!lecturer) {
            return res.status(404).json({ msg: "Lecturer not found" });
        }
        res.json(lecturer);
    } catch (error) {
        console.error("Error fetching lecturer:", error);
        res.status(500).json({ msg: "Error fetching lecturer", error: error.message });
    }
});


// 📌 Delete Lecturer by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedLecturer = await Lecturer.findByIdAndDelete(req.params.id);
        if (!deletedLecturer) {
            return res.status(404).json({ msg: "Lecturer not found" });
        }
        res.json({ msg: "Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting lecturer:", error);
        res.status(500).json({ msg: "Cannot be deleted" });
    }
});

module.exports = router;
