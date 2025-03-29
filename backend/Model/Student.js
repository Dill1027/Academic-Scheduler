const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      location: String
    }
  ],
  assignments: [
    {
      title: String,
      description: String,
      dueDate: Date
    }
  ],
  exams: [
    {
      title: String,
      date: Date,
      location: String
    }
  ],
  announcements: [
    {
      title: String,
      description: String,
      date: Date
    }
  ]
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Student", StudentSchema);
