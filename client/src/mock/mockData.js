// Mock Database Data for Live Demo Preview (GitHub Pages / Standalone Client)

export const MOCK_GROUPS = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'MGR' },
    { id: 3, name: 'SPV' },
    { id: 4, name: 'TL' },
    { id: 5, name: 'User' }
];

export const MOCK_USERS = [
    {
        id: 1,
        name: 'admin',
        pass: 'admin123',
        nip_nrp: '10001',
        fullname: 'Administrator Demo',
        idgroup: '1',
        role_name: 'Admin',
        jabatan: 'Administrator System',
        nohp: '081234567890',
        email: 'admin@bni.co.id',
        lastchange: '2026-01-01',
        must_change_password: 0
    },
    {
        id: 2,
        name: 'mgr',
        pass: 'mgr123',
        nip_nrp: '19244',
        fullname: 'Manager T&R Demo',
        idgroup: '2',
        role_name: 'MGR',
        jabatan: 'MGR T&R',
        nohp: '081234567891',
        email: 'mgr@bni.co.id',
        lastchange: '2026-01-01',
        must_change_password: 0
    },
    {
        id: 3,
        name: 'spv',
        pass: 'spv123',
        nip_nrp: '36779',
        fullname: 'Supervisor T&R Demo',
        idgroup: '3',
        role_name: 'SPV',
        jabatan: 'SPV T&R',
        nohp: '081234567892',
        email: 'spv@bni.co.id',
        lastchange: '2026-01-01',
        must_change_password: 0
    },
    {
        id: 4,
        name: 'tl',
        pass: 'tl123',
        nip_nrp: '95474',
        fullname: 'Team Leader Demo',
        idgroup: '4',
        role_name: 'TL',
        jabatan: 'TL T&R',
        nohp: '081234567893',
        email: 'tl@bni.co.id',
        lastchange: '2026-01-01',
        must_change_password: 0
    },
    {
        id: 5,
        name: 'user',
        pass: 'user123',
        nip_nrp: '95194',
        fullname: 'User Staff Demo',
        idgroup: '5',
        role_name: 'User',
        jabatan: 'CXO T&R',
        nohp: '081234567894',
        email: 'user@bni.co.id',
        lastchange: '2026-01-01',
        must_change_password: 0
    }
];

export const MOCK_CHANNELS = [
    { id: 1, name_channel: 'Email' },
    { id: 2, name_channel: 'Telepon / Call' },
    { id: 3, name_channel: 'Surat Resmi' },
    { id: 4, name_channel: 'Portal Web' },
    { id: 5, name_channel: 'Walk In' }
];

export const MOCK_CUSTTYPES = [
    { id: 1, name_typecust: 'Perorangan', cust_reff: 'input:Nomor Rekening' },
    { id: 2, name_typecust: 'Korporasi / PT', cust_reff: 'input:NPWP Perusahaan' },
    { id: 3, name_typecust: 'Bank Koresponden', cust_reff: 'ref_bic' },
    { id: 4, name_typecust: 'Kantor Cabang BNI', cust_reff: 'ref_branch' },
    { id: 5, name_typecust: 'Paying Agent Luar Negeri', cust_reff: 'ref_pagent' },
    { id: 6, name_typecust: 'Lainnya', cust_reff: 'ref_other' }
];

export const MOCK_PRODUCTS = [
    { id: 1, name: 'BNI Remittance (Smart Transfer)', seq: 1, parent: 0, listselection: '', lv: 0, urutmenu: 1, aktif: 'Y', ket: 'Layanan Pengiriman Uang Luar Negeri' },
    { id: 2, name: 'Trade Finance - Letter of Credit (LC)', seq: 2, parent: 0, listselection: '', lv: 0, urutmenu: 2, aktif: 'Y', ket: 'Penerbitan & Konfirmasi LC' },
    { id: 3, name: 'Bank Garansi (BG)', seq: 3, parent: 0, listselection: '', lv: 0, urutmenu: 3, aktif: 'Y', ket: 'Jaminan Pembayaran Bank Garansi' },
    { id: 4, name: 'SKBDN (Surat Kredit Berdokumen Dalam Negeri)', seq: 4, parent: 0, listselection: '', lv: 0, urutmenu: 4, aktif: 'Y', ket: 'Perdagangan Dalam Negeri' }
];

export const MOCK_SUBJECTS = [
    { id: 1, idproduct: 1, name: 'Status Kiriman Belum Masuk Rekening', seq: 1, parent: 0, listselection: '', lv: 0, urutmenu: 1, aktif: 'Y', ket: '' },
    { id: 2, idproduct: 1, name: 'Koreksi Data Penerima / Nama / Rekening', seq: 2, parent: 0, listselection: '', lv: 0, urutmenu: 2, aktif: 'Y', ket: '' },
    { id: 3, idproduct: 1, name: 'Pembatalan & Pengembalian Dana (Refund)', seq: 3, parent: 0, listselection: '', lv: 0, urutmenu: 3, aktif: 'Y', ket: '' },
    { id: 4, idproduct: 2, name: 'Konfirmasi Penerimaan LC dari Bank Luar Negeri', seq: 1, parent: 0, listselection: '', lv: 0, urutmenu: 1, aktif: 'Y', ket: '' },
    { id: 5, idproduct: 2, name: 'Discrepancy Dokumen Perdagangan', seq: 2, parent: 0, listselection: '', lv: 0, urutmenu: 2, aktif: 'Y', ket: '' },
    { id: 6, idproduct: 3, name: 'Verifikasi Keabsahan Warkat Bank Garansi', seq: 1, parent: 0, listselection: '', lv: 0, urutmenu: 1, aktif: 'Y', ket: '' },
    { id: 7, idproduct: 4, name: 'Pencairan SKBDN Lewat Jatuh Tempo', seq: 1, parent: 0, listselection: '', lv: 0, urutmenu: 1, aktif: 'Y', ket: '' }
];

export const MOCK_BICS = [
    { id: 1, name_bic: 'Citibank N.A. New York', country_bic: 'United States', scode_bic: 'CITIUS33', aktif: 'Y' },
    { id: 2, name_bic: 'DBS Bank Ltd Singapore', country_bic: 'Singapore', scode_bic: 'DBSSSGSG', aktif: 'Y' },
    { id: 3, name_bic: 'The Hongkong and Shanghai Banking Corp (HSBC)', country_bic: 'Hong Kong', scode_bic: 'HSBCHKHH', aktif: 'Y' },
    { id: 4, name_bic: 'Standard Chartered Bank London', country_bic: 'United Kingdom', scode_bic: 'SCBLGB2L', aktif: 'Y' },
    { id: 5, name_bic: 'MUFG Bank Ltd Tokyo', country_bic: 'Japan', scode_bic: 'BOTKJPJT', aktif: 'Y' }
];

export const MOCK_BRANCHES = [
    { id: 1, sandi_brc: '001', kode_brc: 'JKT-KOTA', name_brc: 'KC Jakarta Kota', wil_brc: 'WJP', eisname_brc: 'Jakarta Kota' },
    { id: 2, sandi_brc: '002', kode_brc: 'SBY-UTAMA', name_brc: 'KC Surabaya', wil_brc: 'WJT', eisname_brc: 'Surabaya' },
    { id: 3, sandi_brc: '003', kode_brc: 'BDG-ASIA', name_brc: 'KC Bandung Asia Afrika', wil_brc: 'WJB', eisname_brc: 'Bandung' },
    { id: 4, sandi_brc: '004', kode_brc: 'MDN-PEM', name_brc: 'KC Medan Pemuda', wil_brc: 'WSU', eisname_brc: 'Medan' },
    { id: 5, sandi_brc: '005', kode_brc: 'DPS-GATOT', name_brc: 'KC Denpasar Gatot Subroto', wil_brc: 'WDB', eisname_brc: 'Denpasar' }
];

export const MOCK_PAGENTS = [
    { id: 1, name_pagent: 'Western Union Indonesia' },
    { id: 2, name_pagent: 'MoneyGram International' },
    { id: 3, name_pagent: 'Ria Financial Services' },
    { id: 4, name_pagent: 'Transfast Global' },
    { id: 5, name_pagent: 'Al-Ansari Exchange UAE' }
];

export const MOCK_BNIR_REPS = [
    { id: 1, name_bnir_rep: 'BNI Seoul Representative Office', area: 'South Korea' },
    { id: 2, name_bnir_rep: 'BNI Tokyo Branch & Remittance Desk', area: 'Japan' },
    { id: 3, name_bnir_rep: 'BNI London Branch', area: 'Europe' },
    { id: 4, name_bnir_rep: 'BNI Singapore Branch', area: 'Southeast Asia' },
    { id: 5, name_bnir_rep: 'BNI New York Agency', area: 'Americas' }
];

export const MOCK_COMPLAINTS = [
    {
        id: 1,
        noticket: 'T-18102026-101',
        noreff: 'REF-20261018-001',
        idchannel: 1,
        name_channel: 'Email',
        idchannel_note: 'Ticket Helpdesk #9921',
        idtypecust: 1,
        name_typecust: 'Perorangan',
        cust_name: 'Budi Santoso',
        cust_lok: 'Jakarta Selatan',
        cust_note: '01234567890',
        idbic: 1,
        bic_name: 'Citibank N.A. New York',
        idbranch: 1,
        branch_name: 'KC Jakarta Kota',
        idpagent: 1,
        pagent_name: 'Western Union Indonesia',
        idbnir_rep: 4,
        bnir_rep_name: 'BNI Singapore Branch',
        idproduct: 1,
        product_name: 'BNI Remittance (Smart Transfer)',
        idsubject: 1,
        subject_name: 'Status Kiriman Belum Masuk Rekening',
        cmessage: 'Nasabah menanyakan kiriman uang dari Citibank New York sebesar USD 1,500 tertanggal 15 Oktober 2026 belum masuk rekening BNI IDR.',
        cmessage_re: 'Sudah dilakukan penelusuran MT103. Dana telah dikreditkan ke rekening tujuan pada 18 Oktober 2026 pukul 11:30 WIB.',
        notes: 'Tiket selesai dikonfirmasi ke nasabah via email.',
        idstatus: 2,
        status_name: 'Close',
        tgl_open: '2026-10-18 09:15:00',
        tgl_close: '2026-10-18 11:35:00',
        iduser_o: 5,
        opener_name: 'User Staff Demo',
        iduser_c: 5,
        closer_name: 'User Staff Demo',
        iduser_u: 5,
        updater_name: 'User Staff Demo'
    },
    {
        id: 2,
        noticket: 'T-18102026-102',
        noreff: 'LC-EXP-2026-889',
        idchannel: 2,
        name_channel: 'Telepon / Call',
        idchannel_note: 'Ext 4501 Call Center',
        idtypecust: 2,
        name_typecust: 'Korporasi / PT',
        cust_name: 'PT Maju Bersama Ekspor',
        cust_lok: 'Surabaya Industrial Estate',
        cust_note: '01.234.567.8-012.000',
        idbic: 2,
        bic_name: 'DBS Bank Ltd Singapore',
        idbranch: 2,
        branch_name: 'KC Surabaya',
        idpagent: null,
        pagent_name: '-',
        idbnir_rep: null,
        bnir_rep_name: '-',
        idproduct: 2,
        product_name: 'Trade Finance - Letter of Credit (LC)',
        idsubject: 5,
        subject_name: 'Discrepancy Dokumen Perdagangan',
        cmessage: 'Permintaan advis untuk discrepancy pada Bill of Lading pengiriman barang komoditas ke Singapura melalui DBS Bank.',
        cmessage_re: 'Sedang dilakukan koordinasi dengan Advising Bank dan Divisi Trade Processing.',
        notes: 'Menunggu konfirmasi waiver discrepancy dari pihak applicant.',
        idstatus: 1,
        status_name: 'Open',
        tgl_open: '2026-10-18 10:20:00',
        tgl_close: null,
        iduser_o: 3,
        opener_name: 'Supervisor T&R Demo',
        iduser_c: null,
        closer_name: null,
        iduser_u: 3,
        updater_name: 'Supervisor T&R Demo'
    },
    {
        id: 3,
        noticket: 'T-18102026-103',
        noreff: 'BG-BNI-2026-045',
        idchannel: 3,
        name_channel: 'Surat Resmi',
        idchannel_note: 'No Surat: 045/DIR-KONS/X/2026',
        idtypecust: 2,
        name_typecust: 'Korporasi / PT',
        cust_name: 'PT Wijaya Karya Konstruksi',
        cust_lok: 'Bandung',
        cust_note: '02.456.789.1-013.000',
        idbic: null,
        bic_name: '-',
        idbranch: 3,
        branch_name: 'KC Bandung Asia Afrika',
        idpagent: null,
        pagent_name: '-',
        idbnir_rep: null,
        bnir_rep_name: '-',
        idproduct: 3,
        product_name: 'Bank Garansi (BG)',
        idsubject: 6,
        subject_name: 'Verifikasi Keabsahan Warkat Bank Garansi',
        cmessage: 'Verifikasi keabsahan warkat Bank Garansi jaminan pelaksanaan proyek senilai Rp 5.000.000.000,-.',
        cmessage_re: 'Warkat Bank Garansi dinyatakan sah, tercatat resmi dalam sistem core banking BNI.',
        notes: 'Surat konfirmasi balasan telah dikirimkan ke kontraktor.',
        idstatus: 2,
        status_name: 'Close',
        tgl_open: '2026-10-18 08:30:00',
        tgl_close: '2026-10-18 13:45:00',
        iduser_o: 2,
        opener_name: 'Manager T&R Demo',
        iduser_c: 2,
        closer_name: 'Manager T&R Demo',
        iduser_u: 2,
        updater_name: 'Manager T&R Demo'
    },
    {
        id: 4,
        noticket: 'T-18102026-104',
        noreff: 'REM-SK-2026-901',
        idchannel: 4,
        name_channel: 'Portal Web',
        idchannel_note: 'Web Portal Pengaduan T&R',
        idtypecust: 1,
        name_typecust: 'Perorangan',
        cust_name: 'Siti Aminah',
        cust_lok: 'Incheon, South Korea',
        cust_note: '98765432109',
        idbic: null,
        bic_name: '-',
        idbranch: 4,
        branch_name: 'KC Medan Pemuda',
        idpagent: null,
        pagent_name: '-',
        idbnir_rep: 1,
        bnir_rep_name: 'BNI Seoul Representative Office',
        idproduct: 1,
        product_name: 'BNI Remittance (Smart Transfer)',
        idsubject: 2,
        subject_name: 'Koreksi Data Penerima / Nama / Rekening',
        cmessage: 'Pengirim dari Korea Selatan mengajukan koreksi nama penerima di Medan karena terdapat salah ketik 1 huruf.',
        cmessage_re: null,
        notes: 'Menunggu kelengkapan KTP asli penerima dari KC Medan Pemuda.',
        idstatus: 1,
        status_name: 'Open',
        tgl_open: '2026-10-18 11:00:00',
        tgl_close: null,
        iduser_o: 5,
        opener_name: 'User Staff Demo',
        iduser_c: null,
        closer_name: null,
        iduser_u: 5,
        updater_name: 'User Staff Demo'
    }
];

export const MOCK_USER_LOGS = [
    {
        id: 1,
        timestamp: '2026-10-18 09:15:00',
        user_name: 'user',
        fullname: 'User Staff Demo',
        role_name: 'User',
        action: 'CREATE_COMPLAINT',
        details: 'Created new complaint ticket T-18102026-101 (Budi Santoso)',
        ip_address: '127.0.0.1'
    },
    {
        id: 2,
        timestamp: '2026-10-18 10:20:00',
        user_name: 'spv',
        fullname: 'Supervisor T&R Demo',
        role_name: 'SPV',
        action: 'CREATE_COMPLAINT',
        details: 'Created new complaint ticket T-18102026-102 (PT Maju Bersama Ekspor)',
        ip_address: '127.0.0.1'
    },
    {
        id: 3,
        timestamp: '2026-10-18 11:35:00',
        user_name: 'user',
        fullname: 'User Staff Demo',
        role_name: 'User',
        action: 'CLOSE_COMPLAINT',
        details: 'Closed complaint ticket T-18102026-101',
        ip_address: '127.0.0.1'
    },
    {
        id: 4,
        timestamp: '2026-10-18 13:45:00',
        user_name: 'mgr',
        fullname: 'Manager T&R Demo',
        role_name: 'MGR',
        action: 'CLOSE_COMPLAINT',
        details: 'Closed complaint ticket T-18102026-103',
        ip_address: '127.0.0.1'
    }
];

export const MOCK_APP_LOGS = [
    {
        id: 1,
        timestamp: '2026-10-18 08:00:00',
        status: 'Normal',
        reported_by: 'Administrator Demo',
        description: 'System startup and daily health check completed successfully.',
        recommendation: 'System stable.'
    },
    {
        id: 2,
        timestamp: '2026-10-18 10:00:00',
        status: 'Normal',
        reported_by: 'Supervisor T&R Demo',
        description: 'Periodic database backup and replication verified.',
        recommendation: 'Keep standard monitoring.'
    }
];
