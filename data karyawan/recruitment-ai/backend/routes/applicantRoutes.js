const express = require('express');
const router = express.Router();
const multer = require('multer');
const applicantController = require('../controllers/applicantController');

// Menggunakan memoryStorage agar tidak perlu menyimpan file fisik ke hard disk
// File langsung di-parse ke buffer untuk diekstrak teksnya
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('cvFile'), applicantController.uploadCV);
router.get('/', applicantController.getApplicants);
router.put('/:id/status', applicantController.updateStatus);

module.exports = router;
