const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes with a more permissive configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Add a specific test route for CORS checking
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working properly!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;