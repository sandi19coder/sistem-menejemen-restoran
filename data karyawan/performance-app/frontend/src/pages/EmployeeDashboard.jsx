import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogOut, User, Activity, BrainCircuit } from 'lucide-react';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user'));
        if(!u) return navigate('/login');
        
        // Fetch fresh user data (for rank and score)
        api.get('/auth/me').then(res => setUser(res.data)).catch(() => navigate('/login'));
        
        // Fetch personal evaluations
        api.get(`/evaluations/employee/${u.id}`).then(res => setEvaluations(res.data));
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if(!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-emerald-800 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="font-bold text-xl flex items-center gap-2"><User/> Portal Karyawan</h1>
                <button onClick={logout} className="flex items-center gap-2 hover:text-emerald-300"><LogOut size={18}/> Logout</button>
            </nav>

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border col-span-2 flex items-center gap-6">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <User size={40}/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                            <p className="text-slate-500 font-medium">{user.position} | {user.email}</p>
                        </div>
                    </div>
                    <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center">
                        <p className="text-emerald-200 text-sm font-bold uppercase tracking-wide">Peringkat & Skor</p>
                        <div className="flex items-end gap-2 mt-2">
                            <span className="text-5xl font-black">#{user.rank || '-'}</span>
                            <span className="text-xl opacity-80 mb-1">({user.totalScore}/100)</span>
                        </div>
                    </div>
                </div>

                {/* Evaluations History */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity className="text-emerald-600"/> Riwayat Evaluasi Kinerja (AI Reviewed)</h3>
                    
                    <div className="space-y-4">
                        {evaluations.map(ev => (
                            <div key={ev._id} className="border border-slate-100 bg-slate-50 rounded-xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">Periode: {ev.month}</h4>
                                        <p className="text-xs text-slate-500">Dievaluasi oleh Supervisor</p>
                                    </div>
                                    <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-center">
                                        <p className="text-[10px] font-bold uppercase">Skor AI Akhir</p>
                                        <p className="text-2xl font-black">{ev.finalScore}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    <div className="bg-white p-2 text-center rounded border"><p className="text-[10px] text-slate-500 font-bold uppercase">Hadir</p><p className="font-bold">{ev.kpiMetrics.attendance}</p></div>
                                    <div className="bg-white p-2 text-center rounded border"><p className="text-[10px] text-slate-500 font-bold uppercase">Disiplin</p><p className="font-bold">{ev.kpiMetrics.discipline}</p></div>
                                    <div className="bg-white p-2 text-center rounded border"><p className="text-[10px] text-slate-500 font-bold uppercase">Tim</p><p className="font-bold">{ev.kpiMetrics.teamwork}</p></div>
                                    <div className="bg-white p-2 text-center rounded border"><p className="text-[10px] text-slate-500 font-bold uppercase">Sikap</p><p className="font-bold">{ev.kpiMetrics.attitude}</p></div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                    <h5 className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1"><BrainCircuit size={14}/> Feedback AI Analisis:</h5>
                                    <p className="text-sm text-blue-900 leading-relaxed">{ev.aiFeedback}</p>
                                </div>
                            </div>
                        ))}
                        {evaluations.length === 0 && <p className="text-slate-500 text-center py-6">Belum ada data evaluasi kinerja untuk Anda.</p>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;
