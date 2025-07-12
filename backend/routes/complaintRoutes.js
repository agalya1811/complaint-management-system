const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Complaint = require('../models/Complaint');
const complaintController = require('../controllers/complaintController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authenticateJWT');
//const authenticateJWT = require('../middlewares/authenticateJWT');
//const authorizeRoles = require('../middlewares/authorizeRoles');


const {
  createComplaint,
  getAllComplaints,
  assignComplaint,
  markReceived,
  getAssignedComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');
//const authenticateJWT = require('../middlewares/authenticateJWT');
console.log('authenticateJWT:', authenticateJWT);
console.log('getAssignedComplaints:', getAssignedComplaints);

router.post('/create', upload.single('image'), createComplaint);
router.get('/', getAllComplaints);
router.put('/assign', assignComplaint);
router.put('/received', markReceived);
router.get('/assigned', authenticateJWT, getAssignedComplaints);
router.put('/status', authenticateJWT, updateComplaintStatus);
router.post('/assign', authenticateJWT, authorizeRoles('support', 'technician'), assignComplaint);

router.get('/client/:clientId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ clientId: req.params.clientId });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
