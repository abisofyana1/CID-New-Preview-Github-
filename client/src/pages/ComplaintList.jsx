import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    Search,
    Printer,
    FileSpreadsheet,
    Download,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Edit,
    Trash2,
    X,
    Filter,
    Eye,
    FileText
} from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx-js-style';
import Popup from '../components/Popup';
import Modal from '../components/Modal';

const API_URL = '/api/complaints';
const MASTER_URL = '/api/master';
const USERS_URL = '/api/users';

const ComplaintList = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Only Admin (1), MGR (2), SPV (3) can Quick Add
    const canQuickAdd = user && [1, 2, 3].includes(parseInt(user.idgroup));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Master Data State
    const [custTypes, setCustTypes] = useState([]);
    const [channels, setChannels] = useState([]);
    const [products, setProducts] = useState([]);
    const [subjects, setSubjects] = useState([]); // All subjects
    const [bics, setBics] = useState([]);
    const [branches, setBranches] = useState([]);
    const [pagents, setPagents] = useState([]);
    const [bnirReps, setBnirReps] = useState([]);
    const [statuses, setStatuses] = useState([]); // In case we want status dropdown
    const [userList, setUserList] = useState([]); // List of users for filters

    // Form State
    const [formData, setFormData] = useState({
        noreff: '',
        idchannel: '',
        idtypecust: '',
        cust_name: '',
        cust_lok: '',
        idbic: '',
        idbranch: '',
        idpagent: '',
        idbnir_rep: '',
        other_note: '',
        idproduct: '',
        idsubject: '',
        cmessage: '',
        cmessage_re: '',
        notes: '',
        status_action: 'Close' // Button text "Close" or similar? Assuming default Close for now
    });
    const [editId, setEditId] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isClosed, setIsClosed] = useState(false); // Assuming this state is needed for the form logic

    // Popup State
    const [popup, setPopup] = useState({
        show: false,
        type: 'success', // success, error, delete
        title: '',
        message: '',
        onConfirm: null
    });

    const [viewTextModal, setViewTextModal] = useState(null);

    // Quick Add State
    const [quickAdd, setQuickAdd] = useState({
        show: false,
        type: '', // channel, customertype, product, dynamic
        title: '',
        value: '',
        custReffMode: 'existing',
        custReffValue: '',
        newFieldType: 'input',
        category: ''
    });

    const handleQuickAddOpen = (type, title, category = '') => {
        setQuickAdd({ show: true, type, title, value: '', custReffMode: 'existing', custReffValue: '', newFieldType: 'input', category });
    };

    const handleQuickAddSubmit = async (e) => {
        e.preventDefault();
        if (!quickAdd.value.trim()) return;

        try {
            // Determine endpoint and payload based on type
            let endpoint = '';
            // Only send iduser mostly for logging purposes if supported, 
            // but carefully construct actual DB payload per type.
            let payload = { iduser: user?.id };

            switch (quickAdd.type) {
                case 'channel':
                    endpoint = `${MASTER_URL}/channel`;
                    payload.name_channel = quickAdd.value;
                    break;
                case 'customertype':
                    endpoint = `${MASTER_URL}/customertype`;
                    payload.name_typecust = quickAdd.value;
                    let finalCustReff = '-';
                    if (quickAdd.custReffMode === 'existing' && quickAdd.custReffValue) {
                        finalCustReff = quickAdd.custReffValue;
                    } else if (quickAdd.custReffMode === 'new' && quickAdd.custReffValue) {
                        finalCustReff = `${quickAdd.newFieldType}:${quickAdd.custReffValue}`;
                    }
                    payload.cust_reff = finalCustReff;
                    break;
                case 'dynamic':
                    endpoint = `${MASTER_URL}/dynamic`;
                    payload.name = quickAdd.value;
                    payload.category = quickAdd.category;
                    payload.aktif = 'Y';
                    break;
                case 'product':
                    endpoint = `${MASTER_URL}/product`;
                    payload.name = quickAdd.value;
                    payload.parent = 0;
                    payload.seq = 1;
                    payload.lv = 0;
                    payload.urutmenu = 0;
                    payload.aktif = 'Y';
                    break;
                case 'subject':
                    endpoint = `${MASTER_URL}/subject`;
                    payload.name = quickAdd.value;
                    // Find a parent for this subject based on selected product
                    const pid = parseInt(formData.idproduct);
                    const parentSubject = subjects.find(s => s.idproduct === pid && s.parent === 0);

                    if (parentSubject) {
                        payload.parent = parentSubject.id;
                        payload.idproduct = 0; // Item mode if parent exists
                    } else {
                        // If no parent category found (e.g. Product has no categories yet), 
                        // create this as a ROOT subject/category for this product.
                        payload.parent = 0;
                        payload.idproduct = pid;
                    }

                    payload.seq = 1;
                    payload.lv = 0;
                    payload.urutmenu = 0;
                    payload.aktif = 'Y';
                    break;
                case 'bnirr':
                    endpoint = `${MASTER_URL}/bnirr`;
                    payload.name_bnir_rep = quickAdd.value;
                    payload.area = '-'; // Default
                    break;
                case 'bic':
                    endpoint = `${MASTER_URL}/bic`;
                    payload.name_bic = quickAdd.value;
                    payload.country_bic = '-'; // Default
                    payload.scode_bic = '-'; // Default
                    payload.aktif = 'Y';
                    break;
                case 'branch':
                    endpoint = `${MASTER_URL}/branch`;
                    payload.name_brc = quickAdd.value;
                    payload.sandi_brc = '-';
                    payload.kode_brc = '-';
                    payload.wil_brc = '-';
                    payload.eisname_brc = quickAdd.value;
                    break;
                case 'pagent':
                    endpoint = `${MASTER_URL}/payingagent`;
                    payload.name_pagent = quickAdd.value;
                    break;
                default: return;
            }

            const res = await axios.post(endpoint, payload);
            const newItem = res.data;

            // Refresh specific master list and auto-select
            // We can just refetch all for simplicity or append locally. 
            // Better to refetch specific to ensure sort order.
            const sortByName = (arr, key) => arr.sort((a, b) => (a[key] || '').localeCompare(b[key] || ''));

            if (quickAdd.type === 'channel') {
                const updated = await axios.get(`${MASTER_URL}/channel`);
                setChannels(sortByName(updated.data, 'name_channel'));
                setFormData(prev => ({ ...prev, idchannel: newItem.id }));
            } else if (quickAdd.type === 'customertype') {
                const updated = await axios.get(`${MASTER_URL}/customertype`);
                setCustTypes(sortByName(updated.data, 'name_typecust'));
                setFormData(prev => ({ ...prev, idtypecust: newItem.id }));
            } else if (quickAdd.type === 'product') {
                const updated = await axios.get(`${MASTER_URL}/product`);
                setProducts(sortByName(updated.data, 'name'));
                setFormData(prev => ({ ...prev, idproduct: newItem.id }));
            } else if (quickAdd.type === 'subject') {
                const updated = await axios.get(`${MASTER_URL}/subject`);
                setSubjects(sortByName(updated.data, 'name'));
                setFormData(prev => ({ ...prev, idsubject: newItem.id }));
            } else if (quickAdd.type === 'bnirr') {
                const updated = await axios.get(`${MASTER_URL}/bnirr`);
                setBnirReps(sortByName(updated.data, 'name_bnir_rep'));
                setFormData(prev => ({ ...prev, idbnir_rep: newItem.id }));
            } else if (quickAdd.type === 'bic') {
                const updated = await axios.get(`${MASTER_URL}/bic`);
                setBics(sortByName(updated.data, 'country_bic'));
                setFormData(prev => ({ ...prev, idbic: newItem.id }));
            } else if (quickAdd.type === 'branch') {
                const updated = await axios.get(`${MASTER_URL}/branch`);
                setBranches(sortByName(updated.data, 'kode_brc'));
                setFormData(prev => ({ ...prev, idbranch: newItem.id }));
            } else if (quickAdd.type === 'pagent') {
                const updated = await axios.get(`${MASTER_URL}/payingagent`);
                setPagents(sortByName(updated.data, 'name_pagent'));
                setFormData(prev => ({ ...prev, idpagent: newItem.id }));
            } else if (quickAdd.type === 'dynamic') {
                const category = quickAdd.category;
                const updated = await axios.get(`${MASTER_URL}/dynamic/category/${category}`);
                setDynamicOptions(updated.data);
                setFormData(prev => ({ ...prev, other_note: newItem.name }));
            }

            setQuickAdd({ show: false, type: '', title: '', value: '', custReffMode: 'existing', custReffValue: '', newFieldType: 'input', category: '' });
            setPopup({ show: true, type: 'success', title: 'Success', message: 'Item added and selected!', onConfirm: () => setPopup(p => ({ ...p, show: false })) });

        } catch (err) {
            console.error("Quick Add Error:", err);
            setPopup({ show: true, type: 'error', title: 'Error', message: 'Failed to add item.', onConfirm: () => setPopup(p => ({ ...p, show: false })) });
        }
    };

    // Helper to get customer type name for conditional rendering
    const custTypeName = custTypes.find(ct => ct.id == formData.idtypecust)?.name_typecust?.toLowerCase() || '';
    const custTypeSelected = custTypes.find(ct => ct.id == formData.idtypecust) || null;
    const custReff = custTypeSelected?.cust_reff || '';

    const [dynamicOptions, setDynamicOptions] = useState([]);

    useEffect(() => {
        if (custReff && custReff.startsWith('dropdown:')) {
            const category = custReff.substring(9);
            axios.get(`${MASTER_URL}/dynamic/category/${category}`).then(res => {
                setDynamicOptions(res.data);
            }).catch(err => console.error(err));
        } else {
            setDynamicOptions([]);
        }
    }, [custReff]);

    const resetForm = () => {
        setFormData({
            noreff: '', idchannel: '', channel_note: '', idtypecust: '', cust_name: '', cust_lok: '',
            idbic: '', idbranch: '', idpagent: '', idbnir_rep: '', other_note: '',
            idproduct: '', idsubject: '', cmessage: '', cmessage_re: '', notes: '', status_action: 'Close'
        });
        setIsClosed(false);
        setEditId(null);
        setIsViewOnly(false);
    }

    useEffect(() => {
        fetchAllMasters();
    }, []);

    const fetchAllMasters = async () => {
        try {
            const [ct, ch, pr, sb, bi, br, pa, brp, us] = await Promise.all([
                axios.get(`${MASTER_URL}/customertype`),
                axios.get(`${MASTER_URL}/channel`),
                axios.get(`${MASTER_URL}/product`),
                axios.get(`${MASTER_URL}/subject`),
                axios.get(`${MASTER_URL}/bic`),
                axios.get(`${MASTER_URL}/branch`),
                axios.get(`${MASTER_URL}/payingagent`),
                axios.get(`${MASTER_URL}/bnirr`),
                axios.get(USERS_URL)
            ]);
            // Sort Helper
            const sortByName = (arr, key) => arr.sort((a, b) => (a[key] || '').localeCompare(b[key] || ''));

            setCustTypes(sortByName(ct.data, 'name_typecust'));
            setChannels(sortByName(ch.data, 'name_channel'));
            setProducts(sortByName(pr.data, 'name'));
            setSubjects(sortByName(sb.data, 'name'));
            setBics(sortByName(bi.data, 'country_bic'));
            setBranches(sortByName(br.data, 'kode_brc'));
            setPagents(sortByName(pa.data, 'name_pagent'));
            setBnirReps(sortByName(brp.data, 'name_bnir_rep'));
            setUserList(sortByName(us.data, 'fullname'));
        } catch (err) {
            console.error("Error fetching masters:", err);
        }
    };

    // Filter Subjects based on Selected Product (Hierarchical: Product -> Parent Subject -> Child Subjects)
    // Filter Subjects based on Selected Product
    // Shows both Root subjects (direct link to product) and Child subjects (link to parents)
    const filteredSubjects = useMemo(() => {
        const pid = parseInt(formData.idproduct);
        if (!pid) return [];

        const roots = subjects.filter(s => s.idproduct === pid);
        const rootIds = roots.map(r => r.id);
        const children = subjects.filter(s => rootIds.includes(s.parent));

        // Show both. If you only want leaf nodes, you'd need to filter roots that have children.
        // For now, allow selecting anything valid for this product.
        return [...roots, ...children].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [formData.idproduct, subjects]);

    // --- FILTER STATE ---
    const [filters, setFilters] = useState({
        f_noTicket: '', f_custName: '', f_channel: '', f_day: '', f_month: '', f_year: '',
        f_noReff: '', f_status: '', f_product: '', f_custType: '',
        f_question: '', f_answer: '', f_subject: '', f_bic: '',
        f_userOpen: '', f_userClose: '', f_branch: ''
    });

    // Store initial form data to check for changes
    const [initialFormData, setInitialFormData] = useState({});

    const handleView = useCallback((item) => {
        setEditId(item.id);

        // Logic: if item is technically incomplete (red), treat as OPEN in UI even if DB says closed.
        const isIncomplete = !item.tgl_close || !item.closer_name;
        setIsClosed(item.idstatus == 2 && !isIncomplete);

        setIsViewOnly(true);
        const mappedData = {
            noreff: item.noreff || '',
            idchannel: item.idchannel || '',
            channel_note: item.idchannel_note || '',
            idtypecust: item.idtypecust || '',
            cust_name: item.cust_name || '',
            cust_lok: item.cust_lok || '',
            idbic: item.idbic || '',
            idbranch: item.idbranch || '',
            idpagent: item.idpagent || '',
            idbnir_rep: item.idbnir_rep || '',
            other_note: item.cust_note || '',
            idproduct: item.idproduct || '',
            idsubject: item.idsubject || '',
            cmessage: item.cmessage || '',
            cmessage_re: item.cmessage_re || '',
            notes: item.notes || '',
            status_action: 'Close'
        };
        setFormData(mappedData);
        setShowAddModal(true);
    }, []);

    // Helper to format duration
    const formatDuration = useCallback((start, end) => {
        if (!start || !end) return '-';
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        let diff = Math.abs(endTime - startTime) / 1000; // in seconds

        const days = Math.floor(diff / (3600 * 24));
        diff -= days * 3600 * 24;

        const hours = Math.floor(diff / 3600);
        diff -= hours * 3600;

        const minutes = Math.floor(diff / 60);
        diff -= minutes * 60;

        const seconds = Math.floor(diff);

        let result = '';
        if (days > 0) result += `${days} Hari | `;
        result += `${hours} Jam ${minutes} Menit ${seconds} Detik`;

        return result;
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetFilters = () => {
        setFilters({
            f_noTicket: '', f_custName: '', f_channel: '', f_day: '', f_month: '', f_year: '',
            f_noReff: '', f_status: '', f_product: '', f_custType: '',
            f_question: '', f_answer: '', f_subject: '', f_bic: '',
            f_userOpen: '', f_userClose: '', f_branch: ''
        });
        setSearch(''); // Clear global search if any
    };

    // Update fetch to include filters
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL, {
                params: {
                    page,
                    limit,
                    search,
                    ...filters // Spread filters
                }
            });
            setData(res.data.data);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Table Data
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchAllData();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [page, limit, search, filters]);

    const handlePrint = () => {
        // Headers
        const headers = [
            'No', 'No Ticket', 'Tgl Open', 'Open By', 'Tgl Close', 'Close By', 'Close Update by', 'Duration',
            'No Reff', 'Cust Type', 'Cust Name', 'Cust Loc', 'Cust Note',
            'BIC', 'Branch', 'Representative', 'P.Agent',
            'Channel Type', 'Notes', 'Product', 'Note', 'Subject', 'Subject Note',
            'Question', 'Answer', 'Internal Note'
        ];

        // Map data to array of arrays
        const tableData = data.map((item, index) => [
            (page - 1) * 10 + index + 1,
            item.noticket,
            item.tgl_open ? format(new Date(item.tgl_open), 'dd MMM yyyy HH:mm:ss') : '-',
            item.opener_name || '-',
            item.tgl_close ? format(new Date(item.tgl_close), 'dd MMM yyyy HH:mm:ss') : '-',
            item.closer_name || '-',
            (() => {
                if (item.updater_name && (item.idstatus == 2 || item.tgl_close)) {
                    let text = `| Update by ${item.updater_group == 1 ? 'Admin-SDI' : item.updater_name} |`;
                    if ((item.updater_group == 1 || item.updater_group == 2) && item.tgl_update) {
                        text += `\n${format(new Date(item.tgl_update), 'dd MMM yy')} | ${format(new Date(item.tgl_update), 'HH:mm')}`;
                    }
                    return text;
                }
                return '-';
            })(),
            formatDuration(item.tgl_open, item.tgl_close),
            item.noreff || '-',
            item.name_typecust || '-',
            item.cust_name || '-',
            item.cust_lok || '-',
            item.cust_note || '-',
            item.name_bic || '-',
            item.name_brc || '-',
            item.name_bnir_rep || '-',
            item.name_pagent || '-',
            item.name_channel || '-',
            item.idchannel_note || '-', // Mapped to 'Notes' column
            item.product_name || '-',
            item.idproduct_note || '-', // Mapped to 'Note' column
            item.subject_name || '-',
            item.idsubject_note || '-',
            // Truncate message to avoid "Text length must not exceed 32767 characters" error
            item.cmessage ? (item.cmessage.length > 30000 ? item.cmessage.substring(0, 30000) + '...' : item.cmessage) : '-',
            item.cmessage_re ? (item.cmessage_re.length > 30000 ? item.cmessage_re.substring(0, 30000) + '...' : item.cmessage_re) : '-',
            item.notes || '-'
        ]);

        // Combine headers and data
        const wsData = [headers, ...tableData];

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Styling (Best effort - works if using Pro or xlsx-js-style, ignored otherwise)
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + "1"; // First row
            if (!ws[address]) continue;
            ws[address].s = {
                font: { bold: true },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
        }

        // Add borders to all cells
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (!ws[cell_ref]) ws[cell_ref] = { t: 's', v: '' }; // Ensure empty cells have object

                if (!ws[cell_ref].s) ws[cell_ref].s = {};

                ws[cell_ref].s.border = {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                };

                if (R === 0) { // Header specific override
                    ws[cell_ref].s.font = { bold: true };
                    ws[cell_ref].s.alignment = { horizontal: "center" };
                } else if (C === 0) { // Center "No" column content
                    if (!ws[cell_ref].s.alignment) ws[cell_ref].s.alignment = {};
                    ws[cell_ref].s.alignment.horizontal = "center";
                    ws[cell_ref].s.alignment.vertical = "center";
                }
            }
        }

        // --- Auto-Width Calculation ---
        const colWidths = headers.map((header, i) => {
            let maxLen = header.length; // Start with header length
            // Check all data rows for this column
            for (let j = 0; j < tableData.length; j++) {
                const cellValue = tableData[j][i] ? String(tableData[j][i]) : '';
                if (cellValue.length > maxLen) {
                    maxLen = cellValue.length;
                }
            }
            // Add a little padding and cap max width to avoid massive columns
            return { wch: Math.min(Math.max(maxLen + 2, 10), 80) };
        });
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Complaint_Data");
        XLSX.writeFile(wb, "Complaints_Export.xlsx");
    };

    const handleExportCSV = () => {
        // Headers
        const headers = [
            'No', 'No Ticket', 'Tgl Open', 'Open By', 'Tgl Close', 'Close By', 'Close Update by', 'Duration',
            'No Reff', 'Cust Type', 'Cust Name', 'Cust Loc', 'Cust Note',
            'BIC', 'Branch', 'Representative', 'P.Agent',
            'Channel Type', 'Notes', 'Product', 'Note', 'Subject', 'Subject Note',
            'Question', 'Answer', 'Internal Note'
        ];

        // Map data to array of arrays
        const tableData = data.map((item, index) => [
            (page - 1) * 10 + index + 1,
            item.noticket,
            item.tgl_open ? format(new Date(item.tgl_open), 'dd MMM yyyy HH:mm:ss') : '-',
            item.opener_name || '-',
            item.tgl_close ? format(new Date(item.tgl_close), 'dd MMM yyyy HH:mm:ss') : '-',
            item.closer_name || '-',
            (() => {
                if (item.updater_name && (item.idstatus == 2 || item.tgl_close)) {
                    let text = `| Update by ${item.updater_group == 1 ? 'Admin-SDI' : item.updater_name} |`;
                    if ((item.updater_group == 1 || item.updater_group == 2) && item.tgl_update) {
                        text += `\n${format(new Date(item.tgl_update), 'dd MMM yy')} | ${format(new Date(item.tgl_update), 'HH:mm')}`;
                    }
                    return text;
                }
                return '-';
            })(),
            formatDuration(item.tgl_open, item.tgl_close),
            item.noreff || '-',
            item.name_typecust || '-',
            item.cust_name || '-',
            item.cust_lok || '-',
            item.cust_note || '-',
            item.name_bic || '-',
            item.name_brc || '-',
            item.name_bnir_rep || '-',
            item.name_pagent || '-',
            item.name_channel || '-',
            item.idchannel_note || '-', // Mapped to 'Notes' column
            item.product_name || '-',
            item.idproduct_note || '-', // Mapped to 'Note' column
            item.subject_name || '-',
            item.idsubject_note || '-',
            item.cmessage || '-',
            item.cmessage_re || '-',
            item.notes || '-'
        ]);

        // Helper to escape and quote CSV fields
        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '""';
            let str = String(val);
            // Replace double quotes with two double quotes
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        };

        const csvContent = [
            headers.map(escapeCSV).join(';'),
            ...tableData.map(row => row.map(escapeCSV).join(';'))
        ].join('\r\n');

        // Create blob and download with BOM for Excel compatibility
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Complaints_Export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Helper to check for changes
    const hasChanges = () => {
        if (!editId) return true; // Adding new always involves changes

        // Compare form fields
        for (const key in formData) {
            if (key === 'status_action' || key === '_initialStatus') continue; // Skip non-db fields. Include notes!

            // Loose comparison for numbers/strings
            if (String(formData[key] || '') !== String(initialFormData[key] || '')) {
                return true;
            }
        }

        // Check Status Change
        const initialStatus = initialFormData._initialStatus; // Stored in handleEdit
        const currentStatus = isClosed ? 2 : 1;
        if (initialStatus != currentStatus) return true;

        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 0. CHECK FOR CHANGES (If Edit Mode)
        if (editId && !hasChanges()) {
            // No changes? Treat as Cancel/Close
            setShowAddModal(false);
            resetForm();
            return;
        }

        // 1. Map Form State to DB Columns AND Filter unknown fields
        const dbPayload = {
            noreff: formData.noreff,
            idchannel: formData.idchannel,
            idchannel_note: formData.channel_note, // Mapping
            idtypecust: formData.idtypecust,
            cust_name: formData.cust_name,
            cust_lok: formData.cust_lok,
            cust_note: formData.other_note, // Mapping
            idbic: formData.idbic,
            idbranch: formData.idbranch,
            idpagent: formData.idpagent,
            idbnir_rep: custTypeName.includes('other') ? null : formData.idbnir_rep,
            idproduct: formData.idproduct,
            idsubject: formData.idsubject,
            cmessage: formData.cmessage,
            cmessage_re: formData.cmessage_re,
            notes: formData.notes,
            // idstatus logic
            idstatus: isClosed ? 2 : 1,
            iduser_u: user ? user.id : 0
        };

        // 2. Handle Closing Logic (Date & User)
        if (isClosed) {
            // Only update Close Date if it wasn't already closed OR if we want to overwrite it
            // For now, let's always update it if it's being closed now. 
            // Better: If previously open (editId && data.idstatus==1) -> set Date.
            // But we don't have previous state easily here without prop drilling. 
            // Simple approach: Send current time if Closing. Backend can decide to ignore if already set, 
            // but standard is usually "Time of closure action".
            // Use Local Time instead of UTC for 24-hour format
            const now = new Date();
            // Offset for Indonesia (WIB) is UTC+7? No, just use client local time which is correct for user context
            // Format: YYYY-MM-DD HH:mm:ss
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            dbPayload.tgl_close = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            dbPayload.iduser_c = user ? user.id : 0;
        } else {
            // Re-opening case?
            dbPayload.tgl_close = null;
            dbPayload.iduser_c = null;
        }

        // 3. Handle Opening Logic (New Data)
        if (!editId) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            dbPayload.tgl_open = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            dbPayload.iduser_o = user ? user.id : 0;
        }

        try {
            if (editId) {
                await axios.put(`${API_URL}/${editId}`, dbPayload);
            } else {
                await axios.post(API_URL, dbPayload);
            }
            setShowAddModal(false);
            setPopup({
                show: true,
                type: 'success',
                title: 'Success',
                message: 'Data saved successfully!',
                onConfirm: () => setPopup(p => ({ ...p, show: false }))
            });
            resetForm();
            fetchAllData();
        } catch (err) {
            console.error(err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save data. ' + (err.response?.data?.error || err.message),
                onConfirm: () => setPopup(p => ({ ...p, show: false }))
            });
        }
    };

    const handleEdit = useCallback((item) => {
        setEditId(item.id);
        const isIncomplete = !item.tgl_close || !item.closer_name;
        // Treat incomplete items as OPEN even if DB says closed
        setIsClosed(item.idstatus == 2 && !isIncomplete);

        // Check for View Only mode (Only restrict for Non-Admin/Non-SPV)
        // Admin (1) and SPV (2) can always edit even if closed
        // Check for View Only mode (Only restrict for Non-Admin/Non-SPV)
        // Admin (1), MGR (2), SPV (3) can always edit even if closed
        const hasFullAccess = user && (user.idgroup == 1 || user.idgroup == 2 || user.idgroup == 3);

        // Allow editing if row is technically "incomplete" (missing close date/by), even if marked closed (import error)
        // const isIncomplete = !item.tgl_close || !item.closer_name; // Already declared above

        if (!hasFullAccess && item.idstatus == 2 && !isIncomplete) {
            setIsViewOnly(true);
        } else {
            setIsViewOnly(false);
        }

        const mappedData = {
            noreff: item.noreff || '',
            idchannel: item.idchannel || '',
            channel_note: item.idchannel_note || '',
            idtypecust: item.idtypecust || '',
            cust_name: item.cust_name || '',
            cust_lok: item.cust_lok || '',
            idbic: item.idbic || '',
            idbranch: item.idbranch || '',
            idpagent: item.idpagent || '',
            idbnir_rep: item.idbnir_rep || '',
            other_note: item.cust_note || '', // Map DB cust_note to form other_note
            idproduct: item.idproduct || '',
            idsubject: item.idsubject || '',
            cmessage: item.cmessage || '',
            cmessage_re: item.cmessage_re || '',
            notes: item.notes || '',
            status_action: 'Close',
            _initialStatus: item.idstatus // Store status for comparison
        };

        setFormData(mappedData);
        setInitialFormData(mappedData); // Save initial state
        setShowAddModal(true);
    }, [user]);

    // (Stray code removed)

    const handleDelete = useCallback((id) => {
        // Implement delete logic here
        console.log("Delete item with ID:", id);
        // Example: Show popup for confirmation
        setPopup({
            show: true,
            type: 'delete',
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this complaint?',
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    setPopup({ show: false });
                    fetchAllData();
                } catch (error) {
                    console.error("Error deleting complaint:", error);
                    setPopup({ show: false });
                }
            }
        });
    }, [fetchAllData]);

    // Memoize the Table Content to prevent re-renders when typing in the form
    const tableContent = useMemo(() => (
        <div className="card">
            {/* Controls */}
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Show</span>
                        <select
                            className="form-select"
                            style={{ width: 'auto' }}
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="all">All</option>
                        </select>
                        <span className="text-sm">entries</span>
                    </div>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }} style={{ height: 'fit-content', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                        <Plus size={16} />
                        Add Data
                    </button>
                </div>

                <div className="flex gap-2">
                    <button className="btn" style={{ background: '#107c41', color: 'white', borderColor: '#107c41', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handlePrint}>
                        <FileSpreadsheet size={18} />
                        <span>Export Excel</span>
                        <Download size={14} style={{ opacity: 0.8 }} />
                    </button>
                    <button className="btn" style={{ background: '#3b82f6', color: 'white', borderColor: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleExportCSV}>
                        <FileText size={18} />
                        <span>Export CSV</span>
                        <Download size={14} style={{ opacity: 0.8 }} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                            <th style={{ textAlign: 'center' }}>No Ticket</th>
                            <th style={{ textAlign: 'center' }}>Tgl Open<br /><span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Open By</span></th>
                            <th style={{ textAlign: 'center' }}>Tgl Close<br /><span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Close By</span></th>
                            <th style={{ textAlign: 'center' }}>Duration</th>
                            <th>No Reff</th>
                            <th>Cust Type</th>
                            <th>Product Type</th>
                            <th>Channel Type</th>
                            <th>Question/Complaint</th>
                            <th>Answer/Follow Up</th>
                            <th style={{ textAlign: 'center', width: '100px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="12" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan="12" style={{ textAlign: 'center', padding: '2rem' }}>No data found</td></tr>
                        ) : (
                            data.map((item, index) => {
                                const isIncomplete = !item.tgl_close || !item.closer_name;
                                return (
                                    <tr key={item.id} style={{
                                        backgroundColor: isIncomplete ? '#FF0000' : 'inherit',
                                        color: isIncomplete ? 'white' : 'inherit'
                                    }}>
                                        <td>{(page - 1) * 10 + index + 1}</td>
                                        <td style={{ fontWeight: 500 }}>{item.noticket}</td>
                                        <td>
                                            {item.tgl_open ? format(new Date(item.tgl_open), 'dd MMM yyyy HH:mm:ss') : '-'}<br />
                                            <span style={{ fontSize: '0.75rem', color: isIncomplete ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>{item.opener_name || '-'}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: isIncomplete ? 600 : 400 }}>
                                                {item.tgl_close ? format(new Date(item.tgl_close), 'dd MMM yyyy HH:mm:ss') : '-'}
                                            </span><br />
                                            <span style={{ fontSize: '0.75rem', color: isIncomplete ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>{item.closer_name || '-'}</span>
                                            {item.updater_name && (item.idstatus == 2 || item.tgl_close) && (
                                                <div style={{ marginTop: '4px', borderTop: isIncomplete ? '1px solid rgba(255,255,255,0.3)' : '1px solid #eee', paddingTop: '4px' }}>
                                                    <span style={{ fontSize: '0.75rem', color: isIncomplete ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)', display: 'block', fontWeight: 500 }}>
                                                        | Update by {item.updater_group == 1 || item.updater_group == 2 ? 'Admin-SDI' : item.updater_name} |
                                                    </span>
                                                    {(item.updater_group == 1 || item.updater_group == 2) && item.tgl_update && (
                                                        <span style={{ fontSize: '0.75rem', color: isIncomplete ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)', display: 'block' }}>
                                                            {format(new Date(item.tgl_update), 'dd MMM yy')} | {format(new Date(item.tgl_update), 'HH:mm')}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{formatDuration(item.tgl_open, item.tgl_close)}</td>
                                        <td>{item.noreff || '-'}</td>
                                        <td>
                                            {item.name_typecust}<br />
                                            <span style={{ fontSize: '0.75rem', color: isIncomplete ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)' }}>{item.cust_name}</span>
                                        </td>
                                        <td>{item.product_name}</td>
                                        <td>{item.name_channel}</td>
                                        <td style={{ maxWidth: '200px' }}>
                                            {item.cmessage && item.cmessage.length > 50 ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    <span style={{ wordBreak: 'break-all' }}>
                                                        {item.cmessage.substring(0, 20)}...
                                                    </span>
                                                    <div
                                                        style={{
                                                            background: isIncomplete ? 'white' : 'linear-gradient(90deg, rgba(0, 94, 106, 0.1) 0%, rgba(0, 94, 106, 0.05) 100%)',
                                                            border: isIncomplete ? 'none' : '1px solid rgba(0, 94, 106, 0.1)',
                                                            padding: '2px 8px',
                                                            borderRadius: '6px',
                                                            color: isIncomplete ? '#991b1b' : 'var(--primary)',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem',
                                                            display: 'inline-block',
                                                            backdropFilter: 'blur(2px)',
                                                            fontWeight: 600,
                                                            whiteSpace: 'nowrap',
                                                            boxShadow: isIncomplete ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                                        }}
                                                        onClick={(e) => { e.stopPropagation(); setViewTextModal({ title: 'Question / Complaint', content: item.cmessage }); }}
                                                    >
                                                        See All
                                                    </div>
                                                </div>
                                            ) : (item.cmessage || '-')}
                                        </td>
                                        <td style={{ maxWidth: '200px' }}>
                                            {item.cmessage_re && item.cmessage_re.length > 50 ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    <span style={{ wordBreak: 'break-all' }}>
                                                        {item.cmessage_re.substring(0, 20)}...
                                                    </span>
                                                    <div
                                                        style={{
                                                            background: isIncomplete ? 'white' : 'linear-gradient(90deg, rgba(0, 94, 106, 0.1) 0%, rgba(0, 94, 106, 0.05) 100%)',
                                                            border: isIncomplete ? 'none' : '1px solid rgba(0, 94, 106, 0.1)',
                                                            padding: '2px 8px',
                                                            borderRadius: '6px',
                                                            color: isIncomplete ? '#991b1b' : 'var(--primary)',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem',
                                                            display: 'inline-block',
                                                            backdropFilter: 'blur(2px)',
                                                            fontWeight: 600,
                                                            whiteSpace: 'nowrap',
                                                            boxShadow: isIncomplete ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                                        }}
                                                        onClick={(e) => { e.stopPropagation(); setViewTextModal({ title: 'Answer / Follow Up', content: item.cmessage_re }); }}
                                                    >
                                                        See All
                                                    </div>
                                                </div>
                                            ) : (item.cmessage_re || '-')}
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                                {(user?.idgroup == 1 || user?.idgroup == 2 || user?.idgroup == 3) && (
                                                    <button
                                                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                                        style={isIncomplete ? { background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', border: '1px solid #bbf7d0' } : {}}
                                                        title="View"
                                                        onClick={() => handleView(item)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                                    style={isIncomplete ? { background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', border: '1px solid #bfdbfe' } : {}}
                                                    title={(!(user?.idgroup == 1 || user?.idgroup == 2 || user?.idgroup == 3) && !isIncomplete && item.idstatus == 2) ? "View" : "Edit"}
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    {(!(user?.idgroup == 1 || user?.idgroup == 2 || user?.idgroup == 3) && !isIncomplete && item.idstatus == 2) ? <Eye size={16} /> : <Edit size={16} />}
                                                </button>
                                                {(user?.idgroup == 1 || user?.idgroup == 2 || user?.idgroup == 3) && (
                                                    <button
                                                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                                        style={isIncomplete ? { background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', border: '1px solid #fecaca' } : {}}
                                                        title="Delete"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center" style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Showing {data.length} of {total} entries
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn btn-outline"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="btn btn-outline" style={{ cursor: 'default', background: '#f9fafb' }}>{page}</span>
                    <button
                        className="btn btn-outline"
                        disabled={page >= totalPages && limit !== 'all'}
                        onClick={() => setPage(p => p + 1)}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    ), [data, loading, page, limit, total, totalPages, user, handleEdit, handleDelete, handleView, setViewTextModal, formatDuration, handlePrint, handleExportCSV, resetForm]);

    return (
        <div style={{ marginTop: '-2rem' }}>
            <div className="flex flex-row justify-between items-end relative" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Data List</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage and view customer complaints</p>
                </div>
            </div>

            {/* --- DETAILED SEARCH FILTER --- */}
            <div className="card" style={{ marginBottom: '0.5rem', padding: '1rem', position: 'sticky', top: '10px', zIndex: 30, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={16} /> Filter Search
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {/* Row 1 */}
                    <input name="f_noTicket" className="form-input" placeholder="No Ticket" value={filters.f_noTicket} onChange={handleFilterChange} />
                    <input name="f_custName" className="form-input" placeholder="Customer Name" value={filters.f_custName} onChange={handleFilterChange} />
                    <select name="f_channel" className="form-select" value={filters.f_channel} onChange={handleFilterChange}>
                        <option value="">- Channel Type -</option>
                        {channels.map(o => <option key={o.id} value={o.id}>{o.name_channel}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <select name="f_day" className="form-select" value={filters.f_day} onChange={handleFilterChange}>
                            <option value="">- Day -</option>
                            {Array.from({ length: filters.f_month ? new Date(filters.f_year || new Date().getFullYear(), filters.f_month, 0).getDate() : 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select name="f_month" className="form-select" value={filters.f_month} onChange={handleFilterChange}>
                            <option value="">- Month -</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select name="f_year" className="form-select" value={filters.f_year} onChange={handleFilterChange}>
                            <option value="">- Year -</option>
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Row 2 */}
                    <input name="f_noReff" className="form-input" placeholder="No Reff" value={filters.f_noReff} onChange={handleFilterChange} />
                    <select name="f_status" className="form-select" value={filters.f_status} onChange={handleFilterChange}>
                        <option value="">- Status -</option>
                        <option value="1">Open</option>
                        <option value="2">Close</option>
                    </select>
                    <select name="f_product" className="form-select" value={filters.f_product} onChange={handleFilterChange}>
                        <option value="">- Product Type -</option>
                        {products.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <select name="f_custType" className="form-select" value={filters.f_custType} onChange={handleFilterChange}>
                        <option value="">- Customer Type -</option>
                        {custTypes.map(o => <option key={o.id} value={o.id}>{o.name_typecust}</option>)}
                    </select>

                    {/* Row 3 */}
                    <input name="f_question" className="form-input" placeholder="Question" value={filters.f_question} onChange={handleFilterChange} />
                    <input name="f_answer" className="form-input" placeholder="Answer" value={filters.f_answer} onChange={handleFilterChange} />
                    <select name="f_subject" className="form-select" value={filters.f_subject} onChange={handleFilterChange}>
                        <option value="">- Subject Type -</option>
                        {subjects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <select name="f_bic" className="form-select" value={filters.f_bic} onChange={handleFilterChange}>
                        <option value="">- Correspondent -</option>
                        {bics.map(o => <option key={o.id} value={o.id}>{`${o.country_bic || '-'} - ${o.name_bic || '-'} - ${o.scode_bic || '-'}`}</option>)}
                    </select>

                    {/* Row 4 */}
                    <select name="f_userOpen" className="form-select" value={filters.f_userOpen} onChange={handleFilterChange}>
                        <option value="">- User Open -</option>
                        {userList.map(u => <option key={u.id} value={u.fullname}>{u.fullname}{u.jabatan ? ` - ${u.jabatan}` : ''}</option>)}
                    </select>
                    <select name="f_userClose" className="form-select" value={filters.f_userClose} onChange={handleFilterChange}>
                        <option value="">- User Close -</option>
                        {userList.map(u => <option key={u.id} value={u.fullname}>{u.fullname}{u.jabatan ? ` - ${u.jabatan}` : ''}</option>)}
                    </select>
                    <select name="f_branch" className="form-select" value={filters.f_branch} onChange={handleFilterChange}>
                        <option value="">- Branch -</option>
                        {branches.map(o => <option key={o.id} value={o.id}>{`${o.kode_brc || ''} - ${o.sandi_brc || ''} - ${o.name_brc || ''}`}</option>)}
                    </select>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end" style={{ gridColumn: 'span 1' }}>
                        <button className="btn" style={{ background: '#ef4444', color: 'white', borderColor: '#ef4444' }} onClick={resetFilters}>Reset</button>
                    </div>
                </div>
            </div>

            {tableContent}

            {/* Add Modal */}
            <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); }}>
                <div className="card" style={{ width: '900px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                            {isViewOnly ? 'View Complaint (Closed)' : (editId ? 'Edit Complaint Data' : 'Add New Complaint')}
                        </h3>
                        <button
                            onClick={() => { setShowAddModal(false); resetForm(); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <fieldset disabled={isViewOnly} style={{ border: 'none', padding: 0, margin: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Left Column */}
                                <div>
                                    <div className="form-group">
                                        <label className="form-label">No Reff</label>
                                        <input
                                            name="noreff"
                                            className="form-input"
                                            value={formData.noreff}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Channel Type</label>
                                        <div className="flex gap-2">
                                            <select
                                                name="idchannel"
                                                className="form-select"
                                                value={formData.idchannel}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Select Channel...</option>
                                                {channels.map(c => <option key={c.id} value={c.id}>{c.name_channel}</option>)}
                                            </select>
                                            {canQuickAdd && (
                                                <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('channel', 'Add Channel')} title="Quick Add Channel">
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Conditional Channel Note Field */}
                                    {(() => {
                                        const chId = parseInt(formData.idchannel);
                                        const showNote = [1, 4, 5, 9, 10].includes(chId);
                                        let label = 'Note';
                                        if (chId === 5) label = 'Email';
                                        else if (chId === 10) label = 'Other Type';
                                        else label = 'Phone Number'; // 1, 4, 9 default to Phone Number

                                        if (showNote) {
                                            return (
                                                <div className="form-group" style={{ marginTop: '-0.5rem', background: '#f0fdf4', padding: '0.5rem', borderRadius: '4px', borderStyle: 'solid', borderWidth: '1px', borderColor: '#bbf7d0' }}>
                                                    <label className="form-label" style={{ color: '#166534' }}>{label}</label>
                                                    <input
                                                        name="channel_note"
                                                        className="form-input"
                                                        value={formData.channel_note || ''}
                                                        onChange={handleFormChange}
                                                        placeholder={`Enter ${label}...`}
                                                        required
                                                    />
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    <div className="form-group">
                                        <label className="form-label">Customer Type</label>
                                        <div className="flex gap-2">
                                            <select
                                                name="idtypecust"
                                                className="form-select"
                                                value={formData.idtypecust}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Select Customer Type...</option>
                                                {custTypes.map(c => <option key={c.id} value={c.id}>{c.name_typecust}</option>)}
                                            </select>
                                            {canQuickAdd && (
                                                <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('customertype', 'Add Customer Type')} title="Quick Add Customer Type">
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Conditional Customer Fields */}
                                    {(custTypeName.includes('respective') || custReff === 'ref_respective') && (
                                        <div style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '4px', marginBottom: '1rem' }}>
                                            <div className="form-group">
                                                <label className="form-label">Name</label>
                                                <input name="cust_name" className="form-input" value={formData.cust_name} onChange={handleFormChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Location</label>
                                                <input name="cust_lok" className="form-input" value={formData.cust_lok} onChange={handleFormChange} required />
                                            </div>
                                        </div>
                                    )}

                                    {(custTypeName.includes('correspondent') || custReff === 'ref_bic') && (
                                        <div className="form-group">
                                            <label className="form-label">BIC / Correspondent</label>
                                            <div className="flex gap-2">
                                                <select name="idbic" className="form-select" value={formData.idbic} onChange={handleFormChange} required>
                                                    <option value="">Select BIC...</option>
                                                    {bics.map(b => <option key={b.id} value={b.id}>{`${b.country_bic || '-'} - ${b.name_bic || '-'} - ${b.scode_bic || '-'}`}</option>)}
                                                </select>
                                                {canQuickAdd && (
                                                    <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('bic', 'Add BIC')} title="Quick Add BIC">
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(custTypeName.includes('branch') || custReff === 'ref_branch') && (
                                        <div className="form-group">
                                            <label className="form-label">Bank Branch</label>
                                            <div className="flex gap-2">
                                                <select name="idbranch" className="form-select" value={formData.idbranch} onChange={handleFormChange} required>
                                                    <option value="">Select Branch...</option>
                                                    {branches.map(b => <option key={b.id} value={b.id}>{`${b.kode_brc || ''} - ${b.sandi_brc || ''} - ${b.name_brc || ''}`}</option>)}
                                                </select>
                                                {canQuickAdd && (
                                                    <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('branch', 'Add Branch')} title="Quick Add Branch">
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(custTypeName.includes('paying agent') || custReff === 'ref_pagent') && (
                                        <div className="form-group">
                                            <label className="form-label">Paying Agent</label>
                                            <div className="flex gap-2">
                                                <select name="idpagent" className="form-select" value={formData.idpagent} onChange={handleFormChange} required>
                                                    <option value="">Select Agent...</option>
                                                    {pagents.map(p => <option key={p.id} value={p.id}>{p.name_pagent}</option>)}
                                                </select>
                                                {canQuickAdd && (
                                                    <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('pagent', 'Add Agent')} title="Quick Add Agent">
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(custTypeName.includes('remittance') || custTypeName.includes('rep') || custReff === 'ref_bnir_rep') && (
                                        <div className="form-group">
                                            <label className="form-label">Remittance Representative</label>
                                            <div className="flex gap-2">
                                                <select name="idbnir_rep" className="form-select" value={formData.idbnir_rep} onChange={handleFormChange} required>
                                                    <option value="">Select Rep...</option>
                                                    {bnirReps.map(r => <option key={r.id} value={r.id}>{r.name_bnir_rep}</option>)}
                                                </select>
                                                {canQuickAdd && (
                                                    <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('bnirr', 'Add Rep')} title="Quick Add Rep">
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(custTypeName.includes('other') || custReff === 'ref_other') && (
                                        <div style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '4px', marginBottom: '1rem' }}>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label className="form-label">Note</label>
                                                <input name="other_note" className="form-input" value={formData.other_note} onChange={handleFormChange} required />
                                            </div>
                                        </div>
                                    )}

                                    {custReff && custReff.startsWith('input:') && (
                                        <div style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '4px', marginBottom: '1rem' }}>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label className="form-label">{custReff.substring(6)}</label>
                                                <input name="other_note" className="form-input" value={formData.other_note} onChange={handleFormChange} required />
                                            </div>
                                        </div>
                                    )}

                                    {custReff && custReff.startsWith('dropdown:') && (
                                        <div className="form-group">
                                            <label className="form-label">{custReff.substring(9)}</label>
                                            <div className="flex gap-2">
                                                <select name="other_note" className="form-select" value={formData.other_note} onChange={handleFormChange} required>
                                                    <option value="">Select...</option>
                                                    {dynamicOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                                                </select>
                                                {canQuickAdd && (
                                                    <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('dynamic', `Add ${custReff.substring(9)}`, custReff.substring(9))} title={`Quick Add ${custReff.substring(9)}`}>
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {custReff && !custReff.startsWith('ref_') && !custReff.startsWith('input:') && !custReff.startsWith('dropdown:') && custReff !== '-' && !['respective', 'correspondent', 'branch', 'paying agent', 'remittance', 'rep', 'other'].some(k => custTypeName.includes(k)) && (
                                        <div style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '4px', marginBottom: '1rem' }}>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label className="form-label">{custReff}</label>
                                                <input name="other_note" className="form-input" value={formData.other_note} onChange={handleFormChange} required />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div>
                                    <div className="form-group">
                                        <label className="form-label">Product Type</label>
                                        <div className="flex gap-2">
                                            <select
                                                name="idproduct"
                                                className="form-select"
                                                value={formData.idproduct}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Select Product...</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                            {canQuickAdd && (
                                                <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('product', 'Add Product')} title="Quick Add Product">
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {formData.idproduct && (
                                        <div className="form-group">
                                            <label className="form-label">Subject Type</label>
                                            <div className="flex gap-2">
                                                <select
                                                    name="idsubject"
                                                    className="form-select"
                                                    value={formData.idsubject}
                                                    onChange={handleFormChange}
                                                    required={filteredSubjects.length > 0}
                                                >
                                                    <option value="">Select Subject...</option>
                                                    {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </select>
                                                {canQuickAdd && (
                                                    <button type="button" className="btn btn-outline px-2" onClick={() => handleQuickAddOpen('subject', 'Add Subject')} title="Quick Add Subject">
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">Question / Complaint</label>
                                        <textarea
                                            name="cmessage"
                                            className="form-input"
                                            rows="4"
                                            style={{ resize: 'vertical' }}
                                            value={formData.cmessage}
                                            onChange={handleFormChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Answer / Follow Up</label>
                                        <textarea
                                            name="cmessage_re"
                                            className="form-input"
                                            rows="4"
                                            style={{ resize: 'vertical' }}
                                            value={formData.cmessage_re}
                                            onChange={handleFormChange}
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Note (Internal)</label>
                                        <textarea
                                            name="notes"
                                            className="form-input"
                                            rows="2"
                                            style={{ resize: 'vertical' }}
                                            value={formData.notes || ''}
                                            onChange={handleFormChange}
                                            placeholder="Add internal notes here..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {/* Notes Section - Absolute Left */}
                            <div style={{ position: 'absolute', left: 0, top: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {isViewOnly ? (
                                    <div className="flex items-center gap-2">
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>Status Tiket:</span>
                                        <div style={{
                                            padding: '4px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: isClosed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                            color: isClosed ? '#16a34a' : '#4b5563',
                                            border: isClosed ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{ width: 8, height: 8, background: isClosed ? '#22c55e' : '#9ca3af', borderRadius: '50%' }}></span>
                                            {isClosed ? 'Closed' : 'Open'}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <span style={{ width: 8, height: 8, background: '#9ca3af', borderRadius: '50%', display: 'inline-block' }}></span>
                                            Gray: Tiket belum close
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                                            Green: Status Tiket sudah Close
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Buttons - Centered */}
                            {!isViewOnly ? (
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{
                                            background: isClosed ? 'linear-gradient(to right, #22c55e, #16a34a)' : '#9ca3af',
                                            color: 'white',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => setIsClosed(!isClosed)}
                                    >
                                        Status: Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">Save Data</button>
                                </div>
                            ) : (
                                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Close View</button>
                            )}
                        </div>
                    </form >
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

            {/* Text View Modal */}
            <Modal isOpen={!!viewTextModal} onClose={() => setViewTextModal(null)} zIndex={110}>
                <div
                    className="card"
                    style={{ width: '600px', maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center" style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{viewTextModal?.title}</h3>
                        <button onClick={() => setViewTextModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
                    </div>
                    <div style={{
                        overflowY: 'auto',
                        flex: 1,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        lineHeight: 1.6,
                        color: 'var(--text-main)',
                        paddingRight: '0.5rem'
                    }}>
                        {viewTextModal?.content}
                    </div>
                </div>
            </Modal>

            {/* Quick Add Modal */}
            <Modal isOpen={quickAdd.show} onClose={() => setQuickAdd({ ...quickAdd, show: false })}>
                <div className="card w-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">{quickAdd.title}</h3>
                        <button onClick={() => setQuickAdd({ ...quickAdd, show: false })}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleQuickAddSubmit}>
                        <div className="form-group mb-4">
                            <label className="form-label">Name <span className="text-red-500">*</span></label>
                            <input
                                className="form-input"
                                value={quickAdd.value}
                                onChange={e => setQuickAdd({ ...quickAdd, value: e.target.value })}
                                placeholder="Enter name..."
                                autoFocus
                                required
                            />
                        </div>
                        {quickAdd.type === 'customertype' && (
                            <div className="form-group mb-4">
                                <label className="form-label">Customer Reff</label>
                                <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={quickAdd.custReffMode === 'existing'} onChange={() => setQuickAdd({...quickAdd, custReffMode: 'existing', custReffValue: ''})} />
                                        Existing (Dropdown)
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={quickAdd.custReffMode === 'new'} onChange={() => setQuickAdd({...quickAdd, custReffMode: 'new', custReffValue: ''})} />
                                        New (Input)
                                    </label>
                                </div>
                                {quickAdd.custReffMode === 'existing' ? (
                                    <select className="form-select" value={quickAdd.custReffValue} onChange={e => setQuickAdd({...quickAdd, custReffValue: e.target.value})}>
                                        <option value="">Select Reff...</option>
                                        {[...new Set(custTypes.map(c => c.cust_reff).filter(r => r && r !== '-'))].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                        <input className="form-input mb-2" value={quickAdd.custReffValue} onChange={e => setQuickAdd({...quickAdd, custReffValue: e.target.value})} placeholder="Enter new cust_reff..." />
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" checked={quickAdd.newFieldType === 'input'} onChange={() => setQuickAdd({...quickAdd, newFieldType: 'input'})} />
                                                Input Field
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" checked={quickAdd.newFieldType === 'dropdown'} onChange={() => setQuickAdd({...quickAdd, newFieldType: 'dropdown'})} />
                                                Dropdown
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <button type="button" className="btn btn-outline" onClick={() => setQuickAdd({ ...quickAdd, show: false })}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save & Select</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div >
    );
};

export default ComplaintList;
