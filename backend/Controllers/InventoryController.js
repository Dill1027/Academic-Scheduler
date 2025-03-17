const InventoryModel = require("../Model/InventoryModel");

const getAll = async (req, res, next) => {
  let inventory;
  try {
    inventory = await InventoryModel.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!inventory) {
    return res.status(404).json({ message: "not found" });
  }
  return res.status(200).json({ inventory });
};

// data Insert
const add = async (req, res, next) => {
  const { InevnID, name, type, quantity, Supplire, Price } = req.body;

  let inventory;

  try {
    inventory = new InventoryModel({
      InevnID,
      name,
      type,
      quantity,
      Supplire,
      Price,
    });
    await inventory.save();
  } catch (err) {
    console.log(err);
  }
  if (!inventory) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ inventory });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let inventory;

  try {
    inventory = await InventoryModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!inventory) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json({ inventory });
};

//Update  Details
const update = async (req, res, next) => {
  const id = req.params.id;
  const { InevnID, name, type, quantity, Supplire, Price } = req.body;

  let inventory;

  try {
    inventory = await InventoryModel.findByIdAndUpdate(id, {
      InevnID: InevnID,
      name: name,
      type: type,
      quantity: quantity,
      Supplire: Supplire,
      Price: Price,
    });
    inventory = await inventory.save();
  } catch (err) {
    console.log(err);
  }
  if (!inventory) {
    return res
      .status(404)
      .json({ message: "Unable to Update InventoryModel Details" });
  }
  return res.status(200).json({ inventory });
};

//Delete inventory Details
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let inventory;

  try {
    inventory = await InventoryModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!inventory) {
    return res
      .status(404)
      .json({ message: "Unable to Delete InventoryModel Details" });
  }
  return res.status(200).json({ inventory });
};

exports.getAll = getAll;
exports.add = add;
exports.getById = getById;
exports.update = update;
exports.deleteData = deleteData;
