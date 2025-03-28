const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Link to the Student model
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
