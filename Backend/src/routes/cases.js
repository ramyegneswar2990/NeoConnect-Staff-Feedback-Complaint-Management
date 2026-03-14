const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// @route   POST api/cases
// @desc    Submit a new complaint
router.post('/', auth, upload.array('attachments'), async (req, res) => {
  try {
    const { title, description, category, department, location, severity, isAnonymous } = req.body;
    
    // Generate Tracking ID: NEO-YYYY-001
    const year = new Date().getFullYear();
    const count = await Case.countDocuments({ 
      createdAt: { 
        $gte: new Date(`${year}-01-01`), 
        $lte: new Date(`${year}-12-31`) 
      } 
    });
    const trackingId = `NEO-${year}-${(count + 1).toString().padStart(3, '0')}`;

    const attachmentUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const newCase = new Case({
      trackingId,
      title,
      description,
      category,
      department,
      location,
      severity,
      isAnonymous,
      submitter: req.user._id,
      attachments: attachmentUrls
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/cases
// @desc    Get cases based on role
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'Staff') {
      query.submitter = req.user._id;
    } else if (req.user.role === 'Case Manager') {
      query.assignedTo = req.user._id;
    }
    // Secretariat and Admin can see all

    const cases = await Case.find(query)
      .populate('submitter', 'name email department')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const processedCases = cases.map(c => {
      const obj = c.toObject();
      if (obj.isAnonymous && req.user.role === 'Staff' && obj.submitter._id.toString() !== req.user._id.toString()) {
        obj.submitter = { name: 'Anonymous' };
      } else if (obj.isAnonymous && req.user.role !== 'Admin' && req.user.role !== 'Secretariat') {
          obj.submitter = { name: 'Anonymous' };
      }
      return obj;
    });

    res.json(processedCases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/cases/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('submitter', 'name email department')
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name role');
    
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });
    
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/cases/:id/assign
router.patch('/:id/assign', auth, checkRole(['Secretariat', 'Admin']), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { assignedTo, status: 'Assigned', updatedAt: Date.now() },
      { new: true }
    );
    res.json(updatedCase);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/cases/:id/status
router.patch('/:id/status', auth, checkRole(['Case Manager', 'Secretariat', 'Admin']), async (req, res) => {
  try {
    const { status, note } = req.body;
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });

    caseItem.status = status;
    if (status === 'Resolved') caseItem.resolvedAt = Date.now();
    
    if (note) {
      caseItem.notes.push({ content: note, addedBy: req.user._id });
    }
    
    caseItem.updatedAt = Date.now();
    await caseItem.save();
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
