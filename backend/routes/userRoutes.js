const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middlewares/authenticateJWT');
const User = require('../models/User');
const { login } = require('../controllers/userController');

router.post('/login', login);
router.get('/', authenticateJWT, authorizeRoles('support',  'technician'), async (req, res) => {
  try {
    const role = req.query.role;
    if (!role) {
      return res.status(400).json({ message: 'Role query param required' });
    }

    const users = await User.find({ role }, 'username email _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/complaints/assign', authenticateJWT, authorizeRoles('support'), async (req, res) => {
  try {
    const { complaintId, technicianId } = req.body;

    if (!complaintId || !technicianId) {
      return res.status(400).json({ message: 'Missing complaintId or technicianId' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.technicianId = technicianId;
    complaint.status = 'assigned';
    await complaint.save();

    res.json({ message: 'Technician assigned successfully', complaint });
  } catch (error) {
    console.error('Error assigning technician:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
