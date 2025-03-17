const express = require("express");
const router = express.Router();
const AttendanceController = require("../Controllers/AttendanceController");

// Admin middleware applied to the routes that require admin access
router.get("/", AttendanceController.getAll);
router.post("/", AttendanceController.isAdmin, AttendanceController.add); // Only admin can add
router.put("/:id", AttendanceController.isAdmin, AttendanceController.update); // Only admin can update
router.delete("/:id", AttendanceController.isAdmin, AttendanceController.deleteData); // Only admin can delete
router.get("/:id", AttendanceController.getById);

module.exports = router;
