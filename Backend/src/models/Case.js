const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Safety', 'Policy', 'Facilities', 'HR', 'Other'], 
    required: true 
  },
  department: { type: String, required: true },
  location: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    required: true 
  },
  isAnonymous: { type: Boolean, default: false },
  submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'], 
    default: 'New' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachments: [{ type: String }],
  notes: [{
    content: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  lastEscalationCheck: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

caseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Case', caseSchema);
