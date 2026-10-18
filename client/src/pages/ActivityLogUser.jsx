import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = '/api/activity';

const ActivityLogUser = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchLogs();
    }, [page, limit]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/user`, {
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Activity Logs</h2>
                    <p className="text-gray-500">Track user actions and interactions</p>
                </div>
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
                                <th style={{ width: '200px' }}>User</th>
                                <th style={{ width: '150px' }}>Role/Jabatan</th>
                                <th style={{ width: '150px' }}>Action</th>
                                <th>Details</th>
                                <th style={{ width: '120px' }}>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center p-4">Loading...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="7" className="text-center p-4">No activity recorded</td></tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={log.id}>
                                        <td style={{ textAlign: 'center' }}>{(page - 1) * limit + index + 1}</td>
                                        <td>
                                            {format(new Date(log.created_at), 'ddMMyy | HH:mm:ss')}
                                        </td>
                                        <td>
                                            <div className="font-medium">{log.fullname || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{log.username}</div>
                                        </td>
                                        <td>{log.jabatan || '-'}</td>
                                        <td>
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td>{log.details || '-'}</td>
                                        <td className="text-xs text-gray-500">{log.ip_address || '-'}</td>
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
        </div>
    );
};

export default ActivityLogUser;
