require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const adminExists = await User.findOne({ email: 'admin@resto.com' });
        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            name: 'HRD Admin',
            email: 'admin@resto.com',
            password: hashedPassword,
            role: 'admin',
            position: 'HR Manager'
        });

        await admin.save();
        console.log('Admin seeded successfully! Email: admin@resto.com | Pass: admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
