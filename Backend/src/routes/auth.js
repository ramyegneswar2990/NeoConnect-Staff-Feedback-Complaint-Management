const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, department, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// @route   GET api/auth/managers
router.get('/managers', auth, async (req, res) => {
    try {
      const managers = await User.find({ role: 'Case Manager' }).select('name _id department');
      res.json(managers);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
