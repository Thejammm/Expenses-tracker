const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { pool } = require('../db');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth  { email, password } -> { token }
router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });

    const r = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    if (!r.rows.length) return res.status(401).json({ error: 'Wrong email or password.' });

    const u = r.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: 'Wrong email or password.' });

    const token = jwt.sign({ uid: u.id, email: u.email }, SECRET, { expiresIn: '60d' });
    res.json({ token });
  } catch (e) {
    console.error('auth error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
