const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  appliedPosition: String, // Input dari pelamar
  cvText: String, // Ekstraksi teks mentah dari PDF
  aiAnalysis: {
    recommendedPosition: String,
    matchScore: Number,
    strengths: [String],
    weaknesses: [String],
    alternativePositions: [String]
  },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Applicant', applicantSchema);
