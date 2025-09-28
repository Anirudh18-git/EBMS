const express = require('express');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add new user (admin only, for adding customers)
router.post('/', auth, admin, async (req, res) => {
  const { name, address, email, meterNumber, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, address, email, meterNumber, password, role: role || 'CUSTOMER' });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
