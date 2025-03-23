const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


module.exports = mongoose.model("student", StudentSchema);
