require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const Case = require('./models/Case');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/public', require('./routes/public'));

// 7-Day Rule Logic
// In a real app, this would be a Cron Job (node-cron)
const checkEscalations = async () => {
  console.log('Checking for escalations...');
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  try {
    const casesToEscalate = await Case.find({
      status: { $in: ['Assigned', 'In Progress'] },
      updatedAt: { $lt: sevenDaysAgo }
    });

    for (const c of casesToEscalate) {
      c.status = 'Escalated';
      c.notes.push({
        content: 'Automatically escalated due to 7-day inactivity rule.',
        addedBy: null // System
      });
      await c.save();
      console.log(`Esclated case: ${c.trackingId}`);
    }
  } catch (err) {
    console.error('Error in escalation task:', err);
  }
};

// Run check every 24 hours (86400000 ms) - for demo, run every hour 3600000
setInterval(checkEscalations, 3600000);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Could not connect to MongoDB', err));
