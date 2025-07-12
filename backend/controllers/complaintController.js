const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      image: req.file?.filename,
    });
    await complaint.save();
    res.status(201).json({ message: 'Complaint created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('clientId').populate('assignedTo');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignComplaint = async (req, res) => {
  try {
    const { complaintId, technicianId } = req.body;
    await Complaint.findByIdAndUpdate(complaintId, {
      assignedTo: technicianId,
      status: 'assigned',
    });
    res.json({ message: 'Complaint assigned' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markReceived = async (req, res) => {
  try {
    const { complaintId } = req.body;
    await Complaint.findByIdAndUpdate(complaintId, { status: 'received' });
    res.json({ message: 'Marked as received' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
