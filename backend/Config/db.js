const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use direct connection string format instead of SRV format
    // Also add database name to URL
    await mongoose.connect('mongodb+srv://dilkiprabodya:dilki123@cluster0.k43vw.mongodb.net/academicScheduler', {
      // Remove deprecated options
      serverSelectionTimeoutMS: 6000 // Keep timeout setting
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process on connection error - allows for reconnection attempts
    console.log('Attempting to continue despite MongoDB connection error');
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB reconnected successfully');
});

module.exports = connectDB;