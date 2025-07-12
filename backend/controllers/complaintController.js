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
  const { complaintId, technicianId } = req.body;
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        assignedTo: technicianId,
        status: 'assigned'
      },
      { new: true }
    );
    res.json({ message: 'Complaint assigned', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get complaints assigned to technician
exports.getAssignedComplaints = async (req, res) => {
  try {
    const technicianId = req.user.id; // fix here
    const complaints = await Complaint.find({ assignedTo: technicianId })
      .populate('clientId', 'username email')
      .populate('assignedTo', 'username');

    res.json(complaints);
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

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId, status } = req.body;

    // Optionally verify if req.user._id matches assignedTo for security

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
