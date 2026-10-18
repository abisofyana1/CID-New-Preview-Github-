import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import logoTrade from '../assets/trade_remittance_new.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/auth/login', {
                username,
                password
            });

            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('loginTime', Date.now().toString());

            // Redirect to dashboard
            navigate('/ciu/complaints');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{
            minHeight: '112vh', // Compensate for body zoom: 90%
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--bg-dark) 0%, #0f172a 100%)', // Darker bg to make the card pop
            margin: 0,
            padding: 0
        }}>
            <div className="card" style={{
                width: '500px',
                padding: '3rem',
                background: 'white',
                // border: '16px solid var(--primary)', // REVERTED per user request
                borderRadius: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                    }}>
                        <img
                            src={logoTrade}
                            alt="Trade & Remittance"
                            style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* If the image doesn't have text, uncomment below. Assuming image HAS text based on history. */}
                    {/* <h2 style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '1rem' }}>Trade & Remittance</h2> */}
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, color: '#64748b' }}>Name / NIP / Email</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: '2.75rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderColor: '#cbd5e1' }}
                                placeholder="Enter your name, nip, or email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, color: '#64748b' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: '2.75rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderColor: '#cbd5e1' }}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{
                        justifyContent: 'center',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '8px'
                    }}>
                        Sign In
                    </button>
                </form>

                {/* Demo Quick Logins for Testing & Live Preview */}
                <div style={{
                    marginTop: '1.75rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.825rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                        color: '#475569'
                    }}>
                        <span>Akun Demo / Testing (Klik untuk Isi):</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        {[
                            { role: 'Admin', user: 'admin', pass: 'admin123', color: '#005E6A' },
                            { role: 'MGR', user: 'mgr', pass: 'mgr123', color: '#0369a1' },
                            { role: 'SPV', user: 'spv', pass: 'spv123', color: '#7c3aed' },
                            { role: 'TL', user: 'tl', pass: 'tl123', color: '#d97706' },
                            { role: 'User', user: 'user', pass: 'user123', color: '#16a34a' }
                        ].map((acc) => (
                            <button
                                key={acc.role}
                                type="button"
                                onClick={() => {
                                    setUsername(acc.user);
                                    setPassword(acc.pass);
                                    setError('');
                                }}
                                style={{
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '6px',
                                    border: `1px solid ${acc.color}40`,
                                    background: `${acc.color}10`,
                                    color: acc.color,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = acc.color; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = `${acc.color}10`; e.currentTarget.style.color = acc.color; }}
                            >
                                {acc.role}
                            </button>
                        ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
                        Password demo: <code>[role]123</code> (contoh: <code>admin123</code>)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
