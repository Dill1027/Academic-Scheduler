require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const cors = require("cors");
const path = require("path");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // Added for security headers

// Import Routes
const StudentRoutes = require("./Routes/StudentRoutes.js");
const AuthRoutes = require("./Routes/AuthRoutes.js");
const CourseRoutes = require("./Routes/CourseRoutes.js");
const GroupRoutes = require("./Routes/GroupRoutes.js");
const LecturerRoutes = require("./Routes/lecturerRoutes.js");
const TimetableRoutes = require("./Routes/timetable.routes");

const app = express();

// Database connection
connectDB();

// Middleware Configuration
app.use(helmet()); // Add security headers
app.use(cors({
  origin: "http://localhost:3000", // Explicitly allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  credentials: true, // If using cookies/sessions
}));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' })); // Add body size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/docs", CourseRoutes);
app.use("/api/students", StudentRoutes);
app.use("/api/groups", GroupRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/lecturers", LecturerRoutes);
app.use("/api/timetables", TimetableRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Only show stack in dev
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Handle termination signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));