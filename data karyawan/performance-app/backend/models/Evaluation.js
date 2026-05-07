const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin
    month: { type: String, required: true }, // e.g., '2023-10'
    kpiMetrics: {
        attendance: { type: Number, required: true, min: 0, max: 100 }, // 40%
        discipline: { type: Number, required: true, min: 0, max: 100 }, // 20%
        teamwork: { type: Number, required: true, min: 0, max: 100 },   // 20%
        attitude: { type: Number, required: true, min: 0, max: 100 },   // 20%
    },
    supervisorNotes: { type: String },
    aiScore: { type: Number, default: 0 },
    aiFeedback: { type: String },
    finalScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
