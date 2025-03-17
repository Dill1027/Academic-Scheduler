const OrderModel = require("../Model/OrderModel");

const getAll = async (req, res, next) => {
  let order;
  try {
    order = await OrderModel.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!order) {
    return res.status(404).json({ message: "not found" });
  }
  return res.status(200).json({ order });
};

// data Insert
const add = async (req, res, next) => {
  const { OrderID, SupplierID, SupplierName, QuantityOrder, total } = req.body;

  let order;

  try {
    order = new OrderModel({
      OrderID,
      SupplierID,
      SupplierName,
      QuantityOrder,
      total,
    });
    await order.save();
  } catch (err) {
    console.log(err);
  }
  if (!order) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ order });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let order;

  try {
    order = await OrderModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!order) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json({ order });
};

//Update  Details
const update = async (req, res, next) => {
  const id = req.params.id;
  const { OrderID, SupplierID, SupplierName, QuantityOrder, total } = req.body;

  let order;

  try {
    order = await OrderModel.findByIdAndUpdate(id, {
      OrderID: OrderID,
      SupplierID: SupplierID,
      SupplierName: SupplierName,
      QuantityOrder: QuantityOrder,
      total: total,
    });
    order = await order.save();
  } catch (err) {
    console.log(err);
  }
  if (!order) {
    return res
      .status(404)
      .json({ message: "Unable to Update OrderModel Details" });
  }
  return res.status(200).json({ order });
};

//Delete order Details
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let order;

  try {
    order = await OrderModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!order) {
    return res
      .status(404)
      .json({ message: "Unable to Delete OrderModel Details" });
  }
  return res.status(200).json({ order });
};

exports.getAll = getAll;
exports.add = add;
exports.getById = getById;
exports.update = update;
exports.deleteData = deleteData;
