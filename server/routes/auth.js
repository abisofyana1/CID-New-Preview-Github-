const express = require('express');
const router = express.Router();
const db = require('../db');
const { logUserActivity } = require('../utils/activityLogger');

// Login API
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { rows: users } = await db.query(
            "SELECT u.*, g.name as role_name FROM tbluser u JOIN tblgroup g ON CAST(u.idgroup AS INTEGER) = g.id WHERE u.name = $1 OR u.nip_nrp = $1 OR u.email = $1",
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = users[0];

        // Direct password comparison (Legacy)
        if (user.pass !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const { pass, ...userInfo } = user;

        // Log Activity safely
        await logUserActivity(user.id, 'LOGIN', 'User logged in successfully', req.ip);

        res.json({
            message: 'Login successful',
            user: userInfo
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
});

// Change Password API
router.post('/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const { rows: users } = await db.query("SELECT * FROM tbluser WHERE id = $1", [userId]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = users[0];

        // Verify Old Password
        if (user.pass !== oldPassword) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        // Update Password
        await db.query("UPDATE tbluser SET pass = $1, must_change_password = 0, lastchange = NOW() WHERE id = $2", [newPassword, userId]);

        // Log Activity
        const clientIp = req.ip.replace('::ffff:', '');
        await db.query('INSERT INTO tbl_activity_log_user (iduser, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [user.id, 'CHANGE_PASSWORD', 'User changed password successfully', clientIp]);

        res.json({ message: 'Password changed successfully' });

    } catch (err) {
        console.error("Change Password Error:", err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;
