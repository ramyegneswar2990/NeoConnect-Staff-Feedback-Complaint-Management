const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Minutes = require('../models/Minutes');
const Case = require('../models/Case');
const auth = require('../middleware/auth');

// @route   GET api/public/digest
router.get('/digest', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublished: true }).lean();
    
    const resolvedCases = await Case.find({ status: 'Resolved' }).lean();
    
    const caseDigests = resolvedCases.map(c => ({
      _id: c._id,
      title: `Resolved Issue: ${c.title}`,
      content: c.description || 'This issue has been formally addressed and resolved by our team.',
      category: c.category || 'General',
      publishedAt: c.resolvedAt || c.updatedAt || c.createdAt,
      type: 'case'
    }));

    const digest = [...announcements, ...caseDigests].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    res.json(digest);
  } catch (err) {
    console.error('Digest API Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/public/impact
router.get('/impact', async (req, res) => {
  try {
    // Show resolved cases and their actions (simplified)
    const cases = await Case.find({ status: 'Resolved' })
      .select('title category department trackingId notes resolvedAt')
      .limit(10)
      .sort({ resolvedAt: -1 });
    
    const impactData = cases.map(c => ({
      issue: c.title,
      category: c.category,
      department: c.department,
      action: c.notes.length > 0 ? c.notes[c.notes.length - 1].content : 'Resolved by management',
      result: 'Completed'
    }));

    res.json(impactData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/public/minutes
router.get('/minutes', async (req, res) => {
  try {
    const minutes = await Minutes.find().sort({ date: -1 });
    res.json(minutes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/public/digest
router.post('/digest', auth, async (req, res) => {
  if (!['Admin', 'Secretariat'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const { title, content, category } = req.body;
    const announcement = new Announcement({
      title,
      content,
      category,
      isPublished: true,
      publishedAt: new Date()
    });
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/public/minutes
router.post('/minutes', auth, async (req, res) => {
  if (!['Admin', 'Secretariat'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const { title, date, fileUrl } = req.body;
    const minute = new Minutes({
      title,
      date,
      fileUrl
    });
    await minute.save();
    res.json(minute);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
