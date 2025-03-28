const express = require("express");
const router = express.Router();
const Student = require("../Model/Student");

// Store new registration as "pending"
router.post("/student", async (req, res) => {
  try {
    const newStudent = new Student({ ...req.body, status: "pending" }); // Add status field
    await newStudent.save();
    res.status(201).json({ message: "Student submitted for review." });
  } catch (error) {
    res.status(500).json({ error: "Error submitting student for review." });
  }
});

// Fetch students for admin review (filter by status)
router.get("/student", async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;  // Only fetch students with the given status
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students." });
  }
});

// Admin approves or declines registration
router.patch("/student/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update." });
    }

    await Student.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Student status updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error updating student status." });
  }
});

module.exports = router;
