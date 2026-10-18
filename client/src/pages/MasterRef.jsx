import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit,
    Trash2,
    X,
    Eye,
    Search
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Popup from '../components/Popup';
import Pagination from '../components/Pagination';

// Configuration for each master type to map fields dynamically
const MASTER_CONFIG = {
    bic: { title: 'Bank Identifier Codes (BIC)', fields: ['name_bic', 'country_bic', 'scode_bic', 'aktif'] },
    bnirr: { title: 'BNI RR', fields: ['name_bnir_rep', 'area'] },
    branch: { title: 'Branches', fields: ['sandi_brc', 'kode_brc', 'name_brc', 'wil_brc', 'eisname_brc'] },
    channel: { title: 'Channel Types', fields: ['name_channel'] },
    customertype: { title: 'Customer Types', fields: ['name_typecust', 'cust_reff'] },
    payingagent: { title: 'Paying Agents', fields: ['name_pagent'] },
    product: { title: 'Products', fields: ['name', 'seq', 'parent', 'listselection', 'lv', 'urutmenu', 'aktif', 'ket'] },
    subject: { title: 'Subjects', fields: ['idproduct', 'name', 'seq', 'parent', 'listselection', 'lv', 'urutmenu', 'aktif', 'ket'] },
};

const API_URL = '/api/master';

const MasterRef = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Admin (1), MGR (2), SPV (3) have full capabilities.
    const hasFullAccess = user && (user.idgroup == 1 || user.idgroup == 2 || user.idgroup == 3);

    const { type } = useParams();
    const config = MASTER_CONFIG[type];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});
    const [isReadOnly, setIsReadOnly] = useState(false); // New state for View Mode
    const [search, setSearch] = useState(''); // Search State

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // Auxiliary Data
    const [products, setProducts] = useState([]);
    const [channels, setChannels] = useState([]);
    const [custTypes, setCustTypes] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);

    // UI Helper State
    const [subjectDim, setSubjectDim] = useState('product'); // 'product', 'channel', 'customertype'

    // Popup State
    const [popup, setPopup] = useState({
        show: false,
        type: 'success', // success, error, delete
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        fetchData();
        setSearch(''); // Reset search on type change
        setCurrentPage(1); // Reset page

        // Fetch auxiliaries if type is subject
        if (type === 'subject') {
            fetchAuxiliaryData();
        }
    }, [type]);

    // Refresh aux data when modal opens to ensure new categories appear
    useEffect(() => {
        if (modalOpen && type === 'subject') {
            fetchAuxiliaryData();
        }
    }, [modalOpen]);

    const fetchAuxiliaryData = async () => {
        try {
            const [pRes, sRes, cRes, ctRes] = await Promise.all([
                axios.get(`${API_URL}/product`),
                axios.get(`${API_URL}/subject`),
                axios.get(`${API_URL}/channel`),
                axios.get(`${API_URL}/customertype`)
            ]);
            setProducts(pRes.data);
            setAllSubjects(sRes.data);
            setChannels(cRes.data);
            setCustTypes(ctRes.data);
        } catch (err) {
            console.error("Failed to fetch products/subjects", err);
        }
    };

    const fetchData = async () => {
        if (!config) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/${type}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setPopup({
            show: true,
            type: 'delete',
            title: 'Delete Confirmation',
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            onConfirm: () => confirmDelete(id)
        });
    };

    const confirmDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${type}/${id}`, { params: { iduser: user?.id } });
            setPopup({
                show: true,
                type: 'success',
                title: 'Deleted!',
                message: 'Item has been removed successfully.',
                onConfirm: () => setPopup(p => ({ ...p, show: false }))
            });
            fetchData();
        } catch (err) {
            setPopup({
                show: true,
                type: 'error',
                title: 'Delete Failed',
                message: 'Failed to delete item.',
                onConfirm: () => setPopup(p => ({ ...p, show: false }))
            });
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setInitialFormData(item); // Store initial
        setIsReadOnly(false);
        setModalOpen(true);

        // Detect Dimension
        if (type === 'subject') {
            if (item.idproduct > 0) setSubjectDim('product');
            else if (item.idchannel > 0) setSubjectDim('channel');
            else if (item.idtypecust > 0) setSubjectDim('customertype');
            else setSubjectDim('product');
        }
    };

    const handleView = (item) => {
        setEditingItem(item);
        setFormData(item);
        setIsReadOnly(true);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ parent: 0 }); // Default to Category Mode
        setIsReadOnly(false);
        setModalOpen(true);
        setSubjectDim('product');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Helper for integer sanitization
        const cleanInt = (val) => {
            const parsed = parseInt(val, 10);
            return isNaN(parsed) ? 0 : parsed;
        };

        // CHECK FOR CHANGES
        if (editingItem) {
            let hasChanges = false;
            for (const key in formData) {
                if (String(formData[key] || '') !== String(initialFormData[key] || '')) {
                    hasChanges = true;
                    break;
                }
            }
            if (!hasChanges) {
                setModalOpen(false);
                return;
            }
        }

        // DUPLICATE CHECK (Specifically for Product Type)
        if (type === 'product' && formData.name) {
            const isDuplicate = data.some(item =>
                String(item.name).trim().toLowerCase() === String(formData.name).trim().toLowerCase() &&
                item.id !== (editingItem ? editingItem.id : -1)
            );

            if (isDuplicate) {
                setPopup({
                    show: true, type: 'error', title: 'Duplicate Data!',
                    message: `Nama Produk "${formData.name}" sudah ada! Silakan gunakan nama lain.`,
                    onConfirm: () => setPopup(p => ({ ...p, show: false }))
                });
                return;
            }
        }

        // PREPARE PAYLOAD
        const { temp_product_id, enableCopy, sourceCategory, ...cleanFormData } = formData;

        const payload = {
            ...cleanFormData,
            iduser: user?.id
        };

        if (type === 'product' || type === 'subject') {
            payload.parent = cleanInt(formData.parent);
            payload.seq = cleanInt(formData.seq);
            payload.lv = cleanInt(formData.lv);
            payload.urutmenu = cleanInt(formData.urutmenu);
        }

        if (!editingItem) delete payload.id;

        if (type === 'subject') {
            payload.idproduct = 0;
            payload.idchannel = 0;
            payload.idtypecust = 0;

            if (payload.parent == 0) {
                if (subjectDim === 'product') payload.idproduct = cleanInt(formData.idproduct);
                if (subjectDim === 'channel') payload.idchannel = cleanInt(formData.idchannel);
                if (subjectDim === 'customertype') payload.idtypecust = cleanInt(formData.idtypecust);
            }
        }

        try {
            if (!editingItem && enableCopy && sourceCategory) {
                const resParent = await axios.post(`${API_URL}/${type}`, payload);
                const newParentId = resParent.data.id;
                const sourceChildren = allSubjects.filter(s => s.parent == sourceCategory);

                let copiedCount = 0;
                for (const child of sourceChildren) {
                    const childPayload = {
                        ...child,
                        id: undefined,
                        parent: newParentId,
                        idproduct: 0,
                        iduser: user?.id
                    };
                    await axios.post(`${API_URL}/${type}`, childPayload);
                    copiedCount++;
                }

                setModalOpen(false);
                setPopup({
                    show: true, type: 'success', title: 'Start Cloned!',
                    message: `Sukses membuat Kategori BARU & menyalin ${copiedCount} item subject di dalamnya.`,
                    onConfirm: () => setPopup(p => ({ ...p, show: false }))
                });
            } else {
                if (editingItem) {
                    await axios.put(`${API_URL}/${type}/${editingItem.id}`, payload);
                } else {
                    await axios.post(`${API_URL}/${type}`, payload);
                }
                setModalOpen(false);
                setPopup({
                    show: true,
                    type: 'success',
                    title: 'Saved Successfully!',
                    message: 'Master data has been updated.',
                    onConfirm: () => setPopup(p => ({ ...p, show: false }))
                });
            }
            fetchData();
        } catch (err) {
            console.error("Save Error:", err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to save data. ' + (err.response?.data?.error || err.message),
                onConfirm: () => setPopup(p => ({ ...p, show: false }))
            });
        }
    };



    if (!config) return <div className="p-6">Invalid Master Type</div>;

    // Filter Data
    const filteredData = data.filter(item => {
        const searchLower = search.toLowerCase();
        return config.fields.some(field =>
            String(item[field] || '').toLowerCase().includes(searchLower)
        );
    });

    // Pagination Logic
    const indexOfLastEntry = entriesPerPage === 'All' ? filteredData.length : currentPage * entriesPerPage;
    const indexOfFirstEntry = entriesPerPage === 'All' ? 0 : indexOfLastEntry - entriesPerPage;
    const currentData = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const renderFieldInput = (field) => {
        if (field === 'idproduct' && type === 'subject') {
            return (
                <div>
                    <select
                        className="form-select"
                        value={formData[field] || 0}
                        onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        disabled={isReadOnly}
                    >
                        <option value="0">-- No Product Link (Use for Items) --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Pilih Produk HANYA jika membuat Folder/Kategori Utama. Jika membuat Item dropdown, biarkan 0.
                    </small>
                </div>
            );
        }

        if (field === 'parent' && type === 'subject') {
            const potentialParents = allSubjects.filter(s => s.id !== (editingItem?.id || -1));
            return (
                <div>
                    <select
                        className="form-select"
                        value={formData[field] || 0}
                        onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        disabled={isReadOnly}
                    >
                        <option value="0">-- No Parent (Root Folder) --</option>
                        {potentialParents.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.idproduct ? `[Folder] ${s.name}` : s.name}
                            </option>
                        ))}
                    </select>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Pilih Parent HANYA jika membuat Item Dropdown. Pilih Folder Induknya.
                    </small>
                </div>
            );
        }

        let maxLength = undefined;
        if (type === 'branch') {
            if (field === 'kode_brc' || field === 'wil_brc') maxLength = 5;
            if (field === 'sandi_brc') maxLength = 10;
            if (field === 'eisname_brc') maxLength = 50;
        }

        return (
            <input
                className="form-input"
                value={formData[field] || ''}
                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                disabled={isReadOnly}
                type={field === 'seq' || field === 'lv' || field === 'urutmenu' ? 'number' : 'text'}
                maxLength={maxLength}
            />
        );
    };

    return (
        <div>
            <div className="flex flex-col gap-2 relative" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{config.title}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Master Data Management</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {hasFullAccess && (
                        <>
                            <button className="btn btn-primary" onClick={handleAdd} style={{ width: 'fit-content' }}>
                                <Plus size={18} />
                                Add New
                            </button>
                        </>
                    )}

                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder={`Search ${config.title}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                {config.fields.map(field => (
                                    <th key={field} style={{ textTransform: 'capitalize' }}>{field.replace(/_/g, ' ')}</th>
                                ))}
                                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={config.fields.length + 1} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : currentData.length === 0 ? (
                                <tr><td colSpan={config.fields.length + 1} style={{ padding: '2rem', textAlign: 'center' }}>No results found</td></tr>
                            ) : currentData.map(item => (
                                <tr key={item.id}>
                                    {config.fields.map(field => (
                                        <td key={field}>{item[field]}</td>
                                    ))}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '0.5rem' }}>
                                            {hasFullAccess ? (
                                                <>
                                                    <button className="btn btn-outline" style={{ padding: '0.25rem' }} onClick={() => handleView(item)}>
                                                        <Eye size={14} />
                                                    </button>
                                                    <button className="btn btn-outline" style={{ padding: '0.25rem' }} onClick={() => handleEdit(item)}>
                                                        <Edit size={14} />
                                                    </button>
                                                    <button className="btn btn-outline" style={{ padding: '0.25rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(item.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="btn btn-outline" style={{ padding: '0.25rem' }} onClick={() => handleView(item)}>
                                                    <Eye size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    totalEntries={filteredData.length}
                    entriesPerPage={entriesPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onEntriesChange={setEntriesPerPage}
                />
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>
                            {isReadOnly ? 'View Item' : (editingItem ? 'Edit Item' : 'Add New Item')}
                        </h3>
                        <button
                            onClick={() => setModalOpen(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {type === 'subject' && !isReadOnly && (
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.9rem', fontWeight: 600 }}>Panduan Input Subject</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#1e3a8a' }}>
                                <li style={{ marginBottom: '0.25rem' }}>
                                    <b>Ingin membuat Kategori/Folder?</b><br />
                                    Pilih <b>Linked Product</b> sesuai produk. Biarkan <b>Parent Subject</b> kosong (0).
                                </li>
                                <li>
                                    <b>Ingin membuat Pilihan Dropdown?</b><br />
                                    Biarkan <b>Linked Product</b> kosong (0). Pilih <b>Parent Subject</b> sesuai kategori folder yang sudah dibuat sebelumnya.
                                </li>
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {type === 'subject' ? (
                            <div className="flex flex-col gap-4">
                                {!isReadOnly && (
                                    <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subjectMode"
                                                checked={formData.parent != 0}
                                                onChange={() => setFormData({ ...formData, parent: '' })}
                                            />
                                            <span className="text-sm font-semibold text-gray-700">Add Data (Isi Dropdown)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subjectMode"
                                                checked={formData.parent == 0}
                                                onChange={() => setFormData({ ...formData, parent: 0 })}
                                            />
                                            <span className="text-sm font-semibold text-gray-700">Add Category (Folder)</span>
                                        </label>
                                    </div>
                                )}
                                {formData.idproduct == 0 ? (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Product <span className="text-red-500">*</span></label>
                                            <select
                                                className="form-select"
                                                value={formData.temp_product_id || (allSubjects.find(s => s.id == formData.parent)?.idproduct) || ''}
                                                onChange={(e) => {
                                                    const pid = e.target.value;
                                                    const firstCat = allSubjects.find(s => s.idproduct == pid && s.parent == 0);
                                                    setFormData({ ...formData, temp_product_id: pid, parent: firstCat ? firstCat.id : '' });
                                                }}
                                                disabled={isReadOnly}
                                            >
                                                <option value="">-- Select Product --</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Category / Folder <span className="text-red-500">*</span></label>
                                            <select
                                                className="form-select"
                                                value={formData.parent || ''}
                                                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                                disabled={isReadOnly}
                                            >
                                                <option value="">-- Select Category --</option>
                                                {allSubjects
                                                    .filter(s => {
                                                        const activePid = formData.temp_product_id || (allSubjects.find(sub => sub.id == formData.parent)?.idproduct);
                                                        return activePid ? (s.parent == 0 && s.idproduct == activePid) : false;
                                                    })
                                                    .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                                                }
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Add Category Mode */}
                                        <div className="mb-2">
                                            <label className="form-label text-xs mb-1">Type Linked</label>
                                            <div className="flex gap-4">
                                                {['product', 'channel', 'customertype'].map(dim => (
                                                    <label key={dim} className="flex items-center gap-1 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="subjectDim"
                                                            checked={subjectDim === dim}
                                                            onChange={() => { setSubjectDim(dim); setFormData(prev => ({ ...prev, idproduct: 0, idchannel: 0, idtypecust: 0 })); }}
                                                        />
                                                        <span className="text-sm capitalize">{dim === 'customertype' ? 'Customer Type' : dim}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Linked {subjectDim} <span className="text-red-500">*</span></label>
                                            {subjectDim === 'product' && (
                                                <select className="form-select" value={formData.idproduct || ''} onChange={e => setFormData({ ...formData, idproduct: e.target.value })} disabled={isReadOnly}>
                                                    <option value="">-- Select Product --</option>
                                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </select>
                                            )}
                                            {subjectDim === 'channel' && (
                                                <select className="form-select" value={formData.idchannel || ''} onChange={e => setFormData({ ...formData, idchannel: e.target.value })} disabled={isReadOnly}>
                                                    <option value="">-- Select Channel --</option>
                                                    {channels.map(c => <option key={c.id} value={c.id}>{c.name_channel}</option>)}
                                                </select>
                                            )}
                                            {subjectDim === 'customertype' && (
                                                <select className="form-select" value={formData.idtypecust || ''} onChange={e => setFormData({ ...formData, idtypecust: e.target.value })} disabled={isReadOnly}>
                                                    <option value="">-- Select Cust Type --</option>
                                                    {custTypes.map(c => <option key={c.id} value={c.id}>{c.name_typecust}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Name <span className="text-red-500">*</span></label>
                                    <input className="form-input" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={isReadOnly} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Note (Ket)</label>
                                    <input className="form-input" value={formData.ket || ''} onChange={e => setFormData({ ...formData, ket: e.target.value })} disabled={isReadOnly} />
                                </div>
                            </div>
                        ) : type === 'product' ? (
                            <div className="flex flex-col gap-4">
                                <div className="form-group">
                                    <label className="form-label">Product Name <span className="text-red-500">*</span></label>
                                    <input className="form-input" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={isReadOnly} />
                                </div>
                                {config.fields.filter(f => f !== 'name').map(field => (
                                    <div className="form-group" key={field}>
                                        <label className="form-label" style={{ textTransform: 'capitalize' }}>{field.replace(/_/g, ' ')}</label>
                                        {renderFieldInput(field)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* --- GENERIC FORM FOR OTHER TYPES --- */
                            config.fields.map(field => (
                                <div className="form-group" key={field}>
                                    <label className="form-label" style={{ textTransform: 'capitalize' }}>
                                        {field.replace(/_/g, ' ')}
                                        {field === 'idproduct' && <span className="text-red-500">*</span>}
                                    </label>
                                    {renderFieldInput(field)}
                                </div>
                            ))
                        )}

                        <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                                {isReadOnly ? 'Close' : 'Cancel'}
                            </button>
                            {!isReadOnly && <button type="submit" className="btn btn-primary">Save Changes</button>}
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
                onConfirm={popup.onConfirm || (() => setPopup(p => ({ ...p, show: false })))}
            />
        </div>
    );
};

export default MasterRef;
