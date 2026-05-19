const Complaint = require('../models/Complaint');

// Add Complaint
const addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location, aiSummary, aiPriority, aiDepartment } = req.body;

    if (!title || !email) {
      return res.status(400).json({ message: 'Title and email are required' });
    }

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      aiSummary,
      aiPriority,
      aiDepartment
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Complaints
const getComplaints = async (req, res) => {
  try {
    // Optional filtering by category
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Complaint Status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    const updatedComplaint = await complaint.save();

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Complaint by Location
const searchComplaints = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'Location query parameter is required' });
    }

    // Case-insensitive regex search
    const complaints = await Complaint.find({ location: { $regex: location, $options: 'i' } });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  updateComplaintStatus,
  searchComplaints
};
