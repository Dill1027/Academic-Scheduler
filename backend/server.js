require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const routes= require("./Routes/lecturerRoutes");
const bodyParser = require("body-parser");

const app = express();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Import Routes
const CourseRoutes = require("./Routes/CourseRoutes.js");
const lecturerRoutes= require("./Routes/lecturerRoutes.js")

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/docs", CourseRoutes);
app.use("/api/lecturers", lecturerRoutes);



// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
