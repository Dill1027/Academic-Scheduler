const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  AttID: {
    type: String,
    required: true,
  },
  EmployeID: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // Changed to Date type for better date handling
    required: true,
  },
  CheckIn: {
    type: Date, // Changed to Date type for better date handling
    required: true,
  },
  CheckOut: {
    type: Date, // Changed to Date type for better date handling
    required: true,
  },
  TotalHours: {
    type: Number, // Changed to Number type for proper hour handling
    required: true,
    min: [0, 'TotalHours must be greater than or equal to 0'], // Validation for positive hours
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent", "Late", "On Leave"], // Enum for restricting status values
  },
  Leavetype: {
    type: String,
    required: true,
    enum: ["Sick", "Casual", "Maternity", "Paternity"], // Enum for restricting leave type values
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
