import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    User,
    Mail,
    Briefcase,
    Phone,
    Shield,
    X,
    Eye,
    EyeOff,
    CreditCard
} from 'lucide-react';
import Pagination from '../components/Pagination';
import Popup from '../components/Popup';

const UserManagement = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isViewOnly, setIsViewOnly] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        pass: '',
        fullname: '',
        nip_nrp: '',
        email: '',
        jabatan: '',
        nohp: '',
        idgroup: '5'
    });

    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        title: '',
        message: '',
        onConfirm: null
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to fetch users list.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                actorId: currentUser?.id
            };

            if (editId) {
                // Check if any changes were made
                const hasChanges = Object.keys(initialFormData).some(key => {
                    if (key === 'pass') return formData.pass !== '';
                    return String(formData[key]) !== String(initialFormData[key]);
                });

                if (!hasChanges) {
                    setShowModal(false);
                    setLastContext(null);
                    return;
                }

                await axios.put(`/api/users/${editId}`, payload);
                setPopup({
                    show: true,
                    type: 'success',
                    title: 'Success',
                    message: 'User updated successfully!'
                });
            } else {
                await axios.post('/api/users', payload);
                setPopup({
                    show: true,
                    type: 'success',
                    title: 'Success',
                    message: 'User created successfully!'
                });
            }
            setShowModal(false);
            fetchUsers();
            resetForm();
            setLastContext(null);
        } catch (err) {
            console.error('Error saving user:', err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Error',
                message: err.response?.data?.error || 'Failed to save user.'
            });
        }
    };

    const handleDelete = (id) => {
        setPopup({
            show: true,
            type: 'delete',
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            onConfirm: () => confirmDelete(id)
        });
    };

    const confirmDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`, { params: { actorId: currentUser?.id } });
            setPopup({
                show: true,
                type: 'success',
                title: 'Deleted',
                message: 'User deleted successfully.'
            });
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to delete user.'
            });
        }
    };

    const [initialFormData, setInitialFormData] = useState({});

    // State to track the last edited context (id or 'new')
    const [lastContext, setLastContext] = useState(null);

    const handleView = (user) => {
        setIsViewOnly(true);
        setEditId(user.id);
        const mappedData = {
            name: user.name,
            pass: '',
            fullname: user.fullname,
            nip_nrp: user.nip_nrp || '',
            email: user.email || '',
            jabatan: user.jabatan || '',
            nohp: user.nohp || '',
            idgroup: String(user.idgroup)
        };
        setFormData(mappedData);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        const mappedData = {
            name: user.name,
            pass: '', // Don't show password
            fullname: user.fullname,
            nip_nrp: user.nip_nrp || '',
            email: user.email || '',
            jabatan: user.jabatan || '',
            nohp: user.nohp || '',
            idgroup: String(user.idgroup)
        };
        setInitialFormData(mappedData);

        // If we are re-opening the same user edit, keep the draft
        if (lastContext === user.id) {
            setEditId(user.id);
            // Check if we were viewing or editing? Usually assume edit if clicking edit.
            // But if we were viewing, we should switch to edit?
            // Since lastContext is just ID, we don't know mode.
            // Simplification: Always force Edit mode when clicking Edit.
            setIsViewOnly(false);
            setShowModal(true);
            return;
        }

        // Switching context, so load new data
        setLastContext(user.id);
        setEditId(user.id);
        setFormData(mappedData);
        setIsViewOnly(false);
        setShowModal(true);
    };

    const handleAdd = () => {
        // If we are re-opening "Add New", keep the draft
        if (lastContext === 'new') {
            setEditId(null);
            setIsViewOnly(false);
            setShowModal(true);
            return;
        }

        // Switching context to New
        setLastContext('new');
        resetForm();
        setEditId(null);
        setIsViewOnly(false);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            pass: '',
            fullname: '',
            nip_nrp: '',
            email: '',
            jabatan: '',
            nohp: '',
            idgroup: '5'
        });
        setShowPassword(false);
        setIsViewOnly(false);
    };

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.fullname || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastEntry = entriesPerPage === 'All' ? filteredUsers.length : currentPage * entriesPerPage;
    const indexOfFirstEntry = entriesPerPage === 'All' ? 0 : indexOfLastEntry - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-500">Manage application users and their roles</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500">
                        Total Users: <b>{filteredUsers.length}</b>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name (ID)</th>
                                <th>Fullname</th>
                                <th>NIP/NRP</th>
                                <th>Role</th>
                                <th>Position (Jabatan)</th>
                                <th>Email</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                            ) : currentUsers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-4">No users found</td></tr>
                            ) : (
                                currentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 500 }}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <User size={16} />
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td>{user.fullname}</td>
                                        <td>{user.nip_nrp || '-'}</td>
                                        <td>
                                            {(() => {
                                                const roles = {
                                                    1: { label: 'Admin', bg: '#dbeafe', color: '#1e40af' },
                                                    2: { label: 'MGR', bg: '#f3e8ff', color: '#6b21a8' },
                                                    3: { label: 'SPV', bg: '#ffedd5', color: '#c2410c' },
                                                    4: { label: 'TL', bg: '#ccfbf1', color: '#0f766e' },
                                                    5: { label: 'User', bg: '#f3f4f6', color: '#374151' }
                                                };
                                                const role = roles[user.idgroup] || roles[5];
                                                const label = user.role_name || role.label;

                                                return (
                                                    <span className="badge" style={{ background: role.bg, color: role.color }}>
                                                        {label}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td>{user.jabatan || '-'}</td>
                                        <td>{user.email || '-'}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                {/* View Button - Only for Admin, MGR, SPV */}
                                                {(currentUser?.idgroup == 1 || currentUser?.idgroup == 2 || currentUser?.idgroup == 3) && (
                                                    <button className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="View Detail" onClick={() => handleView(user)}>
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit User" onClick={() => handleEdit(user)}>
                                                    <Edit size={16} />
                                                </button>
                                                {user.name !== 'admin' && (
                                                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete User" onClick={() => handleDelete(user.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    totalEntries={filteredUsers.length}
                    entriesPerPage={entriesPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onEntriesChange={setEntriesPerPage}
                />
            </div>

            {showModal && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
                    onClick={(e) => {
                        // Close only if clicking the backdrop, not the card
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="card" style={{ width: '500px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div className="flex items-center gap-2">
                                <Shield className="text-primary" size={24} />
                                <h3 className="m-0 font-bold text-lg">
                                    {isViewOnly ? 'View User' : (editId ? 'Edit User' : 'Add New User')}
                                </h3>
                            </div>
                            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            name="name"
                                            className="form-input"
                                            style={{ paddingLeft: '2.2rem' }}
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                            disabled={!!editId || isViewOnly}
                                            placeholder="Enter unique username"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">NIP / NRP</label>
                                    <div style={{ position: 'relative' }}>
                                        <CreditCard size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            name="nip_nrp"
                                            className="form-input"
                                            style={{ paddingLeft: '2.2rem' }}
                                            value={formData.nip_nrp || ''}
                                            onChange={handleFormChange}
                                            placeholder="Enter NIP/NRP"
                                            disabled={isViewOnly}
                                        />
                                    </div>
                                </div>
                            </div>


                            {!isViewOnly && (
                                <div className="form-group">
                                    <label className="form-label">Password {editId && '(Keep blank if no change)'}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            name="pass"
                                            type={showPassword ? "text" : "password"}
                                            className="form-input"
                                            value={formData.pass}
                                            onChange={handleFormChange}
                                            required={!editId}
                                            placeholder={editId ? "Enter new password" : "Enter temporary password"}
                                        />
                                        <button
                                            type="button"
                                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Fullname</label>
                                <input name="fullname" className="form-input" value={formData.fullname} onChange={handleFormChange} required placeholder="Enter full name" disabled={isViewOnly} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <div style={{ position: 'relative' }}>
                                    <Shield size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                    <select name="idgroup" className="form-select" style={{ paddingLeft: '2.2rem' }} value={formData.idgroup} onChange={handleFormChange} required disabled={isViewOnly}>
                                        <option value="1">Admin</option>
                                        <option value="2">MGR</option>
                                        <option value="3">SPV</option>
                                        <option value="4">TL</option>
                                        <option value="5">User</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Position (Jabatan)</label>
                                    <div style={{ position: 'relative' }}>
                                        <Briefcase size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input name="jabatan" className="form-input" style={{ paddingLeft: '2.2rem' }} value={formData.jabatan} onChange={handleFormChange} placeholder="e.g. Officer" disabled={isViewOnly} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone (No HP)</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input name="nohp" className="form-input" style={{ paddingLeft: '2.2rem' }} value={formData.nohp} onChange={handleFormChange} placeholder="0812..." disabled={isViewOnly} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                    <input name="email" className="form-input" style={{ paddingLeft: '2.2rem' }} value={formData.email} onChange={handleFormChange} placeholder="email@bni.co.id" disabled={isViewOnly} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); setLastContext(null); }}>
                                    {isViewOnly ? 'Close' : 'Cancel'}
                                </button>
                                {!isViewOnly && (
                                    <button type="submit" className="btn btn-primary">{editId ? 'Update User' : 'Create User'}</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Popup
                isOpen={popup.show}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                onClose={() => setPopup(p => ({ ...p, show: false }))}
                onConfirm={popup.onConfirm || (() => setPopup(p => ({ ...p, show: false })))}
            />
        </div>
    );
};

export default UserManagement;
