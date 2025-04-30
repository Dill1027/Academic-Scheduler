const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  lecture: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
