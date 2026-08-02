// ══════════════════════════════════════════════════════════════
//  Bootstrap the single private user from env on every deploy.
//  ADMIN_EMAIL / ADMIN_PASSWORD are the source of truth, so changing
//  the password is just an env change + redeploy.
// ══════════════════════════════════════════════════════════════
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function bootstrap() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) {
    console.warn('⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — no user seeded.');
    return;
  }
  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, hash]
  );
  console.log('✓ Admin user ensured:', email);
}

module.exports = { bootstrap };
