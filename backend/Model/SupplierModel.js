const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplireSchema = new Schema({
  supID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Supplire", SupplireSchema);
