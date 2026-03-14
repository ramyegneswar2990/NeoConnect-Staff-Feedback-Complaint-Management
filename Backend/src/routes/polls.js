const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

// @route   POST api/polls
router.post('/', auth, checkRole(['Secretariat', 'Admin']), async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;
    const poll = new Poll({
      question,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      createdBy: req.user._id,
      expiresAt
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/polls
router.get('/', auth, async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/polls/:id/vote
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const pollId = req.params.id;

    // Check if already voted
    const existingVote = await Vote.findOne({ poll: pollId, user: req.user._id });
    if (existingVote) return res.status(400).json({ message: 'Already voted' });

    const vote = new Vote({
      poll: pollId,
      user: req.user._id,
      optionIndex
    });
    await vote.save();

    // Update poll count
    await Poll.updateOne(
      { _id: pollId, "options._index": optionIndex }, // This is wrong in mongoose, need different approach
      { $inc: { [`options.${optionIndex}.votes`]: 1 } }
    );

    res.json({ message: 'Vote recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
