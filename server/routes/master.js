const express = require('express');
const router = express.Router();
const db = require('../db');
const { logUserActivity } = require('../utils/activityLogger');

const tableMapping = {
    bic: 'ref_bic',
    bnirr: 'ref_bnir_rep',
    branch: 'ref_branch',
    channel: 'ref_channel',
    customertype: 'ref_typecust',
    payingagent: 'ref_pagent',
    product: 'ref_product',
    subject: 'ref_subject',
    dynamic: 'ref_dynamic'
};

const sortMapping = {
    bic: 'name_bic',
    bnirr: 'name_bnir_rep',
    branch: 'kode_brc',
    channel: 'name_channel',
    customertype: 'name_typecust',
    payingagent: 'name_pagent',
    product: 'name',
    subject: 'name',
    dynamic: 'name'
};

// Get dynamic items by category
router.get('/dynamic/category/:category', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM "ref_dynamic" WHERE category = $1 ORDER BY name ASC`, [req.params.category]);
        res.json(rows);
    } catch (err) {
        console.error(`GET /master/dynamic/category Error:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Get all items for a master
router.get('/:type', async (req, res) => {
    const type = req.params.type;
    const table = tableMapping[type];
    const sortCol = sortMapping[type] || 'id';

    if (!table) return res.status(400).json({ error: 'Invalid master type' });

    try {
        const { rows } = await db.query(`SELECT * FROM "${table}" ORDER BY "${sortCol}" ASC`);
        res.json(rows);
    } catch (err) {
        console.error(`GET /master/${type} Error:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Add item
router.post('/:type', async (req, res) => {
    const type = req.params.type;
    const table = tableMapping[type];

    if (!table) return res.status(400).json({ error: 'Invalid master type' });

    try {
        // Extract iduser for logging, remove from DB payload. Also remove 'id' if present to avoid conflict.
        const { iduser, id, ...dataToSave } = req.body;

        // Use direct query to ensure compatibility
        const keys = Object.keys(dataToSave);
        const values = Object.values(dataToSave);

        // Manual ID Generation: Get Max ID + 1
        const maxIdRes = await db.query(`SELECT MAX(id) as maxid FROM "${table}"`);
        const nextId = (parseInt(maxIdRes.rows[0].maxid) || 0) + 1;

        // Add ID to INSERT columns
        keys.push('id');
        values.push(nextId);

        const columns = keys.map(k => `"${k}"`).join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const sql = `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING id`;
        const { rows } = await db.query(sql, values);
        const newId = rows[0].id;

        if (iduser) {
            await logUserActivity(iduser, 'ADD_MASTER', `Menambahkan Data Master ${dataToSave.name || newId}`, req.ip);
        }

        res.json({ id: newId, ...dataToSave });
    } catch (err) {
        console.error(`POST /master/${type} Error:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Update item
router.put('/:type/:id', async (req, res) => {
    const type = req.params.type;
    const table = tableMapping[type];
    const id = req.params.id;

    if (!table) return res.status(400).json({ error: 'Invalid master type' });

    try {
        // Extract iduser for logging, remove from DB payload. Remove 'id' so we don't try to update it.
        const { iduser, id: bodyId, ...dataToSave } = req.body;

        // Uses updateSet helper
        await db.updateSet(table, dataToSave, id);

        if (iduser) {
            await logUserActivity(iduser, 'EDIT_MASTER', `Update Data Master ${id}`, req.ip);
        }

        res.json({ id, ...dataToSave });
    } catch (err) {
        console.error(`PUT /master/${type}/${id} Error:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Delete item
router.delete('/:type/:id', async (req, res) => {
    const type = req.params.type;
    const table = tableMapping[type];
    const id = req.params.id;

    if (!table) return res.status(400).json({ error: 'Invalid master type' });

    try {
        await db.query(`DELETE FROM "${table}" WHERE id = $1`, [id]);

        if (req.query.iduser) {
            await logUserActivity(req.query.iduser, 'DELETE_MASTER', `Menghapus Data Master ${id}`, req.ip);
        }

        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(`DELETE /master/${type}/${id} Error:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
