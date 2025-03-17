const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  OrderID: {
    type: String,
    required: true,
  },
  SupplierID: {
    type: String,
    required: true,
  },
  SupplierName: {
    type: String,
    required: true,
  },
  QuantityOrder: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
