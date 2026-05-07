import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, FileText, Users, BrainCircuit, Search, ChevronRight, Check, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const App = () => {
  const [activeTab, setActiveTab] = useState('applicant');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit /> RestoRecruit AI
          </h1>
          <nav className="flex gap-2">
            <button onClick={() => setActiveTab('applicant')} className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === 'applicant' ? 'bg-emerald-900' : 'hover:bg-emerald-600'}`}>Portal Pelamar</button>
            <button onClick={() => setActiveTab('hrd')} className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === 'hrd' ? 'bg-emerald-900' : 'hover:bg-emerald-600'}`}>Dashboard HRD</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-6">
        {activeTab === 'applicant' && <ApplicantPortal />}
        {activeTab === 'hrd' && <HRDDashboard />}
      </main>
    </div>
  );
};

// --- PORTAL PELAMAR ---
const ApplicantPortal = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', appliedPosition: '' });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Pilih file CV terlebih dahulu!');
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('appliedPosition', formData.appliedPosition);
    data.append('cvFile', file);

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/applicants/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(res.data.data);
      setFormData({ name: '', email: '', phone: '', appliedPosition: '' });
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
    setIsSubmitting(false);
  };

  if (successMsg) return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-10 rounded-3xl shadow-xl text-center border-t-4 border-emerald-500">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={50} /></div>
      <h2 className="text-3xl font-bold mb-2 text-slate-800">Lamaran Terkirim!</h2>
      <p className="text-slate-500 mb-8">Terima kasih, CV Anda sedang dianalisis oleh sistem AI kami. Kami akan menghubungi Anda jika Anda memenuhi kriteria.</p>
      
      <div className="bg-slate-50 border p-6 rounded-2xl text-left mb-8 shadow-inner">
        <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">📋 Ringkasan Aplikasi</h3>
        <p><strong>Nama:</strong> {successMsg.name}</p>
        <p><strong>Posisi Dilamar:</strong> {successMsg.appliedPosition}</p>
        <p><strong>Status:</strong> <span className="text-amber-600 font-bold bg-amber-100 px-2 rounded">Reviewing</span></p>
      </div>

      <button onClick={() => setSuccessMsg(null)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700">Kembali ke Form</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Karir Restoran F&B</h2>
        <p className="text-slate-500">Isi formulir di bawah ini dan unggah CV Anda (Format PDF). Sistem kami akan secara otomatis merekomendasikan posisi terbaik untuk Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Posisi yang Diinginkan</label>
            <select required value={formData.appliedPosition} onChange={e=>setFormData({...formData, appliedPosition:e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50">
              <option value="">-- Pilih Posisi --</option>
              <option value="Waiter">Waiter</option>
              <option value="Kasir">Kasir</option>
              <option value="Barista">Barista</option>
              <option value="Kitchen Staff">Kitchen Staff</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">No. WhatsApp</label>
            <input required type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50" />
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-300 p-8 rounded-2xl text-center hover:bg-slate-50 transition">
          <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-slate-700 mb-1">Upload CV Anda (Wajib PDF)</p>
          <p className="text-sm text-slate-500 mb-4">Maksimal ukuran file: 2MB</p>
          <input required type="file" accept=".pdf" onChange={e=>setFile(e.target.files[0])} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting ? <><BrainCircuit className="animate-pulse" /> Memproses Analisis AI...</> : 'Kirim Lamaran'}
        </button>
      </form>
    </div>
  );
};

// --- DASHBOARD HRD ---
const HRDDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [filterPos, setFilterPos] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplicants = async () => {
    const params = filterPos ? `?position=${filterPos}` : '';
    const res = await axios.get(`${API_URL}/applicants${params}`);
    setApplicants(res.data);
  };

  useEffect(() => { fetchApplicants(); }, [filterPos]);

  const handleStatus = async (id, status) => {
    if(confirm(`Yakin ubah status jadi ${status}?`)) {
      await axios.put(`${API_URL}/applicants/${id}/status`, { status });
      fetchApplicants();
      if(selectedApp && selectedApp._id === id) setSelectedApp({...selectedApp, status});
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* KIRI: DAFTAR PELAMAR */}
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl flex items-center gap-2"><Users /> Kandidat ({applicants.length})</h2>
        </div>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          <select value={filterPos} onChange={e=>setFilterPos(e.target.value)} className="w-full pl-9 p-2 border rounded-xl text-sm bg-slate-50">
            <option value="">Semua Posisi Rekomendasi AI</option>
            <option value="Waiter">Waiter</option>
            <option value="Kasir">Kasir</option>
            <option value="Barista">Barista</option>
            <option value="Kitchen Staff">Kitchen Staff</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {applicants.map(app => (
            <div key={app._id} onClick={() => setSelectedApp(app)} className={`p-4 rounded-xl cursor-pointer border transition ${selectedApp?._id === app._id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'}`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-800">{app.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  app.status==='Pending'?'bg-amber-100 text-amber-700' : 
                  app.status==='Accepted'?'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>{app.status}</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Lamar: {app.appliedPosition}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-grow bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${app.aiAnalysis.matchScore >= 80 ? 'bg-green-500' : app.aiAnalysis.matchScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${app.aiAnalysis.matchScore}%`}}></div>
                </div>
                <span className="text-xs font-bold text-slate-600">AI: {app.aiAnalysis.matchScore}</span>
              </div>
            </div>
          ))}
          {applicants.length === 0 && <div className="text-center text-slate-400 text-sm mt-10">Belum ada pelamar.</div>}
        </div>
      </div>

      {/* KANAN: DETAIL ANALISIS AI */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 h-[85vh] overflow-y-auto">
        {selectedApp ? (
          <div>
            <div className="bg-slate-900 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black mb-1">{selectedApp.name}</h2>
                  <p className="text-slate-400">{selectedApp.email} | {selectedApp.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Posisi Dilamar</p>
                  <p className="text-xl font-bold text-amber-400">{selectedApp.appliedPosition}</p>
                </div>
              </div>

              {selectedApp.status === 'Pending' && (
                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleStatus(selectedApp._id, 'Accepted')} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><Check size={16}/> Terima Kandidat</button>
                  <button onClick={() => handleStatus(selectedApp._id, 'Rejected')} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><X size={16}/> Tolak</button>
                </div>
              )}
            </div>

            <div className="p-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><BrainCircuit className="text-emerald-600" /> Hasil Analisis AI OpenAI</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                  <p className="text-sm font-bold text-emerald-600 mb-1">Rekomendasi Posisi Terbaik</p>
                  <p className="text-2xl font-black text-slate-800">{selectedApp.aiAnalysis.recommendedPosition}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
                  <p className="text-sm font-bold text-blue-600 mb-1">Skor Kecocokan (Match Score)</p>
                  <p className="text-5xl font-black text-blue-700">{selectedApp.aiAnalysis.matchScore}<span className="text-lg text-blue-400">/100</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5"/> Kelebihan (Strengths)</h4>
                  <ul className="space-y-2">
                    {selectedApp.aiAnalysis.strengths.map((str, i) => (
                      <li key={i} className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm">{str}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><XCircle className="text-red-500 w-5 h-5"/> Kekurangan (Weaknesses)</h4>
                  <ul className="space-y-2">
                    {selectedApp.aiAnalysis.weaknesses.map((w, i) => (
                      <li key={i} className="bg-red-50 text-red-800 px-3 py-2 rounded-lg text-sm">{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2 text-sm">Alternatif Posisi Lain:</h4>
                <div className="flex gap-2">
                  {selectedApp.aiAnalysis.alternativePositions.map((alt, i) => (
                    <span key={i} className="bg-white border text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{alt}</span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Isi CV Mentah (Hasil Ekstraksi PDF):</h4>
                <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedApp.cvText}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Users className="w-16 h-16 mb-4 opacity-50" />
            <p>Pilih kandidat dari daftar di sebelah kiri untuk melihat detail analisis AI.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default App;
