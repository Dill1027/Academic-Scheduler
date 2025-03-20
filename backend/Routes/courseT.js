const express = require("express");
const router = express.Router();
const courselist = require("../Model/CourseModel");

//text
router.get("/test",(req, res)=>res.send("route is working"));

module.exports = router;