const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: generate a JWT token for a user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'  // token lasts 30 days
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password (never store plain text)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in MongoDB
    const user = await User.create({
        email,
        password: hashedPassword,
        profile: { name: name || email.split("@")[0] }
      });

    // Return token + basic info (frontend will store the token)
    res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        profileComplete: false,
        name: user.profile.name
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      profileComplete: user.profile?.profileComplete || false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;