const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/profile  — get logged-in user's profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user.profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/profile  — save or update profile
router.post('/', protect, async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      profileComplete: true  // mark profile as done when saved
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile: profileData },
      { new: true }  // return the updated document
    ).select('-password');

    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;