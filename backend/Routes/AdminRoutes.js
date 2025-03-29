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
// Fetch only pending students
router.get("/student", async (req, res) => {
  try {
    const students = await Student.find({ status: "pending" }); // Fetch only pending students
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
// Delete student after decline
router.delete("/:id", async (req, res) => {
  try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ error: "Invalid student ID format." });
      }

      const deletedStudent = await Student.findByIdAndDelete(req.params.id);
      if (!deletedStudent) return res.status(404).json({ message: "Student not found" });

      // Also delete the student from the User collection
      await User.findOneAndDelete({ email: deletedStudent.email });

      res.json({ message: "Student and associated user deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Cannot delete student" });
  }
});

module.exports = router;
