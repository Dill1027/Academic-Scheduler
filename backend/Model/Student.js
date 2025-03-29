const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  specialization: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false,
  },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Example validation: Password should be at least 6 characters long
        return value.length >= 6;
      },
      message: "Password must be at least 6 characters long",
    },
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "docs",
    required: false,
  },
  schedule: [
    {
      courseName: String,
      startTime: Date,
      endTime: Date,
      instructor: String,
      location: String,
    },
  ],
  assignments: [
    {
      title: String,
      description: String,
      dueDate: Date,
    },
  ],
  exams: [
    {
      title: String,
      date: Date,
      location: String,
    },
  ],
  announcements: [
    {
      title: String,
      description: String,
      date: Date,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Student", StudentSchema);
