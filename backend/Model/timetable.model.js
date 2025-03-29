const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  time: String,
  subject: String,
  room: String,
  lecturer: String
});

const daySchema = new mongoose.Schema({
  day: String,
  slots: [slotSchema]
});

const timetableSchema = new mongoose.Schema({
  year: Number,
  specialization: String,
  moduleCode: String,
  days: [daySchema]
});

module.exports = mongoose.model('Timetable', timetableSchema);