const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Applicant = require('../models/Applicant');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route GET api/employees
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({ role: 'employee' }).sort({ totalScore: -1 });
        
        // Update rank based on sort
        for(let i=0; i<users.length; i++){
            users[i].rank = i + 1;
            await users[i].save();
        }

        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route GET api/employees/leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const topEmployees = await User.find({ role: 'employee' }).sort({ totalScore: -1 }).limit(3);
        res.json(topEmployees);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route POST api/employees
// Admin only
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const { name, email, password, position } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, position, role: 'employee' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route POST api/employees/sync-applicants
// Sync accepted applicants from HRD
router.post('/sync-applicants', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        // Find accepted applicants who don't have an employee account yet
        const acceptedApplicants = await Applicant.find({ status: 'Accepted' });
        let addedCount = 0;

        for (let app of acceptedApplicants) {
            let exists = await User.findOne({ email: app.email });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('resto123', salt); // Default password
                const newUser = new User({
                    name: app.name,
                    email: app.email,
                    password: hashedPassword,
                    position: app.appliedPosition,
                    role: 'employee'
                });
                await newUser.save();
                addedCount++;
            }
        }
        res.json({ msg: `Successfully synced ${addedCount} new employees from recruitment data.` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
