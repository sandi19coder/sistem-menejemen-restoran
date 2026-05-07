const mongoose = require('mongoose');

// This connects to the resto-recruitment database's applicants collection conceptually
const ApplicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    appliedPosition: { type: String },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    cvText: { type: String },
    aiAnalysis: {
        recommendedPosition: String,
        matchScore: Number,
        strengths: [String],
        weaknesses: [String],
        alternativePositions: [String]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);
