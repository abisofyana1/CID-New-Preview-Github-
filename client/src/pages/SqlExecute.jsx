import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import Popup from '../components/Popup';

const SqlExecute = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, type: '', title: '', message: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setPopup({ show: true, type: 'error', title: 'Error', message: 'Please select a SQL file first.' });
            return;
        }

        // Double check extension
        if (!file.name.toLowerCase().endsWith('.sql')) {
            setPopup({ show: true, type: 'error', title: 'Invalid File', message: 'Only .sql files are allowed.' });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('iduser', user?.id); // Log who did it

        try {
            await axios.post('/api/system/execute-sql', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPopup({ show: true, type: 'success', title: 'Success', message: 'SQL file executed successfully.' });
            setFile(null);
        } catch (err) {
            console.error(err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Execution Failed',
                message: err.response?.data?.error || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Execute SQL Script</h2>
            <div className="card max-w-2xl mx-auto">
                <div className="p-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 shrink-0" size={24} />
                        <div>
                            <h4 className="font-bold text-yellow-800 text-sm mb-1">Warning: Advanced Feature</h4>
                            <p className="text-yellow-700 text-sm">
                                Executing SQL scripts directly modifies the database.
                                This cannot be undone. Ensure your SQL file is valid and tested.
                                <br /><strong>Use with extreme caution.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors">
                        <input
                            type="file"
                            accept=".sql"
                            id="sql-upload"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <label htmlFor="sql-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            {file ? (
                                <FileText className="text-blue-500" size={48} />
                            ) : (
                                <Upload className="text-gray-400" size={48} />
                            )}

                            <span className="text-gray-600 font-medium">
                                {file ? file.name : 'Click to select .sql file'}
                            </span>

                            {!file && <span className="text-gray-400 text-sm">Max size: 10MB</span>}
                        </label>
                    </div>

                    {file && (
                        <div className="mt-6 flex justify-center">
                            <button
                                className="btn btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2"
                                onClick={handleUpload}
                                disabled={loading}
                            >
                                {loading ? 'Executing...' : (
                                    <>
                                        <CheckCircle size={20} />
                                        Execute SQL
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

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

export default SqlExecute;
