const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createComplaint,
  getAllComplaints,
  assignComplaint,
  markReceived,
} = require('../controllers/complaintController');

router.post('/create', upload.single('image'), createComplaint);
router.get('/', getAllComplaints);
router.put('/assign', assignComplaint);
router.put('/received', markReceived);

module.exports = router;
