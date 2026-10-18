const express = require('express');
const router = express.Router();
const db = require('../db');
const { logUserActivity } = require('../utils/activityLogger');

// Get All Users (or filtered list)
router.get('/', async (req, res) => {
    try {
        const { rows: users } = await db.query(`
            SELECT u.id, u.name, u.fullname, u.nip_nrp, u.email, u.jabatan, u.nohp, g.name as role_name, u.idgroup 
            FROM tbluser u 
            LEFT JOIN tblgroup g ON u.idgroup = CAST(g.id AS VARCHAR)
            ORDER BY u.fullname ASC
        `);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create User
router.post('/', async (req, res) => {
    const { name, pass, fullname, nip_nrp, email, jabatan, nohp, idgroup, actorId } = req.body;
    try {
        // Check duplicate
        const { rows: existing } = await db.query("SELECT * FROM tbluser WHERE name = $1", [name]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        await db.query(
            'INSERT INTO tbluser ("name", "pass", "fullname", "nip_nrp", "email", "jabatan", "nohp", "idgroup", "lastchange", "must_change_password") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), 1)',
            [name, pass, fullname, nip_nrp, email, jabatan, nohp, idgroup]
        );

        if (actorId) {
            await logUserActivity(actorId, 'ADD_USER', `Menambahkan User [${name}]`, req.ip);
        }

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, fullname, nip_nrp, email, jabatan, nohp, idgroup, pass, actorId } = req.body;
    try {
        let query = 'UPDATE tbluser SET "name"=$1, "fullname"=$2, "nip_nrp"=$3, "email"=$4, "jabatan"=$5, "nohp"=$6, "idgroup"=$7, "lastchange"=NOW()';
        const params = [name, fullname, nip_nrp, email, jabatan, nohp, idgroup];
        let paramIndex = 8;

        // Update password only if provided
        if (pass && pass.trim() !== '') {
            query += `, "pass"=$${paramIndex++}, "must_change_password"=0`;
            params.push(pass);
        }

        query += ` WHERE id=$${paramIndex}`;
        params.push(id);

        await db.query(query, params);

        if (actorId) {
            await logUserActivity(actorId, 'UPDATE_USER', `Update User [${name}]`, req.ip);
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { actorId } = req.query; // Actor ID passed in query
    try {
        // Get name for logging before delete
        const { rows } = await db.query("SELECT name FROM tbluser WHERE id = $1", [id]);
        const userName = rows.length > 0 ? rows[0].name : id;

        await db.query("DELETE FROM tbluser WHERE id = $1", [id]);

        if (actorId) {
            await logUserActivity(actorId, 'DELETE_USER', `Menghapus User [${userName}]`, req.ip);
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
