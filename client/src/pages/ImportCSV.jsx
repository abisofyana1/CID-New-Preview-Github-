import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertTriangle, CheckCircle, X, AlertCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const ImportCSV = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // State
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(true);
    const [result, setResult] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    // Initial Warning Component
    const WarningModal = () => {
        if (!showWarning) return null;
        return (
            <Modal isOpen={showWarning} onClose={() => { }} zIndex={10000}>
                <div className="card" style={{
                    width: '450px',
                    maxWidth: '90%',
                    background: 'white',
                    borderRadius: '1.25rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderBottom: '1px solid #f1f5f9', background: '#fffbeb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706' }}>
                            <AlertTriangle size={28} strokeWidth={2.5} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Perhatian</h3>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ lineHeight: 1.6, margin: 0 }}>
                            Fitur ini khusus untuk import data dari file <strong>CSV (Comma Separated Values)</strong> dengan delimiter semicolon (;).
                        </p>

                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#1f2937', fontWeight: 600 }}>
                                <AlertCircle size={16} />
                                <span>Note:</span>
                            </div>
                            <p style={{ color: '#64748b', margin: 0 }}>
                                Pastikan file CSV Anda menggunakan pemisah semicolon (;) dan setiap teks diapit tanda kutip (").
                            </p>
                        </div>

                        <p style={{ fontWeight: 600, color: '#374151', paddingTop: '0.5rem', margin: 0 }}>Apakah Anda ingin melanjutkan?</p>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '1.5rem', background: '#f9fafb', borderTop: '1px solid #f1f5f9' }}>
                        <button
                            onClick={() => navigate('/ciu/complaints')}
                            style={{ padding: '0.6rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, color: '#4b5563', background: 'white', border: '1px solid #e5e7eb', cursor: 'pointer', minWidth: '100px' }}
                        >
                            Tidak
                        </button>
                        <button
                            onClick={() => setShowWarning(false)}
                            style={{ padding: '0.6rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, color: 'white', background: '#2563eb', border: 'none', cursor: 'pointer', minWidth: '100px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                        >
                            Ya, Lanjut
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    // Result Summary Modal
    const ResultModal = () => {
        if (!showResultModal || !result) return null;
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '48rem', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ background: 'linear-gradient(to right, #2563eb, #4338ca)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}>
                                <FileText size={24} color="white" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Laporan Import CSV</h3>
                                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>Ringkasan hasil import file CSV</p>
                            </div>
                        </div>
                        <button onClick={() => { setShowResultModal(false); setResult(null); }} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                        {[
                            { label: 'Data Sukses', value: result.success, color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle color="#16a34a" size={24} /> },
                            { label: 'Data Duplikat', value: result.duplicate, color: '#ca8a04', bg: '#fef9c3', icon: <AlertTriangle color="#ca8a04" size={24} /> },
                            { label: 'Data Gagal', value: result.failed, color: '#dc2626', bg: '#fee2e2', icon: <AlertCircle color="#dc2626" size={24} /> }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #eff6ff', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ padding: '0.75rem', background: item.bg, borderRadius: '9999px', marginBottom: '0.75rem' }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontSize: '1.875rem', fontWeight: 900, color: '#1e293b' }}>{item.value}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Details Lists */}
                    <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                        {result.failed === 0 && result.duplicate === 0 && (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2.5rem 0', opacity: 0.6 }}>
                                <div style={{ width: '5rem', height: '5rem', background: '#dcfce7', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <CheckCircle size={40} color="#16a34a" />
                                </div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Import Berhasil!</h4>
                                <p style={{ color: '#64748b', margin: 0 }}>Semua data berhasil diproses tanpa error.</p>
                            </div>
                        )}

                        {result.failed > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ height: '1.5rem', width: '0.25rem', background: '#ef4444', borderRadius: '9999px' }}></div>
                                    <h4 style={{ fontWeight: 700, color: '#1f2937', margin: 0 }}>Detail Kegagalan</h4>
                                </div>
                                <div style={{ background: 'white', border: '1px solid #fee2e2', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#fef2f2', color: '#7f1d1d' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>Baris</th>
                                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>No Ticket</th>
                                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>Keterangan Error</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.failureList.map((fail, idx) => (
                                                <tr key={idx} style={{ borderTop: '1px solid #fee2e2' }}>
                                                    <td style={{ padding: '0.75rem 1.5rem', fontFamily: 'monospace', color: '#475569' }}>#{fail.row}</td>
                                                    <td style={{ padding: '0.75rem 1.5rem', fontWeight: 500, color: '#1e293b' }}>{fail.ticket}</td>
                                                    <td style={{ padding: '0.75rem 1.5rem', color: '#dc2626' }}>{fail.reason}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleDownloadTemplate = () => {
        // Create CSV Content with BOM, quoted fields, and semicolon delimiter
        const headers = [
            'No', 'No Ticket', 'Tgl Open', 'Open By', 'Tgl Close', 'Close By', 'Close Update by', 'Duration',
            'No Reff', 'Cust Type', 'Cust Name', 'Cust Loc', 'Cust Note',
            'BIC', 'Branch', 'BNIR Rep', 'P.Agent',
            'Channel Type', 'Notes', 'Product', 'Note', 'Subject', 'Subject Note',
            'Question', 'Answer', 'Internal Note'
        ];

        const sample = [
            '1',    // No
            '',     // No Ticket
            '2025-01-01 10:00:00', // Tgl Open
            'Admin', // Open By
            '',     // Tgl Close
            '',     // Close By
            '',     // Close Update by
            '',     // Duration
            'REFF-123', // No Reff
            'Nasabah Prioritas', // Cust Type
            'John Doe', // Cust Name
            'Jakarta', // Cust Loc
            'VIP User', // Cust Note
            'BNIJKT', // BIC
            'KCU Jakarta', // Branch
            '', // BNIR Rep
            '', // P.Agent
            'Email', // Channel Type
            'Notes about channel', // Notes
            'Kartu Kredit', // Product
            'Gold Card', // Note
            'Tagihan', // Subject
            'Masalah Billing', // Subject Note
            'Pertanyaan mengenai tagihan Januari', // Question
            '', // Answer
            'Internal usage note' // Internal Note
        ];

        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '""';
            let str = String(val);
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        };

        const csvContent = [
            headers.map(escapeCSV).join(';'),
            sample.map(escapeCSV).join(';')
        ].join('\r\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Template_Import_Complaint.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Pilih file CSV terlebih dahulu");
            return;
        }

        if (!file.name.toLowerCase().match(/\.csv$/)) {
            alert("Hanya file CSV (.csv) yang diperbolehkan");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('iduser', user?.id);

        try {
            const res = await axios.post('/api/complaints/import-csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const stats = res.data.stats;
            setResult({
                success: stats.success,
                duplicate: stats.duplicate,
                failed: stats.failed,
                failureList: stats.failures || []
            });
            setShowResultModal(true);
            setFile(null);

            // Clear input
            const fileInput = document.getElementById('csv-upload');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            console.error(err);
            alert("Gagal mengupload: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const styles = {
        pageContainer: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: "'Inter', sans-serif"
        },
        card: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(255,255,255,0.8)',
            width: '100%',
            maxWidth: '1100px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            padding: '2rem 3rem',
            background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(240,249,255,0.5))',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'rgba(226, 232, 240, 0.8)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        mainLayout: {
            display: 'flex',
            flexDirection: 'row',
            minHeight: '600px',
            flexWrap: 'wrap'
        },
        sidebar: {
            flex: '0 0 350px',
            padding: '2.5rem',
            background: 'rgba(248, 250, 252, 0.8)',
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: 'rgba(226, 232, 240, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        },
        content: {
            flex: 1,
            padding: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            minWidth: '300px'
        },
        uploadZone: {
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        uploadLabel: {
            borderWidth: '3px',
            borderStyle: 'dashed',
            borderColor: '#cbd5e1',
            borderRadius: '24px',
            background: '#f8fafc',
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        },
        uploadLabelActive: {
            borderColor: '#3b82f6',
            background: 'rgba(239, 246, 255, 0.5)'
        },
        backBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'white',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#e2e8f0',
            borderRadius: '12px',
            color: '#64748b',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        primaryBtn: {
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'transform 0.2s'
        }
    };

    return (
        <div style={styles.pageContainer}>
            <WarningModal />
            <ResultModal />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                            <div style={{ background: '#3b82f6', padding: '0.6rem', borderRadius: '10px', color: 'white', display: 'flex' }}>
                                <FileText size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Import CSV</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, paddingLeft: '3.5rem' }}>
                            Upload dan perbarui database complaint dari file CSV (Semicolon delimited).
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/ciu/complaints')}
                        style={styles.backBtn}
                        onMouseOver={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                        onMouseOut={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                        <span>&larr;</span> Kembali ke Data List
                    </button>
                </div>

                <div style={styles.mainLayout}>
                    <div style={styles.sidebar}>
                        <div>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
                                <CheckCircle size={20} color="#3b82f6" />
                                Panduan Import CSV
                            </h4>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { text: <span>Format file wajib <b>.csv</b>.</span> },
                                    { text: <span>Pemisah wajib menggunakan <b>semicolon (;)</b>.</span> },
                                    { text: <span>Semua teks wajib diapit <b>tanda kutip (")</b>.</span> },
                                    { text: <span>Header kolom wajib sesuai dengan format export.</span> }
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', marginTop: '7px', flexShrink: 0 }} />
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Resources</p>
                            <button
                                onClick={handleDownloadTemplate}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'white',
                                    color: '#3b82f6',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                                onMouseOut={e => e.currentTarget.style.background = 'white'}
                            >
                                <Download size={18} />
                                Download Template CSV
                            </button>
                        </div>
                    </div>

                    <div style={styles.content}>
                        <div style={styles.uploadZone}>
                            <input
                                type="file"
                                accept=".csv"
                                id="csv-upload"
                                className="hidden"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="csv-upload"
                                style={{
                                    ...styles.uploadLabel,
                                    ...(file ? styles.uploadLabelActive : {})
                                }}
                                onMouseOver={e => !file && (e.currentTarget.style.borderColor = '#3b82f6')}
                                onMouseOut={e => !file && (e.currentTarget.style.borderColor = '#cbd5e1')}
                            >
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '50%',
                                    background: file ? '#eff6ff' : 'white',
                                    color: file ? '#3b82f6' : '#94a3b8',
                                    boxShadow: file ? '0 10px 25px -5px rgba(59, 130, 246, 0.4)' : '0 4px 10px rgba(0,0,0,0.05)',
                                    marginBottom: '1.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'transform 0.3s'
                                }}>
                                    {file ? <FileText size={48} /> : <Upload size={48} />}
                                </div>

                                <div style={{ textAlign: 'center', padding: '0 2rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: file ? '#1d4ed8' : '#334155', marginBottom: '0.5rem' }}>
                                        {file ? file.name : 'Drop file CSV disini'}
                                    </h3>
                                    {!file && <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>atau klik untuk memilih file</p>}
                                    {file && <span style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>File Ready ✓</span>}
                                </div>
                            </label>

                            <button
                                style={{
                                    ...styles.primaryBtn,
                                    opacity: !file || loading ? 0.6 : 1,
                                    cursor: !file || loading ? 'not-allowed' : 'pointer',
                                    background: !file || loading ? '#cbd5e1' : styles.primaryBtn.background
                                }}
                                onClick={handleUpload}
                                disabled={!file || loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} strokeWidth={3} />
                                        Mulai Import CSV
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '2rem 0', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
                © {new Date().getFullYear()} Trade & Remittance Import System &bull; Pastikan data bersih sebelum upload
            </div>
        </div>
    );
};

export default ImportCSV;
