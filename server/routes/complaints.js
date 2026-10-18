const express = require('express');
const router = express.Router();
const db = require('../db');
const { logUserActivity } = require('../utils/activityLogger');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const xlsx = require('xlsx');
const fs = require('fs');

// Helper to find ID by Name in related tables
const findIdByName = async (table, colName, value) => {
    if (!value) return null;
    const { rows } = await db.query(`SELECT id FROM "${table}" WHERE "${colName}" ILIKE $1 LIMIT 1`, [String(value).trim()]);
    return rows.length > 0 ? rows[0].id : null;
};

// Helper: Find User ID by exact Fullname match (or ILIKE)
const findUserIdByName = async (fullname) => {
    if (!fullname) return null;
    const { rows } = await db.query(`SELECT id FROM tbluser WHERE fullname ILIKE $1 LIMIT 1`, [String(fullname).trim()]);
    return rows.length > 0 ? rows[0].id : null;
};

// Helper: Sanitize Payload (Convert "" to null for Integer fields)
const sanitizePayload = (data) => {
    console.log("Sanitizing Payload - Input:", data);
    const newData = { ...data };
    const intKeys = [
        'idtypecust', 'idbic', 'idbranch', 'idbnir_rep', 'idpagent',
        'idchannel', 'idproduct', 'idsubject', 'idstatus',
        'iduser_o', 'iduser_c', 'iduser_u'
    ];
    const dateKeys = ['tgl_open', 'tgl_close', 'tgl_update'];

    for (const k in newData) {
        // Handle Integer Keys
        if (intKeys.includes(k)) {
            const val = newData[k];
            if (val === '' || val === null || val === undefined) {
                newData[k] = null;
            } else if (typeof val === 'string') {
                // Parse integer from string
                const parsed = parseInt(val, 10);
                newData[k] = isNaN(parsed) ? null : parsed;
            }
        }
        // Handle Date Keys
        else if (dateKeys.includes(k)) {
            if (newData[k] === '' || newData[k] === null) {
                newData[k] = null;
            }
        }
        // Handle Empty Strings for other keys (Optional, but safer to trim)
        else if (typeof newData[k] === 'string') {
            // NOTE: keep empty strings for text fields as is, or trim? 
            // Better not to force null on text fields unless necessary.
            // But we can trim to avoid whitespace-only strings if desired.
            // newData[k] = newData[k].trim(); // Optional
        }
    }
    console.log("Sanitizing Payload - Output:", newData);
    return newData;
};



// Import CSV Route
router.post('/import-csv', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const { iduser } = req.body;

    let stats = {
        success: 0,
        duplicate: 0,
        failed: 0,
        failures: []
    };

    try {
        // Read file as string to handle delimiters manually
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const workbook = xlsx.read(fileContent, { type: 'string', codepage: 65001 });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { FS: ';' });

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNumber = i + 2;

            try {
                let givenTicket = row['No Ticket'] || row['no_ticket'] || row['noticket'];

                if (givenTicket) {
                    const ticketStr = String(givenTicket).trim();
                    const existingTicket = await db.query("SELECT id FROM tbl_complain WHERE noticket = $1", [ticketStr]);

                    if (existingTicket.rows.length > 0) {
                        stats.duplicate++;
                        continue;
                    }
                }

                // Map columns using the same logic as Excel import
                const idtypecust = await findIdByName('ref_typecust', 'name_typecust', row['Cust Type']) || 0;
                const idproduct = await findIdByName('ref_product', 'name', row['Product']) || 0;
                const idchannel = await findIdByName('ref_channel', 'name_channel', row['Channel Type']) || 0;
                const idbic = await findIdByName('ref_bic', 'name_bic', row['BIC']) || 0;
                const idbranch = await findIdByName('ref_branch', 'name_brc', row['Branch']) || 0;
                const idbnir_rep = await findIdByName('ref_bnir_rep', 'name_bnir_rep', row['BNIR Rep']) || 0;
                const idpagent = await findIdByName('ref_pagent', 'name_pagent', row['P.Agent']) || 0;
                const idsubject = await findIdByName('ref_subject', 'name', row['Subject']) || 0;

                const iduser_o_found = await findUserIdByName(row['Open By']);
                const iduser_c_found = await findUserIdByName(row['Close By']);
                const iduser_u_found = await findUserIdByName(row['Close Update by']);

                const parseDate = (d) => {
                    if (!d || d === '-') return null;
                    const dateVal = new Date(d);
                    if (isNaN(dateVal.getTime())) return null;
                    return dateVal;
                };

                const insertData = {
                    noticket: givenTicket || `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    tgl_open: parseDate(row['Tgl Open']),
                    tgl_close: parseDate(row['Tgl Close']),
                    noreff: row['No Reff'],
                    idtypecust,
                    cust_name: row['Cust Name'],
                    cust_lok: row['Cust Loc'],
                    cust_note: row['Cust Note'],
                    idbic,
                    idbranch,
                    idbnir_rep,
                    idpagent,
                    idchannel,
                    idchannel_note: row['Notes'],
                    idproduct,
                    idproduct_note: row['Note'],
                    idsubject,
                    idsubject_note: row['Subject Note'],
                    cmessage: row['Question'],
                    cmessage_re: row['Answer'],
                    notes: row['Internal Note'],
                    iduser_o: iduser_o_found,
                    iduser_c: iduser_c_found,
                    iduser_u: iduser_u_found,
                    idstatus: (parseDate(row['Tgl Close']) || row['Close By']) ? 2 : 1
                };

                await db.insertSet('tbl_complain', insertData);
                stats.success++;

            } catch (err) {
                console.error(`Row ${rowNumber} Error:`, err.message);
                stats.failed++;
                stats.failures.push({
                    row: rowNumber,
                    ticket: row['No Ticket'] || 'N/A',
                    reason: err.message
                });
            }
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (iduser) {
            await logUserActivity(iduser, 'IMPORT_CSV', `Import Stats: Success=${stats.success}, Dup=${stats.duplicate}, Fail=${stats.failed}`, req.ip);
        }

        res.json({
            message: 'Import finished',
            stats: stats
        });

    } catch (err) {
        console.error("Import CSV Technical Error:", err);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: err.message });
    }
});

// Get complaints with pagination and search/filters
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit === 'all' ? 1000000 : parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Basic Search
        const search = req.query.search || '';

        // Advanced Filters
        const {
            f_noTicket, f_custName, f_channel, f_day, f_month, f_year, f_noReff, f_status,
            f_product, f_custType, f_question, f_answer, f_subject,
            f_bic, f_userOpen, f_userClose, f_branch
        } = req.query;

        let paramIndex = 1;
        const params = [];

        // SELECT Clause
        let querySelect = `
      SELECT c.*, 
        tc.name_typecust, 
        b.name_bic, 
        br.name_brc, 
        rr.name_bnir_rep, 
        pa.name_pagent, 
        ch.name_channel, 
        p.name as product_name, 
        s.name as subject_name,
        st.name_status,
        u_open.fullname as opener_name,
        u_close.fullname as closer_name,
        u_update.fullname as updater_name,
        u_update.idgroup as updater_group,
        EXTRACT(EPOCH FROM (c.tgl_close - c.tgl_open))/60 as duration_minutes
      FROM tbl_complain c
      LEFT JOIN ref_typecust tc ON c.idtypecust = tc.id
      LEFT JOIN ref_bic b ON c.idbic = b.id
      LEFT JOIN ref_branch br ON c.idbranch = br.id
      LEFT JOIN ref_bnir_rep rr ON c.idbnir_rep = rr.id
      LEFT JOIN ref_pagent pa ON c.idpagent = pa.id
      LEFT JOIN ref_channel ch ON c.idchannel = ch.id
      LEFT JOIN ref_product p ON c.idproduct = p.id
      LEFT JOIN ref_subject s ON c.idsubject = s.id
      LEFT JOIN ref_status st ON c.idstatus = st.id
      LEFT JOIN tbluser u_open ON c.iduser_o = u_open.id
      LEFT JOIN tbluser u_close ON c.iduser_c = u_close.id
      LEFT JOIN tbluser u_update ON c.iduser_u = u_update.id
    `;

        // FROM/JOIN Clause (Shared with Count)
        let queryFrom = `
      FROM tbl_complain c
      LEFT JOIN ref_typecust tc ON c.idtypecust = tc.id
      LEFT JOIN ref_bic b ON c.idbic = b.id
      LEFT JOIN ref_branch br ON c.idbranch = br.id
      LEFT JOIN ref_channel ch ON c.idchannel = ch.id
      LEFT JOIN ref_product p ON c.idproduct = p.id
      LEFT JOIN ref_subject s ON c.idsubject = s.id
      LEFT JOIN ref_status st ON c.idstatus = st.id
      LEFT JOIN tbluser u_open ON c.iduser_o = u_open.id
      LEFT JOIN tbluser u_close ON c.iduser_c = u_close.id
      LEFT JOIN tbluser u_update ON c.iduser_u = u_update.id
    `;

        let conditions = [];

        // Helper to add condition
        const addCond = (sql, val) => {
            conditions.push(sql.replace('?', `$${paramIndex++}`));
            params.push(val);
        };

        // Global Search
        if (search) {
            // Push values first to match indices
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            // Use indices
            conditions.push(`(c.noticket ILIKE $${paramIndex++} OR c.cust_name ILIKE $${paramIndex++} OR c.cmessage ILIKE $${paramIndex++})`);
        }

        // Advanced Filters
        if (f_noTicket) addCond(`c.noticket ILIKE ?`, `%${f_noTicket}%`);
        if (f_custName) addCond(`c.cust_name ILIKE ?`, `%${f_custName}%`);
        if (f_channel) addCond(`c.idchannel = ?`, f_channel);
        if (f_day) addCond(`EXTRACT(DAY FROM c.tgl_open) = ?`, f_day);
        if (f_month) addCond(`EXTRACT(MONTH FROM c.tgl_open) = ?`, f_month);
        if (f_year) addCond(`EXTRACT(YEAR FROM c.tgl_open) = ?`, f_year);
        if (f_noReff) addCond(`c.noreff ILIKE ?`, `%${f_noReff}%`);

        // FIX: Handle Status Filter logic manually to avoid param index desync
        // Logic: Open (1) includes explicit Open OR Incomplete Data. Close (2) must be strictly Complete.
        if (f_status) {
            if (f_status === '1') {
                conditions.push(`(c.idstatus = 1 OR c.tgl_close IS NULL OR c.iduser_c IS NULL OR c.iduser_c = 0)`);
            } else if (f_status === '2') {
                conditions.push(`(c.idstatus = 2 AND c.tgl_close IS NOT NULL AND c.iduser_c IS NOT NULL AND c.iduser_c != 0)`);
            } else {
                addCond(`c.idstatus = ?`, f_status);
            }
        }

        if (f_product) addCond(`c.idproduct = ?`, f_product);
        if (f_custType) addCond(`c.idtypecust = ?`, f_custType);
        if (f_question) addCond(`c.cmessage ILIKE ?`, `%${f_question}%`);
        if (f_answer) addCond(`c.cmessage_re ILIKE ?`, `%${f_answer}%`);
        if (f_subject) addCond(`c.idsubject = ?`, f_subject);
        if (f_bic) addCond(`c.idbic = ?`, f_bic);
        if (f_branch) addCond(`c.idbranch = ?`, f_branch);

        if (f_userOpen) addCond(`u_open.fullname ILIKE ?`, `%${f_userOpen}%`);
        if (f_userClose) addCond(`u_close.fullname ILIKE ?`, `%${f_userClose}%`);

        let whereClause = '';
        if (conditions.length > 0) {
            whereClause = ' WHERE ' + conditions.join(' AND ');
        }

        // Count Query
        const countQueryText = `SELECT COUNT(*) as total ${queryFrom} ${whereClause}`;
        const countRes = await db.query(countQueryText, params);
        const total = parseInt(countRes.rows[0].total);

        // Data Query
        // Add limit params
        const limitParamIndex = paramIndex++;
        const offsetParamIndex = paramIndex++;
        const limitClause = ` ORDER BY c.tgl_open DESC LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`;

        const dataQueryText = `${querySelect} ${whereClause} ${limitClause}`;
        const dataRes = await db.query(dataQueryText, [...params, limit, offset]);

        res.json({
            data: dataRes.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Add Complaint
router.post('/', async (req, res) => {
    try {
        const data = sanitizePayload(req.body);
        delete data.noticket;
        delete data.id;
        if (!data.tgl_open) data.tgl_open = new Date();

        // Use Helper for INSERT ... SET ?
        const { rows } = await db.insertSet('tbl_complain', data);
        const newId = rows[0].id;

        // Generate Ticket
        const dateObj = new Date();
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const yyyy = dateObj.getFullYear();
        const noTicket = `T-${dd}${mm}${yyyy}-${newId}`;

        // Update ticket using standard update
        await db.query('UPDATE tbl_complain SET noticket = $1 WHERE id = $2', [noTicket, newId]);

        // Final Fetch
        const finalRes = await db.query('SELECT * FROM tbl_complain WHERE id = $1', [newId]);

        // LOGGING
        if (data.iduser_o) {
            await logUserActivity(data.iduser_o, 'ADD_DATA', `Menambahkan Data List ${noTicket}`, req.ip);
        }

        res.json(finalRes.rows[0]);
    } catch (err) {
        console.error("Error in POST /complaints:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update Complaint
router.put('/:id', async (req, res) => {
    try {
        const data = sanitizePayload(req.body);
        const id = req.params.id;
        delete data.noticket;
        delete data.id;

        const currentRes = await db.query('SELECT * FROM tbl_complain WHERE id = $1', [id]);
        if (currentRes.rows.length === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        const oldRec = currentRes.rows[0];

        // Logic change: Only prevent overwrite if Old record is PROPERLY closed (has date AND user)
        // If old record is marked closed but missing date or user (incomplete import), we MUST allow update.
        if (oldRec.idstatus == 2 && data.idstatus == 2) {
            if (oldRec.tgl_close && oldRec.iduser_c) {
                delete data.tgl_close;
                delete data.iduser_c;
            }
            // else: incomplete closed data -> allow overwrite (keep data.tgl_close/iduser_c from payload)
        }

        data.tgl_update = new Date();

        // Use Helper for UPDATE ... SET ?
        await db.updateSet('tbl_complain', data, id);

        // LOGGING
        if (data.iduser_u) {
            const fieldMap = {
                'cmessage': 'Question / Complaint',
                'cmessage_re': 'Answer / Follow Up',
                'idstatus': 'Status',
                'idchannel': 'Channel',
                'idchannel_note': 'Channel Note',
                'idtypecust': 'Tipe Nasabah',
                'cust_name': 'Nama Nasabah',
                'cust_lok': 'Lokasi Nasabah',
                'cust_note': 'Note Nasabah (Other)',
                'cust_phone': 'No HP',
                'cust_email': 'Email',
                'noreff': 'No Reff',
                'idproduct': 'Product',
                'idsubject': 'Subject',
                'idbic': 'BIC',
                'idbranch': 'Unit / Branch',
                'idbnir_rep': 'BNI Rep',
                'idpagent': 'Phone Agent',
                'notes': 'Note (Internal)'
            };

            let changes = [];
            for (const key in data) {
                if (key in fieldMap && data[key] != oldRec[key]) {
                    changes.push(fieldMap[key]);
                }
            }

            let actionText = 'Update Data List';
            if (data.idstatus == 2 && oldRec.idstatus != 2) actionText = 'Update Status:Close';

            let detailText = `${actionText} ${oldRec.noticket}`;
            if (changes.length > 0) detailText += ` (Changed: ${changes.join(', ')})`;

            await logUserActivity(data.iduser_u, actionText === 'Update Status:Close' ? 'UPDATE_STATUS' : 'UPDATE_DATA', detailText, req.ip);
        }

        res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.error("Error in PUT /complaints:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Complaint
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM tbl_complain WHERE id = $1', [req.params.id]);
        if (req.query.iduser) {
            await logUserActivity(req.query.iduser, 'DELETE_DATA', `Menghapus Data List ${req.params.id}`, req.ip);
        }
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
