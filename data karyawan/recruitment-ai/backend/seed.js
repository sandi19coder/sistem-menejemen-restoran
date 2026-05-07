const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Applicant = require('./models/Applicant');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resto-recruitment')
  .then(async () => {
    console.log('Connected to DB');
    await Applicant.deleteMany({});
    
    const dummyData = [
      { 
          name: 'Andi Setiawan', email: 'andi@email.com', phone: '08123456789', appliedPosition: 'Waiter',
          cvText: 'Dummy text...',
          aiAnalysis: { recommendedPosition: 'Supervisor', matchScore: 92, strengths: ['Kepemimpinan yang baik', 'Komunikasi luar biasa'], weaknesses: ['Kurang pengalaman kitchen'], alternativePositions: ['Head Waiter'] },
          status: 'Pending'
      },
      { 
        name: 'Rina Kartika', email: 'rina@email.com', phone: '08555123456', appliedPosition: 'Kitchen Staff',
        cvText: 'Dummy text...',
        aiAnalysis: { recommendedPosition: 'Kitchen Staff', matchScore: 88, strengths: ['Memasak sangat cepat', 'Paham standar Food Safety'], weaknesses: ['Kurang pandai berinteraksi dengan pelanggan'], alternativePositions: ['Cook Helper'] },
        status: 'Pending'
      },
      { 
        name: 'Dimas Anggara', email: 'dimas@email.com', phone: '08777112233', appliedPosition: 'Barista',
        cvText: 'Dummy text...',
        aiAnalysis: { recommendedPosition: 'Barista', matchScore: 95, strengths: ['Sertifikasi Latte Art', 'Pengetahuan biji kopi sangat luas'], weaknesses: ['Sulit bekerja pagi hari'], alternativePositions: ['Cashier'] },
        status: 'Accepted'
      }
    ];
    
    await Applicant.insertMany(dummyData);
    console.log('Dummy data berhasil ditambahkan!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
