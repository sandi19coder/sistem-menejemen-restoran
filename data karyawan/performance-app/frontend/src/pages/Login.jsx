import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserCircle2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/employee');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Sistem Kinerja F&B</h2>
                    <p className="text-sm text-slate-500">Silakan login untuk melanjutkan</p>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 outline-blue-500" placeholder="admin@resto.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 outline-blue-500" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition">
                        Masuk
                    </button>
                </form>
                <div className="mt-6 text-xs text-center text-slate-400">
                    <p>Setup Pertama: Gunakan script pembuatan admin di panduan.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
