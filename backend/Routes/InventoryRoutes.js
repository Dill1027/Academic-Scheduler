const express = require("express");
const router = express.Router();
const InventoryController = require("../Controllers/InventoryController");

router.get("/", InventoryController.getAll);
router.post("/", InventoryController.add);
router.put("/:id", InventoryController.update);
router.delete("/:id", InventoryController.deleteData);
router.get("/:id", InventoryController.getById);

module.exports = router;
