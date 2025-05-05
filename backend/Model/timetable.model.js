const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    enum: ['08:30-10:30', '10:30-12:30', '13:30-15:30', '15:30-17:30', '17:30-19:30']
  },
  subject: {
    type: String,
    required: true
  },
  venu: {
    type: String,
    required: true
  },
  lecturer: {
    type: String,
    required: true
  }
});

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  slots: [slotSchema]
});

const timetableSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  specialization: {
    type: String,
    required: true,
    enum: ['Information Technology', 'Data Science', 'Software Engineering', 'Interactive Media', 'Cyber Security']
  },
  moduleCode: {
    type: String,
    required: true
  },
  days: [daySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', timetableSchema);