const mongoose = require('mongoose');

const minutesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Minutes', minutesSchema);
