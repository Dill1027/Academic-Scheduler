const express = require('express');
// const bcrypt = require('bcrypt'); // ✅ Add this line

const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const Student = require('../Model/Student'); // Ensure the correct path to your Student model
const AuthMiddleware = require('../Middleware/AuthMiddleware');
const RoleMiddleware = require('../Middleware/RoleMiddleware');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
  res.json({ token, user });
});
// Student Login Route
router.post("/logins", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    console.log("Login request received:", email, password); // Debugging

    // Find student by email
    const student = await Student.findOne({ email });
    console.log("Found student:", student); // Check if student exists

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    

// Direct password comparison (without bcrypt)
if (password !== student.password) {
  return res.status(400).json({ message: "Invalid credentials" });
}

// Proceed to generate JWT token
const token = jwt.sign({ id: student._id }, "your_secret_key", { expiresIn: "1h" });
res.json({ token, student });


  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
