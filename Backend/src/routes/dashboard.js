const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

// @route   GET api/dashboard/stats
router.get('/stats', auth, checkRole(['Secretariat', 'Admin']), async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const resolvedCases = await Case.countDocuments({ status: 'Resolved' });
    
    // Aggregation for charts
    const byDepartment = await Case.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const byStatus = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const byCategory = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Hotspot detection: 5+ cases in same dept and category
    const hotspots = await Case.aggregate([
      { $group: { 
        _id: { dept: '$department', cat: '$category' }, 
        count: { $sum: 1 } 
      } },
      { $match: { count: { $gte: 5 } } }
    ]);

    res.json({
      totalCases,
      resolvedCases,
      byDepartment,
      byStatus,
      byCategory,
      hotspots
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
