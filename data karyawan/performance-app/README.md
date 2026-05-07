# Sistem Penilaian Kinerja Karyawan F&B (MERN Stack)

Ini adalah aplikasi full-stack MERN untuk Sistem Penilaian Kinerja Karyawan Restoran F&B berbasis KPI dan terintegrasi dengan modul evaluasi AI.

## Struktur Project
- **`/backend`**: Node.js, Express, MongoDB, OpenAI API
- **`/frontend`**: React.js, Vite, Tailwind CSS

---

## 🛠 Panduan Setup & Instalasi (Lokal)

### 1. Persiapan Database (MongoDB)
Pastikan Anda sudah menginstal **MongoDB** di komputer Anda dan service MongoDB sedang berjalan di `mongodb://127.0.0.1:27017`.

### 2. Setup Backend
1. Buka Terminal/Command Prompt, arahkan ke folder backend:
   ```bash
   cd "c:\Users\sandidanibu\OneDrive\Documents\vscode\data karyawan\performance-app\backend"
   ```
2. Instal semua dependensi Node.js:
   ```bash
   npm install
   ```
3. *(Opsional)* Jika Anda memiliki API Key OpenAI, buka file `backend/.env` dan ubah `OPENAI_API_KEY=...`. Jika tidak ada, sistem akan otomatis menggunakan simulasi AI secara lokal.
4. Buat akun Admin pertama kali dengan menjalankan script berikut:
   ```bash
   node seedAdmin.js
   ```
   *(Akan membuat akun `admin@resto.com` dengan password `admin123`)*
5. Jalankan server Backend:
   ```bash
   npm run dev
   ```
   *(Backend akan berjalan di `http://localhost:5001`)*

### 3. Setup Frontend
1. Buka Terminal baru, arahkan ke folder frontend:
   ```bash
   cd "c:\Users\sandidanibu\OneDrive\Documents\vscode\data karyawan\performance-app\frontend"
   ```
2. Instal semua dependensi React:
   ```bash
   npm install
   ```
3. Jalankan server Frontend:
   ```bash
   npm run dev
   ```
4. Buka URL yang muncul (biasanya `http://localhost:5173`) di browser Anda.

---

## 🚀 Cara Penggunaan

1. Buka website di browser. Anda wajib **Login**.
2. **Login sebagai Admin** menggunakan:
   - Email: `admin@resto.com`
   - Password: `admin123`
3. Di **Dashboard Admin**, Anda bisa mengklik tombol **"Sync Pelamar Baru"**. Ini akan secara otomatis membaca pelamar yang "Diterima (Accepted)" dari Sistem Rekrutmen AI sebelumnya, dan memasukkannya sebagai Karyawan dengan password bawaan `resto123`.
4. Admin dapat mengisi formulir evaluasi kinerja per bulan (Hadir, Disiplin, Teamwork, Attitude) + catatan supervisor. Saat ditekan "Simpan", AI akan menghitung skor akhir (1-100) dan mencatat riwayatnya.
5. **Login sebagai Karyawan** menggunakan email mereka dan password `resto123`. Karyawan akan masuk ke portal pribadi untuk melihat Ranking, Total Skor Leaderboard, dan Feedback detail dari AI atas evaluasi supervisor!
