const express = require("express");
const router = express.Router();
const OrderController = require("../Controllers/OrderController");

router.get("/", OrderController.getAll);
router.post("/", OrderController.add);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.deleteData);
router.get("/:id", OrderController.getById);

module.exports = router;
