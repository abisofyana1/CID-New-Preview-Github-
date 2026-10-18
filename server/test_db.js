const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function testConnection() {
    try {
        console.log('Testing connection to database...');
        const now = await pool.query('SELECT NOW()');
        console.log('Connection successful! Database time:', now.rows[0].now);

        const tables = ['tbluser', 'tblgroup', 'tbl_activity_log_user'];
        for (const table of tables) {
            try {
                const res = await pool.query(`SELECT 1 FROM "${table}" LIMIT 1`);
                console.log(`Table "${table}" exists.`);
            } catch (err) {
                console.warn(`Table "${table}" DOES NOT exist or is inaccessible: ${err.message}`);
            }
        }

        // Check types
        try {
            const res = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tbluser' AND column_name = 'idgroup'
      `);
            if (res.rows.length > 0) {
                console.log(`tbluser.idgroup type: ${res.rows[0].data_type}`);
            }
        } catch (err) {
            console.error('Failed to check types:', err.message);
        }

    } catch (err) {
        console.error('Database connection failed:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
