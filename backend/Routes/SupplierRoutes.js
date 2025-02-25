const express = require("express");
const router = express.Router();
const SupplierController = require("../Controllers/SupplierController");

router.get("/", SupplierController.getAll);
router.post("/", SupplierController.add);
router.put("/:id", SupplierController.update);
router.delete("/:id", SupplierController.deleteData);
router.get("/:id", SupplierController.getById);

module.exports = router;
