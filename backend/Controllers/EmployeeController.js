const EmployeeModel = require("../Model/EmployeeModel");

const getAll = async (req, res, next) => {
  let employee;
  try {
    employee = await EmployeeModel.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!employee) {
    return res.status(404).json({ message: "not found" });
  }
  return res.status(200).json({ employee });
};

// data Insert
const add = async (req, res, next) => {
  const { empID, name, nic, address, email, department, jobTitle, salary } =
    req.body;

  let employee;

  try {
    employee = new EmployeeModel({
      empID,
      name,
      nic,
      address,
      email,
      department,
      jobTitle,
      salary,
    });
    await employee.save();
  } catch (err) {
    console.log(err);
  }
  if (!employee) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ employee });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let employee;

  try {
    employee = await EmployeeModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!employee) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json({ employee });
};

//Update  Details
const update = async (req, res, next) => {
  const id = req.params.id;
  const { empID, name, nic, address, email, department, jobTitle, salary } =
    req.body;

  let employee;

  try {
    employee = await EmployeeModel.findByIdAndUpdate(id, {
      empID: empID,
      name: name,
      nic: nic,
      address: address,
      email: email,
      department: department,
      jobTitle: jobTitle,
      salary: salary,
    });
    employee = await employee.save();
  } catch (err) {
    console.log(err);
  }
  if (!employee) {
    return res
      .status(404)
      .json({ message: "Unable to Update EmployeeModel Details" });
  }
  return res.status(200).json({ employee });
};

//Delete employee Details
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let employee;

  try {
    employee = await EmployeeModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!employee) {
    return res
      .status(404)
      .json({ message: "Unable to Delete EmployeeModel Details" });
  }
  return res.status(200).json({ employee });
};

exports.getAll = getAll;
exports.add = add;
exports.getById = getById;
exports.update = update;
exports.deleteData = deleteData;
