import axios from 'axios';
import {
    MOCK_USERS,
    MOCK_COMPLAINTS,
    MOCK_CHANNELS,
    MOCK_CUSTTYPES,
    MOCK_PRODUCTS,
    MOCK_SUBJECTS,
    MOCK_BICS,
    MOCK_BRANCHES,
    MOCK_PAGENTS,
    MOCK_BNIR_REPS,
    MOCK_USER_LOGS,
    MOCK_APP_LOGS
} from './mockData';

// Determine if mock mode is active
// Automatically active on GitHub Pages (hostname contains github.io)
// OR if VITE_DEMO_MODE is set to 'true'
// OR if user clicks "Demo Mode" toggle in localStorage
export const isMockMode = () => {
    if (typeof window === 'undefined') return false;
    const isGithubPages = window.location.hostname.includes('github.io');
    const isLocalDemo = localStorage.getItem('demo_mode') === 'true';
    const isEnvDemo = import.meta.env.VITE_DEMO_MODE === 'true';
    return isGithubPages || isLocalDemo || isEnvDemo;
};

// Storage keys for persisting demo state in localStorage
const STORAGE_KEYS = {
    USERS: 'cid_mock_users',
    COMPLAINTS: 'cid_mock_complaints',
    CHANNELS: 'cid_mock_channels',
    CUSTTYPES: 'cid_mock_custtypes',
    PRODUCTS: 'cid_mock_products',
    SUBJECTS: 'cid_mock_subjects',
    BICS: 'cid_mock_bics',
    BRANCHES: 'cid_mock_branches',
    PAGENTS: 'cid_mock_pagents',
    BNIR_REPS: 'cid_mock_bnir_reps',
    USER_LOGS: 'cid_mock_user_logs',
    APP_LOGS: 'cid_mock_app_logs',
    DYNAMIC: 'cid_mock_dynamic'
};

const getStored = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
};

const saveStored = (key, val) => {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        console.error(e);
    }
};

const MOCK_VERSION = 'v2_fake_data_sanitized';

export const initMockStorage = (forceReset = false) => {
    const currentVer = localStorage.getItem('cid_mock_ver');
    if (forceReset || currentVer !== MOCK_VERSION) {
        saveStored(STORAGE_KEYS.USERS, MOCK_USERS);
        saveStored(STORAGE_KEYS.COMPLAINTS, MOCK_COMPLAINTS);
        saveStored(STORAGE_KEYS.CHANNELS, MOCK_CHANNELS);
        saveStored(STORAGE_KEYS.CUSTTYPES, MOCK_CUSTTYPES);
        saveStored(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
        saveStored(STORAGE_KEYS.SUBJECTS, MOCK_SUBJECTS);
        saveStored(STORAGE_KEYS.BICS, MOCK_BICS);
        saveStored(STORAGE_KEYS.BRANCHES, MOCK_BRANCHES);
        saveStored(STORAGE_KEYS.PAGENTS, MOCK_PAGENTS);
        saveStored(STORAGE_KEYS.BNIR_REPS, MOCK_BNIR_REPS);
        saveStored(STORAGE_KEYS.USER_LOGS, MOCK_USER_LOGS);
        saveStored(STORAGE_KEYS.APP_LOGS, MOCK_APP_LOGS);
        saveStored(STORAGE_KEYS.DYNAMIC, []);
        localStorage.setItem('cid_mock_ver', MOCK_VERSION);
    }
};

export const setupMockAdapter = () => {
    initMockStorage();

    // Intercept axios request
    axios.interceptors.request.use(async (config) => {
        // If not mock mode and backend is reachable, let it pass through
        if (!isMockMode()) {
            return config;
        }

        const url = config.url || '';
        const method = (config.method || 'get').toLowerCase();

        // Handle Auth
        if (url.includes('/api/auth/login')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
            const { username, password } = body;
            const users = getStored(STORAGE_KEYS.USERS, MOCK_USERS);
            const user = users.find(u =>
                (u.name === username || u.nip_nrp === username || u.email === username)
            );

            if (!user) {
                return mockResponse(401, { error: 'User tidak ditemukan' });
            }
            if (user.pass !== password) {
                return mockResponse(401, { error: 'Password salah' });
            }

            const { pass, ...userInfo } = user;
            return mockResponse(200, {
                message: 'Login successful (Demo Mode)',
                user: userInfo
            });
        }

        if (url.includes('/api/auth/change-password')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
            const { userId, oldPassword, newPassword } = body;
            const users = getStored(STORAGE_KEYS.USERS, MOCK_USERS);
            const user = users.find(u => u.id === userId);
            if (!user) return mockResponse(404, { error: 'User not found' });
            if (user.pass !== oldPassword) return mockResponse(401, { error: 'Incorrect old password' });

            user.pass = newPassword;
            user.must_change_password = 0;
            saveStored(STORAGE_KEYS.USERS, users);
            return mockResponse(200, { message: 'Password changed successfully' });
        }

        // Handle Users
        if (url === '/api/users' || url.startsWith('/api/users?')) {
            if (method === 'get') {
                const users = getStored(STORAGE_KEYS.USERS, MOCK_USERS);
                return mockResponse(200, users);
            }
            if (method === 'post') {
                const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                const users = getStored(STORAGE_KEYS.USERS, MOCK_USERS);
                const newUser = {
                    id: Date.now(),
                    ...body,
                    lastchange: new Date().toISOString().split('T')[0],
                    must_change_password: 0
                };
                users.unshift(newUser);
                saveStored(STORAGE_KEYS.USERS, users);
                return mockResponse(201, newUser);
            }
        }

        if (url.startsWith('/api/users/')) {
            const id = parseInt(url.split('/api/users/')[1]);
            const users = getStored(STORAGE_KEYS.USERS, MOCK_USERS);
            if (method === 'put') {
                const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                const idx = users.findIndex(u => u.id === id);
                if (idx !== -1) {
                    users[idx] = { ...users[idx], ...body };
                    saveStored(STORAGE_KEYS.USERS, users);
                    return mockResponse(200, users[idx]);
                }
            }
            if (method === 'delete') {
                const updated = users.filter(u => u.id !== id);
                saveStored(STORAGE_KEYS.USERS, updated);
                return mockResponse(200, { message: 'User deleted' });
            }
        }

        // Handle Complaints
        if (url.includes('/api/complaints')) {
            let complaints = getStored(STORAGE_KEYS.COMPLAINTS, MOCK_COMPLAINTS);

            if (method === 'get' && !url.match(/\/api\/complaints\/\d+/)) {
                // Return paginated complaints with filter support
                const params = config.params || {};
                const page = parseInt(params.page) || 1;
                const limit = parseInt(params.limit) || 10;
                let filtered = [...complaints];

                if (params.search) {
                    const q = params.search.toLowerCase();
                    filtered = filtered.filter(c =>
                        (c.noticket && c.noticket.toLowerCase().includes(q)) ||
                        (c.noreff && c.noreff.toLowerCase().includes(q)) ||
                        (c.cust_name && c.cust_name.toLowerCase().includes(q)) ||
                        (c.cmessage && c.cmessage.toLowerCase().includes(q))
                    );
                }

                if (params.f_noTicket) {
                    filtered = filtered.filter(c => c.noticket && c.noticket.toLowerCase().includes(params.f_noTicket.toLowerCase()));
                }
                if (params.f_custName) {
                    filtered = filtered.filter(c => c.cust_name && c.cust_name.toLowerCase().includes(params.f_custName.toLowerCase()));
                }
                if (params.f_status) {
                    filtered = filtered.filter(c => String(c.idstatus) === String(params.f_status));
                }

                const total = filtered.length;
                const totalPages = Math.ceil(total / limit) || 1;
                const start = (page - 1) * limit;
                const paginated = filtered.slice(start, start + limit);

                return mockResponse(200, {
                    data: paginated,
                    total,
                    page,
                    limit,
                    totalPages
                });
            }

            if (method === 'post') {
                const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                const channels = getStored(STORAGE_KEYS.CHANNELS, MOCK_CHANNELS);
                const custTypes = getStored(STORAGE_KEYS.CUSTTYPES, MOCK_CUSTTYPES);
                const products = getStored(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
                const subjects = getStored(STORAGE_KEYS.SUBJECTS, MOCK_SUBJECTS);
                const bics = getStored(STORAGE_KEYS.BICS, MOCK_BICS);
                const branches = getStored(STORAGE_KEYS.BRANCHES, MOCK_BRANCHES);
                const pagents = getStored(STORAGE_KEYS.PAGENTS, MOCK_PAGENTS);
                const bnirReps = getStored(STORAGE_KEYS.BNIR_REPS, MOCK_BNIR_REPS);
                const users = getStored(STORAGE_KEYS.USERS, MOCK_USERS);

                const channelObj = channels.find(x => x.id == body.idchannel);
                const custTypeObj = custTypes.find(x => x.id == body.idtypecust);
                const prodObj = products.find(x => x.id == body.idproduct);
                const subjObj = subjects.find(x => x.id == body.idsubject);
                const bicObj = bics.find(x => x.id == body.idbic);
                const brcObj = branches.find(x => x.id == body.idbranch);
                const pagObj = pagents.find(x => x.id == body.idpagent);
                const repObj = bnirReps.find(x => x.id == body.idbnir_rep);
                const openerObj = users.find(x => x.id == body.iduser_o);

                const newId = Date.now();
                const now = new Date();
                const dStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;

                const newComplaint = {
                    id: newId,
                    noticket: `T-${dStr}-${complaints.length + 101}`,
                    ...body,
                    name_channel: channelObj?.name_channel || '-',
                    name_typecust: custTypeObj?.name_typecust || '-',
                    product_name: prodObj?.name || '-',
                    subject_name: subjObj?.name || '-',
                    bic_name: bicObj?.name_bic || '-',
                    branch_name: brcObj?.name_brc || '-',
                    pagent_name: pagObj?.name_pagent || '-',
                    bnir_rep_name: repObj?.name_bnir_rep || '-',
                    opener_name: openerObj?.fullname || 'Demo User',
                    closer_name: body.idstatus == 2 ? (openerObj?.fullname || 'Demo User') : null,
                    updater_name: openerObj?.fullname || 'Demo User'
                };

                complaints.unshift(newComplaint);
                saveStored(STORAGE_KEYS.COMPLAINTS, complaints);
                return mockResponse(201, newComplaint);
            }

            if (method === 'put') {
                const idMatch = url.match(/\/api\/complaints\/(\d+)/);
                if (idMatch) {
                    const id = parseInt(idMatch[1]);
                    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                    const idx = complaints.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        complaints[idx] = { ...complaints[idx], ...body };
                        if (body.idstatus == 2 && !complaints[idx].closer_name) {
                            complaints[idx].closer_name = 'Demo Closer';
                        }
                        saveStored(STORAGE_KEYS.COMPLAINTS, complaints);
                        return mockResponse(200, complaints[idx]);
                    }
                }
            }

            if (method === 'delete') {
                const idMatch = url.match(/\/api\/complaints\/(\d+)/);
                if (idMatch) {
                    const id = parseInt(idMatch[1]);
                    const updated = complaints.filter(c => c.id !== id);
                    saveStored(STORAGE_KEYS.COMPLAINTS, updated);
                    return mockResponse(200, { message: 'Complaint deleted' });
                }
            }
        }

        // Handle Master
        if (url.includes('/api/master')) {
            const pathParts = url.split('/api/master/')[1] || '';
            const masterType = pathParts.split('?')[0].split('/')[0];

            const typeMap = {
                channel: { key: STORAGE_KEYS.CHANNELS, def: MOCK_CHANNELS },
                customertype: { key: STORAGE_KEYS.CUSTTYPES, def: MOCK_CUSTTYPES },
                product: { key: STORAGE_KEYS.PRODUCTS, def: MOCK_PRODUCTS },
                subject: { key: STORAGE_KEYS.SUBJECTS, def: MOCK_SUBJECTS },
                bic: { key: STORAGE_KEYS.BICS, def: MOCK_BICS },
                branch: { key: STORAGE_KEYS.BRANCHES, def: MOCK_BRANCHES },
                payingagent: { key: STORAGE_KEYS.PAGENTS, def: MOCK_PAGENTS },
                bnirr: { key: STORAGE_KEYS.BNIR_REPS, def: MOCK_BNIR_REPS }
            };

            if (masterType.startsWith('dynamic')) {
                const dyn = getStored(STORAGE_KEYS.DYNAMIC, []);
                return mockResponse(200, dyn);
            }

            if (typeMap[masterType]) {
                const mapping = typeMap[masterType];
                const list = getStored(mapping.key, mapping.def);

                if (method === 'get') {
                    return mockResponse(200, list);
                }

                if (method === 'post') {
                    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                    const newItem = { id: Date.now(), ...body };
                    list.push(newItem);
                    saveStored(mapping.key, list);
                    return mockResponse(201, newItem);
                }

                if (method === 'put') {
                    const idMatch = url.match(new RegExp(`/api/master/${masterType}/(\\d+)`));
                    if (idMatch) {
                        const id = parseInt(idMatch[1]);
                        const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                        const idx = list.findIndex(item => item.id === id);
                        if (idx !== -1) {
                            list[idx] = { ...list[idx], ...body };
                            saveStored(mapping.key, list);
                            return mockResponse(200, list[idx]);
                        }
                    }
                }

                if (method === 'delete') {
                    const idMatch = url.match(new RegExp(`/api/master/${masterType}/(\\d+)`));
                    if (idMatch) {
                        const id = parseInt(idMatch[1]);
                        const updated = list.filter(item => item.id !== id);
                        saveStored(mapping.key, updated);
                        return mockResponse(200, { message: 'Item deleted' });
                    }
                }
            }
        }

        // Handle Activity Logs
        if (url.includes('/api/activity/user')) {
            const logs = getStored(STORAGE_KEYS.USER_LOGS, MOCK_USER_LOGS);
            return mockResponse(200, {
                data: logs,
                total: logs.length,
                totalPages: 1
            });
        }

        if (url.includes('/api/activity/app')) {
            const logs = getStored(STORAGE_KEYS.APP_LOGS, MOCK_APP_LOGS);
            if (method === 'post') {
                const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
                const newLog = {
                    id: Date.now(),
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    status: body.status || 'Normal',
                    reported_by: 'Demo User',
                    description: body.description || '',
                    recommendation: body.recommendation || ''
                };
                logs.unshift(newLog);
                saveStored(STORAGE_KEYS.APP_LOGS, logs);
                return mockResponse(201, newLog);
            }
            return mockResponse(200, {
                data: logs,
                total: logs.length,
                totalPages: 1
            });
        }

        // Handle System SQL Execute (simulate success in demo)
        if (url.includes('/api/system/execute-sql')) {
            return mockResponse(200, { message: 'SQL Script executed in Mock Simulator.' });
        }

        // Default pass-through
        return config;
    }, (error) => Promise.reject(error));
};

// Helper function to create fake resolved axios responses
function mockResponse(status, data) {
    return {
        adapter: async () => ({
            data,
            status,
            statusText: status === 200 || status === 201 ? 'OK' : 'Error',
            headers: {},
            config: {},
            request: {}
        })
    };
}
