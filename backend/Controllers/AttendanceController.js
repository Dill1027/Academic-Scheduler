const AttendanceModel = require("../Model/AttendanceModel");

const isAdmin = (req, res, next) => {
  console.log(req.user); // Log the user object to verify it has the correct role
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access forbidden: Admins only" });
  }
};

// Get all attendance records
const getAll = async (req, res, next) => {
  let attendance;
  try {
    attendance = await AttendanceModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!attendance) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ attendance });
};

// Add new attendance record
const add = async (req, res, next) => {
  const {
    AttID,
    EmployeID,
    fullname,
    date,
    CheckIn,
    CheckOut,
    TotalHours,
    status,
    Leavetype,
  } = req.body;

  let attendance;
  try {
    attendance = new AttendanceModel({
      AttID,
      EmployeID,
      fullname,
      date,
      CheckIn,
      CheckOut,
      TotalHours,
      status,
      Leavetype,
    });
    await attendance.save();
  } catch (err) {
    console.log(err);
  }
  if (!attendance) {
    return res.status(404).json({ message: "Unable to add data" });
  }
  return res.status(200).json({ attendance });
};

// Get attendance record by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let attendance;
  try {
    attendance = await AttendanceModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!attendance) {
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json({ attendance });
};

// Update attendance record by ID
const update = async (req, res, next) => {
  const id = req.params.id;
  const {
    AttID,
    EmployeID,
    fullname,
    date,
    CheckIn,
    CheckOut,
    TotalHours,
    status,
    Leavetype,
  } = req.body;

  let attendance;
  try {
    attendance = await AttendanceModel.findByIdAndUpdate(id, {
      AttID,
      EmployeID,
      fullname,
      date,
      CheckIn,
      CheckOut,
      TotalHours,
      status,
      Leavetype,
    }, { new: true }); // Returning the updated document
  } catch (err) {
    console.log(err);
  }
  if (!attendance) {
    return res.status(404).json({ message: "Unable to Update Attendance Details" });
  }
  return res.status(200).json({ attendance });
};

// Delete attendance record by ID
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let attendance;
  try {
    attendance = await AttendanceModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!attendance) {
    return res.status(404).json({ message: "Unable to Delete Attendance Details" });
  }
  return res.status(200).json({ message: "Attendance record deleted successfully" });
};

exports.getAll = getAll;
exports.add = add;
exports.getById = getById;
exports.update = update;
exports.deleteData = deleteData;
exports.isAdmin = isAdmin; // Exporting the isAdmin middleware
