const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
  override: true
});

// Strict configuration validation - prevent any execution without .env values
if (!process.env.DB_NAME || !process.env.DB_PORT || !process.env.DB_USER) {
  console.error('[CRITICAL ERROR] Database configuration (DB_NAME, DB_PORT, or DB_USER) is missing in .env');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Discreet connection verification
pool.on('connect', () => {
  // Only log once to be discreet
  if (!global._db_logged) {
    console.log(`[DB] Connected to: ${process.env.DB_NAME} on port ${process.env.DB_PORT}`);
    global._db_logged = true;
  }
});

const query = async (text, params) => {
  return pool.query(text, params);
};

// Helper for "INSERT INTO table SET ?"
const insertSet = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const columns = keys.map(k => `"${k}"`).join(', ');
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const sql = `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING *`;
  return pool.query(sql, values);
};

// Helper for "UPDATE table SET ? WHERE id = ?"
const updateSet = async (table, data, id) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) return; // Nothing to update

  const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');

  const sql = `UPDATE "${table}" SET ${setClause} WHERE id = $${keys.length + 1}`;
  return pool.query(sql, [...values, id]);
};

module.exports = {
  pool,
  query,
  insertSet,
  updateSet
};
