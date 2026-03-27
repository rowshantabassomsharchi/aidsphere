const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const { protect } = require('../middleware/authMiddleware');

// POST /api/assessment  — save a new assessment result
router.post('/', protect, async (req, res) => {
  const { symptoms, conditions, score, riskLevel, recommendation } = req.body;

  try {
    const assessment = await Assessment.create({
      user: req.user._id,
      symptoms,
      conditions,
      score,
      riskLevel,
      recommendation
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/assessment/history  — get all past assessments for logged-in user
router.get('/history', protect, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id })
      .sort({ createdAt: -1 });  // newest first

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;