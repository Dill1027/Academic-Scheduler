const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const StudentRoutes = require("./Routes/StudentRoutes.js");
const AuthRoutes = require("./Routes/AuthRoutes.js");
const rateLimit = require('express-rate-limit'); // Add this import
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

// Import Routes
const path = require("path");

//academic shedular
const CourseRoutes = require("./Routes/CourseRoutes.js");
const GroupRoutes = require("./Routes/GroupRoutes.js");
const lecturerRoutes = require("./Routes/lecturerRoutes.js");

// Try to import timetable routes, if not available use empty router
let timetableRoutes;
try {
    timetableRoutes = require("./Routes/timetable.routes.js");
} catch (err) {
    timetableRoutes = express.Router(); // Create empty router if module not found
}

const errorHandler = require('./Middleware/ErrorMiddleware');

dotenv.config();

// Database connection
connectDB();

// Middleware
app.use(cors({
<<<<<<< HEAD
    origin: 'http://localhost:3000',
=======
    origin: ['http://localhost:3000', 'http://localhost:3001'],
>>>>>>> origin/new-main
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Disposition'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit to 500 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

app.use("/api/docs", CourseRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/groups", GroupRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/timetables", timetableRoutes);

// Global Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs error stack to console
  res.status(500).json({ message: "Something went wrong!" });
});

// Add this after all your routes
app.use(errorHandler);

// Start the server
const PORT = 5000; // Set explicit port for consistency
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
