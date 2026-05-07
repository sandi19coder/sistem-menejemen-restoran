# RestoRecruit AI
Sistem penerimaan karyawan restoran (F&B) berbasis AI.

## Fitur
- **Portal Pelamar**: Pelamar dapat mengunggah CV berformat PDF.
- **Ekstraksi PDF**: Sistem (Backend Node.js) akan membaca isi PDF secara otomatis menggunakan `pdf-parse`.
- **Analisis AI (OpenAI)**: CV akan dianalisis untuk menentukan skor kecocokan, rekomendasi posisi, kelebihan, dan kekurangan.
- **Dashboard HRD**: Mengelola daftar pelamar, melihat hasil analisis AI yang rapi, memfilter berdasarkan rekomendasi posisi, dan mengubah status (Terima/Tolak).

## Cara Menjalankan Aplikasi

### 1. Persiapan Backend
Buka terminal dan arahkan ke folder `backend`:
```bash
cd backend
npm install
```

**Konfigurasi AI:**
Buka file `backend/.env` dan ubah `OPENAI_API_KEY` menjadi API Key Anda. 
*(Catatan: Jika Anda belum punya API Key atau membiarkannya kosong, sistem sudah dilengkapi fitur Simulasi Fallback sehingga aplikasi tetap berjalan dan memberikan hasil).*

**Seed Data Dummy:**
Agar HRD Dashboard tidak kosong saat pertama dibuka:
```bash
node seed.js
```

**Jalankan Backend:**
```bash
npm run dev
```
*(Backend akan berjalan di port 5000)*

### 2. Persiapan Frontend
Buka terminal baru dan arahkan ke folder `frontend`:
```bash
cd frontend
npm install
npm run dev
```

Buka URL yang muncul di terminal (biasanya http://localhost:5173). Aplikasi siap digunakan!
