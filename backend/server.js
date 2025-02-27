const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

// Import Routes
const InventoryRoute = require("./Routes/InventoryRoutes.js");
const EmployeeRoute = require("./Routes/EmployeeRoutes.js");
const AttendanceRoute = require("./Routes/AttendanceRoutes.js");
const OrderRoute = require("./Routes/OrderRoute.js");
const SupplierRoute = require("./Routes/SupplierRoutes.js");

dotenv.config();

// Database connection
connectDB();

// Middleware
app.use(cors()); // You can add custom options if needed
app.use(express.json());

// Routes
app.use("/inventory", InventoryRoute);
app.use("/employee", EmployeeRoute);
app.use("/attendance", AttendanceRoute);
app.use("/order", OrderRoute);
app.use("/supplier", SupplierRoute);

// Global Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs error stack to console
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
