const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  InevnID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  Supplire: {
    type: String,
    required: true,
  },
  Price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("inventory", InventorySchema);
