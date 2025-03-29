const express = require("express");
const router = express.Router();
const Group = require("../Model/Groups");

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups); // Return groups as a response
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Failed to fetch groups." });
  }
});

// Create a new group
router.post("/", async (req, res) => {
  try {
    const { groupName } = req.body;

    if (!groupName) {
      return res.status(400).json({ message: "Group name is required." });
    }

    const newGroup = new Group({
      groupName,
      students: [],
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Failed to create group." });
  }
});

module.exports = router;
