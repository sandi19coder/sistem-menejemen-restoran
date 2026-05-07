const Applicant = require('../models/Applicant');
const aiService = require('../services/aiService');
const pdfParse = require('pdf-parse');

exports.uploadCV = async (req, res) => {
    try {
        const { name, email, phone, appliedPosition } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'File CV (PDF) wajib diunggah!' });
        }

        let cvText = "";
        
        // Ekstrak teks dari PDF
        if (req.file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            cvText = pdfData.text;
        } else {
            // Jika dokumen tipe lain (misal text biasa), tangkap sebagai string (opsional)
            cvText = req.file.buffer.toString('utf8'); 
        }

        if (cvText.trim() === '') {
             cvText = "CV tidak bisa dibaca, pelamar atas nama: " + name;
        }

        // Jalankan Analisis AI OpenAi
        const aiAnalysis = await aiService.analyzeCV(cvText, appliedPosition);

        const newApplicant = new Applicant({
            name, email, phone, appliedPosition, cvText, aiAnalysis
        });

        await newApplicant.save();
        res.status(201).json({ message: 'Aplikasi berhasil dikirim!', data: newApplicant });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat memproses CV.' });
    }
};

exports.getApplicants = async (req, res) => {
    try {
        const filters = {};
        if (req.query.position) filters['aiAnalysis.recommendedPosition'] = req.query.position;
        if (req.query.status) filters.status = req.query.status;

        const applicants = await Applicant.find(filters).sort({ 'aiAnalysis.matchScore': -1 });
        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const applicant = await Applicant.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        res.status(200).json(applicant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
