const express = require("express");
const router = express.Router();
const EmployeeController = require("../Controllers/EmployeeController");

router.get("/", EmployeeController.getAll);
router.post("/", EmployeeController.add);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.deleteData);
router.get("/:id", EmployeeController.getById);

module.exports = router;
