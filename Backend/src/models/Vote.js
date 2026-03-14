const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  optionIndex: { type: Number, required: true },
  votedAt: { type: Date, default: Date.now }
});

// One vote per user per poll
voteSchema.index({ poll: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
