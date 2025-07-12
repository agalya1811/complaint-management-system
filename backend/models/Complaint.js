const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  buildingUnit: String,
  contractNumber: String,
  startDate: Date,
  endDate: Date,
  category: String,
  subCategory: String,
  image: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['new', 'assigned', 'received', 'closed'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
