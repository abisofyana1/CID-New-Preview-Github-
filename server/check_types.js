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

async function checkTypes() {
    try {
        const res = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('tbluser', 'tblgroup') AND column_name IN ('idgroup', 'id')
    `);
        console.table(res.rows);
    } catch (err) {
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

checkTypes();
