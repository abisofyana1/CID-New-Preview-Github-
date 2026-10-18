import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Monitor, Plus, AlertTriangle, CheckCircle, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import Popup from '../components/Popup';

const API_URL = '/api/activity';

const ActivityLogApp = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Popup State
    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        title: '',
        message: ''
    });

    const [formData, setFormData] = useState({
        status: 'Normal',
        description: '',
        recommendation: ''
    });

    useEffect(() => {
        fetchLogs();
    }, [page, limit]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/app`, {
                params: { page, limit }
            });
            setLogs(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/app`, {
                ...formData,
                iduser: user?.id
            });
            setShowModal(false);
            setPopup({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Application log recorded.'
            });
            setFormData({ status: 'Normal', description: '', recommendation: '' });
            fetchLogs();
        } catch (err) {
            console.error(err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save log.'
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Normal': return 'bg-green-100 text-green-800';
            case 'Down': return 'bg-red-100 text-red-800';
            case 'Bug': return 'bg-yellow-100 text-yellow-800';
            case 'Error': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Application Logs</h2>
                    <p className="text-gray-500">System health and issue tracking</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Log Status
                </button>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="text-sm text-gray-500">
                        Total Records: <b>{total}</b>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                            className="form-select text-sm py-1"
                            style={{ width: 'auto' }}
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        >
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                                <th style={{ width: '180px' }}>Date</th>
                                <th style={{ width: '150px' }}>Status</th>
                                <th style={{ width: '150px' }}>Reported By</th>
                                <th>Description</th>
                                <th>Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-4">No logs found</td></tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={log.id}>
                                        <td style={{ textAlign: 'center' }}>{(page - 1) * limit + index + 1}</td>
                                        <td>
                                            {format(new Date(log.created_at), 'dd MMM yyyy HH:mm:ss')}
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td>{log.fullname || 'System'}</td>
                                        <td>{log.description || '-'}</td>
                                        <td>{log.recommendation || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4 px-2">
                    <div className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-outline"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <button
                            className="btn btn-outline"
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Log Application Status</h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Normal">Normal</option>
                                <option value="Down">Down</option>
                                <option value="Bug">Bug System</option>
                                <option value="Error">Fatal Error</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the system state or issue..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Recommendation (Saran Perbaikan)</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={formData.recommendation}
                                onChange={e => setFormData({ ...formData, recommendation: e.target.value })}
                                placeholder="Suggested fix or action..."
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Log</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Popup
                isOpen={popup.show}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                onClose={() => setPopup(p => ({ ...p, show: false }))}
            />
        </div>
    );
};

export default ActivityLogApp;
