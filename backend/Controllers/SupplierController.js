const SupplierModel = require("../Model/SupplierModel");

const getAll = async (req, res, next) => {
  let supplier;
  try {
    supplier = await SupplierModel.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!supplier) {
    return res.status(404).json({ message: "not found" });
  }
  return res.status(200).json({ supplier });
};

// data Insert
const add = async (req, res, next) => {
  const { supID, name, phone, address, email } = req.body;

  let supplier;

  try {
    supplier = new SupplierModel({
      supID,
      name,
      phone,
      address,
      email,
    });
    await supplier.save();
  } catch (err) {
    console.log(err);
  }
  if (!supplier) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ supplier });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let supplier;

  try {
    supplier = await SupplierModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!supplier) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json({ supplier });
};

//Update  Details
const update = async (req, res, next) => {
  const id = req.params.id;
  const { supID, name, phone, address, email } = req.body;

  let supplier;

  try {
    supplier = await SupplierModel.findByIdAndUpdate(id, {
      supID: supID,
      name: name,
      phone: phone,
      address: address,
      email: email,
    });
    supplier = await supplier.save();
  } catch (err) {
    console.log(err);
  }
  if (!supplier) {
    return res.status(404).json({ message: "Unable to Update Details" });
  }
  return res.status(200).json({ supplier });
};

//Delete supplier Details
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let supplier;

  try {
    supplier = await SupplierModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!supplier) {
    return res
      .status(404)
      .json({ message: "Unable to Delete SupplierModel Details" });
  }
  return res.status(200).json({ supplier });
};

exports.getAll = getAll;
exports.add = add;
exports.getById = getById;
exports.update = update;
exports.deleteData = deleteData;
