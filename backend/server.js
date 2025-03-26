const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Initialize app
const app = express();

// Load environment variables
dotenv.config();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const timetableRoutes = require("../Routes/TimetableRoutes.js");
const courseRoutes = require("../Routes/CourseRoutes.js");

app.use('/api/timetables', timetableRoutes);
app.use("/api/docs", courseRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: "Internal Server Error",
    error: err.message 
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});