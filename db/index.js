// ══════════════════════════════════════════════════════════════
//  Database connection + schema migration runner
// ══════════════════════════════════════════════════════════════
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// Coolify's internal Postgres URL does not need SSL. External URLs (e.g. an
// explicit sslmode=require) do — auto-detect from the connection string.
const needsSsl = /sslmode=require/i.test(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000
});

pool.on('error', (err) => console.error('Unexpected pg pool error:', err));

// Run schema.sql on startup. Idempotent (CREATE TABLE IF NOT EXISTS).
async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✓ Schema migration applied');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function isHealthy() {
  try {
    const r = await pool.query('SELECT 1 AS ok');
    return r.rows[0].ok === 1;
  } catch (e) {
    return false;
  }
}

module.exports = { pool, migrate, isHealthy };
