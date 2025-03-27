const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

// Import Routes
const path = require("path");


//academic shedular

const CourseRoutes = require("./Routes/CourseRoutes.js");
const ScheduleRoutes = require("./Routes/SchedulRoute.js");


dotenv.config();

// Database connection
connectDB();

// Middleware
app.use(cors()); // You can add custom options if needed
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes


app.use("/api/docs", CourseRoutes);
app.use("/api/schedules", ScheduleRoutes);





// Global Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs error stack to console
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
