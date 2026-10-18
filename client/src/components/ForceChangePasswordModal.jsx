import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock } from 'lucide-react';

const API_AUTH_URL = '/api/auth';

const ForceChangePasswordModal = ({ user, onLogout, onSuccess }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPass, setShowPass] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const toggleShow = (field) => {
        setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword, oldPassword } = formData;

        // 1. Check Matching
        if (newPassword !== confirmPassword) {
            setError("Password baru tidak cocok!");
            return;
        }

        // 2. Check overlap with Old
        if (newPassword === oldPassword) {
            setError("Password baru tidak boleh sama dengan password lama.");
            return;
        }

        // 3. Complexity Rules
        // Minimal 8 Karakter
        if (newPassword.length < 8) {
            setError("Password harus memiliki minimal 8 karakter.");
            return;
        }

        // Minimal ada satu karakter angka
        if (!/\d/.test(newPassword)) {
            setError("Password harus mengandung minimal satu angka.");
            return;
        }

        // Minimal ada satu huruf besar (ADDED)
        if (!/[A-Z]/.test(newPassword)) {
            setError("Password harus mengandung minimal satu huruf besar.");
            return;
        }

        // Minimal ada satu simbol berikut (!@#$%&*)
        if (!/[!@#$%&*]/.test(newPassword)) {
            setError("Password harus mengandung minimal satu simbol berikut: !@#$%&*");
            return;
        }

        // Selain yang ditanda kurung tidak bisa digunakan (Whitelist)
        // Allowed: a-z, A-Z, 0-9, and [!@#$%&*]
        if (!/^[a-zA-Z0-9!@#$%&*]+$/.test(newPassword)) {
            setError("Password mengandung karakter yang tidak valid. Hanya huruf, angka, dan !@#$%&* yang diperbolehkan.");
            return;
        }

        // Tidak boleh menggunakan Nama sesuai dengan fullname user
        // Hanya cek jika fullname memiliki panjang minimal 4 karakter untuk menghindari false positive (misal nama "2" kena di "123")
        if (user.fullname && user.fullname.length >= 4 && newPassword.toLowerCase().includes(user.fullname.toLowerCase())) {
            setError("Password tidak boleh mengandung nama lengkap Anda.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_AUTH_URL}/change-password`, {
                userId: user.id,
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            setSuccessMessage("Password berhasil diubah! Silakan lanjutkan.");
            setTimeout(() => {
                onSuccess(); // Callback to parent to update User state locally
            }, 1000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Gagal mengubah password.");
        } finally {
            setLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div style={overlayStyle}>
                <div style={cardStyle}>
                    <div style={{ textAlign: 'center', color: '#10b981', marginBottom: '1rem' }}>
                        <div style={{ background: '#d1fae5', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Lock size={30} />
                        </div>
                        <h3 className="text-xl font-bold">Success!</h3>
                        <p>{successMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={overlayStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#fee2e2', color: '#ef4444', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                        <Lock size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Pembaruan Keamanan Diperlukan</h2>
                    <p className="text-gray-500 text-sm">Anda menggunakan password default. Harap ganti untuk melanjutkan.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Old Password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password Saat Ini</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass.old ? "text" : "password"}
                                name="oldPassword"
                                className="form-input w-full"
                                style={{ paddingRight: '40px', width: '100%' }}
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('old')}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                            >
                                {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password Baru</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass.new ? "text" : "password"}
                                name="newPassword"
                                className="form-input w-full"
                                style={{ paddingRight: '40px', width: '100%' }}
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('new')}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                            >
                                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Min 8 karakter, 1 angka, 1 huruf besar, 1 simbol (!@#$%&*).</p>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Konfirmasi Password Baru</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass.confirm ? "text" : "password"}
                                name="confirmPassword"
                                className="form-input w-full"
                                style={{ paddingRight: '40px', width: '100%' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('confirm')}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                            >
                                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full justify-center mt-2"
                        style={{ height: '45px', fontWeight: 600 }}
                    >
                        {loading ? 'Proses...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
};

const cardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'fadeIn 0.3s ease-out'
};

export default ForceChangePasswordModal;
