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

router.post("/add", upload.single("photo"), async (req, res) => {
    try {
        // Log the incoming request
        console.log("Received request body:", req.body);

        const lecturerData = req.body;

        // Validate all fields
        if (!lecturerData.fullName || !lecturerData.userName || !lecturerData.email || !lecturerData.phoneNumber ||
            !lecturerData.DOB || !lecturerData.gender || !lecturerData.address || !lecturerData.nic ||
            !lecturerData.faculty || !lecturerData.year || !lecturerData.modules) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Validate modules as an array of strings
        const modules = lecturerData.modules;
        if (!Array.isArray(modules)) {
            return res.status(400).json({ msg: "Modules must be an array of strings" });
        }

        for (let module of modules) {
            if (typeof module !== 'string') {
                return res.status(400).json({ msg: "Each module must be a string" });
            }
        }

        // Normalize the gender field
        if (lecturerData.gender) {
            lecturerData.gender = lecturerData.gender.charAt(0).toUpperCase() + lecturerData.gender.slice(1).toLowerCase();
        }

        // Generate lecturerId
        const lecturerCount = await Lecturer.countDocuments();
        const newLecturerId = `LEC${(lecturerCount + 1).toString().padStart(5, "0")}`;
        lecturerData.lecturerId = newLecturerId;

        // Check if the email already exists
        const existingLecturer = await Lecturer.findOne({ email: lecturerData.email });
        if (existingLecturer) {
            return res.status(400).json({ msg: "Email already in use" });
        }

        // Save photo if uploaded
        if (req.file) {
            lecturerData.photo = req.file.path;
        }

        // Create a new lecturer
        const newLecturer = new Lecturer(lecturerData);
        await newLecturer.save();

        // Return success response
        res.status(201).json({ lecturerId: newLecturerId, msg: "Lecturer added successfully", lecturer: newLecturer });
    } catch (error) {
        console.error("Error adding lecturer:", error);
        res.status(400).json({ msg: "Lecturer adding failed", error: error.message });
    }
});



// 📌 Get All Lecturers
router.get("/", async (req, res) => {
    try {
        const lecturers = await Lecturer.find();
        res.json(lecturers);
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        res.status(500).json({ msg: "No lecturers found" });
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


// 📌 Update Lecturer by ID
router.put("/:id", upload.single("photo"), async (req, res) => {
    try {
        const { fullName, email, phoneNumber, DOB, gender, address, nic, faculty, year, modules } = req.body;
        const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

        const updatedData = {
            fullName,
            email,
            phoneNumber,
            DOB,
            gender: formattedGender,
            address,
            nic,
            faculty,
            year,
            modules: JSON.parse(modules),
        };

        // Update photo if a new one is uploaded
        if (req.file) {
            updatedData.photo = req.file.path;
        }

        const updatedLecturer = await Lecturer.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedLecturer) {
            return res.status(404).json({ msg: "Lecturer not found" });
        }
        res.json({ msg: "Updated successfully", lecturer: updatedLecturer });
    } catch (error) {
        console.error("Error updating lecturer:", error);
        res.status(500).json({ msg: "Update failed", error: error.message });
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
