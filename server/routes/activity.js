const express = require('express');
const router = express.Router();
const db = require('../db');

// Get User Logs (Paginated)
router.get('/user', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const countQuery = 'SELECT COUNT(*) as total FROM tbl_activity_log_user';
        const { rows: countResult } = await db.query(countQuery);
        const total = parseInt(countResult[0].total);

        const query = `
            SELECT l.*, u.fullname, u.name AS username, u.jabatan
            FROM tbl_activity_log_user l
            LEFT JOIN tbluser u ON l.iduser = u.id
            ORDER BY l.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await db.query(query, [limit, offset]);

        res.json({
            data: rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get App Logs (Paginated)
router.get('/app', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const countQuery = 'SELECT COUNT(*) as total FROM tbl_activity_log_app';
        const { rows: countResult } = await db.query(countQuery);
        const total = parseInt(countResult[0].total);

        const query = `
            SELECT l.*, u.fullname 
            FROM tbl_activity_log_app l
            LEFT JOIN tbluser u ON l.iduser = u.id
            ORDER BY l.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await db.query(query, [limit, offset]);

        res.json({
            data: rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post App Log
router.post('/app', async (req, res) => {
    const { status, description, recommendation, iduser } = req.body;
    try {
        await db.query('INSERT INTO tbl_activity_log_app (status, description, recommendation, iduser) VALUES ($1, $2, $3, $4)',
            [status, description, recommendation, iduser || null]);

        if (iduser && status !== 'Normal') {
            const clientIp = req.ip ? req.ip.replace('::ffff:', '') : '';
            await db.query('INSERT INTO tbl_activity_log_user (iduser, action, details, ip_address) VALUES ($1, $2, $3, $4)',
                [iduser, 'REPORT_APP_ISSUE', `Reported Status: ${status}`, clientIp]);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post User Log (for manual logging from frontend if needed)
router.post('/user', async (req, res) => {
    const { iduser, action, details, ip_address } = req.body;
    try {
        const clientIp = (ip_address || req.ip || '').replace('::ffff:', '');
        await db.query('INSERT INTO tbl_activity_log_user (iduser, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [iduser, action, details, clientIp]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
