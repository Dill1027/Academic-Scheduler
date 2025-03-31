require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger

// Import route files
const authRoutes = require('./Routes/authRoutes');
const studentRoutes = require('./Routes/studentRoutes');
const lecturerRoutes = require('./Routes/lecturerRoutes');
const courseRoutes = require('./Routes/courseRoutes');
const timetableRoutes = require('./Routes/timetableRoutes');

// Initialize Express app
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetables', timetableRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server configuration
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
