const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  aiSummary: { type: String },
  aiPriority: { type: String },
  aiDepartment: { type: String }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
