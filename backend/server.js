const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const StudentRoutes = require("./Routes/StudentRoutes.js");
const AuthRoutes = require("./Routes/AuthRoutes.js");
const rateLimit = require('express-rate-limit');
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

// CORS configuration - FIXED FOR PRODUCTION USE
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // Cache preflight response for 24 hours
};

// Apply CORS for all routes - ENSURE IT'S APPLIED FIRST
app.use(cors(corsOptions));

// Configure Express to handle OPTIONS requests properly
app.options('*', (req, res) => {
    res.status(204).send();
});

// Debug middleware to log headers - SIMPLIFIED TO FOCUS ON CORS ISSUES
app.use((req, res, next) => {
    // For debugging - log all requests
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);
    
    // Ensure CORS headers are set for all responses
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    
    next();
});

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development 
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' // Skip OPTIONS requests
});

// Apply rate limiter after CORS
app.use(limiter);

// Routes
app.use("/api/docs", CourseRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/groups", GroupRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/timetables", timetableRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Add this after all your routes
app.use(errorHandler);

// Start the server with dynamic port selection
const startServer = (port) => {
  const server = app.listen(port)
    .on('listening', () => {
      console.log(`Server running on port ${port}`);
      console.log(`CORS enabled for origin: http://localhost:3000`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, trying port ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  
  return server;
};

// Initialize with preferred port
const PORT = process.env.PORT || 5000;
startServer(PORT);
