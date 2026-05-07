import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogOut, Users, FileBarChart, RefreshCw, Trophy } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    
    // Evaluation Form State
    const [selectedEmp, setSelectedEmp] = useState('');
    const [month, setMonth] = useState('2023-10');
    const [metrics, setMetrics] = useState({ attendance: 100, discipline: 100, teamwork: 100, attitude: 100 });
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            if(err.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const handleSync = async () => {
        if(!confirm('Tarik data pelamar yang DITERIMA dari Sistem Rekrutmen AI?')) return;
        setIsSyncing(true);
        try {
            const res = await api.post('/employees/sync-applicants');
            alert(res.data.msg);
            fetchEmployees();
        } catch (err) {
            alert('Gagal sinkronisasi data.');
        }
        setIsSyncing(false);
    };

    const submitEvaluation = async (e) => {
        e.preventDefault();
        if(!selectedEmp) return alert('Pilih karyawan!');
        try {
            await api.post('/evaluations', {
                employeeId: selectedEmp,
                month,
                kpiMetrics: metrics,
                supervisorNotes: notes
            });
            alert('Evaluasi berhasil disimpan & AI telah menghitung skor!');
            fetchEmployees();
            setSelectedEmp('');
            setNotes('');
        } catch (err) {
            alert('Gagal menyimpan evaluasi.');
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="font-bold text-xl flex items-center gap-2"><FileBarChart/> HRD Admin Panel</h1>
                <button onClick={logout} className="flex items-center gap-2 hover:text-red-300"><LogOut size={18}/> Logout</button>
            </nav>

            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Employee List & Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2"><Users className="text-blue-600"/> Daftar Karyawan</h2>
                            <button onClick={handleSync} disabled={isSyncing} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-200">
                                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> Sync Pelamar Baru
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Rank</th>
                                        <th className="p-3">Nama</th>
                                        <th className="p-3">Posisi</th>
                                        <th className="p-3">Skor Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp, i) => (
                                        <tr key={emp._id} className="border-b">
                                            <td className="p-3 font-bold text-slate-400">#{i+1}</td>
                                            <td className="p-3 font-bold text-slate-800">{emp.name}</td>
                                            <td className="p-3">{emp.position}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${emp.totalScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {emp.totalScore}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-slate-400">Belum ada karyawan. Silakan Sync Pelamar.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-sm text-white">
                        <h2 className="font-bold text-lg flex items-center gap-2 mb-4"><Trophy/> Top 3 Leaderboard (Reward Bulan Ini)</h2>
                        <div className="flex justify-around items-end h-32 mt-8">
                            {employees.slice(0,3).map((emp, i) => (
                                <div key={emp._id} className="flex flex-col items-center">
                                    <span className="font-bold mb-1">{emp.totalScore}</span>
                                    <div className={`w-16 rounded-t-lg bg-white/20 flex items-end justify-center pb-2 font-black text-2xl`} style={{height: `${(3-i)*30}%`}}>
                                        #{i+1}
                                    </div>
                                    <span className="mt-2 text-sm font-medium">{emp.name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Input Evaluation */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="font-bold text-lg mb-4 border-b pb-2">Buat Evaluasi Kinerja (AI)</h2>
                    <form onSubmit={submitEvaluation} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Karyawan</label>
                            <select required value={selectedEmp} onChange={e=>setSelectedEmp(e.target.value)} className="w-full p-2 border rounded bg-slate-50 text-sm">
                                <option value="">-- Pilih --</option>
                                {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.position})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Bulan Evaluasi</label>
                            <input type="month" required value={month} onChange={e=>setMonth(e.target.value)} className="w-full p-2 border rounded bg-slate-50 text-sm"/>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Kehadiran (40%)</label>
                                <input type="number" min="0" max="100" value={metrics.attendance} onChange={e=>setMetrics({...metrics, attendance: e.target.value})} className="w-full p-2 border rounded text-sm font-bold text-blue-600"/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Disiplin (20%)</label>
                                <input type="number" min="0" max="100" value={metrics.discipline} onChange={e=>setMetrics({...metrics, discipline: e.target.value})} className="w-full p-2 border rounded text-sm font-bold text-blue-600"/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Teamwork (20%)</label>
                                <input type="number" min="0" max="100" value={metrics.teamwork} onChange={e=>setMetrics({...metrics, teamwork: e.target.value})} className="w-full p-2 border rounded text-sm font-bold text-blue-600"/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Attitude (20%)</label>
                                <input type="number" min="0" max="100" value={metrics.attitude} onChange={e=>setMetrics({...metrics, attitude: e.target.value})} className="w-full p-2 border rounded text-sm font-bold text-blue-600"/>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Catatan Supervisor</label>
                            <textarea rows="3" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Tuliskan evaluasi manual di sini..." className="w-full p-2 border rounded bg-slate-50 text-sm"></textarea>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 text-sm">
                            Hitung & Simpan dengan AI
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
