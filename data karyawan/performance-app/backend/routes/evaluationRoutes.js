const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const auth = require('../middleware/auth');
const aiService = require('../services/aiService');

// @route POST api/evaluations
// Admin submit evaluation for employee
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    
    const { employeeId, month, kpiMetrics, supervisorNotes } = req.body;
    
    try {
        // AI Evaluation
        const { aiScore, aiFeedback } = await aiService.evaluatePerformance(kpiMetrics, supervisorNotes);
        
        const newEval = new Evaluation({
            employee: employeeId,
            evaluator: req.user.id,
            month,
            kpiMetrics,
            supervisorNotes,
            aiScore,
            aiFeedback,
            finalScore: aiScore
        });
        await newEval.save();

        // Update employee total score (average of all evaluations)
        const allEvals = await Evaluation.find({ employee: employeeId });
        const avgScore = allEvals.reduce((acc, curr) => acc + curr.finalScore, 0) / allEvals.length;
        
        await User.findByIdAndUpdate(employeeId, { totalScore: Math.round(avgScore) });

        res.json(newEval);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/evaluations/employee/:id
router.get('/employee/:id', auth, async (req, res) => {
    // Employees can only view their own, Admin can view all
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    
    try {
        const evals = await Evaluation.find({ employee: req.params.id }).sort({ createdAt: -1 });
        res.json(evals);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
