const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const Student = require('../Model/Student');
const AuthMiddleware = require('../Middleware/AuthMiddleware');
const RoleMiddleware = require('../Middleware/RoleMiddleware');
const cors = require('cors');  // Import cors for route-specific configuration

const router = express.Router();

// Apply cors specifically to auth routes as a safety measure
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204
};

router.use(cors(corsOptions));

// Explicit handler for OPTIONS requests on register endpoint
router.options('/register', (req, res) => {
  res.status(204).end();
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Register endpoint called with body:', req.body);
    
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Student Login Route
router.post("/logins", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login request received:", email); // Debugging (don't log passwords!)

    // Find student by email
    const student = await Student.findOne({ email });
    
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
