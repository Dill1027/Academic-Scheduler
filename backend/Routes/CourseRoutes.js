const express = require("express");
const router = express.Router();
const { Docs, upload } = require('../Model/CourseModel'); // Import the Docs model and upload middleware
const { body, validationResult } = require('express-validator');

// Add document
router.post('/add', 
  upload.array('documents', 3), // Allow up to 3 files to be uploaded
  [
    body('year').notEmpty().withMessage('Year is required').isIn(["1st Year", "2nd Year", "3rd Year", "4th Year"]).withMessage('Invalid year'),
    body('moduleName').notEmpty().withMessage('Module name is required').isLength({ max: 100 }).withMessage('Module name must be at most 100 characters long'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be at most 500 characters long'),
    body('lectures').isArray({ min: 1, max: 3 }).withMessage('You must provide between 1 and 3 lectures'),
    body('lectures.*').notEmpty().withMessage('Lecture name cannot be empty').isLength({ max: 100 }).withMessage('Lecture name must be at most 100 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, moduleName, description, lectures } = req.body;

    // Check if at least one document is uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one document must be uploaded' });
    }

    // Get the file paths of the uploaded documents
    const documents = req.files.map(file => file.path);

    try {
      const newDoc = new Docs({
        year,
        moduleName,
        description,
        lectures,
        documents
      });

      await newDoc.save();
      res.status(201).json({ message: 'Document uploaded successfully!', data: newDoc });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all documents
router.get("/", async (req, res) => {
  try {
    const docs = await Docs.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one document by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Docs.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document
router.put("/update/:id", upload.array('documents', 3), async (req, res) => {
  const docId = req.params.id;
  const { year, moduleName, description, lectures } = req.body;

  try {
    const updatedDoc = await Docs.findById(docId);
    if (!updatedDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Update fields
    updatedDoc.year = year || updatedDoc.year;
    updatedDoc.moduleName = moduleName || updatedDoc.moduleName;
    updatedDoc.description = description || updatedDoc.description;
    updatedDoc.lectures = lectures || updatedDoc.lectures;

    // Update documents if new files are uploaded
    if (req.files && req.files.length > 0) {
      updatedDoc.documents = req.files.map(file => file.path);
    }

    await updatedDoc.save();
    res.json({ message: 'Document updated successfully!', data: updatedDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
router.delete("/delete/:id", async (req, res) => {
  const docId = req.params.id;

  try {
    const deletedDoc = await Docs.findByIdAndDelete(docId);
    if (!deletedDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;