const db = require('../db');

/**
 * Helper to log user actions to tbl_activity_log_user
 * @param {number} userId - ID of the user performing the action
 * @param {string} action - Short action code (e.g., 'ADD_DATA', 'EDIT_DATA')
 * @param {string} details - Detailed description
 * @param {string} ip - IP Address
 */
const logUserActivity = async (userId, action, details, ip) => {
    try {
        if (!userId) return;

        // Clean IP address (remove ::ffff: prefix if present)
        const cleanIp = ip ? ip.replace('::ffff:', '') : ip;

        // Uses PG syntax $1, $2...
        await db.query(
            'INSERT INTO tbl_activity_log_user ("iduser", "action", "details", "ip_address") VALUES ($1, $2, $3, $4)',
            [userId, action, details, cleanIp]
        );
    } catch (err) {
        console.error('Failed to log user activity:', err);
    }
};

module.exports = { logUserActivity };
