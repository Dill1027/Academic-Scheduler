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
  faculty: {
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
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Student", StudentSchema);
