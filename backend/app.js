const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other middleware and routes
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;