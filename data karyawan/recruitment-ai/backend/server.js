const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const applicantRoutes = require('./routes/applicantRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resto-recruitment')
  .then(() => console.log('MongoDB Connected to resto-recruitment'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/applicants', applicantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
